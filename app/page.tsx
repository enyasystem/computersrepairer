import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { BlogSection } from "@/components/blog-section"
import { ShopSection } from "@/components/shop-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <BlogSection />
        <ShopSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
