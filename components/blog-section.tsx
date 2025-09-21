"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export function BlogSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

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
    <section ref={sectionRef} className="py-20">
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Latest from Our Blog</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Stay updated with the latest tech tips and industry insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <article
              key={index}
              className={`card overflow-hidden transform-gpu hover:scale-105 hover:-translate-y-2 transition-all duration-500 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 150 + 200}ms` : "0ms",
                transitionDuration: "700ms",
              }}
            >
              <div className="aspect-[16/9] bg-muted overflow-hidden">
                <img
                  src={post.image || "/placeholder.svg"}
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

        <div
          className={`text-center mt-12 transition-all duration-1000 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: isVisible ? "900ms" : "0ms" }}
        >
          <Link href="/blog">
            <Button
              variant="outline"
              size="lg"
              className="hover:scale-105 transition-transform duration-200 group bg-transparent"
            >
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
