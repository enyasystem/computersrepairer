"use client"

import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'

/**
 * AdminBlogClient
 *
 * Client-side UI for the admin blog list. Receives a paginated payload from the
 * server component and renders a simple list with actions and pagination controls.
 *
 * Props:
 * - posts: array of blog post rows from the DB
 * - total: total number of posts matching the filter
 * - page: current page (1-based)
 * - perPage: items per page
 */
export default function AdminBlogClient({ posts, total, page, perPage }: { posts: any[]; total?: number; page?: number; perPage?: number }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">Manage blog posts and publications</p>
        </div>
        <Link href="/admin/blog/new" className="px-4 py-2 rounded bg-blue-600 text-white">New Post</Link>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No posts found.</div>
        ) : (
          posts.map((post: any) => (
            <div key={post.id} className="flex items-start gap-4 border rounded p-4">
              <div className="w-24 h-16 relative flex-shrink-0 overflow-hidden rounded">
                <Image src={post.featured_image || '/placeholder.svg'} alt={post.title} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{post.title}</h3>
                  <div className="text-sm text-muted-foreground">{format(new Date(post.published_at || post.created_at), 'yyyy-MM-dd')}</div>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt || post.content?.slice(0, 200)}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Link href={`/admin/blog/edit/${post.id}`} className="text-sm px-2 py-1 rounded bg-slate-100">Edit</Link>
                  <Link href={`/blog/${post.slug}`} className="text-sm px-2 py-1 rounded bg-slate-50">View</Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Simple pagination */}
      {typeof total !== 'undefined' && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Showing page {page} — {posts.length} of {total} posts</div>
          <div className="flex items-center space-x-2">
            <Link href={`?page=${Math.max(1, (page || 1) - 1)}&perPage=${perPage || 10}`} className="px-3 py-1 rounded border hover:bg-slate-50">Previous</Link>
            <Link href={`?page=${(page || 1) + 1}&perPage=${perPage || 10}`} className="px-3 py-1 rounded border hover:bg-slate-50">Next</Link>
          </div>
        </div>
      )}
    </div>
  )
}
