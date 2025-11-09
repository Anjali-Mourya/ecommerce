"use client"
import { useState, useEffect } from "react"
import { useAuth } from "../../lib/auth"
import { ref, onValue, get, set } from "firebase/database"
import { database } from "../../lib/firebase"
import ProtectedRoute from "../components/ProtectedRoute"
import Link from "next/link"
import "./order.css"
import AuthenticatedNavBar from "../components/AuthenticatedNavBar"
import Footer from "../components/Fotter"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const userOrdersRef = ref(database, `orders/${user.uid}`)

    const unsubscribe = onValue(userOrdersRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const ordersList = Object.values(data).sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        setOrders(ordersList)
      } else {
        setOrders([])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const handleReorder = async (order: any) => {
    if (!user) {
      window.location.href = "/login"
      return
    }

    try {
      const cartRef = ref(database, `carts/${user.uid}`)
      const snapshot = await get(cartRef)
      const currentCart = snapshot.exists() ? snapshot.val() : {}

      const updatedCart = { ...currentCart }
      const keys = Object.keys(updatedCart).map(Number).filter(n => !isNaN(n))
      let nextKey = keys.length > 0 ? Math.max(...keys) + 1 : 1

      order.items.forEach((item: any) => {
        const existingKey = Object.keys(updatedCart).find(
          (key) => updatedCart[key].id === item.id
        )

        if (existingKey) {
          updatedCart[existingKey].quantity += item.quantity
        } else {
          updatedCart[nextKey] = { ...item }
          nextKey++
        }
      })

      await set(cartRef, updatedCart)
      console.log("Cart successfully saved to Firebase")
      alert("Order items added to cart!")
    } catch (error) {
      console.error("Error updating cart in Firebase:", error)
      alert("Failed to update cart in database!")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "status-confirmed"
      case "processing":
        return "status-processing"
      case "shipped":
        return "status-shipped"
      case "delivered":
        return "status-delivered"
      default:
        return "status-confirmed"
    }
  }

  const isReturnEligible = (order: any) => {
    if (!order || !order.tracking.delivered) return false
    const deliveryDate = new Date(order.tracking.delivered.timestamp)
    const currentDate = new Date()
    const daysSinceDelivery = (currentDate.getTime() - deliveryDate.getTime()) / (1000 * 3600 * 24)
    return daysSinceDelivery <= 30
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <main className="main-container">
        <AuthenticatedNavBar />
        <div className="orders-page">
          <div className="container">
            <div className="page-header">
              <h1>My Orders</h1>
              <p>Track and manage your orders</p>
            </div>

            {orders.length === 0 ? (
              <div className="empty-orders">
                <h2>No Orders Yet</h2>
                <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
                <Link href="/products" className="shop-now-btn">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <h3>Order #{order.id.slice(-8).toUpperCase()}</h3>
                        <p className="order-date">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="order-items">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="order-item">
                          <img src={item.image || "/placeholder.svg"} alt={item.name} />
                          <div className="item-details">
                            <h4>{item.name}</h4>
                            <p>Quantity: {item.quantity}</p>
                            <p className="item-price">${item.price.toFixed(2)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="order-footer">
                      <div className="order-total">
                        <strong>Total: ${order.total.toFixed(2)}</strong>
                      </div>
                      <div className="order-actions">
                        <Link href={`/orders/${order.id}`} className="track-btn">
                          Track Order
                        </Link>
                        <button onClick={() => handleReorder(order)} className="reorder-btn">
                          Reorder
                        </button>
                        {isReturnEligible(order) && (
                          <Link href={`/orders/${order.id}/return`} className="return-btn">
                            Return Order
                          </Link>
                        )}
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