/**
 * Authentication utilities for admin dashboard
 *
 * Provides functions for checking authentication status and managing admin sessions.
 * In production, replace localStorage with secure httpOnly cookies and proper JWT handling.
 */

/**
 * Checks if the current user is authenticated as an admin
 * @returns {boolean} True if user is authenticated, false otherwise
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  const cookie = document.cookie || ''
  const match = cookie.match(/(?:^|; )admin_jwt=([^;]+)/)
  const token = match ? decodeURIComponent(match[1]) : null
  const isAuth = !!token
  console.log("[v0] Authentication result:", isAuth)
  return isAuth
}

/**
 * Async check that validates the admin_jwt cookie against the server
 */
export async function isAuthenticatedAsync(): Promise<boolean> {
  if (typeof window === "undefined") return false
  try {
    const res = await fetch('/api/admin/me', { method: 'GET', credentials: 'same-origin' })
    if (res.ok) return true
    return false
  } catch (e) {
    return false
  }
}

/**
 * Logs out the current admin user
 */
export function logout(): void {
  if (typeof window !== "undefined") {
    // Call logout API to clear cookie
    fetch('/api/admin/logout', { method: 'POST' }).catch(() => {})
  }
}

/**
 * Admin user interface
 */
export interface AdminUser {
  id: string
  email: string
  name: string
  role: "admin" | "super_admin"
}

/**
 * Gets the current admin user information
 * @returns {AdminUser | null} Admin user object or null if not authenticated
 */
export function getCurrentUser(): AdminUser | null {
  if (!isAuthenticated()) return null

  // In production, decode JWT token or fetch from API
  return {
    id: "1",
    email: "admin@computersrepairer.com",
    name: "Admin User",
    role: "admin",
  }
}
