import React from "react"
import AdminShell from "@/components/admin/admin-shell"
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
  return <AdminShell>{children}</AdminShell>
}
