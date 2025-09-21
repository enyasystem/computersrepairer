import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const id = Number(body.id)
    const status = body.status as string
    if (!id || !status) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

    await sql`
      UPDATE products SET status = ${status}, updated_at = NOW() WHERE id = ${id}
    `

    try {
      ;(global as any).__productPageCache = (global as any).__productPageCache || new Map()
      ;(global as any).__productPageCache.clear()
    } catch (cacheErr) {
      console.warn('[v0] Failed to clear product page cache', cacheErr)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[v0] Error updating product status', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
