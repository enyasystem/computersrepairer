import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || ''
const ADMIN_USER = process.env.ADMIN_USER || 'admin'
const ADMIN_PASS = process.env.ADMIN_PASS || 'password'

export async function POST(request: Request) {
  if (!JWT_SECRET) return NextResponse.json({ error: 'Server JWT not configured' }, { status: 500 })
  try {
    const body = await request.json()
    const { username, password } = body || {}
    if (!username || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    if (username !== ADMIN_USER || password !== ADMIN_PASS) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = jwt.sign({ sub: username, role: 'admin' }, JWT_SECRET, { expiresIn: '8h' })

    // Build Set-Cookie header; avoid Secure in dev to allow localhost testing
    const isProd = process.env.NODE_ENV === 'production'
    const cookie = `admin_jwt=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${8 * 60 * 60}${isProd ? '; Secure' : ''}`

    const res = NextResponse.json({ ok: true })
    res.headers.set('Set-Cookie', cookie)
    return res
  } catch (err) {
    console.error('admin login error', err)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
