;(async () => {
  try {
    const dbMod = await import('../lib/database.js')
    const db = dbMod.db
    const paged = await db.getProductsPaged(1, 12, { activeOnly: true, bypassCache: true })
    console.log('paged rows length:', Array.isArray(paged.rows) ? paged.rows.length : 'no rows', 'total:', paged.total)
    if (Array.isArray(paged.rows)) {
      console.log('skus:', paged.rows.map(r => r.sku).slice(0, 20))
    }
  } catch (err) {
    console.error('error', err.message || err)
  }
  process.exit(0)
})()
