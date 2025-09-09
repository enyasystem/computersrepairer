import { Button } from "@/components/ui/button"
import { Monitor, Menu } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Monitor className="h-6 w-6 text-primary" />
          <span className="text-balance">ComputersRepairer</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/services" className="text-foreground hover:text-primary transition-colors">
            Services
          </Link>
          <Link href="/shop" className="text-foreground hover:text-primary transition-colors">
            Shop
          </Link>
          <Link href="/blog" className="text-foreground hover:text-primary transition-colors">
            Blog
          </Link>
          <Link href="/about" className="text-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button className="hidden md:inline-flex">Get Support</Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
