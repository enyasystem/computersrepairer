import { NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page') || '1')
    const perPage = Number(searchParams.get('perPage') || '6')
    const payload = await db.getBlogPostsPaged(page, perPage, 'published', { usePrimary: true })
    return NextResponse.json(payload)
  } catch (err) {
    console.error('[v0] /api/blog/list GET error', err)
    return NextResponse.json({ error: 'Failed to load blog posts' }, { status: 500 })
  }
}
