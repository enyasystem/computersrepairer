'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, ArrowRight, Twitter, Linkedin, Github } from 'lucide-react'
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
        {posts.map((post) => {
          const authorName = post.author_name || post.author || 'ComputersRepairer Team'
          // small local author profiles lookup (fallbacks)
          const authorProfiles: Record<string, { bio: string; image: string; twitter?: string; linkedin?: string; github?: string } > = {
            'Tech Support Team': { bio: 'Experienced technicians sharing practical repair tips.', image: '/lead-technician.jpg' },
            'IT Security Team': { bio: 'Security specialists focused on protecting your data.', image: '/network-security-setup-office.jpg' },
            'Hardware Specialists': { bio: 'Hardware experts covering upgrades and maintenance.', image: '/lead-technician.jpg' },
            'Software Team': { bio: 'Software tips and optimization advice.', image: '/placeholder-user.jpg' },
            'ComputersRepairer Team': {
              bio: 'Graduate of the University of Cross River State (Second Class Upper). Brings practical repair experience together with frontend engineering: performance, accessibility and tooling. He has led repair and optimization projects for SMEs, authored hands-on troubleshooting guides, and builds small utilities to speed diagnostic workflows.',
              image: '/placeholder-user.jpg',
              twitter: 'https://twitter.com/computersrepair',
              linkedin: 'https://www.linkedin.com/company/computersrepairer',
              github: 'https://github.com/enyasystem'
            },
          }
          const profile = authorProfiles[authorName] || { bio: 'Graduate of the University of Cross River State (Second Class Upper). He combines years of hands-on IT repair with practical frontend skills. He focuses on performance, accessibility and building small open-source tools. He writes clear, actionable guides for small businesses and home users.', image: '/placeholder-user.jpg' }

          return (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block cursor-pointer">
              <Card className="group hover:shadow-lg transition-all duration-300 border-border/50">
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

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-3">
                      <Image src={profile.image} alt={authorName} width={48} height={48} className="w-12 h-12 rounded-full object-cover border" />
                      <div>
                        <div className="font-medium text-foreground flex items-center gap-3">
                          <span>{authorName}</span>
                          <div className="flex items-center gap-2">
                            {profile.twitter && (
                              <a href={profile.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${authorName} on Twitter`} className="text-muted-foreground hover:text-primary">
                                <Twitter className="w-4 h-4" />
                              </a>
                            )}
                            {profile.linkedin && (
                              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${authorName} on LinkedIn`} className="text-muted-foreground hover:text-primary">
                                <Linkedin className="w-4 h-4" />
                              </a>
                            )}
                            {profile.github && (
                              <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label={`${authorName} on GitHub`} className="text-muted-foreground hover:text-primary">
                                <Github className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                        {/* bio intentionally omitted here; shown on post page only */}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
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
