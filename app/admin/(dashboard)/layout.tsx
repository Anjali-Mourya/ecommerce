// app/admin/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import "./dashboard.css"; // reuse same CSS
import {
  ChartBar,
  Users,
  Package,
  ShoppingBag,
  Home,
  LogOut,
  Menu,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: ChartBar },
  { href: "/admin/profile", label: "Users", icon: Users },
  { href: "/admin/orders", label: "Orders", icon: Package },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace("/admin/auth");
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
          >
            ×
          </button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`nav-link ${pathname === item.href ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(item.href);
                  setMobileOpen(false);
                }}
              >
                <Icon className="nav-icon" size={20} />
                <span className="nav-label">{item.label}</span>
              </a>
            );
          })}
        </nav>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main */}
      <main className="main-content">
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={24} />
        </button>
        {children}
      </main>
    </div>
  );
}