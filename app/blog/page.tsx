import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { db } from "@/lib/database"

export const metadata: Metadata = {
  title: "Blog - Computer Repair & IT Support Centre",
  description: "Latest tech tips, computer repair guides, and IT support insights from our experts.",
}

export default async function BlogPage() {
  // Fetch published posts from the database (server-side)
  const paged = await db.getBlogPostsPaged(1, 12, 'published')
  const posts = Array.isArray(paged?.rows) ? paged.rows : []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Tech Insights & Guides</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Expert advice, troubleshooting guides, and the latest tech insights from our computer repair specialists.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <Card key={post.slug} className="group hover:shadow-lg transition-all duration-300 border-border/50">
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={post.featured_image || post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={500}
                  height={300}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{post.category}</Badge>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-xl group-hover:text-primary transition-colors duration-200 line-clamp-2">
                  {post.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.published_at || post.date || post.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
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

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="px-8 bg-transparent">
            Load More Articles
          </Button>
        </div>
      </div>
    </div>
  )
}
