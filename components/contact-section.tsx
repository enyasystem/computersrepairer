import { Button } from "@/components/ui/button"
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
                <p className="text-lg font-semibold">(555) 123-4567</p>
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
                <p className="text-lg font-semibold">123 Tech Street, Digital City, DC 12345</p>
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
              <Button size="lg" className="w-full text-lg">
                Schedule a Consultation
              </Button>
              <Button variant="outline" size="lg" className="w-full text-lg bg-transparent">
                Request a Quote
              </Button>
              <Button variant="ghost" size="lg" className="w-full text-lg">
                Emergency Support
              </Button>
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
