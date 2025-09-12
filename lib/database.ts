import { neon } from "@neondatabase/serverless"


console.log('DATABASE_URL:', process.env.DATABASE_URL)
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error("[v0] DATABASE_URL environment variable is not set")
  throw new Error("DATABASE_URL environment variable is not set. Please check your Neon integration.")
}

// Create a SQL client using Neon
export const sql = neon(databaseUrl)

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
    return await sql`
      SELECT * FROM products 
      WHERE is_active = true
      ORDER BY category, name
    `
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
  },

  // Blog operations
  async getBlogPosts(status?: string) {
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
  },

  async getBlogPostBySlug(slug: string) {
    const result = await sql`
      SELECT * FROM blog_posts 
      WHERE slug = ${slug}
    `
    return result[0]
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
      await Promise.all([
        sql`SELECT COUNT(*) as count FROM customers`,
        sql`SELECT COUNT(*) as count FROM repair_requests`,
        sql`SELECT COUNT(*) as count FROM repair_requests WHERE status = 'pending'`,
        sql`SELECT COUNT(*) as count FROM repair_requests WHERE status = 'completed'`,
        sql`SELECT COALESCE(SUM(actual_cost), 0) as total FROM repair_requests WHERE status = 'completed'`,
        sql`SELECT COUNT(*) as count FROM inquiries WHERE created_at >= NOW() - INTERVAL '7 days'`,
      ])

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
