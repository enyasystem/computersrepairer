import { BookingForm } from "@/components/booking-form"
import { AppointmentCalendar } from "@/components/appointment-calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Shield, CheckCircle } from "lucide-react"

export default function BookAppointmentPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted to-background py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">
              Book Your Computer Repair Appointment
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Schedule a consultation or drop-off appointment with our expert technicians. Fast, reliable service you
              can trust.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 justify-center">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Certified Technicians</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Clock className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Same-Day Service</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <CheckCircle className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">90-Day Warranty</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Calendar Section */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Available Dates</h2>
              <AppointmentCalendar showAppointments={false} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Booking Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Schedule Your Appointment
                    </CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you within 2 hours to confirm your appointment.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BookingForm />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Service Types</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground">Consultation</h4>
                      <p className="text-sm text-muted-foreground">Free diagnostic and repair estimate</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Drop-off</h4>
                      <p className="text-sm text-muted-foreground">Leave your device for repair service</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Pickup</h4>
                      <p className="text-sm text-muted-foreground">Collect your repaired device</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Business Hours</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Monday - Friday</span>
                      <span className="text-sm font-medium">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Saturday</span>
                      <span className="text-sm font-medium">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Sunday</span>
                      <span className="text-sm font-medium">Closed</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Phone:</span> +234 816 047 2457
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Email:</span> info@computersrepairer.com
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Address:</span> Shop i83/84 Ikota shopping complex Road 5, Lekki Epe express way.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
