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
import { useState } from "react"

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
    details: ["12A Adeola Odeku Street", "Victoria Island, Lagos 106104"],
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
                Call Now: +234 803 000 0000
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
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-2" />
                      <p>Interactive Map</p>
                      <p className="text-sm">12A Adeola Odeku Street, Victoria Island, Lagos 106104</p>
                    </div>
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

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Quick answers to common questions</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">How long do repairs typically take?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Most repairs are completed within 24-48 hours. Simple issues like virus removal can often be done
                same-day.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer warranties on repairs?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Yes, we provide a 90-day warranty on all repairs and a 30-day warranty on used parts.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can you recover my lost data?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                We offer professional data recovery services with a high success rate. Contact us for a free evaluation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you provide on-site service?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Yes, we offer on-site service for businesses and complex network installations. Contact us for pricing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
