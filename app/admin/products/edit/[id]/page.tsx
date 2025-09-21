import { db } from "@/lib/database"
import EditProductForm from "../form"
import type { Product } from "@/lib/products"
import type DbProduct from "@/lib/db-types"

function mapDbToProduct(row: DbProduct): Product {
  const specs =
    typeof row.specifications === "string"
      ? (() => {
          try {
            return JSON.parse(row.specifications as string)
          } catch (e) {
            return {}
          }
        })()
      : row.specifications || {}

  return {
    id: String(row.id),
    name: row.name,
    description: row.description || "",
    fullDescription: row.full_description || "",
    price: Number(row.price || 0),
    originalPrice: row.original_price ?? undefined,
    category: row.category,
    brand: row.brand || "",
    sku: row.sku || "",
    image: row.image_url || "",
    images: row.image_url ? [row.image_url] : [],
    inStock: Boolean(row.in_stock),
    stockQuantity: Number(row.stock_quantity || 0),
    rating: 0,
    reviewCount: 0,
    badge: (row.badge as any) || null,
    status: (row.status as any) || "inactive",
    specifications: specs as Record<string, string>,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  }
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (Number.isNaN(id)) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Invalid product id</h1>
      </div>
    )
  }

  const row = (await db.getProductById(id)) as DbProduct | null

  if (!row) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    )
  }

  const product = mapDbToProduct(row)

  return <EditProductForm product={product} />
}
