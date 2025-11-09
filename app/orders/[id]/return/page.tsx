"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ref, onValue, set } from "firebase/database"
import { database } from "@/lib/firebase"
import ProtectedRoute from "../../../components/ProtectedRoute"
import Link from "next/link"
import { useAuth } from "../../../../lib/auth"
import AuthenticatedNavBar from "@/app/components/AuthenticatedNavBar"
import Footer from "../../../components/Fotter"
import "../../order.css"

export default function ReturnOrderPage() {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([]) // Store all orders
  const [loading, setLoading] = useState(true)
  const [returnReason, setReturnReason] = useState("")
  const [returnSubmitted, setReturnSubmitted] = useState(false)
  const [error, setError] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    // Fetch all orders
    const allOrdersRef = ref(database, `orders/${user.uid}`)
    const unsubscribeAll = onValue(allOrdersRef, (snapshot) => {
      const data = snapshot.val() || {}
      const ordersArray = Object.values(data)
      setOrders(ordersArray)
      setLoading(false)
    })

    // Fetch specific order if ID is present
    if (id) {
      const orderRef = ref(database, `orders/${user.uid}/${id}`)
      const unsubscribeOrder = onValue(orderRef, (snapshot) => {
        const data = snapshot.val()
        setOrder(data)
      })
      return () => {
        unsubscribeAll()
        unsubscribeOrder()
      }
    }

    return () => {
      unsubscribeAll()
    }
  }, [id, user])

  const isReturnEligible = (order: any) => {
    if (!order || !order.tracking?.delivered) return false
    const deliveryDate = new Date(order.tracking.delivered.timestamp)
    const currentDate = new Date()
    const daysSinceDelivery = (currentDate.getTime() - deliveryDate.getTime()) / (1000 * 3600 * 24)
    return daysSinceDelivery <= 30
  }

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !order) return
    if (!returnReason.trim()) {
      setError("Please provide a reason for the return")
      return
    }

    try {
      const returnRef = ref(database, `returns/${user.uid}/${order.id}`)
      await set(returnRef, {
        orderId: order.id,
        createdAt: new Date().toISOString(),
        reason: returnReason,
        status: "pending",
        items: order.items,
        total: order.total
      })
      setReturnSubmitted(true)
      setError("")
    } catch (err) {
      console.error("Error submitting return:", err)
      setError("Failed to submit return request. Please try again.")
    }
  }

  if (loading) {
    return (
      <main className="main-container">
        <AuthenticatedNavBar />
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
        <Footer />
      </main>
    )
  }

  if (!id) {
    // No specific order selected — show list
    return (
      <main className="main-container">
        <AuthenticatedNavBar />
        <div className="orders-list-page">
          <h1>Your Orders</h1>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <ul className="order-list">
              {orders.map((o) => (
                <li key={o.id} className="order-item">
                  <Link href={`/orders/${o.id}/return`} className="order-link">
                    Order #{o.id.slice(-8).toUpperCase()} - Placed on {new Date(o.createdAt).toLocaleDateString()}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Footer />
      </main>
    )
  }

  if (!order) {
    return (
      <main className="main-container">
        <AuthenticatedNavBar />
        <div className="error-page">
          <h1>Order Not Found</h1>
          <p>The order you're looking for doesn't exist.</p>
          <Link href="/orders" className="back-button">Back to Orders</Link>
        </div>
        <Footer />
      </main>
    )
  }

  const eligible = isReturnEligible(order)

  return (
    <ProtectedRoute>
      <main className="main-container">
        <AuthenticatedNavBar />
        <div className="return-page">
          <div className="container">
            <div className="page-header">
              <Link href="/orders" className="back-link">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Orders
              </Link>
              <h1>Return Order #{order.id.slice(-8).toUpperCase()}</h1>
              <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="return-content">
              {!eligible ? (
                <div className="ineligible-message">
                  <h2>Ineligible for Return</h2>
                  <p>This order is not eligible for return. Returns are only available within 30 days of delivery.</p>
                  <h3>Your Orders</h3>
                  {orders.length === 0 ? (
                    <p>No orders found.</p>
                  ) : (
                    <ul className="order-list">
                      {orders.map((o) => (
                        <li key={o.id} className="order-item">
                          <Link href={`/orders/${o.id}/return`} className="order-link">
                            Order #{o.id.slice(-8).toUpperCase()} - Placed on {new Date(o.createdAt).toLocaleDateString()}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : returnSubmitted ? (
                <div className="success-message">
                  <h2>Return Request Submitted</h2>
                  <p>Your return request has been successfully submitted. You'll receive a confirmation soon.</p>
                  <Link href="/orders" className="back-button">
                    Back to Orders
                  </Link>
                </div>
              ) : (
                <>
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
                  </div>

                  <div className="return-form">
                    <h2>Submit Return Request</h2>
                    <form onSubmit={handleReturnSubmit}>
                      <div className="form-group">
                        <label htmlFor="returnReason">Reason for Return</label>
                        <textarea
                          id="returnReason"
                          value={returnReason}
                          onChange={(e) => setReturnReason(e.target.value)}
                          placeholder="Please explain why you want to return this order"
                          required
                        ></textarea>
                      </div>
                      {error && <p className="error-message">{error}</p>}
                      <button type="submit" className="submit-return-btn">
                        Submit Return Request
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </ProtectedRoute>
  )
}