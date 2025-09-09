import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Blog - Computer Repair & IT Support Centre",
  description: "Latest tech tips, computer repair guides, and IT support insights from our experts.",
}

// Mock blog data - in a real app, this would come from a CMS or database
const blogPosts = [
  {
    slug: "common-computer-problems-solutions",
    title: "Top 10 Common Computer Problems and Their Solutions",
    excerpt: "Learn how to troubleshoot the most frequent computer issues that affect both home and business users.",
    content: "Full article content would go here...",
    date: "2024-01-15",
    readTime: "8 min read",
    image: "/computer-troubleshooting-guide.jpg",
    category: "Troubleshooting",
    author: "Tech Support Team",
  },
  {
    slug: "network-security-best-practices",
    title: "Network Security Best Practices for Small Businesses",
    excerpt: "Protect your business network from cyber threats with these essential security measures and protocols.",
    content: "Full article content would go here...",
    date: "2024-01-12",
    readTime: "12 min read",
    image: "/network-security-firewall.jpg",
    category: "Security",
    author: "IT Security Team",
  },
  {
    slug: "ssd-vs-hdd-upgrade-guide",
    title: "SSD vs HDD: Complete Upgrade Guide for 2024",
    excerpt: "Discover the benefits of upgrading to an SSD and learn how to migrate your data safely.",
    content: "Full article content would go here...",
    date: "2024-01-10",
    readTime: "6 min read",
    image: "/ssd-hard-drive-upgrade.jpg",
    category: "Hardware",
    author: "Hardware Specialists",
  },
  {
    slug: "windows-11-optimization-tips",
    title: "Windows 11 Optimization: Speed Up Your PC",
    excerpt: "Simple tweaks and settings to make your Windows 11 computer run faster and more efficiently.",
    content: "Full article content would go here...",
    date: "2024-01-08",
    readTime: "10 min read",
    image: "/windows-11-optimization-settings.jpg",
    category: "Software",
    author: "Software Team",
  },
  {
    slug: "data-backup-strategies",
    title: "Essential Data Backup Strategies for Businesses",
    excerpt: "Protect your valuable business data with proven backup strategies and disaster recovery plans.",
    content: "Full article content would go here...",
    date: "2024-01-05",
    readTime: "15 min read",
    image: "/data-backup-cloud-storage.jpg",
    category: "Data Management",
    author: "Data Recovery Team",
  },
  {
    slug: "laptop-maintenance-guide",
    title: "Laptop Maintenance: Keep Your Device Running Smoothly",
    excerpt: "Regular maintenance tips to extend your laptop's lifespan and prevent common hardware failures.",
    content: "Full article content would go here...",
    date: "2024-01-03",
    readTime: "7 min read",
    image: "/laptop-cleaning-maintenance.jpg",
    category: "Maintenance",
    author: "Repair Technicians",
  },
]

export default function BlogPage() {
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
          {blogPosts.map((post) => (
            <Card key={post.slug} className="group hover:shadow-lg transition-all duration-300 border-border/50">
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={post.image || "/placeholder.svg"}
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
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
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
