"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "../lib/auth"
import AuthenticatedNavBar from "./components/AuthenticatedNavBar"
import AuthenticatedProductCard from "./components/AuthenticatedProductCard"
import Hero from "./components/Hero"
import Newsletter from "./components/Newsletter"
import Footer from "./components/Fotter"
import { products } from "../lib/products"

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState(products.slice(0, 8))
  const [isLoading, setIsLoading] = useState(true)
  const { loading } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading || isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading amazing products...</p>
      </div>
    )
  }

  return (
    <main className="main-container">
      <AuthenticatedNavBar />
      {/* <AuthenticatedCartSidebar /> */}
      <Hero />

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Discover our handpicked selection of premium products</p>
          </div>
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <AuthenticatedProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="section-cta">
            <Link href="/products" className="cta-button">
              View All Products
              <svg className="cta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            <Link href="/products?category=electronics" className="category-card electronics">
              <div className="category-overlay">
                <h3>Electronics</h3>
                <p>Latest tech & gadgets</p>
              </div>
            </Link>
            <Link href="/products?category=clothing" className="category-card clothing">
              <div className="category-overlay">
                <h3>Clothing</h3>
                <p>Fashion & lifestyle</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </main>
  )
}
