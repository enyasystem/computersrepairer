(async () => {
  try {
    const nf = await import('node-fetch')
    const fetch = nf.default
    const BASE = process.env.TEST_BASE_URL || 'http://localhost:3000'
    const ADMIN_USER = process.env.ADMIN_USER || 'admin@computersrepairer.com'
    const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123'

    console.log('Logging in...')
    let res = await fetch(`${BASE}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS })
    })
    console.log('login status', res.status)
    const setCookie = res.headers.get('set-cookie')
    console.log('set-cookie:', setCookie)
    if (!setCookie) {
      console.error('No set-cookie'); process.exit(1)
    }
    const m = setCookie.match(/admin_jwt=([^;]+)/)
    if (!m) { console.error('admin_jwt not found'); process.exit(1) }
    const cookie = `admin_jwt=${m[1]}`

    console.log('Calling create-test...')
    res = await fetch(`${BASE}/api/admin/products/create-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify({ name: 'HardDeleteTest', price: 1, category: 'test', brand: 'test', sku: 'hd-test', in_stock: true, stock_quantity: 1, status: 'active', description: 'test', specifications: {} })
    })
    console.log('create-test status', res.status)
    const text = await res.text()
    try { console.log('create-test body (parsed):', JSON.parse(text)) } catch(e) { console.log('create-test body raw:', text) }
  } catch (err) {
    console.error('Error running debug-create-test', err)
    process.exit(1)
  }
})()
