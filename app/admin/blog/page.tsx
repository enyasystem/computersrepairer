import { db } from '@/lib/database'
import AdminBlogClient from './client'

/**
 * Admin blog server page.
 *
 * Fetches a paginated list of blog posts from the database using the
 * `db.getBlogPostsPaged` helper and renders the client component.
 *
 * Accepts optional query params: `page` and `perPage`.
 */
export default async function AdminBlogPage({ searchParams }: { searchParams?: { page?: string; perPage?: string } }) {
	const page = Number(searchParams?.page || '1') || 1
	const perPage = Number(searchParams?.perPage || '10') || 10

	const paged = await db.getBlogPostsPaged(page, perPage, 'published', { bypassCache: true, usePrimary: true })

	return <AdminBlogClient posts={paged.rows as any} total={paged.total} page={paged.page} perPage={paged.perPage} />
}

