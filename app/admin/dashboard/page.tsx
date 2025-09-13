"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, ShoppingCart, MessageSquare, Clock } from "lucide-react"

export default function AdminDashboard() {
  const quickActions = [
    { title: "Add Blog Post", icon: FileText, href: "/admin/blog/new" },
    { title: "Add Product", icon: ShoppingCart, href: "/admin/products/new" },
    { title: "View Inquiries", icon: MessageSquare, href: "/admin/inquiries" },
    { title: "Repair Status", icon: Clock, href: "/admin/repairs" },
  ]

  return (
    <div className="bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Quick overview (client fallback)</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-sm text-muted-foreground">No data (client fallback)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Repairs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-muted-foreground">No data</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-muted-foreground">No data</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-muted-foreground">No data</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((a) => (
                  <a key={a.title} href={a.href} className="block">
                    <div className="border rounded-md p-4 hover:shadow-sm transition-shadow flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <a.icon className="h-5 w-5 text-primary" />
                        <div className="font-medium text-foreground">{a.title}</div>
                      </div>
                      <Button size="sm">Open</Button>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total Repairs</span><span className="font-medium">0</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Pending</span><span className="font-medium">0</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Laptop Repair</span><Badge variant="secondary">—</Badge></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Data Recovery</span><Badge variant="secondary">—</Badge></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Avg Time</span><span className="font-medium">—</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Rating</span><span className="font-medium">—</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
