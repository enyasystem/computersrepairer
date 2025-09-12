import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const id = Number(body.id)
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

    await sql`
      DELETE FROM products WHERE id = ${id}
    `

    // revalidate can be handled via revalidation API or client reload
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[v0] Error deleting product', err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
