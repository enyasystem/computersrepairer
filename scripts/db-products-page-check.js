const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL
  const envPath = path.resolve(__dirname, '..', '.env.local')
  if (!fs.existsSync(envPath)) return null
  const content = fs.readFileSync(envPath, 'utf8')
  const m = content.match(/^DATABASE_URL=(.+)$/m)
  return m ? m[1].trim() : null
}

(async () => {
  const databaseUrl = getDatabaseUrl()
  if (!databaseUrl) {
    console.error('DATABASE_URL not found')
    process.exit(1)
  }

  const client = new Client({ connectionString: databaseUrl })
  await client.connect()
  try {
    const perPage = 12
    const offset = 0
    const rowsRes = await client.query(`SELECT * FROM public.products WHERE is_active = true ORDER BY category, name LIMIT $1 OFFSET $2`, [perPage, offset])
    const countRes = await client.query(`SELECT COUNT(*)::int as count FROM public.products WHERE is_active = true`)
    console.log('rows returned:', rowsRes.rows.length, 'total active:', countRes.rows[0].count)
    console.log(rowsRes.rows.map(r => ({ id: r.id, sku: r.sku, name: r.name })))
  } catch (err) {
    console.error('error', err.message || err)
  } finally {
    await client.end()
  }
})()
