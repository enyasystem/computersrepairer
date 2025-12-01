import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/serverAuth'
import { setAdminCreds } from '@/lib/adminCreds'
import bcrypt from 'bcryptjs'
import { sql } from '@/lib/database'

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const auth = requireAdmin(request)
  if (!auth.ok) return auth.response

  try {
    const body = await request.json()
    const { email, password } = body || {}
    const updates: any = {}
    if (email) updates.email = String(email)
    let hashedPassword: string | undefined
    if (password) {
      // Hash plaintext password before persisting to DB
      hashedPassword = await bcrypt.hash(String(password), 10)
      updates.password = hashedPassword
    }

    if (!email && !password) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })

    // If we have an authenticated admin id, update the DB row directly for clarity
    try {
      const adminId = (auth.user as any)?.id
      if (adminId) {
        const fieldsToSet: string[] = []
        if (hashedPassword) {
          await sql`UPDATE admins SET password_hash = ${hashedPassword}, updated_at = NOW() WHERE id = ${adminId}`
        }
        if (email) {
          await sql`UPDATE admins SET email = ${String(email)}, updated_at = NOW() WHERE id = ${adminId}`
        }
        return NextResponse.json({ ok: true, updated: { email: updates.email ? updates.email : undefined } })
      }
    } catch (dbErr) {
      console.warn('DB update failed, falling back to file-based creds:', dbErr)
    }

    // fallback: use existing helper which will write to file if DB unavailable
    const updated = await setAdminCreds(updates)
    return NextResponse.json({ ok: true, updated })
  } catch (err) {
    console.error('settings update error', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
