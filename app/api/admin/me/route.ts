import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/serverAuth'

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const auth = requireAdmin(request)
  if (!auth.ok) return auth.response
  return NextResponse.json({ ok: true, user: auth.user })
}
