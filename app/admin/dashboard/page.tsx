import { db } from "@/lib/database"
import Link from "next/link"

// Format numbers for display (thousands separators)
const formatNumber = (n: number) => n.toLocaleString()
const formatCurrency = (n: number) => {
  try {
    return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  } catch {
    return `$${Math.round(n)}`
  }
}

/**
 * Admin dashboard — server component.
 *
 * UX goals implemented:
 * - Clear visual hierarchy: page heading, summary cards, recent items
 * - Accessible alert banner when DB connectivity is unstable
 * - Actionable items: links to product and post management pages
 * - Number & currency formatting for readability
 * - Responsive grid for different viewports
 */
export default async function AdminDashboard() {
  let unstable = false
  let unstableMessage = ''

  let rawAnalytics: any = {}
  let products: any[] = []
  let productsTotal = 0
  let posts: any[] = []
  let postsTotal = 0

  try {
    rawAnalytics = (await db.getAnalytics()) || {}
  } catch (err: any) {
    console.error('Analytics fetch error', err)
    unstable = true
    unstableMessage += 'Analytics unavailable. '
  }

  try {
    const pagedProducts = await db.getProductsPaged(1, 100, { activeOnly: true })
    products = pagedProducts.rows || []
    productsTotal = Number(pagedProducts.total || 0)
  } catch (err: any) {
    console.error('Products fetch error', err)
    unstable = true
    unstableMessage += 'Products unavailable. '
  }

  try {
    const pagedPosts = await db.getBlogPostsPaged(1, 5, 'published')
    posts = pagedPosts.rows || []
    postsTotal = Number(pagedPosts.total || 0)
  } catch (err: any) {
    console.error('Posts fetch error', err)
    unstable = true
    unstableMessage += 'Posts unavailable. '
  }

  const analytics = {
    totalCustomers: Number(rawAnalytics.totalCustomers) || 0,
    totalRepairs: Number(rawAnalytics.totalRepairs) || 0,
    pendingRepairs: Number(rawAnalytics.pendingRepairs) || 0,
    completedRepairs: Number(rawAnalytics.completedRepairs) || 0,
    totalRevenue: Number(rawAnalytics.totalRevenue) || 0,
    recentInquiries: Number(rawAnalytics.recentInquiries) || 0,
  }

  const recentProducts = Array.isArray(products) ? products.slice(0, 5) : []
  const recentPosts = Array.isArray(posts) ? posts.slice(0, 5) : []

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of site activity and quick links to management pages.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="px-3 py-2 rounded bg-sky-600 text-white text-sm">Manage Products</Link>
          <Link href="/admin/blog" className="px-3 py-2 rounded border text-sm">Manage Posts</Link>
        </div>
      </div>

      {unstable && (
        <div role="alert" aria-live="polite" className="mt-4 p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800">
          <strong className="mr-2">Connectivity Issue:</strong>
          <span>We had trouble reaching the database. Data may be incomplete — {unstableMessage}</span>
        </div>
      )}

      <section aria-labelledby="summary-heading" className="mt-6">
        <h2 id="summary-heading" className="sr-only">Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <article className="p-4 bg-card rounded shadow-sm">
            <div className="text-sm text-muted-foreground">Products</div>
            <div className="mt-2 text-2xl font-semibold">{formatNumber(productsTotal || products.length)}</div>
            <div className="mt-3 text-sm"><Link href="/admin/products" className="text-sky-600 hover:underline">View all products</Link></div>
          </article>

          <article className="p-4 bg-card rounded shadow-sm">
            <div className="text-sm text-muted-foreground">Published Posts</div>
            <div className="mt-2 text-2xl font-semibold">{formatNumber(postsTotal || posts.length)}</div>
            <div className="mt-3 text-sm"><Link href="/admin/blog" className="text-sky-600 hover:underline">View posts</Link></div>
          </article>

          <article className="p-4 bg-card rounded shadow-sm">
            <div className="text-sm text-muted-foreground">Total Revenue</div>
            <div className="mt-2 text-2xl font-semibold">{formatCurrency(analytics.totalRevenue)}</div>
            <div className="mt-3 text-sm">Completed repairs revenue</div>
          </article>

          <article className="p-4 bg-card rounded shadow-sm">
            <div className="text-sm text-muted-foreground">Recent Inquiries (7d)</div>
            <div className="mt-2 text-2xl font-semibold">{formatNumber(analytics.recentInquiries)}</div>
            <div className="mt-3 text-sm"><Link href="/admin/inquiries" className="text-sky-600 hover:underline">View inquiries</Link></div>
          </article>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded p-4">
          <h3 className="text-lg font-semibold">Recent Products</h3>
          {recentProducts.length === 0 ? (
            <div className="text-sm text-muted-foreground mt-3">No recent products</div>
          ) : (
            <ul className="mt-3 space-y-2">
              {recentProducts.map((p: any) => (
                <li key={p.id} className="flex items-center justify-between">
                  <div>
                    <Link href={`/admin/products/edit/${p.id}`} className="font-medium text-slate-900 hover:underline">{p.name}</Link>
                    <div className="text-sm text-muted-foreground">{p.brand || ''}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{p.in_stock ? `${p.stock_quantity} in stock` : 'Out of stock'}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-card rounded p-4">
          <h3 className="text-lg font-semibold">Recent Posts</h3>
          {recentPosts.length === 0 ? (
            <div className="text-sm text-muted-foreground mt-3">No recent posts</div>
          ) : (
            <ul className="mt-3 space-y-2">
              {recentPosts.map((post: any) => (
                <li key={post.id} className="flex items-center justify-between">
                  <div>
                    <Link href={`/admin/blog/edit/${post.id}`} className="font-medium text-slate-900 hover:underline">{post.title}</Link>
                    <div className="text-sm text-muted-foreground">{new Date(post.published_at || post.created_at).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <Link href={`/blog/${post.slug}`} className="text-sm text-sky-600">View</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
