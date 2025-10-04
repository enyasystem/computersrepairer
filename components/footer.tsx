import { Monitor, Facebook, Twitter, Linkedin, Instagram, Phone, Mail, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 font-bold text-xl group">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Monitor className="h-6 w-6 text-primary" />
              </div>
              <span className="text-white">ComputersRepairer</span>
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your trusted partner for all IT support and computer repair needs. Professional, reliable, and affordable
              solutions for businesses and individuals.
            </p>
            <div className="flex gap-3">
              <Link href="#" className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors group">
                <Facebook className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
              </Link>
              <Link href="#" className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors group">
                <Twitter className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
              </Link>
              <Link href="#" className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors group">
                <Linkedin className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
              </Link>
              <Link href="#" className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors group">
                <Instagram className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Services</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/services#it-support"
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  IT Support & Maintenance
                </Link>
              </li>
              <li>
                <Link
                  href="/services#networking"
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Network Setup & Security
                </Link>
              </li>
              <li>
                <Link
                  href="/services#computer-repair"
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Computer Repair & Upgrades
                </Link>
              </li>
              <li>
                <Link
                  href="/services#data-recovery"
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Data Recovery Services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Tech Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Shop Products
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Get In Touch</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white">Call Us</div>
                  <div className="text-slate-300">+234 816 047 2457</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white">Email</div>
                  <div className="text-slate-300">support@computersrepairer.com</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white">Location</div>
                  <div className="text-slate-300">12A Adeola Odeku Street, Victoria Island, Lagos</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white">Hours</div>
                  <div className="text-slate-300">Mon-Fri: 9AM-6PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-400">&copy; 2024 ComputersRepairer. All rights reserved.</div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-slate-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-300 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="ml-2 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Phone className="h-3 w-3 mr-2" />
                Emergency Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
