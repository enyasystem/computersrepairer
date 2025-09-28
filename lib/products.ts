/**
 * Product data types and utilities
 *
 * Centralized product data management with TypeScript interfaces
 * and mock data for the admin product management system.
 */

export interface Product {
  id: string
  name: string
  description: string
  fullDescription: string
  price: number
  originalPrice?: number
  category: string
  brand: string
  sku: string
  image: string
  images: string[]
  inStock: boolean
  stockQuantity: number
  rating: number
  reviewCount: number
  badge?: "Sale" | "New" | "Best Seller" | null
  status: "active" | "inactive" | "discontinued"
  specifications: Record<string, string>
  createdAt: string
  updatedAt: string
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string
}

// Mock product categories
export const productCategories: ProductCategory[] = [
  { id: "1", name: "Laptops", slug: "laptops", description: "Gaming and business laptops" },
  { id: "2", name: "Desktops", slug: "desktops", description: "Desktop computers and workstations" },
  { id: "3", name: "Components", slug: "components", description: "Computer parts and components" },
  { id: "4", name: "Peripherals", slug: "peripherals", description: "Keyboards, mice, and accessories" },
  { id: "5", name: "Storage", slug: "storage", description: "Hard drives and SSDs" },
  { id: "6", name: "Monitors", slug: "monitors", description: "Computer monitors and displays" },
  { id: "7", name: "Networking", slug: "networking", description: "Routers and network equipment" },
]

// Mock products with enhanced data structure
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "ASUS ROG Gaming Laptop",
    description: "High-performance gaming laptop with RTX 4060, 16GB RAM, and 1TB SSD",
    fullDescription: "Experience ultimate gaming performance with the ASUS ROG Gaming Laptop...",
    price: 1299.99,
    originalPrice: 1499.99,
    category: "Laptops",
    brand: "ASUS",
    sku: "ASUS-ROG-001",
    image: "/gaming-laptop-asus.jpg",
    images: ["/gaming-laptop-asus.jpg", "/gaming-laptop-asus-2.jpg"],
    inStock: true,
    stockQuantity: 15,
    rating: 4.8,
    reviewCount: 124,
    badge: "Best Seller",
    status: "active",
    specifications: {
      Processor: "Intel Core i7-12700H",
      Graphics: "NVIDIA GeForce RTX 4060",
      Memory: "16GB DDR4",
      Storage: "1TB NVMe SSD",
      Display: '15.6" Full HD 144Hz',
      "Operating System": "Windows 11 Home",
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Logitech MX Master 3S",
    description: "Advanced wireless mouse with precision tracking and ergonomic design",
    fullDescription: "The Logitech MX Master 3S is the ultimate wireless mouse for productivity...",
    price: 99.99,
    category: "Peripherals",
    brand: "Logitech",
    sku: "LOG-MX3S-001",
    image: "/wireless-mouse-logitech.jpg",
    images: ["/wireless-mouse-logitech.jpg"],
    inStock: true,
    stockQuantity: 32,
    rating: 4.9,
    reviewCount: 89,
    badge: "New",
    status: "active",
    specifications: {
      Sensor: "8K DPI Darkfield",
      Connectivity: "Bluetooth, USB Receiver",
      Battery: "Up to 70 days",
      Buttons: "7 customizable buttons",
      Compatibility: "Windows, macOS, Linux, iPadOS",
      Dimensions: "125.9 x 84.3 x 51mm",
    },
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-12T09:00:00Z",
  },
  {
    id: "3",
    name: "Corsair K95 RGB Platinum",
    description: "Premium mechanical gaming keyboard with Cherry MX switches",
    fullDescription: "Premium mechanical gaming keyboard with advanced features...",
    price: 159.99,
    originalPrice: 199.99,
    category: "Peripherals",
    brand: "Corsair",
    sku: "COR-K95-001",
    image: "/mechanical-keyboard-corsair.jpg",
    images: ["/mechanical-keyboard-corsair.jpg"],
    inStock: true,
    stockQuantity: 8,
    rating: 4.7,
    reviewCount: 156,
    badge: "Sale",
    status: "active",
    specifications: {
      "Switch Type": "Cherry MX Speed",
      Backlight: "RGB LED",
      Layout: "Full Size (104 keys)",
      Connection: "USB 3.0",
      Features: "Dedicated media keys, USB passthrough",
      Dimensions: "463 x 171 x 39mm",
    },
    createdAt: "2024-01-10T14:00:00Z",
    updatedAt: "2024-01-10T14:00:00Z",
  },
  {
    id: "4",
    name: "Samsung T7 Portable SSD 1TB",
    description: "Ultra-fast external storage with USB 3.2 Gen 2 interface",
    fullDescription: "Ultra-fast portable SSD with advanced security features...",
    price: 89.99,
    category: "Storage",
    brand: "Samsung",
    sku: "SAM-T7-1TB",
    image: "/external-ssd-samsung.jpg",
    images: ["/external-ssd-samsung.jpg"],
    inStock: false,
    stockQuantity: 0,
    rating: 4.8,
    reviewCount: 203,
    badge: null,
    status: "active",
    specifications: {
      Capacity: "1TB",
      Interface: "USB 3.2 Gen 2",
      "Read Speed": "Up to 1,050 MB/s",
      "Write Speed": "Up to 1,000 MB/s",
      Encryption: "AES 256-bit hardware encryption",
      Dimensions: "85 x 57 x 8mm",
    },
    createdAt: "2024-01-08T11:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
  },
]

/**
 * Get all products with optional filtering
 */
export function getProducts(filters?: {
  status?: Product["status"]
  category?: string
  inStock?: boolean
}): Product[] {
  let filteredProducts = mockProducts

  if (filters?.status) {
    filteredProducts = filteredProducts.filter((product) => product.status === filters.status)
  }

  if (filters?.category) {
    filteredProducts = filteredProducts.filter((product) => product.category === filters.category)
  }

  if (filters?.inStock !== undefined) {
    filteredProducts = filteredProducts.filter((product) => product.inStock === filters.inStock)
  }

  return filteredProducts
}

/**
 * Get a single product by ID
 */
export function getProduct(id: string): Product | undefined {
  return mockProducts.find((product) => product.id === id)
}

/**
 * Generate SKU from product name and brand
 */
export function generateSKU(name: string, brand: string): string {
  const nameCode = name.substring(0, 3).toUpperCase()
  const brandCode = brand.substring(0, 3).toUpperCase()
  const randomNum = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `${brandCode}-${nameCode}-${randomNum}`
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  // Format using Nigerian Naira symbol
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(price)
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(price: number, originalPrice: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}
