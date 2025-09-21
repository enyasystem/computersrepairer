/**
 * Types returned by the database for products.
 * Keep this narrow and aligned with `lib/database.ts` SQL columns.
 */
export interface DbProduct {
  id: number
  name: string
  description?: string | null
  full_description?: string | null
  price: number
  original_price?: number | null
  category: string
  brand?: string | null
  sku?: string | null
  image_url?: string | null
  in_stock: boolean
  stock_quantity: number
  badge?: string | null
  status: string
  specifications?: string | Record<string, string> | null
  created_at?: string
  updated_at?: string
}

export default DbProduct
