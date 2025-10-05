import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { db } from "@/lib/database"
import BlogListLoader from '@/components/blog-list-loader'

export const metadata: Metadata = {
  title: "Blog - Computer Repair & IT Support Centre",
  description: "Latest tech tips, computer repair guides, and IT support insights from our experts.",
}

export default async function BlogPage() {
  // Fetch first page server-side and let the client loader fetch more
  const perPage = 6
  const paged = await db.getBlogPostsPaged(1, perPage, 'published')
  const initialPosts = Array.isArray(paged?.rows) ? paged.rows : []

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
        <BlogListLoader initial={initialPosts} />
        
      </div>
    </div>
  )
}
