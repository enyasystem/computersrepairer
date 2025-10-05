"use client"

import { useState } from "react"
import { useToast, toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Save, Shield, Bell, Globe, Database } from "lucide-react"
import { useRouter } from 'next/navigation'

/**
 * Admin Settings Page
 *
 * Comprehensive settings management for the computer repair business
 * including business information, notifications, security, and system preferences.
 *
 * @returns {JSX.Element} The admin settings page
 */
export default function AdminSettingsPage() {
  const [businessInfo, setBusinessInfo] = useState({
    name: "Computer Repair & IT Support Centre",
    email: "info@computersrepairer.com",
    phone: "+234 803 000 0000",
  address: "Shop i83/84 Ikota shopping complex Road 5, Lekki Epe express way.",
    description: "Professional computer repair and IT support services for businesses and individuals.",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newInquiries: true,
    orderUpdates: true,
    systemAlerts: true,
  })

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
  })

  const router = useRouter()
  const [accountEmail, setAccountEmail] = useState('admin@computersrepairer.com')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSavingAccount, setIsSavingAccount] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleSave = () => {
    // Mock save functionality
    console.log("[v0] Settings saved:", { businessInfo, notifications, security })
    try { toast({ title: 'Settings saved', description: 'Settings saved successfully!' }) } catch (e) {}
  }

  const handleAccountSave = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      toast({ title: 'Password mismatch', description: 'New password and confirmation do not match', variant: 'destructive' })
      return
    }
    setIsSavingAccount(true)
    try {
      const payload: any = {}
      if (accountEmail) payload.email = accountEmail
      if (newPassword) payload.password = newPassword
      const res = await fetch('/api/admin/settings/update', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      console.log('[v0] settings update response status=', res.status)
      const j = await res.json()
      console.log('[v0] settings update response json=', j)
      if (!res.ok) throw new Error(j?.error || 'Update failed')
      // Show success toast and clear sensitive fields
      toast({ title: 'Account updated', description: 'Account settings updated successfully' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      // show modal dialog for clear visibility
      setSuccessMessage('Your account credentials were updated successfully.')
      setShowSuccessDialog(true)
      // ensure toast is visible before refreshing the page
      await new Promise((r) => setTimeout(r, 300))
      // Refresh server state (me endpoint / session) and UI
      try { router.refresh() } catch (e) {}
    } catch (e: any) {
      console.error(e)
      toast({ title: 'Update failed', description: String(e?.message || e), variant: 'destructive' })
    } finally {
      setIsSavingAccount(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your business and system preferences</p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Update your business details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={businessInfo.name}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={businessInfo.email}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Phone</Label>
                  <Input
                    id="businessPhone"
                    value={businessInfo.phone}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Address</Label>
                  <Input
                    id="businessAddress"
                    value={businessInfo.address}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessDescription">Description</Label>
                <Textarea
                  id="businessDescription"
                  value={businessInfo.description}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                </div>
                <Switch
                  checked={notifications.smsNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Inquiries</Label>
                  <p className="text-sm text-muted-foreground">Get notified of new customer inquiries</p>
                </div>
                <Switch
                  checked={notifications.newInquiries}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, newInquiries: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Order Updates</Label>
                  <p className="text-sm text-muted-foreground">Notifications for order status changes</p>
                </div>
                <Switch
                  checked={notifications.orderUpdates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, orderUpdates: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security preferences and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={security.twoFactorAuth ? "default" : "secondary"}>
                    {security.twoFactorAuth ? "Enabled" : "Disabled"}
                  </Badge>
                  <Switch
                    checked={security.twoFactorAuth}
                    onCheckedChange={(checked) => setSecurity({ ...security, twoFactorAuth: checked })}
                  />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={security.passwordExpiry}
                    onChange={(e) => setSecurity({ ...security, passwordExpiry: e.target.value })}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountEmail">Admin Email</Label>
                  <Input id="accountEmail" type="email" value={accountEmail} onChange={(e) => setAccountEmail(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAccountSave} className="ml-auto" disabled={isSavingAccount}>
                    {isSavingAccount ? 'Updating...' : 'Update Account'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>View system status and configuration details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>System Version</Label>
                  <p className="text-sm font-mono bg-muted p-2 rounded">v1.0.0</p>
                </div>
                <div className="space-y-2">
                  <Label>Database Status</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Connected</Badge>
                    <span className="text-sm text-muted-foreground">Last backup: 2 hours ago</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Active Users</Label>
                  <p className="text-sm font-mono bg-muted p-2 rounded">1 admin user</p>
                </div>
                <div className="space-y-2">
                  <Label>Storage Used</Label>
                  <p className="text-sm font-mono bg-muted p-2 rounded">2.3 GB / 10 GB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Success modal dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={(open) => {
        setShowSuccessDialog(open)
        if (!open) {
          try { router.refresh() } catch (e) {}
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Updated</DialogTitle>
            <DialogDescription>{successMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
