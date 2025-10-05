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
    const cnt = await client.query('SELECT COUNT(*)::int AS count FROM products WHERE is_active = true')
    console.log('active products count:', cnt.rows[0].count)
    const rows = await client.query('SELECT id, name, sku, image_url, is_active FROM products WHERE is_active = true ORDER BY category, name LIMIT 12')
    console.table(rows.rows)
  } catch (err) {
    console.error('error', err.message || err)
  } finally {
    await client.end()
  }
})()
