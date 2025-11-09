"use client"
import { useEffect, useState } from "react"
import { database as db } from "./firebase"
import { ref, onValue, set, remove } from "firebase/database"
import { useAuth } from "./auth"

export function useCart() {
  const { user } = useAuth()
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  

  useEffect(() => {
    if (!user) {
      setCart([])
      setLoading(false)
      return
    }

    const cartRef = ref(db, `carts/${user.uid}`)
    const unsubscribe = onValue(cartRef, (snapshot) => {
      const data = snapshot.val()

      if (!data) {
        setCart([])
        setLoading(false)
        return
      }

      let items: any[] = []

      if (Array.isArray(data)) {
        items = data.map((item, index) => item && { dbKey: String(index), ...item }).filter(Boolean)
      } else {
        items = Object.entries(data).map(([key, value]: any) => ({
          dbKey: key,
          ...value,
        }))
      }

      setCart(items)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const addToCart = async (product: any, quantity = 1) => {
    if (!user) return

    const cartRef = ref(db, `carts/${user.uid}`)

    const snapshot = await new Promise<any>((resolve) => {
      onValue(cartRef, resolve, { onlyOnce: true })
    })

    const currentCart = snapshot.val() || {}
    const existingKey = Object.keys(currentCart).find((key) => currentCart[key].id === product.id)

    if (existingKey) {
      await set(ref(db, `carts/${user.uid}/${existingKey}/quantity`), currentCart[existingKey].quantity + quantity)
    } else {
      const keys = Object.keys(currentCart)
        .map(Number)
        .filter((n) => !isNaN(n))
      const nextKey = keys.length > 0 ? Math.max(...keys) + 1 : 1

      await set(ref(db, `carts/${user.uid}/${nextKey}`), {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        quantity: quantity,
      })
    }
  }

  const updateQuantity = async (dbKey: string, quantity: number) => {
    if (!user) return
    await set(ref(db, `carts/${user.uid}/${dbKey}/quantity`), quantity)
  }

  const removeItem = async (dbKey: string) => {
    if (!user) return
    await remove(ref(db, `carts/${user.uid}/${dbKey}`))
  }

  const clearCart = async () => {
    if (!user) return
    await remove(ref(db, `carts/${user.uid}`))
  }

  return { cart, loading, addToCart, updateQuantity, removeItem, clearCart }
}
