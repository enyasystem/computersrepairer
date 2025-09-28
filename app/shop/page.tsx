import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { db } from "@/lib/database"
import { formatCurrencyNGN } from "@/lib/format"

export default async function ShopPage() {
	// Fetch products from the database (server-side)
	const paged = await db.getProductsPaged(1, 12, {
		activeOnly: true,
		bypassCache: false,
	})
	const products = Array.isArray(paged?.rows) ? paged.rows : []

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
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{products.map((product: any) => (
						<Card
							key={product.id}
							className="group hover:shadow-lg transition-shadow duration-300"
						>
							<CardHeader className="p-0">
								<div className="relative aspect-square overflow-hidden rounded-t-lg">
									<Image
										src={product.image_url || product.image || "/placeholder.svg"}
										alt={product.name || "Product"}
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
								<h3 className="font-semibold text-lg mb-2 text-balance">
									{product.name}
								</h3>
								<p className="text-muted-foreground text-sm mb-3 text-pretty">
									{product.description}
								</p>
								<StarRating rating={product.rating} />
								<div className="flex items-center gap-2 mt-3">
									<span className="text-2xl font-bold text-primary">
										{typeof product.price === "number"
											? formatCurrencyNGN(product.price)
											: String(product.price ?? "")}
									</span>
									{product.original_price && (
										<span className="text-lg text-muted-foreground line-through">
											{typeof product.original_price === "number"
												? formatCurrencyNGN(product.original_price)
												: product.original_price}
										</span>
									)}
								</div>
							</CardContent>
							<CardFooter className="p-6 pt-0">
								<Link
									href={`/shop/${product.id}`}
									className="w-full"
								>
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
