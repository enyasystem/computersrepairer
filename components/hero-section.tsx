"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Users, Calendar } from "@/components/icons"
import { useEffect, useState } from "react"
import Link from "next/link"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="bg-gradient-to-br from-background to-muted py-16 lg:py-28 overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left side - Hero Image */}
          <div
            className={`order-2 lg:order-1 transition-all duration-1000 ease-out ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
            }`}
          >
            <div className="rounded-lg overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500 transform-gpu">
              <img
                src="/computer-repair-technician-working.jpg"
                alt="Technician repairing a computer"
                className="w-full h-[420px] object-cover sm:h-[360px] lg:h-[480px] transition-transform duration-500 hover:scale-105"
                loading="eager"
              />
            </div>
          </div>

          {/* Right side - Text Content */}
          <div
            className={`order-1 lg:order-2 transition-all duration-1000 ease-out delay-300 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            }`}
          >
            <h1 className="mb-6 animate-fade-in-up">
              <span className="block text-4xl md:text-5xl lg:text-6xl font-extrabold text-balance leading-tight">
                Your Trusted Partner
              </span>
              <span className="block text-3xl md:text-4xl font-semibold text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mt-2">
                in IT Support & Repair
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 text-pretty animate-fade-in-up animation-delay-200">
              Expert solutions for businesses and individuals — fast, reliable, and professional computer repair and IT
              support services tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up animation-delay-400">
              <Button
                asChild
                size="lg"
                className="text-lg px-8 bg-emerald-600 hover:bg-emerald-700 hover:scale-105 transition-all duration-200 hover:shadow-lg"
              >
                <Link href="/book-appointment">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Appointment
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 bg-transparent hover:scale-105 transition-transform duration-200"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          {[
            {
              icon: Shield,
              title: "Trusted & Secure",
              description: "Your data and systems are safe with our certified professionals",
              delay: "delay-500",
            },
            {
              icon: Zap,
              title: "Fast Response",
              description: "Quick turnaround times to get you back up and running",
              delay: "delay-700",
            },
            {
              icon: Users,
              title: "Expert Team",
              description: "Experienced technicians with years of industry knowledge",
              delay: "delay-900",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center transition-all duration-1000 ease-out ${feature.delay} ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              } hover:scale-105 transform transition-transform hover:shadow-lg rounded-lg p-4`}
            >
              <div className="bg-primary/10 p-4 rounded-full mb-4 hover:bg-primary/20 transition-colors duration-300 hover:rotate-12 transform transition-transform">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
