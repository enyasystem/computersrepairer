import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

export function BlogSection() {
  const blogPosts = [
    {
      slug: "computer-repair-signs",
      title: "5 Signs Your Computer Needs Professional Repair",
      description:
        "Learn to identify when your computer issues require expert attention and how to prevent major problems.",
      date: "March 15, 2024",
      readTime: "5 min read",
      image: "/computer-repair-technician-working.jpg",
    },
    {
      slug: "network-security-best-practices",
      title: "Network Security Best Practices for Small Businesses",
      description:
        "Essential security measures every small business should implement to protect their network and data.",
      date: "March 10, 2024",
      readTime: "7 min read",
      image: "/network-security-setup-office.jpg",
    },
    {
      slug: "proactive-it-support-benefits",
      title: "The Benefits of Proactive IT Support",
      description: "Why preventive IT maintenance saves money and prevents downtime for your business operations.",
      date: "March 5, 2024",
      readTime: "6 min read",
      image: "/it-support-team-monitoring-systems.jpg",
    },
  ]

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
          {blogPosts.map((post, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted">
                <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <CardTitle className="text-lg text-balance">{post.title}</CardTitle>
                <CardDescription className="text-pretty">{post.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/blog/${post.slug}`}>
                  <Button variant="ghost" className="p-0 h-auto font-semibold text-primary">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/blog">
            <Button variant="outline" size="lg">
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
