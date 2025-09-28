import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { db } from "@/lib/database"
import { formatCurrencyNGN } from "@/lib/format"

export async function ShopSection() {
  // Fetch a small set of featured products from the database (server-side)
  const paged = await db.getProductsPaged(1, 3, { activeOnly: true, bypassCache: false })
  const products = Array.isArray(paged?.rows) ? paged.rows : []

  const renderPrice = (price: any) => {
    const n = Number(price)
    return Number.isFinite(n) ? formatCurrencyNGN(n) : String(price ?? "")
  }

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
          {products.map((product: any, index: number) => (
            <Card key={product.id || index} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
              <div className="relative">
                <div className="aspect-square bg-muted">
                  <Image
                    src={product.image_url || product.image || "/placeholder.svg"}
                    alt={product.name || 'Product'}
                    fill
                    className="object-cover"
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
                      className={`h-4 w-4 ${i < Math.floor(Number(product.rating) || 0) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">({product.rating ?? 0})</span>
                </div>
                <CardTitle className="text-lg text-balance">{product.name}</CardTitle>
                <CardDescription className="text-pretty">{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-primary">{renderPrice(product.price)}</span>
                  {product.original_price && (
                    <span className="text-lg text-muted-foreground line-through">{renderPrice(product.original_price)}</span>
                  )}
                </div>
                <div className="mt-auto w-full">
                  <Link href={`/shop/${product.id}`} className="w-full">
                    <Button className="w-full">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      View Product
                    </Button>
                  </Link>
                </div>
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
