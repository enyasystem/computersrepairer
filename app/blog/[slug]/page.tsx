import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock blog data - same as in blog listing page
const blogPosts = [
  {
    slug: "common-computer-problems-solutions",
    title: "Top 10 Common Computer Problems and Their Solutions",
    excerpt: "Learn how to troubleshoot the most frequent computer issues that affect both home and business users.",
    content: `
      <h2>Introduction</h2>
      <p>Computer problems can be frustrating, especially when they disrupt your work or daily activities. In this comprehensive guide, we'll walk you through the top 10 most common computer issues and provide step-by-step solutions to resolve them.</p>
      
      <h2>1. Slow Computer Performance</h2>
      <p>One of the most common complaints we hear is about slow computer performance. This can be caused by several factors:</p>
      <ul>
        <li>Too many startup programs</li>
        <li>Insufficient RAM</li>
        <li>Hard drive fragmentation</li>
        <li>Malware or viruses</li>
      </ul>
      
      <h3>Solution:</h3>
      <p>Start by checking your startup programs and disabling unnecessary ones. Run a full system scan for malware, and consider upgrading your RAM or switching to an SSD for better performance.</p>
      
      <h2>2. Computer Won't Start</h2>
      <p>When your computer refuses to boot up, it can be particularly stressful. Common causes include:</p>
      <ul>
        <li>Power supply issues</li>
        <li>Faulty RAM</li>
        <li>Hard drive failure</li>
        <li>Motherboard problems</li>
      </ul>
      
      <h3>Solution:</h3>
      <p>Check all power connections first. If the computer still won't start, try removing and reseating the RAM. If problems persist, it may require professional diagnosis.</p>
      
      <h2>3. Blue Screen of Death (BSOD)</h2>
      <p>The infamous blue screen can indicate serious system problems. It's often caused by hardware failures, driver issues, or corrupted system files.</p>
      
      <h3>Solution:</h3>
      <p>Note the error code displayed on the blue screen and research it online. Common fixes include updating drivers, running system file checker, or checking for hardware issues.</p>
      
      <h2>Conclusion</h2>
      <p>While these solutions can resolve many common issues, don't hesitate to contact our professional technicians if you're uncomfortable performing these steps or if problems persist. We're here to help keep your computers running smoothly.</p>
    `,
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
    content: `
      <h2>Why Network Security Matters</h2>
      <p>In today's digital landscape, network security is crucial for protecting your business data, customer information, and maintaining operational continuity. Small businesses are often targeted by cybercriminals because they typically have fewer security measures in place.</p>
      
      <h2>Essential Security Measures</h2>
      
      <h3>1. Implement Strong Firewalls</h3>
      <p>A robust firewall is your first line of defense against external threats. Configure it to block unnecessary ports and monitor incoming and outgoing traffic.</p>
      
      <h3>2. Use Strong, Unique Passwords</h3>
      <p>Implement a password policy that requires:</p>
      <ul>
        <li>Minimum 12 characters</li>
        <li>Mix of uppercase, lowercase, numbers, and symbols</li>
        <li>Regular password changes</li>
        <li>No password reuse</li>
      </ul>
      
      <h3>3. Enable Two-Factor Authentication</h3>
      <p>Add an extra layer of security by requiring a second form of verification for all critical systems and accounts.</p>
      
      <h3>4. Keep Software Updated</h3>
      <p>Regularly update all software, operating systems, and security patches to protect against known vulnerabilities.</p>
      
      <h3>5. Employee Training</h3>
      <p>Train your staff to recognize phishing attempts, social engineering tactics, and other common cyber threats.</p>
      
      <h2>Monitoring and Maintenance</h2>
      <p>Regular security audits and monitoring are essential for maintaining a secure network environment. Consider implementing automated monitoring tools and conducting quarterly security assessments.</p>
    `,
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
    content: `
      <h2>SSD vs HDD: The Key Differences</h2>
      <p>Understanding the differences between Solid State Drives (SSDs) and Hard Disk Drives (HDDs) is crucial when considering an upgrade.</p>
      
      <h3>Speed and Performance</h3>
      <p>SSDs are significantly faster than HDDs, with boot times often under 30 seconds compared to 2-3 minutes for HDDs. File transfers and application loading are also much quicker.</p>
      
      <h3>Durability and Reliability</h3>
      <p>SSDs have no moving parts, making them more resistant to physical damage and less likely to fail due to drops or vibrations.</p>
      
      <h3>Power Consumption</h3>
      <p>SSDs consume less power, leading to better battery life in laptops and lower electricity costs for desktop computers.</p>
      
      <h2>When to Upgrade</h2>
      <p>Consider upgrading to an SSD if you experience:</p>
      <ul>
        <li>Slow boot times</li>
        <li>Long application loading times</li>
        <li>Frequent system freezes</li>
        <li>Poor overall system responsiveness</li>
      </ul>
      
      <h2>Migration Process</h2>
      <p>Migrating from HDD to SSD involves several steps:</p>
      <ol>
        <li>Choose the right SSD size and type</li>
        <li>Create a backup of your current data</li>
        <li>Use cloning software to transfer your system</li>
        <li>Install the new SSD</li>
        <li>Verify the migration was successful</li>
      </ol>
      
      <h2>Professional Installation</h2>
      <p>While SSD upgrades can be DIY projects, professional installation ensures optimal performance and data safety. Our technicians can handle the entire process, including data migration and system optimization.</p>
    `,
    date: "2024-01-10",
    readTime: "6 min read",
    image: "/ssd-hard-drive-upgrade.jpg",
    category: "Hardware",
    author: "Hardware Specialists",
  },
]

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} - Computer Repair & IT Support Centre`,
    description: post.excerpt,
  }
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  // Get recent posts for sidebar (excluding current post)
  const recentPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 4)

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
                  {post.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </div>
              </div>

              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-64 md:h-80 object-cover rounded-lg"
              />
            </div>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

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
                  {recentPosts.map((recentPost) => (
                    <Link key={recentPost.slug} href={`/blog/${recentPost.slug}`} className="block group">
                      <div className="flex gap-3">
                        <Image
                          src={recentPost.image || "/placeholder.svg"}
                          alt={recentPost.title}
                          width={80}
                          height={60}
                          className="w-20 h-15 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                            {recentPost.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(recentPost.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
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
