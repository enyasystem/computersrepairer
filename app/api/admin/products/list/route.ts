import { NextResponse } from 'next/server'
import { db } from '@/lib/database'

export const dynamic = "force-dynamic"
import { requireAdmin } from '@/lib/serverAuth'

export async function GET(request: Request) {
  const auth = requireAdmin(request)
  if (!auth.ok) return auth.response
  try {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1')
    const perPage = Number(url.searchParams.get('perPage') || '10')
    const bypassCache = url.searchParams.get('bypassCache') === '1'
    const usePrimary = url.searchParams.get('usePrimary') === '1'
    const res = await db.getProductsPaged(page, perPage, { bypassCache, usePrimary })
    return NextResponse.json(res)
  } catch (err) {
    console.error('[v0] list error', err)
    return NextResponse.json({ error: 'List failed' }, { status: 500 })
  }
}
