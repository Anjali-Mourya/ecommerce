"use client"
import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "../../lib/auth"
import type { Product } from "../../lib/products"
import { database, ref } from "../../lib/firebase"
import { set, get, child } from "firebase/database"

interface ProductCardProps {
  product: Product
}

export default function AuthenticatedProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const { user } = useAuth()

  const addToCart = async (e: React.MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()

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
        quantity: existingItem.quantity + 1,
      })
    } else {
      await set(cartRef, {
        ...product,
        quantity: 1,
      })
    }

    showToast(`${product.name} added to cart!`)
    window.dispatchEvent(new Event("cartUpdated"))
  } catch (error) {
    console.error("Error adding to cart:", error)
    showToast("Failed to add item. Please try again.")
  }
}

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      window.location.href = "/login"
      return
    }

    setIsWishlisted(!isWishlisted)
    showToast(isWishlisted ? "Removed from wishlist" : "Added to wishlist")
  }

  const showToast = (message: string) => {
    const toast = document.createElement("div")
    toast.className = "toast"
    toast.textContent = message
    document.body.appendChild(toast)

    setTimeout(() => toast.classList.add("show"), 100)
    setTimeout(() => {
      toast.classList.remove("show")
      setTimeout(() => document.body.removeChild(toast), 300)
    }, 3000)
  }

  return (
    
    <div className="product-card">
      <Link href={`/products/${product.id}`}>
        <div className="product-image-container">
          {!imageLoaded && <div className="image-skeleton"></div>}
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className={`product-image ${imageLoaded ? "loaded" : ""}`}
            onLoad={() => setImageLoaded(true)}
          />
          {product.discount && <div className="product-badge discount">-{product.discount}%</div>}
          {!product.inStock && <div className="product-badge out-of-stock">Out of Stock</div>}
          <button
            onClick={toggleWishlist}
            className={`wishlist-button ${isWishlisted ? "active" : ""}`}
            aria-label="Add to wishlist"
          >
            <svg fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
        <div className="product-info">
          <div className="product-brand">{product.brand}</div>
          <h3 className="product-name">{product.name}</h3>
          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`star ${i < Math.floor(product.rating) ? "filled" : ""}`}>
                  ★
                </span>
              ))}
            </div>
            <span className="rating-count">({product.reviews})</span>
          </div>
          <div className="product-price">
            <span className="current-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && <span className="original-price">${product.originalPrice.toFixed(2)}</span>}
          </div>
          <div className="product-features">
            {product.features.slice(0, 2).map((feature, index) => (
              <span key={index} className="feature-tag">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </Link>
      <div className="product-actions">
        <button
          onClick={addToCart}
          className={`add-to-cart-btn ${!product.inStock ? "disabled" : ""}`}
          disabled={!product.inStock}
        >
          <svg className="cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
            />
          </svg>
          {product.inStock ? (user ? "Add to Cart" : "Login to Buy") : "Out of Stock"}
        </button>
      </div>
    </div>
  )
}
