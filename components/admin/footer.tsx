/**
 * Admin Footer Component
 *
 * Professional footer for the admin dashboard with system information,
 * quick links, and branding specific to the admin interface.
 *
 * @returns {JSX.Element} The admin footer
 */
export function AdminFooter() {
  return (
    <footer className="bg-sidebar border-t border-sidebar-border px-6 py-4">
      <div className="flex items-center justify-between text-sm text-sidebar-foreground/60">
        <div className="flex items-center space-x-4">
          <span>© 2024 Computer Repair Admin Panel</span>
          <span>•</span>
          <span>Version 1.0.0</span>
        </div>

        <div className="flex items-center space-x-4">
          <span>System Status: Online</span>
          <span>•</span>
          <span>Last Updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </footer>
  )
}
