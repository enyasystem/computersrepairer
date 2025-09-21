import { describe, it, expect } from 'vitest'
import fetch from 'node-fetch'

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'
const ADMIN_USER = process.env.ADMIN_USER || 'admin@computersrepairer.com'
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123'

// Helper to login and get cookie
async function loginAndGetCookie() {
  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS }),
  })
  const setCookie = res.headers.get('set-cookie')
  expect(res.status).toBe(200)
  if (!setCookie) throw new Error('No set-cookie header returned')
  const m = setCookie.match(/(?:^|; )admin_jwt=([^;]+)/)
  if (!m) throw new Error('admin_jwt not found in set-cookie')
  const cookieValue = `admin_jwt=${m[1]}`
  return cookieValue
}

describe('Hard Delete Product API', () => {
  let cookie: string
  let testProductId: number

  it('logs in as admin and gets cookie', async () => {
    cookie = await loginAndGetCookie()
    expect(cookie).toMatch(/admin_jwt=/)
  }, 20000)

  it('creates a test product', async () => {
    // Create a product directly in the DB using a unique SKU to avoid duplicate-key errors
    const uniqueSku = `hd-test-${Date.now()}-${Math.random().toString(36).slice(2,8)}`
    const res = await fetch(`${BASE_URL}/api/admin/products/create-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify({ name: 'HardDeleteTest', price: 1, category: 'test', brand: 'test', sku: uniqueSku, in_stock: true, stock_quantity: 1, status: 'active', description: 'test', specifications: {} }),
    })
    const j = await res.json() as any
    expect(res.status).toBe(200)
    expect(j).toHaveProperty('id')
    testProductId = j.id
  }, 20000)

  it('hard deletes the test product', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/products/hard-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify({ id: testProductId }),
    })
    const j = await res.json() as any
    expect(res.status).toBe(200)
    expect(j.ok).toBe(true)
    expect(j.deletedId).toBe(testProductId)
  }, 20000)

  it('verifies the product is not in the product list', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/products/list?bypassCache=1&usePrimary=1`, {
      headers: { 'Cookie': cookie },
    })
    const j = await res.json() as any
    expect(res.status).toBe(200)
    expect(j.rows.find((p: any) => p.id === testProductId)).toBeFalsy()
  }, 20000)

  it('verifies the product is removed from the database', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/products/by-id?id=${testProductId}`, {
      headers: { 'Cookie': cookie },
    })
    const j = await res.json() as any
    expect(res.status).toBe(404)
  }, 20000)
})
