import { NextResponse } from "next/server"
import { requireAdmin } from '@/lib/serverAuth'

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const auth = requireAdmin(request)
  if (!auth.ok) return auth.response
  try {
    // Deprecation: this endpoint is replaced by /api/admin/products/delete with { hard: true }
    return NextResponse.json({ error: 'Deprecated', message: 'Use /api/admin/products/delete with { hard: true } in the request body' }, { status: 410 })
  } catch (err) {
    console.error('[v0] Deprecated hard-delete endpoint error', err)
    return NextResponse.json({ error: 'Hard delete endpoint failed' }, { status: 500 })
  }
}
