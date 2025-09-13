import { NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { title, slug, content, excerpt, featured_image, status, author_name, published_at } = body

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const created = await db.createBlogPost({
      title,
      slug,
      content,
      excerpt,
      featured_image,
      status,
      author_name,
      published_at: published_at || null,
    })

    return NextResponse.json({ data: created }, { status: 201 })
  } catch (err) {
    console.error('[v0] API create blog error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
