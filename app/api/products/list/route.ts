import { NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page') || '1')
    const perPage = Number(searchParams.get('perPage') || '12')
    const activeOnly = searchParams.get('activeOnly') !== '0'
    const payload = await db.getProductsPaged(page, perPage, { activeOnly, bypassCache: false })
    return NextResponse.json(payload)
  } catch (err) {
    console.error('[v0] /api/products/list GET error', err)
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 })
  }
}
