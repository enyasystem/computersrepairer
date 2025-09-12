import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Product data - in a real app, this would come from an API or database
const products = [
  {
    id: "gaming-laptop-asus-rog",
    name: "ASUS ROG Gaming Laptop",
    description: "High-performance gaming laptop with RTX 4060, 16GB RAM, and 1TB SSD",
    price: "$1,299.99",
    originalPrice: "$1,499.99",
    rating: 4.8,
    image: "/gaming-laptop-asus.jpg",
    badge: "Best Seller",
  },
  {
    id: "wireless-mouse-logitech",
    name: "Logitech MX Master 3S",
    description: "Advanced wireless mouse with precision tracking and ergonomic design",
    price: "$99.99",
    originalPrice: null,
    rating: 4.9,
    image: "/wireless-mouse-logitech.jpg",
    badge: "New",
  },
  {
    id: "mechanical-keyboard-corsair",
    name: "Corsair K95 RGB Platinum",
    description: "Premium mechanical gaming keyboard with Cherry MX switches",
    price: "$159.99",
    originalPrice: "$199.99",
    rating: 4.7,
    image: "/mechanical-keyboard-corsair.jpg",
    badge: "Sale",
  },
  {
    id: "external-ssd-samsung",
    name: "Samsung T7 Portable SSD 1TB",
    description: "Ultra-fast external storage with USB 3.2 Gen 2 interface",
    price: "$89.99",
    originalPrice: null,
    rating: 4.8,
    image: "/external-ssd-samsung.jpg",
    badge: null,
  },
  {
    id: "webcam-logitech-c920",
    name: "Logitech C920 HD Pro Webcam",
    description: "Full HD 1080p webcam with auto-focus and built-in microphones",
    price: "$69.99",
    originalPrice: "$89.99",
    rating: 4.6,
    image: "/webcam-logitech.jpg",
    badge: "Sale",
  },
  {
    id: "monitor-dell-ultrasharp",
    name: 'Dell UltraSharp 27" 4K Monitor',
    description: "Professional 4K monitor with excellent color accuracy and USB-C hub",
    price: "$449.99",
    originalPrice: null,
    rating: 4.9,
    image: "/monitor-dell-4k.jpg",
    badge: "Best Seller",
  },
  {
    id: "graphics-card-rtx4070",
    name: "NVIDIA GeForce RTX 4070",
    description: "High-performance graphics card for gaming and content creation",
    price: "$599.99",
    originalPrice: "$649.99",
    rating: 4.8,
    image: "/graphics-card-rtx4070.jpg",
    badge: "New",
  },
  {
    id: "ram-corsair-32gb",
    name: "Corsair Vengeance 32GB DDR4",
    description: "High-speed 32GB DDR4 memory kit for enhanced performance",
    price: "$129.99",
    originalPrice: null,
    rating: 4.7,
    image: "/ram-corsair-32gb.jpg",
    badge: null,
  },
  {
    id: "cpu-amd-ryzen7",
    name: "AMD Ryzen 7 5800X",
    description: "8-core, 16-thread processor for high-performance computing",
    price: "$279.99",
    originalPrice: "$329.99",
    rating: 4.9,
    image: "/cpu-amd-ryzen7.jpg",
    badge: "Sale",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
      <span className="text-sm text-muted-foreground ml-1">({rating})</span>
    </div>
  )
}

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Computer Parts & Accessories</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              High-quality computer components and accessories for all your tech needs
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <Badge
                      className={`absolute top-3 left-3 ${
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
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-balance">{product.name}</h3>
                <p className="text-muted-foreground text-sm mb-3 text-pretty">{product.description}</p>
                <StarRating rating={product.rating} />
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-2xl font-bold text-primary">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">{product.originalPrice}</span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Link href={`/shop/${product.id}`} className="w-full">
                  <Button className="w-full">View More</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
