import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | ComputersRepairer",
  description: "Terms of Service for ComputersRepairer. Please read these terms carefully before using our services.",
}

export default function TermsPage(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-6">Last updated: October 5, 2025</p>

        <section className="prose max-w-none mb-6">
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing or using ComputersRepairer, you agree to be bound by these Terms of Service. If you do not
            agree, you should not use our services.
          </p>
        </section>

        <section className="prose max-w-none mb-6">
          <h2>Services</h2>
          <p>We provide computer repair, IT support, and related services. Service specifics, pricing and timelines are
          outlined during booking and may vary.</p>
        </section>

        <section className="prose max-w-none mb-6">
          <h2>Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, ComputersRepairer shall not be liable for indirect or consequential
          damages arising from use of our services.</p>
        </section>

        <section className="prose max-w-none mb-6">
          <h2>Governing Law</h2>
          <p>These Terms are governed by the laws of the jurisdiction where ComputersRepairer operates.</p>
        </section>

        <section className="prose max-w-none mb-6">
          <h2>Contact</h2>
          <p>Questions about these Terms should be sent to info@computersrepairer.com.</p>
        </section>
      </div>
    </main>
  )
}
