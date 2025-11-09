// app/admin/users/page.tsx
"use client";

import { useEffect, useState } from "react";
import { ref, get, onValue } from "firebase/database";
import { useAuth } from "@/lib/auth";
import { database } from "@/lib/firebase";
import { Users, Mail, Shield, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<Record<string, User>>({});
  const [ Loading,setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      router.replace("/");
    }
  }, [user, role, loading, router]);

  useEffect(() => {
    const usersRef = ref(database, "users");
    const unsub = onValue(usersRef, (snap) => {
      const data = snap.val() || {};
      setUsers(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = Object.entries(users)
    .filter(([_, u]) => 
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase())
    );

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <>
      <header className="content-header">
        <h1>All Users</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="users-grid">
        {filtered.length === 0 ? (
          <p className="no-data">No users found</p>
        ) : (
          filtered.map(([id, user]) => (
            <div key={id} className="user-card">
              <div className="user-avatar">
                <Users size={32} />
              </div>
              <div className="user-info">
                <h3>{user.name}</h3>
                <p className="user-email">
                  <Mail size={14} /> {user.email}
                </p>
                <p className="user-role">
                  <Shield size={14} /> {user.role}
                </p>
                <p className="user-joined">
                  <Calendar size={14} /> Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}