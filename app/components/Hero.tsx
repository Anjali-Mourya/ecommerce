"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { products } from "../../lib/products"

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const featuredProducts = products.slice(0, 3)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, featuredProducts.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  return (
    <section className="hero-section">
      <div className="hero-carousel">
        {featuredProducts.map((product, index) => (
          <div key={product.id} className={`hero-slide ${index === currentSlide ? "active" : ""}`}>
            <div className="hero-background">
              <img src={product.image || "/placeholder.svg"} alt={product.name} className="hero-image" />
              <div className="hero-overlay"></div>
            </div>

            <div className="hero-content">
              <div className="hero-badge">
                {product.discount && <span className="discount-badge">{product.discount}% OFF</span>}
                <span className="category-badge">{product.category}</span>
              </div>

              <h1 className="hero-title">{product.name}</h1>
              <p className="hero-description">{product.description}</p>

              <div className="hero-price">
                <span className="current-price">${product.price.toFixed(2)}</span>
                {product.originalPrice && <span className="original-price">${product.originalPrice.toFixed(2)}</span>}
              </div>

              <div className="hero-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < Math.floor(product.rating) ? "filled" : ""}`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="rating-text">({product.reviews} reviews)</span>
              </div>

              <div className="hero-actions">
                <Link href={`/products/${product.id}`} className="hero-button primary">
                  Shop Now
                  <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                    />
                  </svg>
                </Link>
                <Link href={`/products/${product.id}`} className="hero-button secondary">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Controls */}
        <button onClick={prevSlide} className="hero-nav prev" aria-label="Previous slide">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button onClick={nextSlide} className="hero-nav next" aria-label="Next slide">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide Indicators */}
        <div className="hero-indicators">
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`indicator ${index === currentSlide ? "active" : ""}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
