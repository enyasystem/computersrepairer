import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Monitor, Network, Wrench } from "lucide-react"

export function ServicesSection() {
  const services = [
    {
      icon: Monitor,
      title: "IT Support",
      description: "Comprehensive IT support for businesses and individuals. Remote and on-site assistance available.",
      features: ["24/7 Support", "Remote Assistance", "System Maintenance"],
    },
    {
      icon: Network,
      title: "Networking",
      description: "Network setup, configuration, and troubleshooting. Secure and reliable network solutions.",
      features: ["Network Setup", "WiFi Configuration", "Security Audits"],
    },
    {
      icon: Wrench,
      title: "Computer Repair",
      description: "Hardware and software repair services. Quick diagnosis and professional repairs.",
      features: ["Hardware Repair", "Software Issues", "Data Recovery"],
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Professional IT solutions tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription className="text-pretty">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      • {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full bg-transparent">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
