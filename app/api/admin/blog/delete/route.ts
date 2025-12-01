import { NextResponse } from 'next/server'
import { primarySql } from '@/lib/database'
import { requireAdmin } from '@/lib/serverAuth'
import { revalidatePath } from 'next/cache'

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const auth = requireAdmin(request)
  if (!auth.ok) return auth.response

  try {
    const body = await request.json()
    try { console.log('[v0] API delete blog request body=', body) } catch (e) {}
    const id = Number(body?.id)
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    try {
      const result = await primarySql`
        DELETE FROM blog_posts WHERE id = ${id} RETURNING *
      `
      const deleted = result && result[0] ? result[0] : null
      if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })

      // Clear server-side blog page cache if present
      try { await (await import('@/lib/cache')).cacheClearPrefix('blog:') } catch (e) { console.warn('[v0] cacheClearPrefix failed', e) }
      try {
        ;(global as any).__blogPageCache = (global as any).__blogPageCache || new Map()
        ;(global as any).__blogPageCache.clear()
      } catch (e) {
        console.warn('[v0] Failed to clear global __blogPageCache', e)
      }

      // Revalidate the admin blog page so the server-rendered list updates immediately
      try { revalidatePath('/admin/blog') } catch (e) { console.warn('[v0] revalidatePath failed', e) }

      return NextResponse.json({ ok: true, deletedId: deleted.id })
    } catch (err) {
      console.error('[v0] API delete blog SQL error', err)
      return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }
  } catch (err) {
    console.error('[v0] API delete blog error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
