// app/admin/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { ref, get, update, onValue } from "firebase/database";
import { database } from "@/lib/firebase";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

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

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ordersRef = ref(database, "orders");
    const unsub = onValue(ordersRef, (snap) => {
      const list: Order[] = [];
      snap.forEach((userSnap) => {
        userSnap.forEach((orderSnap) => {
          const data = orderSnap.val();
          list.push({ ...data, id: orderSnap.key!, userId: userSnap.key! } as Order);
        });
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const updateStatus = async (userId: string, orderId: string, status: keyof Order["tracking"]) => {
    const path = `orders/${userId}/${orderId}/tracking/${status}`;
    await update(ref(database, path), {
      status: true,
      timestamp: new Date().toISOString(),
    });
  };

  const getStatusIcon = (o: Order) => {
    if (o.tracking.delivered.status) return <CheckCircle className="text-green-600" />;
    if (o.tracking.shipped.status) return <Truck className="text-blue-600" />;
    if (o.tracking.processing.status) return <Package className="text-yellow-600" />;
    return <Clock className="text-gray-500" />;
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <>
      <header className="content-header">
        <h1>All Orders</h1>
      </header>

      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <code className="order-id">#{order.id.slice(0, 8)}</code>
                <p className="text-sm text-gray-600">{order.userEmail}</p>
              </div>
              {getStatusIcon(order)}
            </div>

            <div className="order-details">
              <p><strong>Total:</strong> ₹{order.total.toLocaleString()}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="tracking-steps">
              {["confirmed", "processing", "shipped", "delivered"].map((step) => {
                const s = order.tracking[step as keyof typeof order.tracking];
                return (
                  <button
                    key={step}
                    className={`step-btn ${s.status ? "done" : ""}`}
                    onClick={() => updateStatus(order.userId, order.id, step as any)}
                    disabled={s.status}
                  >
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                    {s.status && s.timestamp && (
                      <span className="timestamp">
                        {new Date(s.timestamp).toLocaleTimeString()}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}