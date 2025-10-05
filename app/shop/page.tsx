import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { db } from "@/lib/database"
import { mockProducts } from '@/lib/products'
import { formatCurrencyNGN } from "@/lib/format"
import ProductListLoader from '@/components/product-list-loader'

export default async function ShopPage({ searchParams }: { searchParams?: { [key: string]: string | string[] } }) {
	// Fetch first page server-side and let the client loader fetch more
	const perPage = 12
	let initialProducts: any[] = []
	// Detect optional category filter from query string (e.g. /shop?category=accessories)
	const rawCategory = Array.isArray(searchParams?.category) ? searchParams?.category[0] : searchParams?.category
	const category = rawCategory ? String(rawCategory).trim() : undefined
	try {
				if (category) {
					// If a category filter is present, fetch all active products and filter server-side.
					// This mirrors the blog approach and guarantees we show the correct category results.
					try {
						const all = await db.getProducts()
						if (Array.isArray(all)) {
							const filtered = all.filter((p: any) => String(p.category || '').toLowerCase() === String(category).toLowerCase())
							initialProducts = filtered.slice(0, perPage)
						}
					} catch (err2) {
						try { console.warn('[v0] /shop: getProducts() fallback failed', err2) } catch (e) {}
						// fallback to paged below
					}
				}
				// If no category or fallback didn't populate, use the paged read
				if (!initialProducts.length) {
					// Force a fresh, strongly-consistent read from the primary and bypass short-lived cache
					const paged = await db.getProductsPaged(1, perPage, { activeOnly: true, bypassCache: true, usePrimary: true })
					initialProducts = Array.isArray(paged?.rows) ? paged.rows : []

					// Diagnostic/fallback: if the paged result looks unexpectedly small try a direct full list fetch
					if ((paged?.total || 0) <= (paged?.rows?.length || 0) && (paged?.total || 0) < perPage) {
						try {
							const all = await db.getProducts()
							if (Array.isArray(all) && all.length > (initialProducts?.length || 0)) {
								try { console.warn('[v0] /shop: getProductsPaged returned small result; falling back to getProducts()') } catch (e) {}
								initialProducts = all.slice(0, perPage)
							}
						} catch (err2) {
							try { console.warn('[v0] /shop: fallback getProducts() failed', err2) } catch (e) {}
						}
					}
				}
	} catch (err) {
		// If DB is not configured (e.g. during local dev without DATABASE_URL) fall back to mock data
		try {
			console.warn('[v0] /shop: getProductsPaged failed, falling back to mockProducts', err)
		} catch (e) {}
		initialProducts = mockProducts.slice(0, perPage)
	}

	function StarRating({ rating }: { rating?: number }) {
		const r = Math.max(0, Math.min(5, Math.floor(Number(rating) || 0)))
		return (
			<div className="flex items-center gap-1">
				{[...Array(5)].map((_, i) => (
					<Star
						key={i}
						className={`h-4 w-4 ${
							i < r ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
						}`}
					/>
				))}
				<span className="text-sm text-muted-foreground ml-1">
					({rating ?? 0})
				</span>
			</div>
		)
	}

	// Helper to ensure we always format numeric prices with the Naira symbol
	function renderPrice(price: any) {
		const n = Number(price)
		return Number.isFinite(n) ? formatCurrencyNGN(n) : String(price ?? "")
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
				<div className="container mx-auto px-4">
					<div className="text-center">
						<h1 className="text-4xl font-bold text-foreground mb-4 text-balance">
							Computer Parts & Accessories
						</h1>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
							High-quality computer components and accessories for all your tech
							needs
						</p>
					</div>
				</div>
			</div>

			{/* Products Grid */}
			<div className="container mx-auto px-4 py-16">
				{/* Server-render the initial page for fast first paint and SEO */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{initialProducts.map((product: any) => (
						<Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
							<CardHeader className="p-0">
								<div className="relative aspect-square overflow-hidden rounded-t-lg">
									<Image src={product.image_url || product.image || '/placeholder.svg'} alt={product.name || 'Product'} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
									{product.badge && (
										<Badge className="absolute top-3 left-3" variant={product.badge === 'Sale' ? 'destructive' : 'default'}>
											{product.badge}
										</Badge>
									)}
								</div>
							</CardHeader>
							<CardContent className="p-6 flex-1 flex flex-col">
								<h3 className="font-semibold text-lg mb-2 text-balance">{product.name}</h3>
								<p className="text-muted-foreground text-sm mb-3 text-pretty">{product.description}</p>
								<div className="flex items-center gap-2 mt-3">
									<span className="text-2xl font-bold text-primary">{renderPrice(product.price)}</span>
									{product.original_price && (
										<span className="text-lg text-muted-foreground line-through">{renderPrice(product.original_price)}</span>
									)}
								</div>
							</CardContent>
							<div className="p-6 pt-0 mt-auto">
								<Link href={`/shop/${product.id}`} className="w-full"><Button className="w-full">View More</Button></Link>
							</div>
						</Card>
					))}
				</div>

				{/* Client loader will hydrate and manage subsequent pages (server already rendered initial items) */}
				<ProductListLoader initial={initialProducts} renderInitial={false} category={category} />
			</div>
		</div>
	)
}
