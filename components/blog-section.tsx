import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/database"

export async function BlogSection() {
  // Fetch first 3 published posts using primary to ensure consistency after admin edits
  const payload = await db.getBlogPostsPaged(1, 3, 'published', { usePrimary: true })
  const posts: {
    slug: string
    title: string
    description: string
    date: string
    readTime: string
    image: string
  }[] = (payload?.rows || []).map((p: any) => ({
    slug: p.slug,
    title: p.title,
    description: p.excerpt || (p.content ? String(p.content).slice(0, 140) : ''),
    date: new Date(p.published_at || p.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
    readTime: p.read_time || '5 min read',
    image: p.featured_image || '/placeholder.jpg',
  }))

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Latest from Our Blog</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Stay updated with the latest tech tips and industry insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.length === 0 && (
            <div className="col-span-3 text-center text-muted-foreground">No posts available.</div>
          )}

          {posts.map((post: { slug: string; title: string; description: string; date: string; readTime: string; image: string }, index: number) => (
            <article
              key={index}
              className="card overflow-hidden transform-gpu hover:scale-105 hover:-translate-y-2 transition-all duration-500"
              style={{ transitionDelay: `${index * 150 + 200}ms`, transitionDuration: '700ms' }}
            >
              <div className="aspect-[16/9] bg-muted overflow-hidden">
                <img
                  src={post.image || '/placeholder.svg'}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-lg font-semibold text-balance hover:text-primary transition-colors duration-200 mb-2">
                  {post.title}
                </h3>
                <p className="text-pretty mb-4">{post.description}</p>

                <div className="mt-2">
                  <Link href={`/blog/${post.slug}`}>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto font-semibold text-primary hover:translate-x-1 transition-transform duration-200 group"
                    >
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/blog">
            <Button variant="outline" size="lg" className="hover:scale-105 transition-transform duration-200 group bg-transparent">
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
