"use client"

import type React from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const searchParams = useSearchParams()

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "ComputersRepairer",
    description: "Professional computer repair, IT support, and networking services",
    url: "https://computersrepairer.com",
    telephone: "+1-555-REPAIR-1",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Tech Street",
      addressLocality: "Tech City",
      addressRegion: "TC",
      postalCode: "12345",
      addressCountry: "US",
    },
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: "40.7128",
        longitude: "-74.0060",
      },
      geoRadius: "50000",
    },
    services: ["Computer Repair", "IT Support", "Network Setup", "Data Recovery", "Virus Removal", "Hardware Upgrade"],
    priceRange: "$$",
    openingHours: "Mo-Fr 09:00-18:00, Sa 10:00-16:00",
  }

  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
          <main>{children}</main>
          <Footer />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
