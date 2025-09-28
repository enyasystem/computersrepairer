#!/usr/bin/env node
// Create a Supabase Storage bucket using the service role key
// Usage:
//   SUPABASE_URL=https://<project>.supabase.co SUPABASE_SERVICE_ROLE_KEY=<service_role_key> node scripts/create_supabase_bucket.mjs <bucket-name>
// If no bucket-name is provided, defaults to "public".

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const bucket = process.argv[2] || process.env.SUPABASE_BUCKET || 'public'

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing required env vars. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  // Use global fetch from Node if needed; supabase-js works in recent Node versions
})

async function run() {
  try {
    console.log(`Checking/creating bucket: ${bucket}`)

    // Try to create the bucket. If it already exists the API may return an error — handle gracefully.
    const { data, error } = await supabase.storage.createBucket(bucket, { public: true })

    if (error) {
      // Some Supabase API responses indicate bucket already exists; try to detect that and continue.
      const msg = String(error.message || error).toLowerCase()
      if (msg.includes('already exists') || msg.includes('bucket already exists')) {
        console.log(`Bucket "${bucket}" already exists.`)
      } else {
        console.error('Failed to create bucket:', error)
        process.exit(2)
      }
    } else {
      console.log(`Bucket "${bucket}" created successfully.`)
      console.log('Bucket data:', data)
    }

    // Print example public URL pattern for created objects
    console.log('\nExample public object URL (for public buckets):')
    console.log(`${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/<file-path>`)

    process.exit(0)
  } catch (err) {
    console.error('Unexpected error creating bucket:', err)
    process.exit(3)
  }
}

run()
