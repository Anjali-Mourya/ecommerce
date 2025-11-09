export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  description: string
  category: string
  brand: string
  rating: number
  reviews: number
  inStock: boolean
  features: string[]
  specifications: { [key: string]: string }
  tags: string[]
  discount?: number
}

export const products: Product[] = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 1199.99,
    originalPrice: 1299.99,
    image:
      "/images/apple1.avif",
    images: [
      "/images/apple1.avif",
      "/images/iphone3.jpg",
      "/images/apple2.avif",
    ],
    description: "The most advanced iPhone ever with titanium design, A17 Pro chip, and professional camera system.",
    category: "electronics",
    brand: "Apple",
    rating: 4.8,
    reviews: 2847,
    inStock: true,
    features: ["A17 Pro Chip", "Titanium Design", "48MP Camera", "5G Ready"],
    specifications: {
      Display: "6.7-inch Super Retina XDR",
      Chip: "A17 Pro",
      Camera: "48MP Main, 12MP Ultra Wide",
      Storage: "256GB",
      Battery: "Up to 29 hours video playback",
    },
    tags: ["smartphone", "apple", "premium", "5g"],
    discount: 8,
  },
  {
    id: 2,
    name: "MacBook Pro 16-inch",
    price: 2499.99,
    originalPrice: 2699.99,
    image:
      "/images/laptop1.avif",
    images: [
      "/images/laptop1.avif",
      "/images/laptop2.jpg",
      "/images/laptop3.avif",
    ],
    description: "Supercharged by M3 Pro chip. Built for professionals who demand the ultimate performance.",
    category: "electronics",
    brand: "Apple",
    rating: 4.9,
    reviews: 1523,
    inStock: true,
    features: ["M3 Pro Chip", "16-inch Liquid Retina XDR", "22-hour battery", "Studio-quality mics"],
    specifications: {
      Chip: "Apple M3 Pro",
      Display: "16-inch Liquid Retina XDR",
      Memory: "18GB Unified Memory",
      Storage: "512GB SSD",
      Battery: "Up to 22 hours",
    },
    tags: ["laptop", "apple", "professional", "m3"],
    discount: 7,
  },
  {
    id: 3,
    name: "Premium Cotton T-Shirt",
    price: 29.99,
    originalPrice: 39.99,
    image:
      "/images/tshirt1.avif",
    images: [
      "/images/tshirt1.avif",
      "/images/tshirt2.avif",
      "/images/tshirt3.avif",
    ],
    description: "Ultra-soft premium cotton t-shirt with perfect fit and sustainable materials.",
    category: "clothing",
    brand: "EcoWear",
    rating: 4.6,
    reviews: 892,
    inStock: true,
    features: ["100% Organic Cotton", "Pre-shrunk", "Tagless", "Sustainable"],
    specifications: {
      Material: "100% Organic Cotton",
      Fit: "Regular Fit",
      Care: "Machine Washable",
      Origin: "Made in USA",
      Certification: "GOTS Certified",
    },
    tags: ["t-shirt", "cotton", "organic", "sustainable"],
    discount: 25,
  },
  {
    id: 4,
    name: "Designer Denim Jeans",
    price: 89.99,
    originalPrice: 119.99,
    image: "/images/denim1.avif",
    images: [
      "/images/denim1.avif",
      "/images/denim2.avif",
      "/images/denim3.avif",
    ],
    description: "Premium denim jeans with perfect fit, comfort stretch, and timeless style.",
    category: "clothing",
    brand: "DenimCraft",
    rating: 4.7,
    reviews: 1247,
    inStock: true,
    features: ["Comfort Stretch", "Fade Resistant", "Reinforced Seams", "Classic Fit"],
    specifications: {
      Material: "98% Cotton, 2% Elastane",
      Fit: "Slim Fit",
      Rise: "Mid Rise",
      "Leg Opening": "14 inches",
      Care: "Machine Wash Cold",
    },
    tags: ["jeans", "denim", "stretch", "classic"],
    discount: 25,
  },
  {
    id: 5,
    name: "AirPods Pro (3rd Gen)",
    price: 249.99,
    originalPrice: 279.99,
    image:
      "/images/earbird1.avif",
    images: [
      "/images/earbird1.avif",
      "/images/earbird2.avif",
      "/images/earbird3.avif",
    ],
    description:
      "Next-level Active Noise Cancellation and Adaptive Transparency for the ultimate listening experience.",
    category: "electronics",
    brand: "Apple",
    rating: 4.8,
    reviews: 3421,
    inStock: true,
    features: ["Active Noise Cancellation", "Spatial Audio", "Adaptive Transparency", "MagSafe Charging"],
    specifications: {
      Chip: "H2 Chip",
      Battery: "Up to 6 hours listening",
      "Charging Case": "MagSafe Compatible",
      "Water Resistance": "IPX4",
      Connectivity: "Bluetooth 5.3",
    },
    tags: ["earbuds", "apple", "wireless", "noise-cancelling"],
    discount: 11,
  },
  {
    id: 6,
    name: "Premium Hoodie",
    price: 69.99,
    originalPrice: 89.99,
    image: "/images/hoddie1.webp",
    images: [
      "/images/hoddie1.webp",
      "/images/hoddie2.webp",
      "/images/hoddie3.avif",
    ],
    description: "Ultra-comfortable premium hoodie with soft fleece lining and modern fit.",
    category: "clothing",
    brand: "ComfortWear",
    rating: 4.5,
    reviews: 756,
    inStock: true,
    features: ["Fleece Lined", "Kangaroo Pocket", "Adjustable Hood", "Ribbed Cuffs"],
    specifications: {
      Material: "80% Cotton, 20% Polyester",
      Weight: "320 GSM",
      Fit: "Regular Fit",
      Care: "Machine Washable",
      Features: "Drawstring Hood",
    },
    tags: ["hoodie", "fleece", "comfortable", "casual"],
    discount: 22,
  },
  {
    id: 7,
    name: "Gaming Mechanical Keyboard",
    price: 159.99,
    originalPrice: 199.99,
    image:
      "/images/keyboard1.avif",
    images: [
      "/images/keyboard1.avif",
      "/images/keyboard2.avif",
      "/images/keyboard3.avif",
    ],
    description: "Professional gaming keyboard with RGB backlighting and premium mechanical switches.",
    category: "electronics",
    brand: "GameTech",
    rating: 4.7,
    reviews: 1834,
    inStock: true,
    features: ["RGB Backlighting", "Mechanical Switches", "Anti-Ghosting", "Programmable Keys"],
    specifications: {
      "Switch Type": "Cherry MX Blue",
      Backlighting: "RGB Per-Key",
      Connectivity: "USB-C",
      Layout: "Full Size (104 Keys)",
      "Polling Rate": "1000Hz",
    },
    tags: ["keyboard", "gaming", "mechanical", "rgb"],
    discount: 20,
  },
  {
    id: 8,
    name: "Smartwatch Series 9",
    price: 399.99,
    originalPrice: 449.99,
    image:
      "/images/watch1.avif",
    images: [
      "/images/watch1.avif",
      "/images/watch2.avif",
      "/images/watch3.avif",
    ],
    description: "Advanced health monitoring, fitness tracking, and smart features in a sleek design.",
    category: "electronics",
    brand: "Apple",
    rating: 4.6,
    reviews: 2156,
    inStock: true,
    features: ["Health Monitoring", "GPS Tracking", "Water Resistant", "Always-On Display"],
    specifications: {
      Display: "45mm Retina LTPO OLED",
      Chip: "S9 SiP",
      Battery: "Up to 18 hours",
      "Water Resistance": "50 meters",
      Connectivity: "Wi-Fi, Bluetooth, Cellular",
    },
    tags: ["smartwatch", "fitness", "health", "apple"],
    discount: 11,
  },
]

export const categories = [
  { id: "all", name: "All Products", count: products.length },
  { id: "electronics", name: "Electronics", count: products.filter((p) => p.category === "electronics").length },
  { id: "clothing", name: "Clothing", count: products.filter((p) => p.category === "clothing").length },
]

export const brands = ["Apple", "EcoWear", "DenimCraft", "ComfortWear", "GameTech"]
