import { NextResponse } from 'next/server'
import { db, primarySql } from '@/lib/database'
import { requireAdmin } from '@/lib/serverAuth'

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const auth = requireAdmin(request)
  if (!auth.ok) return auth.response
  try {
    const body = await request.json()
    // Use primarySql for test writes to ensure immediate visibility
    const result = await primarySql`
      INSERT INTO products (
        name, description, full_description, price, original_price,
        category, brand, sku, image_url, in_stock, stock_quantity,
        badge, status, specifications, is_active
      ) VALUES (
        ${body.name || 'test-product'}, ${body.description || ''}, ${body.full_description || null},
        ${body.price || 0}, ${body.original_price || null}, ${body.category || 'test'},
        ${body.brand || 'test'}, ${body.sku || 'test-sku'}, ${body.image_url || null},
        ${body.in_stock ?? true}, ${body.stock_quantity ?? 1}, ${body.badge || null},
        ${body.status || 'active'}, ${JSON.stringify(body.specifications || {})}, true
      ) RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (err: any) {
    console.error('[v0] create-test error', err)
    // Return detailed error information in test responses to aid debugging (remove in production)
    const message = err?.message || String(err)
    const stack = err?.stack || null
    return NextResponse.json({ error: 'Create failed', message, stack }, { status: 500 })
  }
}
