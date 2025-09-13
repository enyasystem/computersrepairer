"use client"

import React, { useState } from "react"
import { usePathname } from "next/navigation"
import { AuthGuard } from "@/components/admin/auth-guard"
import { AdminHeader } from "@/components/admin/header"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminFooter } from "@/components/admin/footer"
import AppointmentsActionPortal from '@/components/admin/appointments-action-portal'

/**
 * Admin Layout Component
 *
 * Provides authentication protection for admin routes except login page.
 * Wraps admin pages with AuthGuard to ensure only authenticated users can access them,
 * but allows unrestricted access to the login page to prevent redirect loops.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} Protected admin layout
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    return <>{children}</>
  }

  // Mobile sidebar state
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background flex">
        <AdminSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader onOpenSidebar={() => setMobileOpen(true)} />
          <main className="flex-1 p-6 overflow-x-hidden">{children}</main>
          <AdminFooter />
          <AppointmentsActionPortal />
        </div>
      </div>
    </AuthGuard>
  )
}
