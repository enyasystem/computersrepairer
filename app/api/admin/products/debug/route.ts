import { NextResponse } from 'next/server'
import { sql, primarySql } from '@/lib/database'
import { requireAdmin } from '@/lib/serverAuth'

export const dynamic = "force-dynamic"

// Debug endpoint for local dev only: returns counts/rows from both sql and primarySql and clears caches
export async function GET(request: Request) {
  const auth = requireAdmin(request)
  if (!auth.ok) return auth.response
  try {
    // Read directly from both clients
    const [poolerCountRes, primaryCountRes] = await Promise.all([
      sql`SELECT COUNT(*)::int as count FROM public.products WHERE is_active = true`,
      primarySql`SELECT COUNT(*)::int as count FROM public.products WHERE is_active = true`,
    ])

    const poolerRows = await sql`SELECT id, name, is_active, updated_at FROM public.products ORDER BY id`
    const primaryRows = await primarySql`SELECT id, name, is_active, updated_at FROM public.products ORDER BY id`

    // Clear caches
    try { await (await import('@/lib/cache')).cacheClearPrefix('products:') } catch (e) { console.warn('[v0] cacheClearPrefix failed', e) }
    try { (global as any).__productPageCache = (global as any).__productPageCache || new Map(); (global as any).__productPageCache.clear() } catch (e) { console.warn('[v0] Failed to clear global __productPageCache', e) }

    return NextResponse.json({
      ok: true,
      pooler: { count: Number(poolerCountRes[0]?.count || 0), rows: poolerRows },
      primary: { count: Number(primaryCountRes[0]?.count || 0), rows: primaryRows },
    })
  } catch (err) {
    console.error('[v0] Debug endpoint error', err)
    return NextResponse.json({ error: 'Debug failed' }, { status: 500 })
  }
}
