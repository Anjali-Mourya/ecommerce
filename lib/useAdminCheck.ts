"use client"
import { useEffect, useState } from "react"
import { ref, get } from "firebase/database"
import { database } from "./firebase"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth"

export function useAdminCheck() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const checkAdmin = async () => {
      const snapshot = await get(ref(database, `users/${user.uid}/role`))
      const role = snapshot.val()
      if (role === "admin") {
        setIsAdmin(true)
      } else {
        router.push("/") // redirect normal users
      }
      setLoading(false)
    }

    checkAdmin()
  }, [user, router])

  return { isAdmin, loading }
}
