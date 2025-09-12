import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  FileText,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { db } from "@/lib/database"

/**
 * Admin Dashboard Page Component
 *
 * Main dashboard interface providing overview of business metrics,
 * quick actions, and recent activity for computer repair business management.
 *
 * @returns {JSX.Element} The admin dashboard page
 */
export default async function AdminDashboard() {
  let analytics
  let recentRepairs = []
  let recentInquiries = []

  try {
    analytics = await db.getAnalytics()
    const repairs = await db.getRepairRequests()
    const inquiries = await db.getInquiries()

    // Get recent repairs (last 5)
    recentRepairs = repairs.slice(0, 5)
    // Get recent inquiries (last 5)
    recentInquiries = inquiries.slice(0, 5)
  } catch (error) {
    console.error("[v0] Failed to fetch dashboard data:", error)
    // Fallback to default values if database fails
    analytics = {
      totalRevenue: 0,
      totalRepairs: 0,
      pendingRepairs: 0,
      completedRepairs: 0,
      totalCustomers: 0,
      recentInquiries: 0,
    }
  }

  const recentActivity = [
    ...recentRepairs.map((repair) => ({
      id: `repair-${repair.id}`,
      type: "repair",
      message: `${repair.device_type} repair for ${repair.customer_name || "Customer"}`,
      time: new Date(repair.created_at).toLocaleDateString(),
      status: repair.status,
    })),
    ...recentInquiries.slice(0, 3).map((inquiry) => ({
      id: `inquiry-${inquiry.id}`,
      type: "inquiry",
      message: `New inquiry: ${inquiry.subject}`,
      time: new Date(inquiry.created_at).toLocaleDateString(),
      status: inquiry.status || "pending",
    })),
  ].slice(0, 4)

  const quickActions = [
    { title: "Add Blog Post", description: "Create new repair guide", icon: FileText, href: "/admin/blog/new" },
    { title: "Add Product", description: "List new product in shop", icon: ShoppingCart, href: "/admin/products/new" },
    { title: "View Inquiries", description: "Check customer messages", icon: MessageSquare, href: "/admin/inquiries" },
    { title: "Repair Status", description: "Update repair progress", icon: Clock, href: "/admin/repairs" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Welcome Section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your computer repair business.
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${Number(analytics.totalRevenue || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                From completed repairs
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Repairs</CardTitle>
              <Clock className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{analytics.pendingRepairs || 0}</div>
              <p className="text-xs text-muted-foreground">Currently in progress</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed Repairs</CardTitle>
              <CheckCircle className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{analytics.completedRepairs || 0}</div>
              <p className="text-xs text-muted-foreground">Total completed</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
              <MessageSquare className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{analytics.totalCustomers || 0}</div>
              <p className="text-xs text-muted-foreground">Registered customers</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-2 border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
              <CardDescription className="text-muted-foreground">Common tasks to manage your business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start space-y-2 border-border hover:bg-muted bg-transparent"
                    asChild
                  >
                    <a href={action.href}>
                      <div className="flex items-center space-x-2">
                        <action.icon className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">{action.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground text-left">{action.description}</p>
                    </a>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
              <CardDescription className="text-muted-foreground">Latest updates and actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.status === "completed" && <CheckCircle className="h-4 w-4 text-chart-3" />}
                      {activity.status === "pending" && <AlertCircle className="h-4 w-4 text-chart-2" />}
                      {activity.status === "in_progress" && <Clock className="h-4 w-4 text-accent" />}
                      {activity.status === "published" && <FileText className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge variant={activity.status === "completed" ? "default" : "secondary"} className="text-xs">
                      {activity.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity to display</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Repairs</span>
                <span className="text-sm font-medium text-foreground">{analytics.totalRepairs || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Pending Repairs</span>
                <span className="text-sm font-medium text-foreground">{analytics.pendingRepairs || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Recent Inquiries</span>
                <span className="text-sm font-medium text-foreground">{analytics.recentInquiries || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Popular Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Laptop Repair</span>
                <Badge variant="secondary">45%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Data Recovery</span>
                <Badge variant="secondary">28%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Virus Removal</span>
                <Badge variant="secondary">18%</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg. Repair Time</span>
                <span className="text-sm font-medium text-foreground">2.5 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Customer Rating</span>
                <span className="text-sm font-medium text-foreground">4.8/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="text-sm font-medium text-foreground">98%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
