import { Button, buttonVariants } from "@/components/ui/button"
import Link from 'next/link'
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export function ContactSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Get in Touch</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Ready to solve your IT problems? Contact us today for expert support
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  Phone Support
                </CardTitle>
                <CardDescription>Call us for immediate assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">+234 816 047 2457</p>
                <p className="text-sm text-muted-foreground">Available 24/7 for emergencies</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Support
                </CardTitle>
                <CardDescription>Send us your questions anytime</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">support@computersrepairer.com</p>
                <p className="text-sm text-muted-foreground">We respond within 2 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  Visit Our Store
                </CardTitle>
                <CardDescription>Drop by for in-person service</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">Shop i83/84 Ikota shopping complex Road 5, Lekki Epe express way.</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Mon-Fri: 9AM-6PM, Sat: 10AM-4PM</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-primary/5 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-6 text-center">Ready to Get Started?</h3>
            <div className="space-y-4">
              <Link
                href="/book-appointment"
                role="button"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full text-lg px-6 cursor-pointer inline-flex items-center justify-center transform-gpu transition-transform duration-150 hover:scale-105 hover:shadow-lg relative z-10 pointer-events-auto"
                )}
              >
                Schedule a Consultation
              </Link>
              <Link
                href="/contact#contact-form"
                role="button"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full text-lg px-6 bg-transparent transition-colors duration-150 hover:bg-accent hover:text-accent-foreground hover:shadow relative z-10 pointer-events-auto inline-flex items-center justify-center"
                )}
              >
                Request a Quote
              </Link>
              {/* <Button variant="ghost" size="lg" className="w-full text-lg">
                Emergency Support
              </Button> */}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Free diagnostics • No fix, no fee • 30-day warranty on all repairs
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
