import { db } from "@/lib/database"
import AdminProductsClient from "./client"

// Server component: fetch paginated products from DB and pass to client component
export default async function AdminProductsPage({ searchParams }: { searchParams?: { page?: string; perPage?: string } }) {
  const page = Number(searchParams?.page || "1") || 1
  const perPage = Number(searchParams?.perPage || "10") || 10

  const paged = await db.getProductsPaged(page, perPage, { activeOnly: true, bypassCache: true, usePrimary: true })

  return <AdminProductsClient products={paged.rows as any} total={paged.total} page={paged.page} perPage={paged.perPage} />
}
