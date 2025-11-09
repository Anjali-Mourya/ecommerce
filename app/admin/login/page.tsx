"use client"
import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { get, ref } from "firebase/database"
import { database } from "@/lib/firebase"
import "../../admin/auth/create.css" // reuse CSS

export default function AdminLoginPage() {
  const { login, user } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // ✅ Step 1: Login the user
      await login(email, password)

      // ✅ Step 2: Get the current user UID
      const currentUser = user || (await import("firebase/auth")).getAuth().currentUser
      if (!currentUser) throw new Error("Unable to get logged-in user")

      // ✅ Step 3: Verify role from Firebase Realtime Database
      const roleSnap = await get(ref(database, `users/${currentUser.uid}/role`))
      const role = roleSnap.val()

      if (role !== "admin") {
        setMessage("❌ You are not authorized as an admin.")
        return
      }

      // ✅ Step 4: Redirect
      router.push("/admin/dashboard")
    } catch (error: any) {
      setMessage(`❌ ${error.message}`)
    }
  }

  return (
    <div className="create-admin-container">
      <div className="admin-card">
        <h1 className="admin-title">Admin Login</h1>
        <form onSubmit={handleAdminLogin}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="admin-input"
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="admin-input"
          />
          <button type="submit" className="admin-btn">
            Login
          </button>
        </form>
        {message && <p className="admin-message">{message}</p>}
      </div>
    </div>
  )
}
