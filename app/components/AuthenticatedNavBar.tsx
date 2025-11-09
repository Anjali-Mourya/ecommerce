"use client"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "../../lib/auth"
import { useCart } from "../../lib/useCart"
import { products } from "../../lib/products"
import { useRouter } from "next/navigation" // Add useRouter for navigation

export default function AuthenticatedNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const searchRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const { user, logout } = useAuth()
  const { cart } = useCart()
  const router = useRouter() // Initialize useRouter

  const cartCount = cart.reduce((total, item) => total + (item.quantity || 0), 0)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const results = products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()) ||
            p.brand.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 5)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setIsSearchFocused(false)
  }

  const handleCartClick = () => {
    if (user) {
      router.push("/cart") // Navigate to /cart page
    } else {
      router.push("/login") // Redirect to login if not authenticated
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="navbar">
      <nav className="navbar-container">
        <div className="navbar-brand">
          <Link href="/">
            <h1>ShopEase</h1>
            <span className="brand-tagline">Premium Shopping</span>
          </Link>
        </div>

        <div className="navbar-links desktop-nav">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/products" className="nav-link">Products</Link>
          <Link href="/products?category=electronics" className="nav-link">Electronics</Link>
          <Link href="/products?category=clothing" className="nav-link">Clothing</Link>
        </div>

        <div className="search-container" ref={searchRef}>
          <div className="search-input-wrapper">
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products, brands..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="search-input"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="search-clear">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {isSearchFocused && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="search-result-item"
                  onClick={clearSearch}
                >
                  <img src={product.image || "/placeholder.svg"} alt={product.name} className="search-result-image" />
                  <div className="search-result-info">
                    <h4>{product.name}</h4>
                    <p className="search-result-price">${product.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="navbar-actions">
          <button onClick={handleCartClick} className="cart-button">
            <svg className="cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
            </svg>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>

          {user ? (
            <div className="user-menu" ref={userMenuRef}>
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="user-button">
                <div className="user-avatar">{user.email?.charAt(0).toUpperCase()}</div>
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info"><p className="user-email">{user.email}</p></div>
                  <div className="dropdown-divider"></div>
                  <Link href="/orders" className="dropdown-item">My Orders</Link>
                  <Link href="/profile" className="dropdown-item">Profile</Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout">Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link href="/login" className="login-btn">Sign In</Link>
              <Link href="/signup" className="signup-btn">Sign Up</Link>
            </div>
          )}

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mobile-menu-toggle" aria-label="Toggle menu">
            <svg className="hamburger-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>

        <div className={`mobile-nav ${isMenuOpen ? "open" : ""}`}>
          <Link href="/" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link href="/products" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Products</Link>
          <Link href="/products?category=electronics" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Electronics</Link>
          <Link href="/products?category=clothing" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Clothing</Link>
          {user && (
            <Link href="/orders" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>My Orders</Link>
          )}
        </div>
      </nav>
    </header>
  )
}