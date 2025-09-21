import { NextResponse } from "next/server"
import { sql, withRetry } from "@/lib/database"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const id = Number(body.id)
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

    // Prefer soft-delete so we don't lose history; hide from listings by marking inactive
    const result = await withRetry(async () => {
      return await sql`
        UPDATE public.products SET is_active = false, updated_at = NOW() WHERE id = ${id} RETURNING *
      `
    })
    try {
      console.log('[v0] Deleting product id=', id, 'result=', result && result[0] ? { id: result[0].id, is_active: result[0].is_active } : null)
    } catch (logErr) {
      // ignore logging failures
    }

    // If no rows affected, return 404 so client can handle 'not found'
      if (!result || !result[0]) {
        try {
          const check = await sql`SELECT id, is_active, name FROM public.products WHERE id = ${id}`
          console.log('[v0] Delete diagnostic - lookup result for id=', id, check && check[0] ? { id: check[0].id, is_active: check[0].is_active, name: check[0].name } : null)
        } catch (diagErr) {
          console.warn('[v0] Delete diagnostic lookup failed for id=', id, diagErr)
        }
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }

    // Clear the simple server-side page cache if present so the next listing reflects the change
    try {
      ;(global as any).__productPageCache = (global as any).__productPageCache || new Map()
      ;(global as any).__productPageCache.clear()
      try { console.log('[v0] Cleared product page cache, size now=', (global as any).__productPageCache.size) } catch (e) {}
    } catch (cacheErr) {
      // non-fatal
      console.warn('[v0] Failed to clear product page cache', cacheErr)
    }

  return NextResponse.json({ ok: true, product: result?.[0] ?? null })
  } catch (err) {
    console.error('[v0] Error deleting product', err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
