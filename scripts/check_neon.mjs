import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Minimal env loader for .env.local
function loadDotEnv(file) {
  try {
    const content = fs.readFileSync(file, 'utf8')
    content.split(/\r?\n/).forEach((line) => {
      line = line.trim()
      if (!line || line.startsWith('#')) return
      const eq = line.indexOf('=')
      if (eq === -1) return
      const key = line.slice(0, eq).trim()
      let val = line.slice(eq + 1).trim()
      // remove surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      if (!process.env[key]) process.env[key] = val
    })
  } catch (err) {
    // ignore missing file
  }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
loadDotEnv(path.join(__dirname, '..', '.env.local'))

import { neon } from '@neondatabase/serverless'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('DATABASE_URL is not set. Please ensure .env.local exists or set env var.')
  process.exit(2)
}

const sql = neon(databaseUrl)

async function run() {
  try {
    console.log('Using DATABASE_URL:', databaseUrl.replace(/:.+@/, ':***@'))
    // quick sanity queries
    const test = await sql`SELECT 1 as ok`
    console.log('Test query result:', test[0])

    // Try to count products and published posts (if tables exist)
    try {
      const products = await sql`SELECT COUNT(*)::int as count FROM products`
      console.log('Products count:', products[0].count)
      try {
        const list = await sql`SELECT id, name, is_active FROM products ORDER BY id LIMIT 50`
        console.log('Products (sample):', list.map((r) => ({ id: r.id, name: r.name, is_active: r.is_active })))
      } catch (e) {
        console.warn('Could not list products table details:', e.message)
      }
    } catch (e) {
      console.warn('Could not query products table:', e.message)
    }

    try {
      const posts = await sql`SELECT COUNT(*)::int as count FROM blog_posts WHERE status = 'published'`
      console.log('Published posts count:', posts[0].count)
    } catch (e) {
      console.warn('Could not query blog_posts table:', e.message)
    }

    process.exit(0)
  } catch (err) {
    console.error('Neon connection/query failed:', err)
    process.exit(1)
  }
}

run()
