"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useToast, toast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, MessageSquare, Calendar } from "lucide-react"
import { useState, useRef, useEffect } from "react"

const contactInfo = [
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Phone",
    details: ["+234 816 047 2457"],
    description: "Call us for immediate assistance",
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Email",
    details: ["info@computersrepairer.com",],
    description: "Send us your questions anytime",
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Location",
    details: ["Shop i83/84 Ikota shopping complex Road 5", "Lekki Epe express way, Lagos"],
    description: "Visit our repair center",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Hours",
    details: ["Mon-Fri: 8AM-7PM", "Sat: 9AM-5PM", "Sun: 12PM-4PM"],
    description: "We're here when you need us",
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    urgency: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would make an API call to save the inquiry
    const inquiryData = {
      ...formData,
      id: Date.now().toString(),
      status: "new",
      priority:
        formData.urgency === "emergency"
          ? "critical"
          : formData.urgency === "high"
            ? "high"
            : formData.urgency === "medium"
              ? "medium"
              : "low",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log("Form submitted:", inquiryData)

    // Show success message (in real app, handle API response)
  try { toast({ title: 'Inquiry received', description: "Thank you for your inquiry! We'll get back to you within 24 hours." }) } catch (e) {}

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      urgency: "",
      message: "",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">Get In Touch</h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Need help with your computer or IT issues? We're here to help! Contact us today for fast, reliable
              service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                <Phone className="h-5 w-5 mr-2" />
                Call Now: +234 816 047 2457
              </Button>
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Appointment
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-lg text-primary w-fit mx-auto mb-4">{info.icon}</div>
                  <CardTitle className="text-lg">{info.title}</CardTitle>
                  <CardDescription>{info.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {info.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="font-medium text-foreground">
                      {detail}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MessageSquare className="h-6 w-6" />
                  Send Us a Message
                </CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you within 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+234 803 000 0000"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="service">Service Needed</Label>
                      <Select onValueChange={(value) => handleInputChange("service", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="computer-repair">Computer Repair</SelectItem>
                          <SelectItem value="it-support">IT Support</SelectItem>
                          <SelectItem value="data-recovery">Data Recovery</SelectItem>
                          <SelectItem value="network-setup">Network Setup</SelectItem>
                          <SelectItem value="virus-removal">Virus Removal</SelectItem>
                          <SelectItem value="hardware-upgrade">Hardware Upgrade</SelectItem>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="urgency">Urgency Level</Label>
                      <Select onValueChange={(value) => handleInputChange("urgency", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="How urgent?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - Within a week</SelectItem>
                          <SelectItem value="medium">Medium - Within 2-3 days</SelectItem>
                          <SelectItem value="high">High - Within 24 hours</SelectItem>
                          <SelectItem value="emergency">Emergency - ASAP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Please describe your issue or what you need help with..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map & Additional Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <MapPin className="h-6 w-6" />
                    Visit Our Location
                  </CardTitle>
                  <CardDescription>Come visit us at our repair center for in-person service</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[16/9] rounded-lg mb-4 overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.63648064286!2d3.1191411480839006!3d6.548028242844956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1759597716871!5m2!1sen!2sng"
                      width="600"
                      height="450"
                      className="w-full h-full border-0"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Parking & Accessibility</h4>
                      <p className="text-sm text-muted-foreground">
                        Free parking available in front of the building. Wheelchair accessible entrance and facilities.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">What to Bring</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Your device and power cable</li>
                        <li>• Any error messages or symptoms</li>
                        <li>• Backup of important data (if possible)</li>
                        <li>• Valid ID for device pickup</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Emergency Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Need immediate help? Our emergency support line is available 24/7 for critical business systems and
                    urgent repairs.
                  </p>
                  <Button variant="destructive" size="lg" className="w-full">
                    <Phone className="h-5 w-5 mr-2" />
                    Emergency: +234 816 047 2457
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section (interactive accordion) */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Quick answers to common questions</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Interactive FAQ accordion (React state + measured height for smooth animation) */}
            {(
              [
                {
                  q: 'How long do repairs typically take?',
                  a: `Most repairs are completed within 24-48 hours. Simple issues like virus removal can often be done same-day.`,
                },
                {
                  q: 'Do you offer warranties on repairs?',
                  a: `Yes, we provide a 90-day warranty on all repairs and a 30-day warranty on used parts.`,
                },
                {
                  q: 'Can you recover my lost data?',
                  a: `We offer professional data recovery services with a high success rate. Contact us for a free evaluation.`,
                },
                {
                  q: 'Do you provide on-site service?',
                  a: `Yes, we offer on-site service for businesses and complex network installations. Contact us for pricing.`,
                },
              ] as { q: string; a: string }[]
            ).map((item, idx) => {
              const panelRef = useRef<HTMLDivElement | null>(null)
              const [open, setOpen] = useState(false)

              useEffect(() => {
                const panel = panelRef.current
                if (!panel) return
                if (open) {
                  const height = panel.scrollHeight
                  panel.style.maxHeight = height + 'px'
                } else {
                  panel.style.maxHeight = '0px'
                }
              }, [open])

              return (
                <div key={idx} className="border-b last:border-b-0">
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`faq-${idx}-panel`}
                    onClick={() => setOpen((v) => !v)}
                    className="w-full text-left py-4 flex items-center justify-between gap-4"
                  >
                    <span className="font-semibold">{item.q}</span>
                    <svg
                      className={`h-5 w-5 text-muted-foreground transform transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div
                    id={`faq-${idx}-panel`}
                    role="region"
                    aria-labelledby={`faq-${idx}`}
                    ref={panelRef}
                    className="overflow-hidden transition-[max-height,opacity] duration-300 opacity-100"
                    style={{ maxHeight: 0 }}
                  >
                    <div className="py-2 pb-6 text-muted-foreground text-sm">
                      {item.a}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
