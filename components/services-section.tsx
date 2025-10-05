"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Monitor, Network, Wrench } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function ServicesSection() {
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
    <section ref={sectionRef} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Professional IT solutions tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`card text-center transform-gpu hover:scale-105 hover:-translate-y-2 transition-all duration-500 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 150}ms` : "0ms",
                transitionDuration: "700ms",
              }}
            >
              <div className="flex flex-col items-center md:items-start">
                <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4 hover:bg-primary/20 transition-colors duration-300 transform-gpu">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                <ul className="space-y-2 mb-6 text-sm text-muted-foreground text-left w-full md:w-auto pl-0">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="hover:text-foreground transition-colors duration-200">
                      • {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/services"
                  role="button"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "default" }),
                    "w-full bg-transparent hover:scale-105 transition-transform duration-200 inline-flex items-center justify-center"
                  )}
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
