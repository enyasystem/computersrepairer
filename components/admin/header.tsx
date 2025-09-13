"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, LogOut, Settings, User } from "lucide-react"
import { logout, getCurrentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

/**
 * Admin Header Component
 *
 * Top navigation bar for the admin dashboard featuring user menu,
 * notifications, and logout functionality.
 *
 * @returns {JSX.Element} The admin header
 */
export function AdminHeader({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const router = useRouter()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  return (
    <header className="bg-background border-b border-border px-6 py-4 overflow-visible">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          {/* Mobile menu button */}
          <div className="sm:hidden">
            <Button variant="ghost" size="sm" onClick={() => onOpenSidebar?.()}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>

          <h2 className="text-lg font-semibold text-foreground truncate">Computer Repair Dashboard</h2>
        </div>

        <div className="flex items-center space-x-4 flex-shrink-0">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
              3
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-admin-avatar.png" alt={user?.name || "Admin"} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 z-50" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "Admin User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "admin@computersrepairer.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
