import { NextResponse } from 'next/server'
import { db, sql } from '@/lib/database'

export async function GET() {
  try {
    // run metadata queries using the same connection
    const meta = await sql`
      SELECT current_database() as database, session_user as user, current_schema() as current_schema, current_setting('search_path') as search_path
    `
    const products = await db.getProducts()
    const tableInfo = await sql`
      SELECT schemaname, tablename FROM pg_tables WHERE tablename = 'products'
    `
    const rawCount = await sql`SELECT COUNT(*)::int as count FROM products`
    const sample = await sql`SELECT id, name, is_active, category FROM products ORDER BY id LIMIT 50`

    return NextResponse.json({
      ok: true,
      meta: meta[0],
      dbGetProducts: { count: Array.isArray(products) ? products.length : 0, sample: (products || []).slice(0, 20) },
      tableInfo,
      rawCount: rawCount[0],
      sample
    })
  } catch (err) {
    console.error('api/debug/products error', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

