import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import ClientLayout from "./ClientLayout"

export const metadata: Metadata = {
  title: "ComputersRepairer - Professional IT Support & Computer Repair Services",
  description:
    "Expert computer repair, IT support, networking solutions, and tech products. Professional, reliable, and affordable technology services for businesses and individuals. Fast turnaround, certified technicians.",
  keywords:
    "computer repair, IT support, networking, laptop repair, desktop repair, virus removal, data recovery, hardware upgrade, software installation, tech support",
  authors: [{ name: "ComputersRepairer Team" }],
  creator: "ComputersRepairer",
  publisher: "ComputersRepairer",
  metadataBase: new URL("https://computersrepairer.com"),
  alternates: {
    canonical: "https://computersrepairer.com",
  },
  openGraph: {
    title: "ComputersRepairer - Professional IT Support & Computer Repair",
    description:
      "Expert computer repair, IT support, and networking services. Professional, reliable, and affordable solutions for all your technology needs.",
    url: "https://computersrepairer.com",
    siteName: "ComputersRepairer",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/computer-repair-technician-working.jpg",
        width: 1200,
        height: 630,
        alt: "Professional computer repair technician at work",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ComputersRepairer - Professional IT Support & Computer Repair",
    description:
      "Expert computer repair, IT support, and networking services. Professional, reliable, and affordable solutions.",
    images: ["/computer-repair-technician-working.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}
