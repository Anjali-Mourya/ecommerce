"use client"
import { useState } from "react"
import { useAuth } from "../../lib/auth"
import PaymentModal from "./PaymentModal"
import { database, ref } from "../../lib/firebase"
import { get, set } from "firebase/database"
import { useRouter } from "next/navigation" // Import useRouter
import "./authProduct.css"

interface AuthenticatedProductDetailProps {
  product: any
  quantity: number
  onQuantityChange: (quantity: number) => void
}

export default function AuthenticatedProductDetail({
  product,
  quantity,
  onQuantityChange,
}: AuthenticatedProductDetailProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const { user } = useAuth()
  const router = useRouter() // Initialize useRouter

  const addToCart = async () => {
  if (!user) {
    window.location.href = "/login"
    return
  }

  const userId = user.uid
  const cartRef = ref(database, `carts/${userId}/${product.id}`)

  try {
    // Check if product already exists in cart
    const snapshot = await get(cartRef)

    if (snapshot.exists()) {
      const existingItem = snapshot.val()
      await set(cartRef, {
        ...product,
        quantity: existingItem.quantity + quantity,
      })
    } else {
      await set(cartRef, {
        ...product,
        quantity,
      })
    }

    // window.dispatchEvent(new Event("cartUpdated"))

    // Show success toast
    const toast = document.createElement("div")
    toast.className = "toast success"
    toast.innerHTML = `
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
      ${product.name} added to cart!
    `
    document.body.appendChild(toast)
    setTimeout(() => toast.classList.add("show"), 100)
    setTimeout(() => {
      toast.classList.remove("show")
      setTimeout(() => document.body.removeChild(toast), 300)
    }, 3000)
  } catch (error) {
    console.error("Error adding to cart:", error)
    const toast = document.createElement("div")
    toast.className = "toast error"
    toast.textContent = "Failed to add item. Please try again."
    document.body.appendChild(toast)
    setTimeout(() => document.body.removeChild(toast), 3000)
  }
}
  const buyNow = () => {
    if (!user) {
      window.location.href = "/login"
      return
    }
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = (orderId: string) => {
    setShowPaymentModal(false)
    const toast = document.createElement("div")
    toast.className = "toast success"
    toast.innerHTML = `
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
      Order placed successfully! Order ID: ${orderId.slice(-8).toUpperCase()}
    `
    document.body.appendChild(toast)
    setTimeout(() => toast.classList.add("show"), 100)
    setTimeout(() => {
      toast.classList.remove("show")
      setTimeout(() => document.body.removeChild(toast), 300)
    }, 5000)
  }

  return (
    <>
      <div className="action-buttons">
        <button
          onClick={addToCart}
          className={`add-to-cart-btn ${!product.inStock ? "disabled" : ""}`}
          disabled={!product.inStock}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
            />
          </svg>
          {product.inStock ? (user ? "Add to Cart" : "Login to Add to Cart") : "Out of Stock"}
        </button>
        <button onClick={buyNow} className="buy-now-btn" disabled={!product.inStock}>
          {user ? "Buy Now" : "Login to Buy"}
        </button>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        cart={[{ ...product, quantity }]}
        total={product.price * quantity}
        onSuccess={handlePaymentSuccess}
      />
    </>
  )
}