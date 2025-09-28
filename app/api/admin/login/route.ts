import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { sql } from '@/lib/database'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || ''

export async function POST(request: Request) {
  if (!JWT_SECRET) return NextResponse.json({ error: 'Server JWT not configured' }, { status: 500 })
  try {
    const body = await request.json()
    const { username, password } = body || {}
    if (!username || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })

    // Accept either username OR email as the identifier
    const identifier = String(username).trim()

    // Lookup admin in DB by username OR email
    const rows = await sql`SELECT id, username, email, password_hash, role, is_active FROM admins WHERE username = ${identifier} OR email = ${identifier} LIMIT 1`
    if (!rows || rows.length === 0) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    const admin = rows[0]
    if (!admin.is_active) return NextResponse.json({ error: 'Account disabled' }, { status: 403 })

    const match = await bcrypt.compare(String(password), admin.password_hash)
    if (!match) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = jwt.sign({ sub: admin.username, role: admin.role, id: admin.id }, JWT_SECRET, { expiresIn: '8h' })

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
