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
    if (loading) return;

    const adminPages = [
      "/admin/dashboard",
      "/admin/orders",
      "/admin/profile",
      "/admin/products",
      "/admin/auth",
      "/admin/login",
    ];

    // Admin on unknown /admin/* → go to dashboard
    if (role === "admin" && pathname.startsWith("/admin") && !adminPages.includes(pathname)) {
      router.replace("/admin/dashboard");
    }
    // Non-admin on any /admin/* → kick out
   else if (
  role !== "admin" &&
  pathname.startsWith("/admin") &&
  pathname !== "/admin/auth"
) {
  router.replace("/");
}

  }, [role, loading, router, pathname]); // ← DEPEND ON pathname

  /* --------------------------------------------------------------
     3. login – DO NOT redirect
     -------------------------------------------------------------- */
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
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
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}