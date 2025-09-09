import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star } from "lucide-react"
import Link from "next/link"

export function ShopSection() {
  const products = [
    {
      id: "gaming-laptop-asus-rog",
      name: "Gaming Laptop - RTX 4060",
      description: "High-performance gaming laptop with RTX 4060 graphics card, perfect for gaming and creative work.",
      price: "$1,299.99",
      originalPrice: "$1,499.99",
      rating: 4.8,
      image: "/gaming-laptop-rtx-graphics-card.jpg",
      badge: "Best Seller",
    },
    {
      id: "business-desktop-pc",
      name: "Business Desktop PC",
      description: "Reliable desktop computer optimized for business use with Intel i7 processor and 16GB RAM.",
      price: "$899.99",
      originalPrice: null,
      rating: 4.6,
      image: "/business-desktop-computer-office-setup.jpg",
      badge: "New",
    },
    {
      id: "wireless-router-pro",
      name: "Wireless Router Pro",
      description: "High-speed wireless router with advanced security features and mesh network capability.",
      price: "$199.99",
      originalPrice: "$249.99",
      rating: 4.7,
      image: "/wireless-router-networking-equipment.jpg",
      badge: "Sale",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Featured Products</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Quality hardware and equipment from trusted brands
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="aspect-square bg-muted">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.badge && (
                  <Badge
                    className="absolute top-3 left-3"
                    variant={product.badge === "Sale" ? "destructive" : "default"}
                  >
                    {product.badge}
                  </Badge>
                )}
              </div>
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">({product.rating})</span>
                </div>
                <CardTitle className="text-lg text-balance">{product.name}</CardTitle>
                <CardDescription className="text-pretty">{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-primary">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">{product.originalPrice}</span>
                  )}
                </div>
                <Link href={`/shop/${product.id}`} className="w-full">
                  <Button className="w-full">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    View Product
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/shop">
            <Button size="lg" variant="outline">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
