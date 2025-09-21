import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

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

const idArg = process.argv[2]
const id = idArg ? Number(idArg) : null

async function run() {
  try {
    if (id) {
      const rows = await sql`SELECT id, name, is_active, updated_at FROM products WHERE id = ${id}`
      if (!rows || rows.length === 0) {
        console.log('No product found with id=', id)
        return
      }
      console.log('Found product:', rows[0])
      return
    }

    const rows = await sql`SELECT id, name, is_active, updated_at FROM products ORDER BY id`
    console.log('Total products (including inactive):', rows.length)
    console.log(rows.map(r => ({ id: r.id, is_active: r.is_active })))
  } catch (err) {
    console.error('Error querying product(s):', err)
  }
}

run()
