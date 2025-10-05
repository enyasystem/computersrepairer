import { NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page') || '1')
    const perPage = Number(searchParams.get('perPage') || '12')
    const activeOnly = searchParams.get('activeOnly') !== '0'
    const category = searchParams.get('category') || undefined
    // If a category filter is supplied, use the full list and filter server-side to preserve correct paging
    if (category) {
      const all = await db.getProducts()
      const filtered = (Array.isArray(all) ? all : []).filter((p: any) => String(p.category || '').toLowerCase() === String(category).toLowerCase())
      const total = filtered.length
      const offset = (page - 1) * perPage
      const rows = filtered.slice(offset, offset + perPage)
      return NextResponse.json({ rows, total, page, perPage })
    }
    const payload = await db.getProductsPaged(page, perPage, { activeOnly, bypassCache: false })
    return NextResponse.json(payload)
  } catch (err) {
    console.error('[v0] /api/products/list GET error', err)
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 })
  }
}
