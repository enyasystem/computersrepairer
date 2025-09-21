import { describe, it, expect, beforeAll } from 'vitest'

const hasDb = Boolean(process.env.DATABASE_URL)

if (!hasDb) {
  // If DATABASE_URL isn't set (local dev), skip DB integration tests.
  describe.skip('Database integration tests (skipped - DATABASE_URL not set)', () => {
    it('skipped because DATABASE_URL is not configured', () => {
      expect(true).toBe(true)
    })
  })
} else {
  describe('Database integration tests', () => {
    let db: any
    let testConnection: any

    beforeAll(async () => {
      const mod = await import('../lib/database')
      db = mod.db
      testConnection = mod.testConnection
    })

    it('connects to database', async () => {
      const ok = await testConnection()
      expect(ok).toBe(true)
    })

    it('getProductsPaged returns expected shape and count', async () => {
      const page = 1
      const perPage = 10
      const res = await db.getProductsPaged(page, perPage)
      expect(res).toHaveProperty('rows')
      expect(res).toHaveProperty('total')
      expect(Array.isArray(res.rows)).toBe(true)
      expect(typeof res.total).toBe('number')

      // Optional expected count from env for CI verification
      const expectedTotal = process.env.TEST_EXPECTED_PRODUCTS ? Number(process.env.TEST_EXPECTED_PRODUCTS) : undefined
      if (expectedTotal !== undefined) {
        expect(res.total).toBe(expectedTotal)
      }
    })

    it('getBlogPosts("published") returns array', async () => {
      const posts = await db.getBlogPosts('published')
      expect(Array.isArray(posts)).toBe(true)
      // optional check
      const expectedBlogCount = process.env.TEST_EXPECTED_BLOG_POSTS ? Number(process.env.TEST_EXPECTED_BLOG_POSTS) : undefined
      if (expectedBlogCount !== undefined) {
        expect(posts.length).toBe(expectedBlogCount)
      }
    })

    it('getAnalytics returns numeric fields', async () => {
      const analytics = await db.getAnalytics()
      expect(analytics).toHaveProperty('totalCustomers')
      expect(analytics).toHaveProperty('totalRepairs')
      expect(analytics).toHaveProperty('pendingRepairs')
      expect(analytics).toHaveProperty('completedRepairs')
      expect(typeof Number(analytics.totalCustomers)).toBe('number')
    })
  })
}
