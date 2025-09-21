import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const res = NextResponse.json({ ok: true })
    // Clear cookie
    const cookie = `admin_jwt=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
    res.headers.set('Set-Cookie', cookie)
    return res
  } catch (err) {
    console.error('admin logout error', err)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
