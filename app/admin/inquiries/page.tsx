"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import {
  getInquiries,
  getInquiryStats,
  getServiceDisplayName,
  getUrgencyColor,
  getStatusColor,
  type CustomerInquiry,
} from "@/lib/inquiries"
import { Search, MessageSquare, Clock, CheckCircle, AlertTriangle, Eye, Reply, Phone, Mail } from "lucide-react"

/**
 * Admin Customer Inquiries Page
 *
 * Provides comprehensive inquiry management including viewing, responding,
 * and status tracking for customer support requests.
 *
 * @returns {JSX.Element} The admin inquiries management interface
 */
export default function AdminInquiriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all")
  const [serviceFilter, setServiceFilter] = useState<string>("all")
  const [selectedInquiry, setSelectedInquiry] = useState<CustomerInquiry | null>(null)
  const [response, setResponse] = useState("")

  // Get all inquiries and stats
  const allInquiries = getInquiries()
  const stats = getInquiryStats()

  // Filter inquiries based on search and filters
  const filteredInquiries = allInquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter
    const matchesUrgency = urgencyFilter === "all" || inquiry.urgency === urgencyFilter
    const matchesService = serviceFilter === "all" || inquiry.service === serviceFilter

    return matchesSearch && matchesStatus && matchesUrgency && matchesService
  })

  const handleStatusChange = (inquiryId: string, newStatus: CustomerInquiry["status"]) => {
    // In a real app, this would make an API call
    console.log("Change status:", inquiryId, newStatus)
  }

  const handleSendResponse = () => {
    if (selectedInquiry && response.trim()) {
      // In a real app, this would send email and update database
      console.log("Sending response to:", selectedInquiry.email, response)
      setResponse("")
      setSelectedInquiry(null)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Customer Inquiries</h1>
              <p className="text-muted-foreground">Manage customer support requests and communications</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New</CardTitle>
                <AlertTriangle className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.new}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inProgress}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.resolved}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Emergency</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.emergency}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Inquiries</CardTitle>
              <CardDescription>View and manage customer support requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search inquiries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Urgency</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="computer-repair">Computer Repair</SelectItem>
                    <SelectItem value="it-support">IT Support</SelectItem>
                    <SelectItem value="data-recovery">Data Recovery</SelectItem>
                    <SelectItem value="network-setup">Network Setup</SelectItem>
                    <SelectItem value="virus-removal">Virus Removal</SelectItem>
                    <SelectItem value="hardware-upgrade">Hardware Upgrade</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Inquiries Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInquiries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No inquiries found matching your criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInquiries.map((inquiry) => (
                        <TableRow key={inquiry.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{inquiry.name}</div>
                              <div className="text-sm text-muted-foreground">{inquiry.email}</div>
                              {inquiry.phone && <div className="text-sm text-muted-foreground">{inquiry.phone}</div>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{getServiceDisplayName(inquiry.service)}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getUrgencyColor(inquiry.urgency)}>{inquiry.urgency.toUpperCase()}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(inquiry.status)}>
                              {inquiry.status.replace("-", " ").toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{new Date(inquiry.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedInquiry(inquiry)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Inquiry Details</DialogTitle>
                                    <DialogDescription>Customer inquiry from {inquiry.name}</DialogDescription>
                                  </DialogHeader>

                                  {selectedInquiry && (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-sm font-medium">Customer</Label>
                                          <p className="text-sm">{selectedInquiry.name}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Email</Label>
                                          <p className="text-sm">{selectedInquiry.email}</p>
                                        </div>
                                        {selectedInquiry.phone && (
                                          <div>
                                            <Label className="text-sm font-medium">Phone</Label>
                                            <p className="text-sm">{selectedInquiry.phone}</p>
                                          </div>
                                        )}
                                        <div>
                                          <Label className="text-sm font-medium">Service</Label>
                                          <p className="text-sm">{getServiceDisplayName(selectedInquiry.service)}</p>
                                        </div>
                                      </div>

                                      <div>
                                        <Label className="text-sm font-medium">Message</Label>
                                        <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                                          {selectedInquiry.message}
                                        </p>
                                      </div>

                                      {selectedInquiry.response && (
                                        <div>
                                          <Label className="text-sm font-medium">Previous Response</Label>
                                          <p className="text-sm mt-1 p-3 bg-primary/10 rounded-md">
                                            {selectedInquiry.response}
                                          </p>
                                        </div>
                                      )}

                                      <div>
                                        <Label htmlFor="response">Send Response</Label>
                                        <Textarea
                                          id="response"
                                          value={response}
                                          onChange={(e) => setResponse(e.target.value)}
                                          placeholder="Type your response here..."
                                          rows={4}
                                          className="mt-1"
                                        />
                                      </div>

                                      <div className="flex justify-between">
                                        <div className="flex gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleStatusChange(selectedInquiry.id, "in-progress")}
                                          >
                                            Mark In Progress
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleStatusChange(selectedInquiry.id, "resolved")}
                                          >
                                            Mark Resolved
                                          </Button>
                                        </div>
                                        <Button onClick={handleSendResponse} disabled={!response.trim()}>
                                          <Reply className="h-4 w-4 mr-2" />
                                          Send Response
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>

                              {inquiry.phone && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={`tel:${inquiry.phone}`}>
                                    <Phone className="h-4 w-4" />
                                  </a>
                                </Button>
                              )}

                              <Button variant="outline" size="sm" asChild>
                                <a href={`mailto:${inquiry.email}`}>
                                  <Mail className="h-4 w-4" />
                                </a>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
