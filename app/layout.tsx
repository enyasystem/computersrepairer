import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import ClientLayout from "./ClientLayout"

export const metadata: Metadata = {
  title: {
    default: "ComputersRepairer - Professional IT Support & Computer Repair Services",
    template: "%s | ComputersRepairer",
  },
  description:
    "Expert computer repair, IT support, networking solutions, and tech products. Professional, reliable, and affordable technology services for businesses and individuals. Fast turnaround, certified technicians, same-day service available.",
  keywords:
    "computer repair, IT support, networking, laptop repair, desktop repair, virus removal, data recovery, hardware upgrade, software installation, tech support, same day repair, certified technicians, business IT solutions, home computer repair, emergency IT support",
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
      "Expert computer repair, IT support, and networking services. Professional, reliable, and affordable solutions for all your technology needs. Same-day service available.",
    url: "https://computersrepairer.com",
    siteName: "ComputersRepairer",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/computer-repairers-logo.png",
        width: 1200,
        height: 630,
        alt: "ComputersRepairer - Professional IT Support & Computer Repair Services",
        type: "image/jpeg",
      },
      // fallback with safer filename (some crawlers prefer no spaces)
      {
        url: "/computer-repairers-logo.png",
        width: 1200,
        height: 630,
        alt: "ComputersRepairer - Professional IT Support & Computer Repair Services",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@computersrepairer",
    creator: "@computersrepairer",
    title: "ComputersRepairer - Professional IT Support & Computer Repair",
    description:
      "Expert computer repair, IT support, and networking services. Professional, reliable, and affordable solutions.",
    images: [
      {
        url: "/computer-repairers-logo.png",
        alt: "ComputersRepairer - Professional IT Support & Computer Repair Services",
      },
      { url: "/computer-repairers-logo.png", alt: "ComputersRepairer - Professional IT Support & Computer Repair Services" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      // Preferred: user-provided PNG (existing file in public/)
      { url: "/computer-repairers-logo.png", sizes: "any", type: "image/png" },
      { url: "/favicon.png", sizes: "any", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#059669" }],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "technology",
  classification: "Computer Repair Services",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}
