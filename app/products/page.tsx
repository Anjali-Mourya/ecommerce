"use client"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import AuthenticatedProductCard from "../components/AuthenticatedProductCard"
import AuthenticatedNavBar from "../components/AuthenticatedNavBar"
import AuthenticatedCartSidebar from "../components/AuthenticatedCartSidebar"
import Footer from "../components/Fotter"
import { products, categories, brands } from "../../lib/products"
import "./product.css"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "all",
    brand: "all",
    priceRange: [0, 3000],
    rating: 0,
    inStock: false,
  })
  const [sort, setSort] = useState("default")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const productsPerPage = 12

  useEffect(() => {
    let filtered = products

    // Apply filters
    if (filters.category !== "all") {
      filtered = filtered.filter((p) => p.category === filters.category)
    }
    if (filters.brand !== "all") {
      filtered = filtered.filter((p) => p.brand === filters.brand)
    }
    filtered = filtered.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])
    if (filters.rating > 0) {
      filtered = filtered.filter((p) => p.rating >= filters.rating)
    }
    if (filters.inStock) {
      filtered = filtered.filter((p) => p.inStock)
    }

    // Apply sorting
    switch (sort) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => b.id - a.id)
        break
      default:
        break
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }, [filters, sort])

  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      category: "all",
      brand: "all",
      priceRange: [0, 3000],
      rating: 0,
      inStock: false,
    })
    setSort("default")
  }

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)

  return (
    <main className="main-container">
      <AuthenticatedNavBar />
      <AuthenticatedCartSidebar />
      <div className="products-page">
        <div className="container">
          <div className="page-header">
            <h1>All Products</h1>
            <p>Discover our complete collection of premium products</p>
          </div>
          <div className="products-layout">
            {/* Filters Sidebar */}
            <aside className="filters-sidebar">
              <div className="filters-header">
                <h3>Filters</h3>
                <button onClick={clearFilters} className="clear-filters">
                  Clear All
                </button>
              </div>
              <div className="filter-group">
                <h4>Category</h4>
                <div className="filter-options">
                  {categories.map((category) => (
                    <label key={category.id} className="filter-option">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={filters.category === category.id}
                        onChange={(e) => updateFilter("category", e.target.value)}
                      />
                      <span>
                        {category.name} ({category.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <h4>Brand</h4>
                <select
                  value={filters.brand}
                  onChange={(e) => updateFilter("brand", e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <h4>Price Range</h4>
                <div className="price-range">
                  <input
                    type="range"
                    min="0"
                    max="3000"
                    value={filters.priceRange[1]}
                    onChange={(e) => updateFilter("priceRange", [0, Number(e.target.value)])}
                    className="price-slider"
                  />
                  <div className="price-display">$0 - ${filters.priceRange[1]}</div>
                </div>
              </div>
              <div className="filter-group">
                <h4>Rating</h4>
                <div className="rating-filters">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="filter-option">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.rating === rating}
                        onChange={(e) => updateFilter("rating", Number(e.target.value))}
                      />
                      <span className="rating-display">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`star ${i < rating ? "filled" : ""}`}>
                            ★
                          </span>
                        ))}
                        & up
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <label className="filter-option checkbox">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => updateFilter("inStock", e.target.checked)}
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </aside>

            {/* Products Content */}
            <div className="products-content">
              <div className="products-toolbar">
                <div className="results-info">
                  Showing {paginatedProducts.length} of {filteredProducts.length} products
                </div>
                <div className="toolbar-controls">
                  <div className="view-toggle">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        />
                      </svg>
                    </button>
                  </div>
                  <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
                    <option value="default">Sort by: Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
              <div className={`products-grid ${viewMode}`}>
                {paginatedProducts.map((product) => (
                  <AuthenticatedProductCard key={product.id} product={product} />
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <div className="no-products">
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search terms</p>
                  <button onClick={clearFilters} className="clear-filters-btn">
                    Clear Filters
                  </button>
                </div>
              )}
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
