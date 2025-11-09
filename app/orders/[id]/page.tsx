"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ref, onValue } from "firebase/database"
import { database } from "../../../lib/firebase"
import Footer from "../../components/Fotter"
import ProtectedRoute from "../../components/ProtectedRoute"
import Link from "next/link"
import { useAuth } from "../../../lib/auth"
import "../order.css"
import AuthenticatedNavBar from "@/app/components/AuthenticatedNavBar"


export default function OrderTrackingPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()


  useEffect(() => {
  if (!id || !user) return

  const orderRef = ref(database, `orders/${user.uid}/${id}`)
  const unsubscribe = onValue(orderRef, (snapshot) => {
    const data = snapshot.val()
    setOrder(data)
    setLoading(false)
  })

  return () => unsubscribe()
}, [id, user])


  const trackingSteps = [
    { key: "confirmed", label: "Order Confirmed", icon: "✓" },
    { key: "processing", label: "Processing", icon: "⚙️" },
    { key: "shipped", label: "Shipped", icon: "🚚" },
    { key: "delivered", label: "Delivered", icon: "📦" },
  ]

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <main className="main-container">
        <AuthenticatedNavBar />
        <div className="error-page">
          <h1>Order Not Found</h1>
          <p>The order you're looking for doesn't exist.</p>
          <Link href="/orders" className="back-button">
            Back to Orders
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <ProtectedRoute>
      <main className="main-container">
        <AuthenticatedNavBar/>
        <div className="tracking-page">
          <div className="container">
            <div className="page-header">
              <Link href="/orders" className="back-link">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Orders
              </Link>
              <h1>Order #{order.id.slice(-8).toUpperCase()}</h1>
              <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="tracking-content">
              <div className="tracking-timeline">
                <h2>Order Status</h2>
                <div className="timeline">
                  {trackingSteps.map((step, index) => {
                    const stepData = order.tracking[step.key]
                    const isCompleted = stepData?.status
                    const isActive = index === trackingSteps.findIndex((s) => !order.tracking[s.key]?.status)

                    return (
                      <div
                        key={step.key}
                        className={`timeline-step ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}
                      >
                        <div className="step-icon">{isCompleted ? "✓" : step.icon}</div>
                        <div className="step-content">
                          <h3>{step.label}</h3>
                          {stepData?.timestamp && (
                            <p className="step-time">{new Date(stepData.timestamp).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="order-details">
                <div className="details-card">
                  <h3>Order Items</h3>
                  <div className="order-items">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="order-item">
                        <img src={item.image || "/placeholder.svg"} alt={item.name} />
                        <div className="item-info">
                          <h4>{item.name}</h4>
                          <p>Quantity: {item.quantity}</p>
                          <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="order-total">
                    <strong>Total: ${order.total.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="details-card">
                  <h3>Shipping Address</h3>
                  <div className="address-info">
                    <p>{order.address.street}</p>
                    <p>
                      {order.address.city}, {order.address.state} {order.address.zip}
                    </p>
                    <p>{order.address.country}</p>
                  </div>
                </div>

                <div className="details-card">
                  <h3>Payment Method</h3>
                  <div className="payment-info">
                    <span className="payment-method">
                      {order.paymentMethod === "card" && "💳 Credit/Debit Card"}
                      {order.paymentMethod === "paypal" && "🏦 PayPal"}
                      {order.paymentMethod === "cash on delivery" && "💵 Cash on Delivery"}
                      {order.paymentMethod === "apple-pay" && "📱 Apple Pay"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </ProtectedRoute>
  )
}
