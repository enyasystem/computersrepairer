import { db } from "@/lib/database"
import Link from "next/link"

// Format numbers for display (thousands separators)
const formatNumber = (n: number) => n.toLocaleString()
const formatCurrency = (n: number) => {
  try {
    // Use Nigerian Naira formatting (₦). Use en-NG locale for appropriate separators.
    return n.toLocaleString('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 })
  } catch {
    // Fallback to Naira symbol with rounded integer value
    return `₦${Math.round(n)}`
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

  // Small presentational helper: skeleton block used when content is missing or loading
  function SkeletonBlock({ lines = 3 }: { lines?: number }) {
    return (
      <div className="animate-pulse" aria-hidden>
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-3 bg-slate-200 rounded w-full mb-2" />
        ))}
      </div>
    )
  }

  function EmptyState({ title, description, cta }: { title: string; description?: string; cta?: { href: string; label: string } }) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto w-40 h-28 flex items-center justify-center">
          <div className="w-20 h-20 rounded-lg bg-amber-100 flex items-center justify-center">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-amber-600">
              <rect x="6" y="10" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" fill="rgba(250, 204, 21, 0.08)" />
              <path d="M14 18h20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M14 22h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="36" cy="18" r="2" fill="currentColor" />
            </svg>
          </div>
        </div>
        <h4 className="mt-4 text-lg font-medium">{title}</h4>
        {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
        {cta && (
          <div className="mt-4">
            <Link href={cta.href} className="inline-flex items-center px-3 py-2 rounded-md bg-amber-400 text-black text-sm font-medium hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">{cta.label}</Link>
          </div>
        )}
      </div>
    )
  }

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
          {unstable ? (
            <div className="mt-3">
              <SkeletonBlock lines={4} />
            </div>
          ) : recentProducts.length === 0 ? (
            <EmptyState title="No recent products" description="There are no recently added products to show." cta={{ href: '/admin/products/new', label: 'Add product' }} />
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
          {unstable ? (
            <div className="mt-3">
              <SkeletonBlock lines={3} />
            </div>
          ) : recentPosts.length === 0 ? (
            <EmptyState title="No recent posts" description="You haven't published any posts yet." cta={{ href: '/admin/blog/new', label: 'Write a post' }} />
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
