import { db } from "@/lib/database"
import AdminProductsClient from "./client"

// Server component: fetch products from DB and pass to client component
export default async function AdminProductsPage() {
  const products = await db.getProducts()
  return <AdminProductsClient products={products as any} />
}
