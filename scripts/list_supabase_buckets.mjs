#!/usr/bin/env node
// List Supabase Storage buckets using the service role key
// Usage:
//   SUPABASE_URL=https://<project>.supabase.co SUPABASE_SERVICE_ROLE_KEY=<service_role_key> node scripts/list_supabase_buckets.mjs

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const url = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/buckets`

async function run() {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    })

    const body = await res.text()
    try {
      const json = JSON.parse(body)
      console.log('Response status:', res.status)
      console.log(JSON.stringify(json, null, 2))
    } catch (e) {
      console.log('Non-JSON response:', body)
    }
  } catch (err) {
    console.error('Request failed', err)
    process.exit(2)
  }
}

run()
