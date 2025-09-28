import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowLeft, ShoppingCart, Heart, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

// Product data - in a real app, this would come from an API or database
const products = [
  {
    id: "gaming-laptop-asus-rog",
    name: "ASUS ROG Gaming Laptop",
    description: "High-performance gaming laptop with RTX 4060, 16GB RAM, and 1TB SSD",
    fullDescription: `Experience ultimate gaming performance with the ASUS ROG Gaming Laptop. This powerhouse features the latest NVIDIA GeForce RTX 4060 graphics card, delivering exceptional frame rates and stunning visuals for the most demanding games.

Key Features:
• NVIDIA GeForce RTX 4060 Graphics Card
• Intel Core i7-12700H Processor
• 16GB DDR4 RAM (expandable to 32GB)
• 1TB NVMe SSD Storage
• 15.6" Full HD 144Hz Display
• RGB Backlit Keyboard
• Advanced Cooling System
• Wi-Fi 6 and Bluetooth 5.2

Whether you're gaming, streaming, or creating content, this laptop delivers the performance you need. The advanced cooling system ensures optimal temperatures during intense gaming sessions, while the high-refresh display provides smooth, tear-free visuals.

Perfect for gamers, content creators, and professionals who demand the best performance from their mobile workstation.`,
    price: "₦1,299.99",
    originalPrice: "₦1,499.99",
    rating: 4.8,
    image: "/gaming-laptop-asus.jpg",
    badge: "Best Seller",
    inStock: true,
    specifications: {
      Processor: "Intel Core i7-12700H",
      Graphics: "NVIDIA GeForce RTX 4060",
      Memory: "16GB DDR4",
      Storage: "1TB NVMe SSD",
      Display: '15.6" Full HD 144Hz',
      "Operating System": "Windows 11 Home",
    },
  },
  {
    id: "wireless-mouse-logitech",
    name: "Logitech MX Master 3S",
    description: "Advanced wireless mouse with precision tracking and ergonomic design",
    fullDescription: `The Logitech MX Master 3S is the ultimate wireless mouse for productivity and precision. Featuring advanced tracking technology and ergonomic design, it's perfect for professionals and power users.

Key Features:
• 8K DPI Darkfield Sensor
• Electromagnetic Scroll Wheel
• USB-C Quick Charging
• Multi-Device Connectivity (up to 3 devices)
• Customizable Buttons
• Ergonomic Design
• 70-Day Battery Life
• Works on Any Surface (including glass)

The MX Master 3S offers unparalleled precision and comfort for extended use. Switch seamlessly between multiple devices, customize buttons for your workflow, and enjoy the ultra-fast, ultra-quiet scroll wheel.

Compatible with Windows, macOS, Linux, iPadOS, and Chrome OS. Includes Logitech Options+ software for advanced customization.`,
    price: "₦99.99",
    originalPrice: null,
    rating: 4.9,
    image: "/wireless-mouse-logitech.jpg",
    badge: "New",
    inStock: true,
    specifications: {
      Sensor: "8K DPI Darkfield",
      Connectivity: "Bluetooth, USB Receiver",
      Battery: "Up to 70 days",
      Buttons: "7 customizable buttons",
      Compatibility: "Windows, macOS, Linux, iPadOS",
      Dimensions: "125.9 x 84.3 x 51mm",
    },
  },
  // Add more products as needed...
]

// Recent products for sidebar
const recentProducts = [
  {
    id: "mechanical-keyboard-corsair",
    name: "Corsair K95 RGB Platinum",
    price: "₦159.99",
    image: "/mechanical-keyboard-corsair.jpg",
  },
  {
    id: "external-ssd-samsung",
    name: "Samsung T7 Portable SSD 1TB",
    price: "₦89.99",
    image: "/external-ssd-samsung.jpg",
  },
  {
    id: "webcam-logitech-c920",
    name: "Logitech C920 HD Pro Webcam",
    price: "₦69.99",
    image: "/webcam-logitech.jpg",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
      <span className="text-lg font-medium ml-2">({rating})</span>
    </div>
  )
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.id === params.slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/shop" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {product.badge && (
                  <Badge
                    className={`absolute top-4 left-4 ${
                      product.badge === "Sale"
                        ? "bg-red-500 hover:bg-red-600"
                        : product.badge === "New"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-primary hover:bg-primary/90"
                    }`}
                  >
                    {product.badge}
                  </Badge>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-4 text-balance">{product.name}</h1>
                  <StarRating rating={product.rating} />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-primary">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-2xl text-muted-foreground line-through">{product.originalPrice}</span>
                  )}
                </div>

                <p className="text-lg text-muted-foreground text-pretty">{product.description}</p>

                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
                  <span className={`font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button size="lg" className="w-full" disabled={!product.inStock}>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>

                  <div className="flex gap-3">
                    <Button variant="outline" size="lg" className="flex-1 bg-transparent">
                      <Heart className="h-5 w-5 mr-2" />
                      Add to Wishlist
                    </Button>
                    <Button variant="outline" size="lg" className="flex-1 bg-transparent">
                      <Share2 className="h-5 w-5 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Product Description</h2>
                <div className="prose prose-gray max-w-none">
                  {product.fullDescription.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-border">
                      <span className="font-medium text-foreground">{key}:</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6">Recent Products</h3>
                <div className="space-y-4">
                  {recentProducts.map((recentProduct) => (
                    <Link
                      key={recentProduct.id}
                      href={`/shop/${recentProduct.id}`}
                      className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={recentProduct.image || "/placeholder.svg"}
                          alt={recentProduct.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground line-clamp-2 mb-1">{recentProduct.name}</h4>
                        <p className="text-primary font-bold text-sm">{recentProduct.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
