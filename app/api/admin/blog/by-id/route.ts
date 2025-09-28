import { NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const post = await db.getBlogPostById(Number(id))
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: post })
  } catch (err) {
    console.error('API get blog by id error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
