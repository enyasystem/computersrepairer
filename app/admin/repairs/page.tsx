"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react"

/**
 * Admin Repairs Page
 *
 * Repair ticket management interface for tracking repair status,
 * assigning technicians, and managing repair workflow.
 *
 * @returns {JSX.Element} The admin repairs page
 */
export default function AdminRepairsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock repair data
  const repairs = [
    {
      id: "REP-001",
      customerName: "John Smith",
      device: 'MacBook Pro 13"',
      issue: "Screen replacement",
      status: "in-progress",
      priority: "high",
      technician: "Mike Johnson",
      dateCreated: "2024-03-10",
      estimatedCompletion: "2024-03-12",
      cost: 450,
    },
    {
      id: "REP-002",
      customerName: "Sarah Wilson",
      device: "Dell Desktop",
      issue: "Hard drive replacement",
      status: "pending",
      priority: "medium",
      technician: "Unassigned",
      dateCreated: "2024-03-11",
      estimatedCompletion: "2024-03-14",
      cost: 280,
    },
    {
      id: "REP-003",
      customerName: "Mike Davis",
      device: "HP Laptop",
      issue: "Virus removal & cleanup",
      status: "completed",
      priority: "low",
      technician: "Sarah Tech",
      dateCreated: "2024-03-08",
      estimatedCompletion: "2024-03-09",
      cost: 120,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "in-progress":
        return "default"
      case "completed":
        return "default"
      case "on-hold":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const filteredRepairs = repairs.filter((repair) => {
    const matchesSearch =
      repair.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || repair.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Repairs</h1>
          <p className="text-muted-foreground">Manage repair tickets and track progress</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Repair Ticket
        </Button>
      </div>

      {/* Repair Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Repairs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Finished repairs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2 days</div>
            <p className="text-xs text-muted-foreground">Average turnaround</p>
          </CardContent>
        </Card>
      </div>

      {/* Repairs Management */}
      <Card>
        <CardHeader>
          <CardTitle>Repair Tickets</CardTitle>
          <CardDescription>Track and manage all repair requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer, device, or ticket ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Device & Issue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Est. Completion</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRepairs.map((repair) => (
                <TableRow key={repair.id}>
                  <TableCell className="font-medium">{repair.id}</TableCell>
                  <TableCell>{repair.customerName}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{repair.device}</p>
                      <p className="text-sm text-muted-foreground">{repair.issue}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(repair.status)}>{repair.status.replace("-", " ")}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(repair.priority)}>{repair.priority}</Badge>
                  </TableCell>
                  <TableCell>{repair.technician}</TableCell>
                  <TableCell>{new Date(repair.estimatedCompletion).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">${repair.cost}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                        <DropdownMenuItem>Assign Technician</DropdownMenuItem>
                        <DropdownMenuItem>Contact Customer</DropdownMenuItem>
                        <DropdownMenuItem>Generate Invoice</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
