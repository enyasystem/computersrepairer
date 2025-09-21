import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/serverAuth'

export async function GET(request: Request) {
  const auth = requireAdmin(request)
  if (!auth.ok) return auth.response
  return NextResponse.json({ ok: true, user: auth.user })
}
