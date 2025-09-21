const { fetch } = require('undici')

const BASE = process.env.TEST_BASE_URL || 'http://localhost:3000'
const ADMIN_USER = process.env.ADMIN_USER || 'admin@computersrepairer.com'
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123'

async function dumpResponse(res) {
  const headers = {}
  res.headers.forEach((v,k)=> headers[k]=v)
  let body
  try { body = await res.text() } catch(e) { body = `<failed to read body: ${e.message}>` }
  return { status: res.status, headers, body }
}

async function run() {
  console.log('Logging in...')
  let res = await fetch(`${BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS })
  })
  const login = await dumpResponse(res)
  console.log('LOGIN RESPONSE', JSON.stringify(login, null, 2))
  const setCookie = login.headers['set-cookie'] || login.headers['Set-Cookie']
  if (!setCookie) { console.error('No set-cookie, aborting'); process.exit(1) }
  // extract admin_jwt
  const m = (setCookie || '').match(/admin_jwt=([^;]+)/)
  if (!m) { console.error('admin_jwt cookie not found in set-cookie header', setCookie); process.exit(1) }
  const cookie = `admin_jwt=${m[1]}`
  console.log('Using cookie:', cookie)

  console.log('Creating test product...')
  res = await fetch(`${BASE}/api/admin/products/create-test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({ name: 'HardDeleteTest', price: 1, category: 'test', brand: 'test', sku: 'hd-test', in_stock: true, stock_quantity: 1, status: 'active', description: 'test', specifications: {} })
  })
  const create = await dumpResponse(res)
  console.log('CREATE RESPONSE', JSON.stringify(create, null, 2))

  if (create.status !== 200) {
    console.error('Create failed, aborting')
    process.exit(1)
  }
  const created = JSON.parse(create.body)
  const id = created.id
  console.log('Created product id', id)

  console.log('Hard-deleting product...')
  res = await fetch(`${BASE}/api/admin/products/hard-delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({ id })
  })
  const harddel = await dumpResponse(res)
  console.log('HARD DELETE RESPONSE', JSON.stringify(harddel, null, 2))

  console.log('Listing products (usePrimary&bypassCache)...')
  res = await fetch(`${BASE}/api/admin/products/list?bypassCache=1&usePrimary=1`, {
    headers: { 'Cookie': cookie }
  })
  const list = await dumpResponse(res)
  console.log('LIST RESPONSE', JSON.stringify(list, null, 2))

  console.log('By-id lookup...')
  res = await fetch(`${BASE}/api/admin/products/by-id?id=${id}`, { headers: { 'Cookie': cookie } })
  const byid = await dumpResponse(res)
  console.log('BY-ID RESPONSE', JSON.stringify(byid, null, 2))
}

run().catch(err => { console.error('Script error', err); process.exit(1) })
