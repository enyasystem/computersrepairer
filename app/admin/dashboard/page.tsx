import { db } from "@/lib/database"

// Simple server-side admin dashboard that fetches analytics and recent items
export default async function AdminDashboard() {
  try {
    const analytics = (await db.getAnalytics()) || {}
    const products = (await db.getProducts()) || []
    const posts = (await db.getBlogPosts("published")) || []

    const recentProducts = products.slice(0, 5)
    const recentPosts = posts.slice(0, 5)

    return (
      <div className="p-6 bg-background">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <div className="mt-4 grid gap-2">
          <div>Total Revenue: {analytics.totalRevenue ?? 0}</div>
          <div>Total Repairs: {analytics.totalRepairs ?? 0}</div>
          <div>Products: {products.length}</div>
          <div>Published Posts: {posts.length}</div>
        </div>

        <section className="mt-6">
          <h2 className="font-semibold">Recent Products</h2>
          <ul className="list-disc pl-6">
            {recentProducts.map((p: any) => (
              <li key={p.id} className="text-sm">{p.name}</li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="font-semibold">Recent Posts</h2>
          <ul className="list-disc pl-6">
            {recentPosts.map((p: any) => (
              <li key={p.id} className="text-sm">{p.title}</li>
            ))}
          </ul>
        </section>
      </div>
    )
  } catch (err) {
    console.error("Dashboard server error", err)
    return <div className="p-6">Unable to load dashboard</div>
  }
}
