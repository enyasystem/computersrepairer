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
      console.log('[v0] requireAdmin: JWT_SECRET present')
      const authHeader = request.headers.get('authorization') || ''
      let token = ''
      if (authHeader.startsWith('Bearer ')) token = authHeader.slice(7)
      if (!token) {
        // Try cookie
        const cookie = request.headers.get('cookie') || ''
        console.log('[v0] requireAdmin: cookie header length=', cookie.length)
        const match = cookie.match(/(?:^|; )admin_jwt=([^;]+)/)
        if (match) token = decodeURIComponent(match[1])
      }
      if (!token) {
        console.warn('[v0] requireAdmin: no token found (authHeader present=', !!authHeader, ')')
        return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
      }
      try {
        console.log('[v0] requireAdmin: token length=', token.length)
        const payload = jwt.verify(token, JWT_SECRET) as any
        console.log('[v0] requireAdmin: token verified, payload=', { sub: payload.sub, role: payload.role, id: payload.id })
        // Allow owner, admin, or super_admin roles to access admin endpoints
        if (payload && (payload.role === 'admin' || payload.role === 'super_admin' || payload.role === 'owner')) {
          return { ok: true, user: payload }
        }
        console.warn('[v0] requireAdmin: forbidden role=', payload.role)
        return { ok: false, response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
      } catch (e: any) {
        console.warn('[v0] requireAdmin: token verify failed:', e?.message || e)
        return { ok: false, response: NextResponse.json({ error: 'Invalid token' }, { status: 401 }) }
      }
    } catch (e) {
      console.error('[v0] requireAdmin: auth failed', e)
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
