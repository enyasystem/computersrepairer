import { neon } from "@neondatabase/serverless"


console.log('DATABASE_URL:', process.env.DATABASE_URL)
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error("[v0] DATABASE_URL environment variable is not set")
  throw new Error("DATABASE_URL environment variable is not set. Please check your Neon integration.")
}

// Create a SQL client using Neon
export const sql = neon(databaseUrl)

// simple retry helper for transient network/DNS/fetch failures
export async function withRetry<T>(fn: () => Promise<T>, retries = 5, baseDelay = 500) {
  let attempt = 0
  while (true) {
    try {
      return await fn()
    } catch (err: any) {
      attempt++
      const isLast = attempt >= retries
      const msg = err?.message || String(err)
      try { console.warn(`[v0] DB query error (attempt ${attempt}/${retries}):`, msg) } catch (e) {}
      if (isLast) {
        try { console.error('[v0] DB query failed after retries') } catch (e) {}
        throw err
      }
      // exponential backoff: baseDelay * 2^(attempt-1)
      const delay = baseDelay * Math.pow(2, attempt - 1)
      try { console.log(`[v0] Retrying DB query after ${delay}ms (attempt ${attempt + 1}/${retries})`) } catch (e) {}
      await new Promise((res) => setTimeout(res, delay))
    }
  }
}

export async function testConnection() {
  try {
    await sql`SELECT 1 as test`
    return true
  } catch (error) {
    console.error("[v0] Database connection failed:", error)
    return false
  }
}

