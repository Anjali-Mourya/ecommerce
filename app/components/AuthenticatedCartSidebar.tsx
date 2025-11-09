"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "../../lib/auth"
import PaymentModal from "../components/PaymentModal"
import { database as db } from "../../lib/firebase"
import { ref, onValue, set, remove } from "firebase/database"

export default function AuthenticatedCartSidebar() {
  const [cart, setCart] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setCart([])
      return
    }

    // ✅ Fetch from RTDB instead of localStorage
    const cartRef = ref(db, `carts/${user.uid}`)
    const unsubscribe = onValue(cartRef, (snapshot) => {
      const data = snapshot.val() || {}
      // your data shape: carts/{uid}/{1: {...}, 2: {...}}
      const items = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }))
      setCart(items)
    })

    // Observer for sidebar open/close
    const sidebar = document.getElementById("cart-sidebar")
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const target = mutation.target as HTMLElement
          setIsOpen(target.classList.contains("open"))
        }
      })
    })
    if (sidebar) observer.observe(sidebar, { attributes: true })

    return () => {
      unsubscribe()
      observer.disconnect()
    }
  }, [user])

  // ✅ Update quantity in RTDB
  const updateQuantity = async (id: string, newQuantity: number) => {
    if (!user || newQuantity < 1) return
    await set(ref(db, `carts/${user.uid}/${id}/quantity`), newQuantity)
  }

  // ✅ Remove item from RTDB
  const removeItem = async (id: string) => {
    if (!user) return
    await remove(ref(db, `carts/${user.uid}/${id}`))
  }

  const closeCart = () => {
    document.getElementById("cart-sidebar")?.classList.remove("open")
  }

  const handleCheckout = () => {
    if (!user) {
      window.location.href = "/login"
      return
    }
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = (orderId: string) => {
    setShowPaymentModal(false)
    closeCart()
    const toast = document.createElement("div")
    toast.className = "toast success"
    toast.innerHTML = `
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
      Order placed successfully! Track your order in My Orders.
    `
    document.body.appendChild(toast)
    setTimeout(() => toast.classList.add("show"), 100)
    setTimeout(() => {
      toast.classList.remove("show")
      setTimeout(() => document.body.removeChild(toast), 300)
    }, 5000)
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      {isOpen && <div className="cart-sidebar-overlay" onClick={closeCart}></div>}
      <div id="cart-sidebar" className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        <div className="cart-sidebar-content">
          <div className="cart-header">
            <h2 className="cart-title">
              Shopping Cart
              {itemCount > 0 && <span className="cart-item-count">({itemCount})</span>}
            </h2>
            <button onClick={closeCart} className="cart-close" aria-label="Close cart">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="cart-body">
            {!user ? (
              <div className="auth-required">
                <svg className="auth-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3>Sign in to view your cart</h3>
                <p>Create an account or sign in to save items and checkout</p>
                <div className="auth-buttons">
                  <Link href="/login" className="auth-btn primary" onClick={closeCart}>Sign In</Link>
                  <Link href="/signup" className="auth-btn secondary" onClick={closeCart}>Sign Up</Link>
                </div>
              </div>
            ) : cart.length === 0 ? (
              <div className="empty-cart">
                <svg className="empty-cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                </svg>
                <p>Your cart is empty</p>
                <Link href="/products" className="continue-shopping-btn" onClick={closeCart}>
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        <img src={item.image || "/placeholder.svg"} alt={item.name} />
                      </div>
                      <div className="cart-item-details">
                        <h4 className="cart-item-name">{item.name}</h4>
                        <p className="cart-item-brand">{item.brand}</p>
                        <div className="cart-item-price">${item.price.toFixed(2)}</div>
                        <div className="cart-item-controls">
                          <div className="quantity-controls">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="quantity-btn"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="quantity">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="quantity-btn">
                              +
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="remove-btn" aria-label="Remove item">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-footer">
                  <div className="cart-total">
                    <div className="subtotal">
                      <span>Subtotal:</span>
                      <span className="total-amount">${total.toFixed(2)}</span>
                    </div>
                    <p className="shipping-note">Shipping calculated at checkout</p>
                  </div>
                  <div className="cart-actions">
                    <Link href="/cart" className="view-cart-btn" onClick={closeCart}>View Cart</Link>
                    <button onClick={handleCheckout} className="checkout-btn">
                      Checkout
                      <svg className="checkout-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        cart={cart}
        total={total}
        onSuccess={handlePaymentSuccess}
      />
    </>
  )
}
