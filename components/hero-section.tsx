import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Users } from "lucide-react"

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-background to-muted py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left side - Hero Image */}
          <div className="order-2 lg:order-1">
            <img
              src="/computer-repair-technician-working.jpg"
              alt="Computer repair technician working on hardware"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>

          {/* Right side - Text Content */}
          <div className="order-1 lg:order-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance mb-6">
              Your Trusted Partner in <span className="text-primary">IT Support & Repair</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Expert solutions for businesses and individuals. Fast, reliable, and professional computer repair and IT
              support services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="text-lg px-8">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                Learn More
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Trusted & Secure</h3>
            <p className="text-sm text-muted-foreground">
              Your data and systems are safe with our certified professionals
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Fast Response</h3>
            <p className="text-sm text-muted-foreground">Quick turnaround times to get you back up and running</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Expert Team</h3>
            <p className="text-sm text-muted-foreground">Experienced technicians with years of industry knowledge</p>
          </div>
        </div>
      </div>
    </section>
  )
}
