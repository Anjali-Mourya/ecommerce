"use client"

import { useState } from "react"
import Link from "next/link"
import Footer from "../components/Fotter"
import PaymentModal from "../components/PaymentModal"
import { useCart } from "../../lib/useCart"
import "./cart.css"
import AuthenticatedCartSidebar from "../components/AuthenticatedCartSidebar"
import AuthenticatedNavBar from "../components/AuthenticatedNavBar"

// Define the CartItem interface
interface CartItem {
  id: string
  name: string
  brand: string
  price: number
  quantity: number
  image?: string
  features?: string[]
}

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart() as {
    cart: CartItem[]
    loading: boolean
    updateQuantity: (id: string, quantity: number) => void
    removeItem: (id: string) => void
    clearCart: () => void
  }
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null)

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handlePaymentSuccess = (orderId: string, isSingleItem: boolean = false) => {
    if (isSingleItem && selectedItem) {
      removeItem(selectedItem.id)
    } else {
      clearCart()
    }
    alert(`Order ${orderId} placed successfully!`)
  }

  const handleCheckoutItem = (item: CartItem) => {
    setSelectedItem(item)
    setIsPaymentModalOpen(true)
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    )
  }

  return (
    <main className="main-container">
      <AuthenticatedNavBar />
      <AuthenticatedCartSidebar />

      <div className="cart-page">
        <div className="container">
          <div className="page-header">
            <h1>Shopping Cart</h1>
            {cart.length > 0 && (
              <button onClick={clearCart} className="clear-cart-btn">
                Clear Cart
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart-page">
              <svg className="empty-cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                />
              </svg>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any items to your cart yet.</p>
              <Link href="/products" className="continue-shopping-btn">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items">
                <div className="cart-header">
                  <span>Product</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Total</span>
                  <span>Actions</span>
                </div>

                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-product">
                      <img src={item.image || "/placeholder.svg"} alt={item.name} />
                      <div className="item-details">
                        <h3>{item.name}</h3>
                        <p className="item-brand">{item.brand}</p>
                        <div className="item-features">
                          {item.features?.slice(0, 2).map((feature: string, index: number) => (
                            <span key={index} className="feature-tag">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="item-price">${item.price.toFixed(2)}</div>

                    <div className="item-quantity">
                      <div className="quantity-controls">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </div>

                    <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>

                    <div className="item-actions">
                      <button
                        onClick={() => handleCheckoutItem(item)}
                        className="checkout-item-btn"
                      >
                        Checkout Item
                      </button>
                      <button onClick={() => removeItem(item.id)} className="remove-btn" aria-label="Remove item">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-card">
                  <h3>Order Summary</h3>

                  <div className="summary-row">
                    <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                  </div>

                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  {subtotal < 50 && (
                    <div className="shipping-notice">Add ${(50 - subtotal).toFixed(2)} more for free shipping!</div>
                  )}

                  <button
                    className="checkout-btn"
                    onClick={() => {
                      setSelectedItem(null)
                      setIsPaymentModalOpen(true)
                    }}
                  >
                    Proceed to Checkout
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>

                  <div className="payment-methods">
                    <span>We accept:</span>
                    <div className="payment-icons">
                      <span>💳</span>
                      <span>🏦</span>
                      <span>📱</span>
                    </div>
                  </div>
                </div>

                <Link href="/products" className="continue-shopping">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <PaymentModal
  isOpen={isPaymentModalOpen}
  onClose={() => {
    setIsPaymentModalOpen(false)
    setSelectedItem(null)
  }}
  cart={selectedItem ? [selectedItem] : cart}
  total={selectedItem
    ? selectedItem.price * selectedItem.quantity +
      selectedItem.price * selectedItem.quantity * 0.08 +
      (selectedItem.price * selectedItem.quantity > 50 ? 0 : 9.99)
    : total}
  onSuccess={(orderId) => handlePaymentSuccess(orderId, !!selectedItem)}
  singleItem={!!selectedItem}   // ✅ pass whether it's single checkout
/>


      <Footer />
    </main>
  )
}