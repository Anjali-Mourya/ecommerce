"use client"
import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { get, ref } from "firebase/database"
import { database } from "@/lib/firebase"
import "./create.css"

export default function AdminAuthPage() {
  const { signup, login } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  // ✅ Handle Login or Signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    try {
      if (isLogin) {
        // ---- LOGIN ----
        await login(email, password)
        const { getAuth } = await import("firebase/auth")
        const currentUser = getAuth().currentUser
        if (!currentUser) throw new Error("Login failed")

        const roleSnap = await get(ref(database, `users/${currentUser.uid}/role`))
        const role = roleSnap.val()
        if (role !== "admin") {
          setMessage("❌ You are not authorized as an admin.")
          return
        }

        router.push("/admin/dashboard")
      } else {
        // ---- SIGNUP ----
        await signup(email, password, name, "admin")
        await login(email, password)
        router.push("/admin/dashboard")
      }
    } catch (error: any) {
      setMessage(`❌ ${error.message}`)
    }
  }

  return (
    <div className="create-admin-container">
      <div className="admin-card">
        <h1 className="admin-title">{isLogin ? "Admin Login" : "Create Admin"}</h1>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="admin-input"
            />
          )}

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
            {isLogin ? "Login" : "Create Admin"}
          </button>
        </form>

        {message && <p className="admin-message">{message}</p>}

        {/* ✅ Toggle button */}
        <p className="toggle-text">
          {isLogin ? (
            <>
              Don’t have an admin account?{" "}
              <button onClick={() => setIsLogin(false)} className="toggle-btn">
                Create Admin
              </button>
            </>
          ) : (
            <>
              Already an admin?{" "}
              <button onClick={() => setIsLogin(true)} className="toggle-btn">
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
