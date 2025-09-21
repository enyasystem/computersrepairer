import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

// Server-side auth helper
// - If JWT_SECRET is set, expect a signed JWT in cookie 'admin_jwt' or Authorization header 'Bearer <token>'
// - If JWT_SECRET is not set, fall back to legacy header 'x-admin-token' compared to ADMIN_TOKEN env var

const JWT_SECRET = process.env.JWT_SECRET || ''

export function requireAdmin(request: Request) {
  // Try JWT first
  if (JWT_SECRET) {
    try {
      const authHeader = request.headers.get('authorization') || ''
      let token = ''
      if (authHeader.startsWith('Bearer ')) token = authHeader.slice(7)
      if (!token) {
        // Try cookie
        const cookie = request.headers.get('cookie') || ''
        const match = cookie.match(/(?:^|; )admin_jwt=([^;]+)/)
        if (match) token = decodeURIComponent(match[1])
      }
      if (!token) return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
      try {
        const payload = jwt.verify(token, JWT_SECRET) as any
        // Optionally validate payload.role === 'admin'
        if (payload && (payload.role === 'admin' || payload.role === 'super_admin')) {
          return { ok: true, user: payload }
        }
        return { ok: false, response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
      } catch (e) {
        return { ok: false, response: NextResponse.json({ error: 'Invalid token' }, { status: 401 }) }
      }
    } catch (e) {
      return { ok: false, response: NextResponse.json({ error: 'Auth failed' }, { status: 401 }) }
    }
  }

  // Fallback: legacy header compare
  const header = request.headers.get('x-admin-token') || ''
  if (process.env.ADMIN_TOKEN && header === process.env.ADMIN_TOKEN) {
    return { ok: true, user: { role: 'admin' } }
  }
  return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
}
