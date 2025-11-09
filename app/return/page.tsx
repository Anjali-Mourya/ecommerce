"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ref, onValue } from "firebase/database"
import { database } from "@/lib/firebase"
import ProtectedRoute from "../components/ProtectedRoute"
import { useAuth } from "../../lib/auth"
import AuthenticatedNavBar from "../components/AuthenticatedNavBar"
import Footer from "../components/Fotter"
import "../orders/order.css"

export default function ReturnOrdersListPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ Fetch all orders for the logged-in user
  useEffect(() => {
    if (!user) return
    const ordersRef = ref(database, `orders/${user.uid}`)
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val() || {}
      const ordersArray = Object.values(data)
      setOrders(ordersArray)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [user])

  // ✅ Determine if an order is eligible for return
  const isReturnEligible = (order: any) => {
    if (!order || !order.tracking?.delivered) return false
    const deliveryDate = new Date(order.tracking.delivered.timestamp)
    const currentDate = new Date()
    const daysSinceDelivery = (currentDate.getTime() - deliveryDate.getTime()) / (1000 * 3600 * 24)
    return daysSinceDelivery <= 30
  }

  if (loading) {
    return (
      <main className="main-container">
        <AuthenticatedNavBar />
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading your returnable orders...</p>
        </div>
        <Footer />
      </main>
    )
  }

  const eligibleOrders = orders.filter(isReturnEligible)

  return (
    <ProtectedRoute>
      <main className="main-container">
        <AuthenticatedNavBar />
        <div className="return-page">
          <div className="container">
            <div className="page-header">
              <h1>Return Orders</h1>
              <p>View and manage your return-eligible orders</p>
            </div>

            {eligibleOrders.length === 0 ? (
              <div className="empty-orders">
                <h2>No Return-Eligible Orders</h2>
                <p>You currently have no orders that can be returned. Returns are allowed within 30 days of delivery.</p>
                <Link href="/orders" className="shop-now-btn">
                  View My Orders
                </Link>
              </div>
            ) : (
              <div className="orders-list">
                {eligibleOrders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <h3>Order #{order.id.slice(-8).toUpperCase()}</h3>
                        <p className="order-date">
                          Delivered on{" "}
                          {new Date(order.tracking.delivered.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="order-status">
                        <span className="status-badge status-delivered">Delivered</span>
                      </div>
                    </div>

                    <div className="order-items">
                      {order.items.slice(0, 2).map((item: any) => (
                        <div key={item.id} className="order-item">
                          <img src={item.image || "/placeholder.svg"} alt={item.name} />
                          <div className="item-details">
                            <h4>{item.name}</h4>
                            <p>Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="more-items">+ {order.items.length - 2} more items</p>
                      )}
                    </div>

                    <div className="order-footer">
                      <div className="order-total">
                        <strong>Total: ${order.total.toFixed(2)}</strong>
                      </div>
                      <div className="order-actions">
                        <Link href={`/orders/${order.id}/return`} className="return-btn">
                          Start Return
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </main>
    </ProtectedRoute>
  )
}
