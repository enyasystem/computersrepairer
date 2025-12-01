import { NextResponse } from "next/server"
import { sql, primarySql, withRetry } from "@/lib/database"
import { requireAdmin } from '@/lib/serverAuth'

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const auth = requireAdmin(request)
  if (!auth.ok) return auth.response
  try {
    const body = await request.json()
    const id = Number(body.id)
    const hard = !!body.hard
    try { console.log('[v0] Delete request received at', new Date().toISOString(), 'body=', body) } catch (e) {}
    try {
      const dbHost = process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).hostname : 'unknown'
      console.log('[v0] Delete request - DB host:', dbHost, 'pid=', process.pid, 'env=', process.env.NODE_ENV)
    } catch (e) {}
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

    // If caller requested a hard (permanent) delete, perform it on the primary
    if (hard) {
      try {
        const result = await primarySql`
          DELETE FROM public.products WHERE id = ${id} RETURNING *
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

    // Soft-delete flow (existing behavior) - changed to perform permanent delete so admin delete removes row
    let beforeCount = 0
    try {
      const c = await primarySql`SELECT COUNT(*)::int as count FROM public.products WHERE is_active = true`
      beforeCount = Number(c && c[0] ? c[0].count : 0)
      try { console.log('[v0] Active products before delete=', beforeCount) } catch (e) {}
    } catch (e) {
      try { console.warn('[v0] Failed to read active count before delete', e) } catch (e) {}
    }

    // Perform permanent delete on primary for default delete action
    const result = await withRetry(async () => {
      return await primarySql`
        DELETE FROM public.products WHERE id = ${id} RETURNING *
      `
    })
    try { console.log('[v0] Delete SQL result raw=', result) } catch (e) {}
    try {
      console.log('[v0] Deleting product id=', id, 'result=', result && result[0] ? { id: result[0].id } : null)
    } catch (logErr) {
      // ignore logging failures
    }

    // If no rows affected, return 404 so client can handle 'not found'
      if (!result || !result[0]) {
        try {
          const check = await primarySql`SELECT id, is_active, name, updated_at FROM public.products WHERE id = ${id}`
          console.log('[v0] Delete diagnostic - lookup result for id=', id, check && check[0] ? { id: check[0].id, is_active: check[0].is_active, name: check[0].name, updated_at: check[0].updated_at } : null)
        } catch (diagErr) {
          console.warn('[v0] Delete diagnostic lookup failed for id=', id, diagErr)
        }
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }

    try {
      // Clear caches and verify deletion
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
        const post = await primarySql`SELECT id, is_active, name, updated_at FROM public.products WHERE id = ${id}`
        console.log('[v0] Post-delete check for id=', id, post && post[0] ? { id: post[0].id, is_active: post[0].is_active, updated_at: post[0].updated_at } : null)
      } catch (postErr) {
        // If post-check fails to find row that's OK (deleted)
        try { console.log('[v0] Post-delete check indicates row not found (expected) for id=', id) } catch (e) {}
      }
    } catch (cacheErr) {
      console.warn('[v0] Failed to clear product page cache', cacheErr)
    }

    return NextResponse.json({ ok: true, deletedId: result?.[0]?.id ?? null })
  } catch (err) {
    console.error('[v0] Error deleting product', err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
