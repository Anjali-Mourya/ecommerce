"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useAuth } from "../../lib/auth"
import { ref, onValue, update } from "firebase/database"
import { database } from "../../lib/firebase"
import Footer from "../components/Fotter"
import ProtectedRoute from "../components/ProtectedRoute"
import AuthenticatedNavBar from "../components/AuthenticatedNavBar"

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  })
  const { user } = useAuth()

  useEffect(() => {
  if (!user) return

  // Fetch user data
  const userRef = ref(database, `users/${user.uid}`)
  const unsubscribeUser = onValue(userRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      setUserData(data)
      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        address: data.address || "",
      })
    }
  })

  // Fetch user orders
  const ordersRef = ref(database, `orders/${user.uid}`)
  const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      const ordersList = Object.values(data)
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
      setOrders(ordersList)
    } else {
      setOrders([])
    }
    setLoading(false)
  })

  return () => {
    unsubscribeUser()
    unsubscribeOrders()
  }
}, [user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      await update(ref(database, `users/${user.uid}`), {
        ...formData,
        updatedAt: new Date().toISOString(),
      })
      setEditing(false)

      // Show success toast
      const toast = document.createElement("div")
      toast.className = "toast success"
      toast.innerHTML = `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        Profile updated successfully!
      `
      document.body.appendChild(toast)
      setTimeout(() => toast.classList.add("show"), 100)
      setTimeout(() => {
        toast.classList.remove("show")
        setTimeout(() => document.body.removeChild(toast), 300)
      }, 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <main className="main-container">
        <AuthenticatedNavBar/>
        <div className="profile-page">
          <div className="container">
            <div className="profile-container">
              {/* Profile Header */}
              <div className="profile-header">
                <div className="profile-avatar">
                  {userData?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </div>
                <h1 className="profile-name">{userData?.name || "User"}</h1>
                <p className="profile-email">{user?.email}</p>
                <div className="profile-stats">
                  <div className="stat-item">
                    <span className="stat-number">{orders.length}</span>
                    <span className="stat-label">Total Orders</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                    </span>
                    <span className="stat-label">Total Spent</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{new Date(userData?.createdAt).getFullYear()}</span>
                    <span className="stat-label">Member Since</span>
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="profile-content">
                {/* Profile Information */}
                <div className="profile-section">
                  <div className="section-header">
                    <h2 className="section-title">Profile Information</h2>
                    <button onClick={() => setEditing(!editing)} className="edit-btn">
                      {editing ? "Cancel" : "Edit"}
                    </button>
                  </div>

                  {editing ? (
                    <form onSubmit={handleUpdateProfile} className="profile-form">
                      <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <button type="submit" className="update-btn">
                        Update Profile
                      </button>
                    </form>
                  ) : (
                    <div className="profile-info">
                      <div className="info-item">
                        <label>Full Name:</label>
                        <span>{userData?.name || "Not provided"}</span>
                      </div>
                      <div className="info-item">
                        <label>Email:</label>
                        <span>{user?.email}</span>
                      </div>
                      <div className="info-item">
                        <label>Phone:</label>
                        <span>{userData?.phone || "Not provided"}</span>
                      </div>
                      <div className="info-item">
                        <label>Address:</label>
                        <span>{userData?.address || "Not provided"}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recent Orders */}
                <div className="profile-section">
                  <h2 className="section-title">Recent Orders</h2>
                  {orders.length === 0 ? (
                    <p className="no-orders">No orders yet</p>
                  ) : (
                    <div className="recent-orders">
                      {orders.map((order) => (
                        <div key={order.id} className="order-summary">
                          <div className="order-id">#{order.id.slice(-8).toUpperCase()}</div>
                          <div className="order-date">{new Date(order.createdAt).toLocaleDateString()}</div>
                          <div className="order-amount">${order.total.toFixed(2)}</div>
                          <div className={`order-status status-${order.status}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