// Database query helpers
export const db = {
  // Customer operations
  async getCustomers() {
    return await sql`
      SELECT * FROM customers 
      ORDER BY created_at DESC
    `
  },

  async getCustomerById(id: number) {
    const result = await sql`
      SELECT * FROM customers 
      WHERE id = ${id}
    `
    return result[0]
  },

  async createCustomer(customer: {
    name: string
    email: string
    phone?: string
    address?: string
  }) {
    const result = await sql`
      INSERT INTO customers (name, email, phone, address)
      VALUES (${customer.name}, ${customer.email}, ${customer.phone || null}, ${customer.address || null})
      RETURNING *
    `
    return result[0]
  },

  // Repair request operations
  async getRepairRequests() {
    return await sql`
      SELECT r.*, c.name as customer_name, c.email as customer_email
      FROM repair_requests r
      LEFT JOIN customers c ON r.customer_id = c.id
      ORDER BY r.created_at DESC
    `
  },

  async getRepairRequestById(id: number) {
    const result = await sql`
      SELECT r.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone
      FROM repair_requests r
      LEFT JOIN customers c ON r.customer_id = c.id
      WHERE r.id = ${id}
    `
    return result[0]
  },

  async updateRepairStatus(id: number, status: string) {
    const result = await sql`
      UPDATE repair_requests 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return result[0]
  },

  // Product operations
  async getProducts() {
    return await withRetry(async () => {
      // Log current schema and search_path for debugging
      const result = await sql`
        SELECT * FROM public.products 
        WHERE is_active = true
        ORDER BY category, name
      `
      return result
    })
  },

  // Paginated product listing with optional simple server-side in-memory cache
  async getProductsPaged(page = 1, perPage = 10, opts?: { activeOnly?: boolean }) {
    const offset = (page - 1) * perPage
    const activeOnly = opts?.activeOnly ?? true

    // simple in-memory cache keyed by page/perPage/activeOnly
    const cacheKey = `products:page=${page}:perPage=${perPage}:active=${activeOnly}`
    // create cache on module if not exists
    ;(global as any).__productPageCache = (global as any).__productPageCache || new Map()
    const cache: Map<string, { ts: number; ttl: number; data: any } > = (global as any).__productPageCache
    const cached = cache.get(cacheKey)
    const now = Date.now()
    const defaultTtl = 1000 * 30 // 30s
    if (cached && now - cached.ts < (cached.ttl || defaultTtl)) {
      try { console.log('[v0] Returning cached products page', cacheKey) } catch (e) {}
      // return cached copy
      return cached.data
    }

    const query = activeOnly
      ? sql`
          SELECT * FROM public.products
          WHERE is_active = true
          ORDER BY category, name
          LIMIT ${perPage}
          OFFSET ${offset}
        `
      : sql`
          SELECT * FROM public.products
          ORDER BY category, name
          LIMIT ${perPage}
          OFFSET ${offset}
        `

    const countQuery = activeOnly
      ? sql`SELECT COUNT(*) as count FROM public.products WHERE is_active = true`
      : sql`SELECT COUNT(*) as count FROM public.products`

    const result = await withRetry(async () => {
      const [rows, countRes] = await Promise.all([query, countQuery])
      const total = Number(countRes[0].count || 0)
      const payload = { rows, total, page, perPage }
      cache.set(cacheKey, { ts: now, ttl: defaultTtl, data: payload })
      try { console.log('[v0] Set products page cache', cacheKey, 'cacheSize=', cache.size) } catch (e) {}
      return payload
    })

    return result
  },

  async getProductById(id: number) {
    const result = await sql`
      SELECT * FROM products 
      WHERE id = ${id}
    `
    return result[0]
  },

  async createProduct(product: {
    name: string
    description: string
    full_description?: string
    price: number
    original_price?: number
    category: string
    brand: string
    sku: string
    image_url?: string
    in_stock: boolean
    stock_quantity: number
    badge?: string
    status: string
    specifications?: Record<string, string>
  }) {
    console.log("[v0] Creating product:", product)
    try {
      // Log DB host to help debug network/DNS issues
      try {
        const dbHost = new URL(databaseUrl).hostname
        console.log(`[v0] Attempting DB insert on host: ${dbHost}`)
      } catch (e) {
        // ignore URL parse errors
      }

      const result = await sql`
        INSERT INTO products (
          name, description, full_description, price, original_price, 
          category, brand, sku, image_url, in_stock, stock_quantity, 
          badge, status, specifications, is_active
        )
        VALUES (
          ${product.name}, ${product.description}, ${product.full_description || null},
          ${product.price}, ${product.original_price || null}, ${product.category},
          ${product.brand}, ${product.sku}, ${product.image_url || null},
          ${product.in_stock}, ${product.stock_quantity}, ${product.badge || null},
          ${product.status}, ${JSON.stringify(product.specifications || {})}, true
        )
        RETURNING *
      `
      console.log("[v0] Product created successfully:", result[0])
      return result[0]
    } catch (error) {
      // Detailed debug logging to surface network/DNS/cause information
      const err: any = error
      try {
        console.error("[v0] SQL error creating product:", {
          message: err?.message,
          stack: err?.stack,
          name: err?.name,
          cause: err?.cause,
          sourceError: err?.sourceError || err?.cause || null,
        })
      } catch (logErr) {
        console.error('[v0] Failed to log SQL error details', logErr)
      }
      throw error
    }
  },

  async updateProduct(id: number, product: {
    name?: string
    description?: string
    full_description?: string
    price?: number
    original_price?: number | null
    category?: string
    brand?: string
    sku?: string
    image_url?: string | null
    in_stock?: boolean
    stock_quantity?: number
    badge?: string | null
    status?: string
    specifications?: Record<string, string>
    is_active?: boolean
  }) {
    // Build a dynamic SET clause using SQL tagged template interpolation
    try {
      const result = await sql`
        UPDATE products SET
          name = COALESCE(${product.name}, name),
          description = COALESCE(${product.description}, description),
          full_description = COALESCE(${product.full_description}, full_description),
          price = COALESCE(${product.price}, price),
          original_price = COALESCE(${product.original_price}, original_price),
          category = COALESCE(${product.category}, category),
          brand = COALESCE(${product.brand}, brand),
          sku = COALESCE(${product.sku}, sku),
          image_url = COALESCE(${product.image_url}, image_url),
          in_stock = COALESCE(${product.in_stock}, in_stock),
          stock_quantity = COALESCE(${product.stock_quantity}, stock_quantity),
          badge = COALESCE(${product.badge}, badge),
          status = COALESCE(${product.status}, status),
          specifications = COALESCE(${JSON.stringify(product.specifications || null)}, specifications),
          is_active = COALESCE(${product.is_active}, is_active),
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
      return result[0]
    } catch (error) {
      const err: any = error
      try {
        console.error('[v0] SQL error updating product:', { message: err?.message, stack: err?.stack })
      } catch (logErr) {
        console.error('[v0] Failed to log SQL error details', logErr)
      }
      throw error
    }
  },

  // Blog operations
  async getBlogPosts(status?: string) {
    return await withRetry(async () => {
      if (status) {
        return await sql`
          SELECT * FROM blog_posts 
          WHERE status = ${status}
          ORDER BY created_at DESC
        `
      }
      return await sql`
        SELECT * FROM blog_posts 
        ORDER BY created_at DESC
      `
    })
  },

  /**
   * Paginated blog posts helper.
   *
   * - Uses LIMIT/OFFSET for pagination.
   * - Optional `status` filter (e.g. 'published').
   * - Caches pages in a short-lived in-memory cache (TTL default 30s) to reduce DB load in development and serverless warmups.
   *
   * Note: This is a simple server-side cache suitable for single-instance deployments or short-lived processes.
   * For multi-instance or production loads, replace with a shared cache (Redis, Memcached).
   *
   * @param page page number (1-based)
   * @param perPage items per page
   * @param status optional status filter (e.g. 'published')
   */
  async getBlogPostsPaged(page = 1, perPage = 10, status?: string) {
    const offset = (page - 1) * perPage

    const cacheKey = `blog:page=${page}:perPage=${perPage}:status=${status || 'all'}`
    ;(global as any).__blogPageCache = (global as any).__blogPageCache || new Map()
    const cache: Map<string, { ts: number; ttl: number; data: any } > = (global as any).__blogPageCache
    const cached = cache.get(cacheKey)
    const now = Date.now()
    const defaultTtl = 1000 * 30 // 30s
    if (cached && now - cached.ts < (cached.ttl || defaultTtl)) {
      return cached.data
    }

    const listQuery = status
      ? sql`
          SELECT * FROM blog_posts
          WHERE status = ${status}
          ORDER BY created_at DESC
          LIMIT ${perPage}
          OFFSET ${offset}
        `
      : sql`
          SELECT * FROM blog_posts
          ORDER BY created_at DESC
          LIMIT ${perPage}
          OFFSET ${offset}
        `

    const countQuery = status
      ? sql`SELECT COUNT(*) as count FROM blog_posts WHERE status = ${status}`
      : sql`SELECT COUNT(*) as count FROM blog_posts`

    const result = await withRetry(async () => {
      const [rows, countRes] = await Promise.all([listQuery, countQuery])
      const total = Number(countRes[0].count || 0)
      const payload = { rows, total, page, perPage }
      cache.set(cacheKey, { ts: now, ttl: defaultTtl, data: payload })
      return payload
    })

    return result
  },

  async getBlogPostBySlug(slug: string) {
    const result = await sql`
      SELECT * FROM blog_posts 
      WHERE slug = ${slug}
    `
    return result[0]
  },

  async createBlogPost(post: {
    title: string
    slug: string
    content: string
    excerpt?: string
    featured_image?: string
    status?: string
    author_name?: string
    published_at?: string | null
  }) {
    try {
      const result = await sql`
        INSERT INTO blog_posts (
          title, slug, content, excerpt, featured_image,
          status, author_name, published_at
        ) VALUES (
          ${post.title}, ${post.slug}, ${post.content}, ${post.excerpt || null}, ${post.featured_image || null},
          ${post.status || 'draft'}, ${post.author_name || 'Admin'}, ${post.published_at || null}
        ) RETURNING *
      `
      return result[0]
    } catch (error) {
      const err: any = error
      try {
        console.error('[v0] SQL error creating blog post:', {
          message: err?.message,
          stack: err?.stack,
          name: err?.name,
          cause: err?.cause,
        })
      } catch (logErr) {
        console.error('[v0] Failed to log SQL error details', logErr)
      }
      throw error
    }
  },

  // Inquiry operations
  async getInquiries() {
    return await sql`
      SELECT * FROM inquiries 
      ORDER BY created_at DESC
    `
  },

  async getInquiryById(id: number) {
    const result = await sql`
      SELECT * FROM inquiries 
      WHERE id = ${id}
    `
    return result[0]
  },

  async updateInquiryStatus(id: number, status: string) {
    const result = await sql`
      UPDATE inquiries 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return result[0]
  },

  // Analytics operations
  async getAnalytics() {
    const [totalCustomers, totalRepairs, pendingRepairs, completedRepairs, totalRevenue, recentInquiries] =
      await withRetry(async () =>
        Promise.all([
          sql`SELECT COUNT(*) as count FROM customers`,
          sql`SELECT COUNT(*) as count FROM repair_requests`,
          sql`SELECT COUNT(*) as count FROM repair_requests WHERE status = 'pending'`,
          sql`SELECT COUNT(*) as count FROM repair_requests WHERE status = 'completed'`,
          // Sum actual_cost when available, otherwise fall back to estimated_cost
          sql`SELECT COALESCE(SUM(COALESCE(actual_cost, estimated_cost)), 0) as total FROM repair_requests WHERE status = 'completed'`,
          sql`SELECT COUNT(*) as count FROM inquiries WHERE created_at >= NOW() - INTERVAL '7 days'`,
        ])
      )

    return {
      totalCustomers: totalCustomers[0].count,
      totalRepairs: totalRepairs[0].count,
      pendingRepairs: pendingRepairs[0].count,
      completedRepairs: completedRepairs[0].count,
      totalRevenue: totalRevenue[0].total,
      recentInquiries: recentInquiries[0].count,
    }
  },

  // Appointment operations
  async getAppointments() {
    return await sql`
      SELECT * FROM appointments 
      ORDER BY preferred_date ASC, preferred_time ASC
    `
  },

  async getAppointmentById(id: number) {
    const result = await sql`
      SELECT * FROM appointments 
      WHERE id = ${id}
    `
    return result[0]
  },

  async createAppointment(appointment: {
    customer_name: string
    customer_email: string
    customer_phone?: string
    service_type: string
    device_type?: string
    device_model?: string
    issue_description?: string
    preferred_date: string
    preferred_time: string
    appointment_type: string
    notes?: string
  }) {
    console.log("[v0] Creating appointment:", appointment)
    const result = await sql`
      INSERT INTO appointments (
        customer_name, customer_email, customer_phone, service_type,
        device_type, device_model, issue_description, preferred_date,
        preferred_time, appointment_type, notes, status
      )
      VALUES (
        ${appointment.customer_name}, ${appointment.customer_email}, 
        ${appointment.customer_phone || null}, ${appointment.service_type},
        ${appointment.device_type || null}, ${appointment.device_model || null},
        ${appointment.issue_description || null}, ${appointment.preferred_date},
        ${appointment.preferred_time}, ${appointment.appointment_type},
        ${appointment.notes || null}, 'pending'
      )
      RETURNING *
    `
    console.log("[v0] Appointment created successfully:", result[0])
    return result[0]
  },

  async updateAppointmentStatus(id: number, status: string) {
    const result = await sql`
      UPDATE appointments 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return result[0]
  },

  async getAppointmentsByDate(date: string) {
    return await sql`
      SELECT * FROM appointments 
      WHERE preferred_date = ${date}
      ORDER BY preferred_time ASC
    `
  },

  async getUpcomingAppointments(limit = 10) {
    return await sql`
      SELECT * FROM appointments 
      WHERE preferred_date >= CURRENT_DATE 
      AND status IN ('pending', 'confirmed')
      ORDER BY preferred_date ASC, preferred_time ASC
      LIMIT ${limit}
    `
  },
}
