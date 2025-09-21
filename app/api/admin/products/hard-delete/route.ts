import { NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { requireAdmin } from '@/lib/serverAuth'

export async function POST(request: Request) {
  const auth = requireAdmin(request)
  if (!auth.ok) return auth.response
  try {

    const body = await request.json()
    const id = Number(body.id)
    if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    // Perform hard delete
    const result = await sql`
      DELETE FROM public.products WHERE id = ${id} RETURNING id
    `

    if (!result || !result[0]) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Clear caches (Redis prefix + in-process map) so listings update immediately
    try { await (await import('@/lib/cache')).cacheClearPrefix('products:') } catch (e) { console.warn('[v0] cacheClearPrefix failed', e) }
    try {
      ;(global as any).__productPageCache = (global as any).__productPageCache || new Map()
      ;(global as any).__productPageCache.clear()
    } catch (e) {
      console.warn('[v0] Failed to clear global __productPageCache', e)
    }

    return NextResponse.json({ ok: true, deletedId: result[0].id })
  } catch (err) {
    console.error('[v0] Error hard-deleting product', err)
    return NextResponse.json({ error: 'Hard delete failed' }, { status: 500 })
  }
}
