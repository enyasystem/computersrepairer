'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

type Post = any

export default function BlogListLoader({ initial }: { initial: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initial || [])
  const [page, setPage] = useState(1)
  const [perPage] = useState(6)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    // initial page already loaded
    setPage(1)
    setHasMore(initial.length >= perPage)
  }, [initial, perPage])

  async function loadMore() {
    setLoading(true)
    const next = page + 1
    try {
      const res = await fetch(`/api/blog/list?page=${next}&perPage=${perPage}`)
      const data = await res.json()
      if (data && Array.isArray(data.rows)) {
        setPosts((p) => [...p, ...data.rows])
        setPage(next)
        setHasMore((data.rows.length || 0) >= perPage && (posts.length + data.rows.length) < (data.total || Infinity))
      } else {
        setHasMore(false)
      }
    } catch (err) {
      console.error('Failed to load more posts', err)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Card key={post.slug} className="group hover:shadow-lg transition-all duration-300 border-border/50">
            <div className="relative overflow-hidden rounded-t-lg">
              <Image src={post.featured_image || post.image || '/placeholder.svg'} alt={post.title} width={500} height={300} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{post.category}</Badge>
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-xl group-hover:text-primary transition-colors duration-200 line-clamp-2">{post.title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.published_at || post.date || post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.read_time || post.readTime || post.read_time_min || '—'}
                </div>
              </div>

              <Link href={`/blog/${post.slug}`}>
                <Button variant="outline" className="w-full group/btn bg-transparent">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        {hasMore ? (
          <Button size="lg" variant="outline" className="px-8 bg-transparent" onClick={loadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load More Articles'}
          </Button>
        ) : (
          <div className="text-sm text-muted-foreground">No more articles</div>
        )}
      </div>
    </>
  )
}
