// app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { ref, get, onValue, query, orderByChild, limitToLast } from "firebase/database";
import { database } from "@/lib/firebase";
import { Users, Package, IndianRupee } from "lucide-react"; // Import icons

interface Order {
  id: string;
  userId: string;
  userEmail: string;
  total: number;
  createdAt: string;
  tracking: {
    confirmed: { status: boolean; timestamp?: string };
    processing: { status: boolean; timestamp?: string };
    shipped: { status: boolean; timestamp?: string };
    delivered: { status: boolean; timestamp?: string };
  };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const run = async () => {
      const roleSnap = await get(ref(database, `users/${user.uid}/role`));
      if (roleSnap.val() !== "admin") return;

      const usersSnap = await get(ref(database, "users"));
      const usersCount = usersSnap.exists() ? Object.keys(usersSnap.val()!).length : 0;

      const ordersRef = ref(database, "orders");
      const recentQuery = query(ordersRef, orderByChild("createdAt"), limitToLast(10));

      const unsub = onValue(recentQuery, (snap) => {
        const list: Order[] = [];
        snap.forEach((userSnap) => {
          userSnap.forEach((orderSnap) => {
            const data = orderSnap.val();
            list.push({ ...data, id: orderSnap.key!, userId: userSnap.key! } as Order);
          });
        });
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const revenue = list.reduce((s, o) => s + (o.total ?? 0), 0);

        setStats({ users: usersCount, orders: list.length, revenue });
        setRecentOrders(list);
        setLoading(false);
      });

      return () => unsub();
    };

    run();
  }, [user]);

  const getStatus = (o: Order) => {
    if (o.tracking.delivered.status) return { label: "Delivered", class: "delivered" };
    if (o.tracking.shipped.status) return { label: "Shipped", class: "shipped" };
    if (o.tracking.processing.status) return { label: "Processing", class: "processing" };
    if (o.tracking.confirmed.status) return { label: "Confirmed", class: "confirmed" };
    return { label: "Pending", class: "pending" };
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <header className="content-header">
        <h1>Dashboard Overview</h1>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Users size={28} />
          </div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.users}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Package size={28} />
          </div>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <p className="stat-number">{stats.orders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <IndianRupee size={28} />
          </div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p className="stat-number">₹{stats.revenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <section className="orders-section">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <a href="/admin/orders" className="view-all">View All</a>
        </div>
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={4} className="no-data">No orders yet</td></tr>
              ) : (
                recentOrders.map((o) => {
                  const status = getStatus(o);
                  return (
                    <tr key={o.id}>
                      <td><code>#{o.id.slice(0, 8)}</code></td>
                      <td>{o.userEmail}</td>
                      <td>₹{o.total.toLocaleString()}</td>
                      <td><span className={`status-badge ${status.class}`}>{status.label}</span></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}