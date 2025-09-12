"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

/**
 * Root Admin Page Component
 *
 * Handles routing logic for the base /admin route:
 * - Redirects authenticated users to the dashboard
 * - Redirects unauthenticated users to the login page
 *
 * This prevents 404 errors when users navigate directly to /admin
 */
export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated()) {
      console.log("[v0] User authenticated, redirecting to dashboard")
      router.replace("/admin/dashboard")
    } else {
      console.log("[v0] User not authenticated, redirecting to login")
      router.replace("/admin/login")
    }
  }, [router])

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-slate-600">Redirecting to admin panel...</p>
      </div>
    </div>
  )
}
