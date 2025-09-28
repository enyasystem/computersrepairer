import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowLeft, ShoppingCart, Heart, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/database"
import { formatCurrencyNGN } from "@/lib/format"

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  // Interpret slug as numeric id when possible
  const id = Number(params.slug)
  if (Number.isNaN(id)) {
    // If slug is not numeric, attempt to find by sku or name is not implemented — return 404
    notFound()
  }

  const product = await db.getProductById(id)
  if (!product) return notFound()

  // Fetch recent products for sidebar
  const paged = await db.getProductsPaged(1, 3, { activeOnly: true, bypassCache: false })
  const recentProducts = Array.isArray(paged?.rows) ? paged.rows : []

  function StarRating({ rating }: { rating?: number }) {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < Math.floor(Number(rating) || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="text-lg font-medium ml-2">({rating ?? 0})</span>
      </div>
    )
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
                  src={product.image_url || product.image || "/placeholder.svg"}
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
                  <span className="text-4xl font-bold text-primary">{typeof product.price === 'number' ? formatCurrencyNGN(product.price) : String(product.price)}</span>
                </div>

                <p className="text-lg text-muted-foreground text-pretty">{product.description}</p>

                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${product.in_stock ? "bg-green-500" : "bg-red-500"}`} />
                  <span className={`font-medium ${product.in_stock ? "text-green-600" : "text-red-600"}`}>
                    {product.in_stock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button size="lg" className="w-full" disabled={!product.in_stock}>
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
                  {(product.full_description || "").split("\n").map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            {product.specifications && (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Specifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-3 border-b border-border">
                        <span className="font-medium text-foreground">{key}:</span>
                        <span className="text-muted-foreground">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6">Recent Products</h3>
                <div className="space-y-4">
                  {recentProducts.map((recentProduct: any) => (
                    <Link
                      key={recentProduct.id}
                      href={`/admin/products/edit/${recentProduct.id}`}
                      className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={recentProduct.image_url || recentProduct.image || "/placeholder.svg"}
                          alt={recentProduct.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground line-clamp-2 mb-1">{recentProduct.name}</h4>
                        <p className="text-primary font-bold text-sm">{typeof recentProduct.price === 'number' ? formatCurrencyNGN(recentProduct.price) : recentProduct.price}</p>
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
