import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function isValidHttpUrl(value?: string) {
  if (!value) return false
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch (e) {
    return false
  }
}

if (!isValidHttpUrl(supabaseUrl) || !supabaseServiceRoleKey) {
  try {
    console.warn('[v0] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set or invalid. Supabase storage will not work until configured.')
  } catch (e) {}
}

export const supabaseServer: SupabaseClient | null = (() => {
  if (!isValidHttpUrl(supabaseUrl) || !supabaseServiceRoleKey) return null
  try {
    return createClient(supabaseUrl as string, supabaseServiceRoleKey as string, { auth: { persistSession: false } })
  } catch (err) {
    try { console.error('[v0] Failed to initialize supabase client:', err) } catch (e) {}
    return null
  }
})()
