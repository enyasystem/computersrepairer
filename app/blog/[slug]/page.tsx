import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, ArrowLeft, Twitter, Linkedin, Github, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { db } from "@/lib/database"

// Generate metadata for each blog post from the DB
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await db.getBlogPostBySlug(params.slug)
  if (!post) {
    return { title: "Post Not Found" }
  }
  return {
    title: `${post.title} - Computer Repair & IT Support Centre`,
    description: post.excerpt || (post.content ? String(post.content).slice(0, 160) : undefined),
  }
}

// Generate static params from the DB (published posts)
export async function generateStaticParams() {
  const paged = await db.getBlogPostsPaged(1, 1000, 'published')
  const rows = Array.isArray(paged?.rows) ? paged.rows : []
  return rows.map((r: any) => ({ slug: r.slug }))
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await db.getBlogPostBySlug(params.slug)
  if (!post) notFound()

  // Recent posts for sidebar (exclude current)
  const recentPaged = await db.getBlogPostsPaged(1, 4, 'published')
  const recentPosts = (Array.isArray(recentPaged?.rows) ? recentPaged.rows : []).filter((p: any) => p.slug !== post.slug).slice(0, 4)

  const publishDate = post.published_at || post.date || post.created_at
  const readTime = post.read_time || post.readTime || post.read_time_min || '—'

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Back Button */}
            <Link href="/blog" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>

            {/* Article Header */}
            <div className="mb-8">
              <Badge className="mb-4">{post.category}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">{post.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author_name || post.author || 'Admin'}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {publishDate ? new Date(publishDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : '—'}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {readTime}
                </div>
              </div>

              <Image
                src={post.featured_image || post.image || "/placeholder.svg"}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-64 md:h-80 object-cover rounded-lg"
              />
            </div>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: String(post.content || post.body || '') }}
            />

            {/* Author bio block (placed after article content) */}
            <div className="mt-8 mb-12 border-t pt-6">
              {(() => {
                const authorName = post.author_name || post.author || 'ComputersRepairer Team'
                const profiles: Record<string, { bio: string; twitter?: string; linkedin?: string; github?: string; email?: string } > = {
                  'Tech Support Team': { bio: 'Hands-on technicians sharing practical repair tips and guides.', twitter: 'https://twitter.com/computersrepair', linkedin: 'https://www.linkedin.com/company/computersrepairer', github: 'https://github.com/enyasystem' },
                  'IT Security Team': { bio: 'Security-focused engineers providing guidance on protecting systems and data.', twitter: 'https://twitter.com/computersrepair' },
                  'Hardware Specialists': { bio: 'Upgrade and maintenance guides from experienced hardware technicians.' },
                  'Software Team': { bio: 'Optimization, tooling, and software best-practices for small teams.' },
                  'Admin': {
                    bio: 'Graduate of the University of Cross River State (Second Class Upper). The site administrator combines over a decade of hands-on computer repair, systems maintenance and on-site troubleshooting with frontend engineering expertise — focusing on performance, accessibility, and practical tooling. He has led repair and optimization projects for small and medium businesses, authored numerous how-to guides, and maintains small open-source utilities to automate diagnostics. He runs training sessions for local businesses, mentors junior technicians, and is available for consulting. For quick contact use the email or social links.',
                    twitter: 'https://twitter.com/computersrepair',
                    linkedin: 'https://www.linkedin.com/company/computersrepairer',
                    github: 'https://github.com/enyasystem',
                    email: 'mailto:hello@computersrepairer.example',
                  },
                  'ComputersRepairer Team': {
                    bio: 'Graduate of the University of Cross River State (Second Class Upper). He combines over a decade of hands-on computer repair and systems maintenance with frontend engineering expertise—focusing on performance, accessibility, and pragmatic tooling. He has led repair and optimization projects for SMEs, authored hands-on troubleshooting guides, and builds small open-source utilities to speed diagnostic workflows. He mentors junior technicians, runs training sessions for local businesses, and is available for consulting and speaking engagements. For quick contact, use the email or social links.',
                    twitter: 'https://twitter.com/computersrepair',
                    linkedin: 'https://www.linkedin.com/company/computersrepairer',
                    github: 'https://github.com/enyasystem',
                  },
                }
                const profile = profiles[authorName] || { bio: 'Graduate of the University of Cross River State (Second Class Upper). Brings practical repair experience together with frontend engineering: performance, accessibility and tooling.' }
                // Use Unsplash source for avatar (no external config needed)
                const avatarUrl = `https://source.unsplash.com/collection/888146/160x160?sig=${encodeURIComponent(authorName)}`

                return (
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-full border ring-1 ring-primary/10">
                      <img src={avatarUrl} alt={`${authorName} avatar`} className="w-full h-full object-cover" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-lg truncate" title={authorName}>{authorName}</h4>
                        {/* show a small Admin badge when the author is the admin */}
                        {authorName === 'Admin' && (
                          <Badge className="text-xs py-0.5 px-2">Admin</Badge>
                        )}

                        <div className="flex items-center gap-2 ml-auto">
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
                          {profile.email && (
                            <a href={profile.email} aria-label={`${authorName} email`} className="text-muted-foreground hover:text-primary">
                              <Mail className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mt-2">{profile.bio}</p>
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* Call to Action */}
            <div className="mt-12 p-6 bg-primary/5 rounded-lg border border-primary/10">
              <h3 className="text-xl font-semibold mb-2">Need Professional Help?</h3>
              <p className="text-muted-foreground mb-4">
                Our expert technicians are ready to help with all your computer repair and IT support needs.
              </p>
              <Button asChild>
                <Link href="/contact">Get Expert Support</Link>
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Recent Posts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Posts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentPosts.map((recentPost: any) => (
                    <Link key={recentPost.slug} href={`/blog/${recentPost.slug}`} className="block group">
                      <div className="flex gap-3">
                        <Image
                          src={recentPost.featured_image || recentPost.image || "/placeholder.svg"}
                          alt={recentPost.title}
                          width={80}
                          height={60}
                          className="w-20 h-15 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">{recentPost.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{recentPost.published_at ? new Date(recentPost.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Contact CTA */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Need IT Support?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get professional help from our certified technicians.
                  </p>
                  <Button asChild size="sm" className="w-full">
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
