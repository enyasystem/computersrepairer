import fs from 'fs'
import path from 'path'
import { neon } from '@neondatabase/serverless'

// load .env.local
try {
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8')
    content.split(/\r?\n/).forEach((line) => {
      line = line.trim()
      if (!line || line.startsWith('#')) return
      const eq = line.indexOf('=')
      if (eq === -1) return
      const key = line.slice(0, eq).trim()
      let val = line.slice(eq + 1).trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1)
      process.env[key] = process.env[key] || val
    })
  }
} catch (e) {}

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('DATABASE_URL not found in .env.local')
  process.exit(2)
}

const sql = neon(databaseUrl)

async function run() {
  try {
    console.log('Connected to', (await sql`SELECT current_database() as db`)[0].db)
    const schemas = await sql`SELECT schemaname FROM pg_tables WHERE tablename = 'products'`
    if (!schemas || schemas.length === 0) {
      console.log('No products table found')
      return
    }
    console.log('Schemas with products table:', schemas.map(s => s.schemaname))

    // For simplicity, query public.products (typical default schema)
    try {
      const count = await sql`SELECT COUNT(*)::int as cnt FROM public.products`
      console.log('public.products count:', count[0].cnt)
      const sample = await sql`SELECT id, name, is_active FROM public.products ORDER BY id LIMIT 50`
      console.log('public.products sample:', sample)
    } catch (e) {
      console.warn('Could not query public.products:', e.message)
    }
  } catch (err) {
    console.error('inspect failed', err)
  }
}

run()
