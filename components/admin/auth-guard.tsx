"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticatedAsync } from "@/lib/auth"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * Authentication Guard Component
 *
 * Protects admin routes by checking authentication status.
 * Redirects unauthenticated users to the login page.
 *
 * @param {AuthGuardProps} props - Component props
 * @returns {JSX.Element} Protected content or loading spinner
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      console.log("[v0] Checking authentication status")
      const authenticated = await isAuthenticatedAsync()
      console.log("[v0] Authentication result:", authenticated)
      setIsAuthed(authenticated)

      if (!authenticated) {
        console.log("[v0] Not authenticated, redirecting to login")
        router.push("/admin/login")
      } else {
        console.log("[v0] User is authenticated")
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthed) {
    return null // Will redirect to login
  }

  return <>{children}</>
}
