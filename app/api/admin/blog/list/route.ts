import { NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1') || 1
    const perPage = Number(url.searchParams.get('perPage') || '10') || 10

    const paged = await db.getBlogPostsPaged(page, perPage, 'published', { bypassCache: true, usePrimary: true })
    return NextResponse.json({ ok: true, data: paged })
  } catch (err) {
    console.error('API blog list error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
