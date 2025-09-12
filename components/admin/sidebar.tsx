"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Wrench,
  Calendar,
} from "lucide-react"

/**
 * Admin Sidebar Component
 *
 * Provides navigation for the admin dashboard with collapsible functionality.
 * Highlights the current active page and organizes admin functions logically.
 *
 * @returns {JSX.Element} The admin sidebar navigation
 */
export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Appointments",
      href: "/admin/appointments",
      icon: Calendar,
    },
    {
      title: "Blog Posts",
      href: "/admin/blog",
      icon: FileText,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: ShoppingCart,
    },
    {
      title: "Inquiries",
      href: "/admin/inquiries",
      icon: MessageSquare,
    },
    {
      title: "Customers",
      href: "/admin/customers",
      icon: Users,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  return (
    <div
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <Wrench className="h-6 w-6 text-sidebar-primary" />
                <span className="font-bold text-sidebar-foreground">Admin Panel</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/admin/appointments" && pathname.startsWith("/admin/appointments"))
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isCollapsed ? "px-2" : "px-3",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                  {!isCollapsed && <span>{item.title}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          {!isCollapsed && (
            <div className="text-xs text-sidebar-foreground/60">
              <p>Computer Repair Admin</p>
              <p>Version 1.0.0</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
