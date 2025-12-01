import { NextResponse } from 'next/server'
import { db, primarySql } from '@/lib/database'
import { requireAdmin } from '@/lib/serverAuth'

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const auth = requireAdmin(request)
  if (!auth.ok) return auth.response
  try {
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    // Read directly from primary to avoid replica lag in admin/test flows
    const rows = await primarySql`
      SELECT * FROM products WHERE id = ${id}
    `
    const product = rows && rows[0]
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(product)
  } catch (err) {
    console.error('[v0] by-id error', err)
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 })
  }
}
