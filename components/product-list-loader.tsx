'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatCurrencyNGN } from '@/lib/format'

type Product = any

export default function ProductListLoader({ initial, renderInitial = true }: { initial: Product[]; renderInitial?: boolean }) {
  // If renderInitial is false we won't render the server-provided initial items here
  // (they are expected to be rendered by the surrounding server component). We still
  // keep `initial` available for pagination calculations.
  const initialCount = Array.isArray(initial) ? initial.length : 0
  const [products, setProducts] = useState<Product[]>(renderInitial ? (initial || []) : [])
  const [page, setPage] = useState(1)
  const [perPage] = useState(12)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    setPage(1)
    setHasMore((initial?.length || 0) >= perPage)
  }, [initial, perPage])

  async function loadMore() {
    setLoading(true)
    const next = page + 1
    try {
      const res = await fetch(`/api/products/list?page=${next}&perPage=${perPage}&activeOnly=1`)
      const data = await res.json()
      if (data && Array.isArray(data.rows)) {
        setProducts((p) => [...p, ...data.rows])
        setPage(next)
        // baseCount is number of items already present on the page: if we rendered the initial items
        // in this client component they are in `products`, otherwise they were rendered on the server
        // and we must account for them using initialCount.
        const baseCount = renderInitial ? products.length : initialCount
        setHasMore((data.rows.length || 0) >= perPage && (baseCount + data.rows.length) < (data.total || Infinity))
      } else {
        setHasMore(false)
      }
    } catch (err) {
      console.error('Failed to load more products', err)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  function StarRating({ rating }: { rating?: number }) {
    const r = Math.max(0, Math.min(5, Math.floor(Number(rating) || 0)))
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < r ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">({rating ?? 0})</span>
      </div>
    )
  }

  function renderPrice(price: any) {
    const n = Number(price)
    return Number.isFinite(n) ? formatCurrencyNGN(n) : String(price ?? '')
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            <CardHeader className="p-0">
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                <Image src={product.image_url || product.image || '/placeholder.svg'} alt={product.name || 'Product'} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                {product.badge && (
                  <Badge
                    className={`absolute top-3 left-3 ${
                      product.badge === 'Sale'
                        ? 'bg-red-500 hover:bg-red-600'
                        : product.badge === 'New'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                  >
                    {product.badge}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col">
              <h3 className="font-semibold text-lg mb-2 text-balance">{product.name}</h3>
              <p className="text-muted-foreground text-sm mb-3 text-pretty">{product.description}</p>
              <StarRating rating={product.rating} />
              <div className="flex items-center gap-2 mt-3">
                <span className="text-2xl font-bold text-primary">{renderPrice(product.price)}</span>
                {product.original_price && (
                  <span className="text-lg text-muted-foreground line-through">{renderPrice(product.original_price)}</span>
                )}
              </div>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <Link href={`/shop/${product.id}`} className="w-full">
                <Button className="w-full">View More</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        {hasMore ? (
          <Button size="lg" variant="outline" className="px-8 bg-transparent" onClick={loadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load More Products'}
          </Button>
        ) : (
          <div className="text-sm text-muted-foreground">No more products</div>
        )}
      </div>
    </>
  )
}
