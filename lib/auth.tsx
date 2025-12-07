"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { get, ref, set } from "firebase/database";
import { auth, database } from "./firebase";
import { useRouter, usePathname } from "next/navigation"; // ← ADD usePathname

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    role?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname(); // ← GET CURRENT PATH

  /* --------------------------------------------------------------
     1. Listen to Firebase Auth + fetch role ONCE
     -------------------------------------------------------------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const snap = await get(ref(database, `users/${firebaseUser.uid}/role`));
          const dbRole = snap.exists() ? snap.val() : "user";
          setUser(firebaseUser);
          setRole(dbRole);
          localStorage.setItem("role", dbRole);
        } catch (e) {
          console.error("Role fetch error:", e);
          setRole("user");
          localStorage.setItem("role", "user");
        }
      } else {
        setUser(null);
        setRole(null);
        localStorage.removeItem("role");
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  /* --------------------------------------------------------------
     2. GLOBAL REDIRECT GUARD (uses current pathname)
     -------------------------------------------------------------- */
 useEffect(() => {
  if (loading || role === null) return; // wait until role known

  const adminPages = [
    "/admin/dashboard",
    "/admin/orders",
    "/admin/profile",
    "/admin/products",
    "/admin/auth",
    "/admin/login",
  ];

  // Admin redirect to dashboard if route is unknown
  if (role === "admin" && pathname.startsWith("/admin") && !adminPages.includes(pathname)) {
    router.replace("/admin/dashboard");
  }
  // Non-admin users cannot access admin pages
  else if (role !== "admin" && pathname.startsWith("/admin") && pathname !== "/admin/auth") {
    router.replace("/");
  }
}, [role, loading, pathname, router]);


  /* --------------------------------------------------------------
     3. login – DO NOT redirect
     -------------------------------------------------------------- */
const login = async (email: string, password: string) => {
  // Try login
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = cred.user;

  // Fetch role from database
  const snap = await get(ref(database, `users/${firebaseUser.uid}/role`));
  const dbRole = snap.exists() ? snap.val() : "user";

  // If ADMIN but trying to login from USER login page → BLOCK
  if (dbRole === "admin" && pathname !== "/admin/auth") {
    await signOut(auth);
    throw new Error("Admins cannot login from the user login page.");
  }
};


  /* --------------------------------------------------------------
     4. signup – create + login
     -------------------------------------------------------------- */
  const signup = async (
    email: string,
    password: string,
    name: string,
    role: string = "user"
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const u = cred.user;

    await updateProfile(u, { displayName: name });

    await set(ref(database, `users/${u.uid}`), {
      uid: u.uid,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    });

    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    router.replace("/admin/auth");
  };

  return (
  <AuthContext.Provider value={{ user, role, loading, login, signup, logout }}>
    {loading ? (
      <div className="flex justify-center items-center h-screen">
        <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
        </div>
      </div>
    ) : (
      children
    )}
  </AuthContext.Provider>
);

}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}