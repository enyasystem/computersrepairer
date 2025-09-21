import { NextResponse } from "next/server"
import { sql, withRetry } from "@/lib/database"
import { requireAdmin } from '@/lib/serverAuth'

export async function POST(request: Request) {
  const auth = requireAdmin(request)
  if (!auth.ok) return auth.response
  try {
    const body = await request.json()
    const id = Number(body.id)
    try { console.log('[v0] Delete request received at', new Date().toISOString(), 'body=', body) } catch (e) {}
    try {
      const dbHost = process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).hostname : 'unknown'
      console.log('[v0] Delete request - DB host:', dbHost, 'pid=', process.pid, 'env=', process.env.NODE_ENV)
    } catch (e) {}
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

    // Prefer soft-delete so we don't lose history; hide from listings by marking inactive
    // Read current active count so we can wait for replicas to catch up (reduce stale read races)
    let beforeCount = 0
    try {
      const c = await sql`SELECT COUNT(*)::int as count FROM public.products WHERE is_active = true`
      beforeCount = Number(c && c[0] ? c[0].count : 0)
      try { console.log('[v0] Active products before delete=', beforeCount) } catch (e) {}
    } catch (e) {
      try { console.warn('[v0] Failed to read active count before delete', e) } catch (e) {}
    }

    const result = await withRetry(async () => {
      return await sql`
        UPDATE public.products SET is_active = false, updated_at = NOW() WHERE id = ${id} RETURNING *
      `
    })
    try { console.log('[v0] Delete SQL result raw=', result) } catch (e) {}
    try {
      console.log('[v0] Deleting product id=', id, 'result=', result && result[0] ? { id: result[0].id, is_active: result[0].is_active } : null)
    } catch (logErr) {
      // ignore logging failures
    }

    // If no rows affected, return 404 so client can handle 'not found'
      if (!result || !result[0]) {
        try {
          const check = await sql`SELECT id, is_active, name, updated_at FROM public.products WHERE id = ${id}`
          console.log('[v0] Delete diagnostic - lookup result for id=', id, check && check[0] ? { id: check[0].id, is_active: check[0].is_active, name: check[0].name, updated_at: check[0].updated_at } : null)
        } catch (diagErr) {
          console.warn('[v0] Delete diagnostic lookup failed for id=', id, diagErr)
        }
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }

    // After updating, poll the active products count a few times to allow replicas/readers to catch up
    try {
      const maxAttempts = 10
      let attempt = 0
      let seen = false
      while (attempt < maxAttempts) {
        try {
          const cur = await sql`SELECT COUNT(*)::int as count FROM public.products WHERE is_active = true`
          const curCount = Number(cur && cur[0] ? cur[0].count : 0)
          try { console.log('[v0] Active products check attempt', attempt + 1, 'count=', curCount) } catch (e) {}
          if (beforeCount === 0 || curCount <= beforeCount - 1) {
            seen = true
            break
          }
        } catch (e) {
          try { console.warn('[v0] Active products check failed on attempt', attempt + 1, e) } catch (e) {}
        }
        attempt++
        await new Promise((r) => setTimeout(r, 300))
      }
      if (!seen) {
        try { console.warn('[v0] Did not observe active count decrease after delete; proceeding to clear caches anyway') } catch (e) {}
      }

      try { await (await import('@/lib/cache')).cacheClearPrefix('products:') } catch (e) { console.warn('[v0] cacheClearPrefix failed', e) }
      try { console.log('[v0] Cleared products cache prefix') } catch (e) {}
      try {
        ;(global as any).__productPageCache = (global as any).__productPageCache || new Map()
        ;(global as any).__productPageCache.clear()
        try { console.log('[v0] Cleared global __productPageCache') } catch (e) {}
      } catch (gerr) {
        try { console.warn('[v0] Failed to clear global __productPageCache', gerr) } catch (e) {}
      }
      try {
        // Confirm the row state after update
        const post = await sql`SELECT id, is_active, name, updated_at FROM public.products WHERE id = ${id}`
        console.log('[v0] Post-update check for id=', id, post && post[0] ? { id: post[0].id, is_active: post[0].is_active, updated_at: post[0].updated_at } : null)
      } catch (postErr) {
        console.warn('[v0] Post-update check failed for id=', id, postErr)
      }
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
