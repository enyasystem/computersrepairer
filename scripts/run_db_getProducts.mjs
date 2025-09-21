import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// load .env.local
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
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      if (!process.env[key]) process.env[key] = val
    })
  } catch (err) {}
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
loadDotEnv(path.join(__dirname, '..', '.env.local'))

import { neon } from '@neondatabase/serverless'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('.env.local DATABASE_URL not found')
  process.exit(2)
}

const sql = neon(databaseUrl)

async function run() {
  try {
    const products = await sql`SELECT * FROM products WHERE is_active = true ORDER BY category, name`
    console.log('query returned', products.length)
    console.log(products.map(p => ({ id: p.id, name: p.name, category: p.category })))
  } catch (err) {
    console.error('Error querying products:', err)
  }
}

run()
