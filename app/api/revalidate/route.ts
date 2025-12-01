import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { cacheClearPrefix } from '@/lib/cache'

// POST or GET /api/revalidate
// - secure with env var REVALIDATE_TOKEN (or REVALIDATE_SECRET)
// - body (POST) or query (GET) may include `paths` (array or comma-separated)

function getConfiguredToken() {
  return process.env.REVALIDATE_TOKEN || process.env.REVALIDATE_SECRET || process.env.NEXT_REVALIDATE_TOKEN
}

function parsePathsFromQuery(url: URL) {
  const raw = url.searchParams.get('paths') || url.searchParams.get('path')
  if (!raw) return undefined
  // allow comma separated or repeated params
  if (raw.includes(',')) return raw.split(',').map((s) => s.trim()).filter(Boolean)
  return [raw]
}

async function handleRevalidate(paths: string[]) {
  // Clear application-level product caches (Redis or local) so API/page caches reflect new DB rows.
  try {
    await cacheClearPrefix('products:')
    try { console.log('[v0] Cleared product cache prefix') } catch (e) {}
  } catch (e) {
    try { console.warn('[v0] Failed to clear product cache prefix', e) } catch (e) {}
  }
  for (const p of paths) {
    try {
      revalidatePath(p)
      try { console.log('[v0] Revalidated path', p) } catch (e) {}
    } catch (err) {
      try { console.warn('[v0] revalidatePath failed for', p, err) } catch (e) {}
    }
  }
}

export async function POST(req: Request) {
  const configured = getConfiguredToken()
  const body = await req.json().catch(() => ({}))
  const provided = body?.token || req.headers.get('x-revalidate-token')

  if (!configured) {
    console.warn('[v0] REVALIDATE token not configured; rejecting request')
    return NextResponse.json({ ok: false, error: 'Revalidate token not configured' }, { status: 500 })
  }
  if (provided !== configured) {
    return NextResponse.json({ ok: false, error: 'Invalid token' }, { status: 401 })
  }

  const paths = Array.isArray(body?.paths) ? body.paths : (body?.paths ? [body.paths] : ['/','/shop'])
  await handleRevalidate(paths)
  return NextResponse.json({ ok: true, revalidated: paths })
}

export async function GET(req: Request) {
  const configured = getConfiguredToken()
  const url = new URL(req.url)
  const provided = url.searchParams.get('token') || req.headers.get('x-revalidate-token')

  if (!configured) {
    console.warn('[v0] REVALIDATE token not configured; rejecting request')
    return NextResponse.json({ ok: false, error: 'Revalidate token not configured' }, { status: 500 })
  }
  if (provided !== configured) {
    return NextResponse.json({ ok: false, error: 'Invalid token' }, { status: 401 })
  }

  const paths = parsePathsFromQuery(url) || ['/','/shop']
  await handleRevalidate(paths)
  return NextResponse.json({ ok: true, revalidated: paths })
}
