import { db } from "@/lib/database"

// Server-side admin dashboard that fetches analytics and recent items from Neon
export default async function AdminDashboard() {
  // Attempt DB calls individually so we can render the page with a friendly
  // banner if connectivity is unstable instead of failing the whole page.
  let unstable = false
  let unstableMessage = ''

  let rawAnalytics: any = {}
  let products: any[] = []
  let posts: any[] = []

  try {
    rawAnalytics = (await db.getAnalytics()) || {}
  } catch (err: any) {
    console.error('Analytics fetch error', err)
    unstable = true
    unstableMessage += 'Analytics unavailable. '
  }

  try {
    products = (await db.getProducts()) || []
  } catch (err: any) {
    console.error('Products fetch error', err)
    unstable = true
    unstableMessage += 'Products unavailable. '
  }

  try {
    posts = (await db.getBlogPosts('published')) || []
  } catch (err: any) {
    console.error('Posts fetch error', err)
    unstable = true
    unstableMessage += 'Posts unavailable. '
  }

  // Ensure numeric values are numbers (Neon may return strings)
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
    <div className="p-6 bg-background">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {unstable && (
        <div className="mt-4 p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800">
          <strong>Connectivity Issue:</strong> We had trouble reaching the database. Data may be incomplete — {unstableMessage}
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-card rounded">
          <div className="text-sm text-muted-foreground">Products</div>
          <div className="text-lg font-semibold">{products.length}</div>
        </div>

        <div className="p-4 bg-card rounded">
          <div className="text-sm text-muted-foreground">Published Posts</div>
          <div className="text-lg font-semibold">{posts.length}</div>
        </div>

        <div className="p-4 bg-card rounded">
          <div className="text-sm text-muted-foreground">Total Revenue</div>
          <div className="text-lg font-semibold">${analytics.totalRevenue}</div>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="font-semibold">Recent Products</h2>
        {recentProducts.length === 0 ? (
          <div className="text-sm text-muted-foreground">No recent products</div>
        ) : (
          <ul className="list-disc pl-6">
            {recentProducts.map((p: any) => (
              <li key={p.id} className="text-sm">{p.name}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6">
        <h2 className="font-semibold">Recent Posts</h2>
        {recentPosts.length === 0 ? (
          <div className="text-sm text-muted-foreground">No published posts</div>
        ) : (
          <ul className="list-disc pl-6">
            {recentPosts.map((p: any) => (
              <li key={p.id} className="text-sm">{p.title}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
