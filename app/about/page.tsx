import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Users, Clock } from "lucide-react"
import Image from "next/image"
import Link from 'next/link'

const teamMembers = [
  {
    name: "Kunle Adebayo",
    role: "Lead Technician",
    experience: "12+ years",
    certifications: ["CompTIA A+", "Microsoft Certified"],
    // Unsplash portrait (Nigerian-style headshot)
    image: "/lead-technician.jpg",
  },
  {
    name: "Ngozi Okonkwo",
    role: "Network Specialist",
    experience: "10+ years",
    certifications: ["Cisco CCNA", "CompTIA Network+"],
    image: "/lady-sec.jpg",
  },
  {
    name: "Chinedu Obi",
    role: "Data Recovery Expert",
    experience: "8+ years",
    certifications: ["Certified Data Recovery", "CompTIA Security+"],
    image: "/Chinedu-Obi.jpg",
  },
]

const stats = [
  { number: "5000+", label: "Devices Repaired" },
  { number: "15+", label: "Years Experience" },
  { number: "98%", label: "Customer Satisfaction" },
  { number: "24/7", label: "Support Available" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
                About ComputersRepairer
              </h1>
              <p className="text-xl text-muted-foreground mb-8 text-pretty">
                Your trusted local computer repair and IT support center, serving the community with expert technical
                solutions since 2009.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/services">View Services</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/computer repairers logo.png"
                alt="ComputersRepairer shop interior"
                width={600}
                height={500}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Story</h2>
              <p className="text-lg text-muted-foreground">Building trust through expertise and exceptional service</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Founded on Excellence</h3>
                <p className="text-muted-foreground mb-6">
                  ComputersRepairer was founded in 2009 with a simple mission: to provide reliable, affordable, and
                  expert computer repair services to our local community. What started as a small repair shop has grown
                  into a comprehensive IT support center.
                </p>
                <p className="text-muted-foreground mb-6">
                  Over the years, we've helped thousands of customers solve their technology challenges, from simple
                  virus removals to complex network installations. Our commitment to quality and customer satisfaction
                  has made us the go-to choice for computer repair in the area.
                </p>
                <div className="flex items-center gap-4">
                  <Award className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-semibold">Certified Excellence</div>
                    <div className="text-sm text-muted-foreground">Industry-recognized certifications</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/computer repairers logo.png"
                  alt="Our journey"
                  width={500}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Meet Our Expert Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our certified technicians bring decades of combined experience to solve your technology challenges
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-base font-medium text-primary">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{member.experience}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.certifications.map((cert, certIndex) => (
                      <Badge key={certIndex} variant="secondary" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Values</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer First</h3>
              <p className="text-muted-foreground">
                Every decision we make is guided by what's best for our customers and their technology needs.
              </p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Excellence</h3>
              <p className="text-muted-foreground">
                We maintain the highest standards in our work and continuously improve our skills and knowledge.
              </p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reliability</h3>
              <p className="text-muted-foreground">
                You can count on us to deliver on our promises and be there when you need us most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience the Difference?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of satisfied customers who trust ComputersRepairer for their technology needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="px-8">
              <Link href="/services">Get Started Today</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
