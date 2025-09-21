import { NextResponse } from "next/server"
import { sql, withRetry } from "@/lib/database"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const id = Number(body.id)
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

    const result = await withRetry(async () => {
      const r = await sql`
        UPDATE public.products SET is_active = true, updated_at = NOW() WHERE id = ${id} RETURNING *
      `
      try { console.log('[v0] Restored product id=', id, 'result=', r && r[0] ? { id: r[0].id, is_active: r[0].is_active } : null) } catch (e) {}
      return r
    })

    try {
      ;(global as any).__productPageCache = (global as any).__productPageCache || new Map()
      ;(global as any).__productPageCache.clear()
    } catch (cacheErr) {
      console.warn('[v0] Failed to clear product page cache', cacheErr)
    }

  return NextResponse.json({ ok: true, product: result?.[0] ?? null })
  } catch (err) {
    console.error('[v0] Error restoring product', err)
    return NextResponse.json({ error: 'Restore failed' }, { status: 500 })
  }
}
