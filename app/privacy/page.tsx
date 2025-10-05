import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | ComputersRepairer",
  description: "Privacy policy for ComputersRepairer. Learn how we collect, use, and protect your information.",
}

export default function PrivacyPage(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-6">Last updated: October 5, 2025</p>

        <section className="prose max-w-none mb-6">
          <h2>Introduction</h2>
          <p>
            At ComputersRepairer we respect your privacy and are committed to protecting your personal data. This
            Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our
            website or use our services.
          </p>
        </section>

        <section className="prose max-w-none mb-6">
          <h2>Information We Collect</h2>
          <p>We may collect information that you provide directly (for example, when you contact us or book a service), and
          information automatically collected (such as cookies and analytics).</p>
        </section>

        <section className="prose max-w-none mb-6">
          <h2>How We Use Your Information</h2>
          <ul>
            <li>To provide and maintain our services</li>
            <li>To communicate with you about bookings, support, and updates</li>
            <li>To improve our website and offerings</li>
          </ul>
        </section>

        <section className="prose max-w-none mb-6">
          <h2>Cookies and Tracking</h2>
          <p>We use cookies for site functionality and analytics. You can control cookie preferences in your browser.</p>
        </section>

        <section className="prose max-w-none mb-6">
          <h2>Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at info@computersrepairer.com.</p>
        </section>
      </div>
    </main>
  )
}
