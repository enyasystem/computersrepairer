import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { BlogSection } from "@/components/blog-section"
import { ShopSection } from "@/components/shop-section"
import { ContactSection } from "@/components/contact-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <BlogSection />
      <ShopSection />
      <ContactSection />
    </>
  )
}
