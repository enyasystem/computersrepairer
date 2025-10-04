"use client"

import { Button } from "@/components/ui/button"
import {
  Monitor,
  Menu,
  X,
  ChevronDown,
  Wrench,
  Laptop,
  Wifi,
  ShoppingBag,
  Headphones,
  Phone,
  Search,
  Calendar,
} from "@/components/icons"
import Link from "next/link"
import { useState, useEffect } from "react"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  // mobile accordion state: sections start collapsed
  const [mobileSectionsOpen, setMobileSectionsOpen] = useState<{ services: boolean; shop: boolean }>({
    services: false,
    shop: false,
  })

  const toggleMobileSection = (section: 'services' | 'shop') => {
    setMobileSectionsOpen((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const servicesDropdown = [
    {
      name: "Computer Repair",
      href: "/services#computer-repair",
      icon: Laptop,
      description: "Hardware & software diagnostics and repairs",
    },
    {
      name: "IT Support",
      href: "/services#it-support",
      icon: Headphones,
      description: "24/7 technical assistance and remote support",
    },
    {
      name: "Network Setup",
      href: "/services#networking",
      icon: Wifi,
      description: "Business & home network configuration",
    },
    {
      name: "Data Recovery",
      href: "/services#data-recovery",
      icon: Wrench,
      description: "Professional data recovery services",
    },
  ]

  const shopDropdown = [
    { name: "Laptops", href: "/shop?category=laptops", description: "Gaming & business laptops" },
    { name: "Accessories", href: "/shop?category=accessories", description: "Keyboards, mice & peripherals" },
  { name: "Software", href: "/shop?category=software", description: "OS, drivers & utilities" },
    { name: "All Products", href: "/shop", description: "Browse complete catalog" },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b shadow-sm"
          : "bg-background/80 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Link href="/" className="flex items-center gap-3 font-bold text-xl lg:text-2xl group">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Monitor className="h-6 w-6 lg:h-7 lg:w-7 text-primary" />
            </div>
            <span className="text-balance bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              ComputersRepairer
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
            >
              Home
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown("services")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200">
                Services
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>

              {activeDropdown === "services" && (
                <div className="absolute top-full left-0 mt-1 w-96 bg-background/95 backdrop-blur-md border rounded-xl shadow-xl p-6 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
                  <div className="grid gap-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Our Services
                    </div>
                    {servicesDropdown.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-start gap-4 p-4 rounded-lg hover:bg-primary/5 transition-all duration-200 group/item"
                      >
                        <div className="p-2 bg-primary/10 rounded-lg group-hover/item:bg-primary/20 transition-colors">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-foreground group-hover/item:text-primary transition-colors">
                            {item.name}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shop Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown("shop")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200">
                Shop
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>

              {activeDropdown === "shop" && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-background/95 backdrop-blur-md border rounded-xl shadow-xl p-6 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
                  <div className="grid gap-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Product Categories
                    </div>
                    {shopDropdown.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-start gap-4 p-4 rounded-lg hover:bg-primary/5 transition-all duration-200 group/item"
                      >
                        <div className="p-2 bg-primary/10 rounded-lg group-hover/item:bg-primary/20 transition-colors">
                          <ShoppingBag className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-foreground group-hover/item:text-primary transition-colors">
                            {item.name}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/blog"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
            >
              Contact
            </Link>
{/* 
            <Button className="hidden lg:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
              <Phone className="h-4 w-4 mr-2" />
              Get Support
            </Button> */}

            {/* <Button asChild className="hidden lg:inline-flex bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
              <Link href="/book-appointment">
                <Calendar className="h-4 w-4 mr-2" />
                Book Appointment
              </Link>
            </Button> */}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-primary/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden lg:inline-flex hover:bg-primary/10">
              <Search className="h-4 w-4" />
            </Button>

            {/* <Button className="hidden lg:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
              <Phone className="h-4 w-4 mr-2" />
              Get Support
            </Button> */}

            <Button asChild className="hidden lg:inline-flex bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
              <Link href="/book-appointment">
                <Calendar className="h-4 w-4 mr-2" />
                Book Appointment
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-primary/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-6 space-y-6">
            <Link
              href="/"
              className="block py-3 text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            <div className="space-y-3">
              <div>
                <button
                  type="button"
                  onClick={() => toggleMobileSection('services')}
                  aria-expanded={mobileSectionsOpen.services}
                  className="flex items-center justify-between w-full font-semibold text-foreground py-2 border-b border-border/50"
                >
                  <span>Services</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileSectionsOpen.services ? 'rotate-180' : ''}`} />
                </button>

                {mobileSectionsOpen.services && (
                  <div className="pl-4 space-y-3">
                    {servicesDropdown.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <button
                  type="button"
                  onClick={() => toggleMobileSection('shop')}
                  aria-expanded={mobileSectionsOpen.shop}
                  className="flex items-center justify-between w-full font-semibold text-foreground py-2 border-b border-border/50"
                >
                  <span>Shop</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileSectionsOpen.shop ? 'rotate-180' : ''}`} />
                </button>

                {mobileSectionsOpen.shop && (
                  <div className="pl-4 space-y-3">
                    {shopDropdown.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Link
              href="/blog"
              className="block py-3 text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="block py-3 text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block py-3 text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>

            <Button asChild className="block py-3 text-foreground hover:text-primary transition-colors font-medium">
              <Link href="/book-appointment">
                <Calendar className="h-4 w-4 mr-2" />
                Book Appointment
              </Link>
            </Button>

            {/* <Button className="w-full mt-6 bg-primary hover:bg-primary/90">
              <Phone className="h-4 w-4 mr-2" />
              Get Support
            </Button> */}
          </div>
        </div>
      )}
    </header>
  )
}
