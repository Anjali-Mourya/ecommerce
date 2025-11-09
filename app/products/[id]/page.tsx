"use client"
import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
// Removed: import NavBar from "../../components/NavBar"
import AuthenticatedNavBar from "../../components/AuthenticatedNavBar"
import AuthenticatedCartSidebar from "../../components/AuthenticatedCartSidebar"
import AuthenticatedProductCard from "../../components/AuthenticatedProductCard"
import AuthenticatedProductDetail from "../../components/AuthenticatedProductDetail"
import Footer from "../../components/Fotter"
import { products } from "../../../lib/products"
import "../product.css"

export default function ProductDetailPage() {
  const { id } = useParams()
  const product = products.find((p) => p.id === Number(id))
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState("description")
  const [isZoomed, setIsZoomed] = useState(false)

  if (!product) {
    return (
      <main className="main-container">
        <AuthenticatedNavBar />
        <div className="error-page">
          <h1>Product Not Found</h1>
          <p>The product you're looking for doesn't exist.</p>
          <Link href="/products" className="back-button">
            Back to Products
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <main className="main-container">
      <AuthenticatedNavBar />
      <AuthenticatedCartSidebar />
      <div className="product-detail-page">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/products">Products</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category}`}>
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </Link>
            <span>/</span>
            <span>{product.name}</span>
          </nav>

          <div className="product-detail-content">
            {/* Product Images */}
            <div className="product-images">
              <div className="main-image-container image-wrapper">
                <img
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className={`main-image ${isZoomed ? "zoomed" : ""}`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
                {product.discount && <div className="discount-badge">-{product.discount}%</div>}
              </div>
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`thumbnail ${index === selectedImage ? "active" : ""}`}
                  >
                    <img src={image || "/placeholder.svg"} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info">
              <div className="product-header">
                <div className="brand-name">{product.brand}</div>
                <h1 className="product-title">{product.name}</h1>
                <div className="product-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`star ${i < Math.floor(product.rating) ? "filled" : ""}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="rating-text">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="product-pricing">
                <div className="price-container">
                  <span className="current-price">${product.price.toFixed(2)}</span>
                  {product.originalPrice && <span className="original-price">${product.originalPrice.toFixed(2)}</span>}
                  {product.discount && (
                    <span className="savings">Save ${(product.originalPrice! - product.price).toFixed(2)}</span>
                  )}
                </div>
                <div className="stock-status">
                  {product.inStock ? (
                    <span className="in-stock">✓ In Stock</span>
                  ) : (
                    <span className="out-of-stock">✗ Out of Stock</span>
                  )}
                </div>
              </div>

              <div className="product-features">
                <h3>Key Features</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="purchase-section">
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                      -
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                </div>

                <AuthenticatedProductDetail product={product} quantity={quantity} onQuantityChange={setQuantity} />
              </div>

              <div className="shipping-info">
                <div className="shipping-item">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="shipping-item">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>30-day return policy</span>
                </div>
                <div className="shipping-item">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span>2-year warranty</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="product-tabs">
            <div className="tab-headers">
              <button
                onClick={() => setActiveTab("description")}
                className={`tab-header ${activeTab === "description" ? "active" : ""}`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("specifications")}
                className={`tab-header ${activeTab === "specifications" ? "active" : ""}`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`tab-header ${activeTab === "reviews" ? "active" : ""}`}
              >
                Reviews ({product.reviews})
              </button>
            </div>
            <div className="tab-content">
              {activeTab === "description" && (
                <div className="tab-panel">
                  <p>{product.description}</p>
                  <h4>Features & Benefits</h4>
                  <ul>
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              {activeTab === "specifications" && (
                <div className="tab-panel">
                  <div className="specifications-grid">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="spec-row">
                        <span className="spec-label">{key}:</span>
                        <span className="spec-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="tab-panel">
                  <div className="reviews-summary">
                    <div className="rating-breakdown">
                      <div className="overall-rating">
                        <span className="rating-number">{product.rating}</span>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`star ${i < Math.floor(product.rating) ? "filled" : ""}`}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span>Based on {product.reviews} reviews</span>
                      </div>
                    </div>
                  </div>
                  <div className="sample-reviews">
                    <div className="review-item">
                      <div className="review-header">
                        <div className="reviewer-name">John D.</div>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="star filled">
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="review-text">
                        Excellent product! Exactly as described and great quality. Would definitely recommend to others.
                      </p>
                    </div>
                    <div className="review-item">
                      <div className="review-header">
                        <div className="reviewer-name">Sarah M.</div>
                        <div className="review-rating">
                          {[...Array(4)].map((_, i) => (
                            <span key={i} className="star filled">
                              ★
                            </span>
                          ))}
                          <span className="star">★</span>
                        </div>
                      </div>
                      <p className="review-text">
                        Very good product, fast shipping. Only minor issue was the packaging could be better, but the
                        product itself is great.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="related-products">
              <h2>Related Products</h2>
              <div className="products-grid">
                {relatedProducts.map((product) => (
                  <AuthenticatedProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
