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
  const token = localStorage.getItem("adminToken")
  console.log("[v0] Checking token:", token)
  const isAuth = token === "authenticated"
  console.log("[v0] Authentication result:", isAuth)
  return isAuth
}

/**
 * Logs out the current admin user
 */
export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminToken")
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
