import { NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET() {
  try {
    // Return first 3 published posts, usePrimary to favor strong-consistency after admin edits
    const payload = await db.getBlogPostsPaged(1, 3, 'published', { usePrimary: true })
    return NextResponse.json(payload)
  } catch (err) {
    console.error('[v0] /api/blog/list GET error', err)
    return NextResponse.json({ error: 'Failed to load blog posts' }, { status: 500 })
  }
}
