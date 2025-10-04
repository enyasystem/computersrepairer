"use client"
import React from "react"
import { useToast, toast } from '@/hooks/use-toast'

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Phone, Mail, Calendar, DollarSign } from "lucide-react"
import { formatCurrencyNGN } from "@/lib/format"

/**
 * Admin Customers Page
 *
 * Customer management interface for viewing customer information,
 * repair history, and contact details.
 *
 * @returns {JSX.Element} The admin customers page
 */
export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock customer data
  const customers = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+234 816 047 2457",
      address: "123 Main St, City, State 12345",
      joinDate: "2024-01-15",
      totalSpent: 1250,
      repairCount: 3,
      status: "active",
      lastVisit: "2024-03-10",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      phone: "+1 (555) 987-6543",
      address: "456 Business Ave, City, State 12345",
      joinDate: "2023-11-20",
      totalSpent: 2100,
      repairCount: 5,
      status: "active",
      lastVisit: "2024-03-08",
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike.wilson@email.com",
      phone: "+1 (555) 456-7890",
      address: "789 Tech Blvd, City, State 12345",
      joinDate: "2024-02-28",
      totalSpent: 450,
      repairCount: 1,
      status: "inactive",
      lastVisit: "2024-02-28",
    },
  ]

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground">Manage customer information and repair history</p>
        </div>
        <Button>Add New Customer</Button>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">298</div>
            <p className="text-xs text-muted-foreground">87% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Lifetime Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrencyNGN(1245)}</div>
            <p className="text-xs text-muted-foreground">Per customer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">Returning customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
          <CardDescription>Search and manage your customer base</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Repairs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder-avatar-${customer.id}.png`} />
                        <AvatarFallback>
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">ID: #{customer.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1" />
                        {customer.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(customer.joinDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center font-medium">
                      <DollarSign className="h-3 w-3 mr-1" />{formatCurrencyNGN(customer.totalSpent)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{customer.repairCount} repairs</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={customer.status === "active" ? "default" : "secondary"}>{customer.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {/* measured portal ActionMenu for customers */}
                    <CustomerActionMenu customer={customer} />
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

// Local portal action menu for customers
function CustomerActionMenu({ customer }: { customer: any }) {
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (!open) return
    const el = btnRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const menuWidth = 220
    let left = r.right - menuWidth
    if (left < 8) left = r.left
    if (left + menuWidth > window.innerWidth - 8) left = window.innerWidth - menuWidth - 8
    const top = r.bottom + 8
    setPos({ top, left })

    const onScroll = () => setOpen(false)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [open])

  const handleViewRepairs = () => {
    setOpen(false)
    // navigate or open repairs modal - placeholder
    try { toast({ title: `Open repairs`, description: `Open repairs for ${customer.name}` }) } catch (e) {}
  }

  return (
    <>
      <button ref={btnRef} onClick={() => setOpen((v) => !v)} className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md bg-transparent hover:bg-slate-100">
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && typeof document !== 'undefined' && (
        (function renderPortal() {
          const menu = (
            <div style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999, width: 220 }} className="bg-popover text-popover-foreground rounded-md border shadow-md p-2">
              <div className="text-sm font-medium px-2 py-1">Actions</div>
              <div className="divide-y">
                <div className="px-2 py-2">
                  <button onClick={() => { setOpen(false); /* view details */ }} className="w-full text-left">View Details</button>
                </div>
                <div className="px-2 py-2">
                  <button onClick={() => { setOpen(false); handleViewRepairs() }} className="w-full text-left">View Repairs</button>
                </div>
                <div className="px-2 py-2">
                  <button onClick={() => { setOpen(false); /* send message */ }} className="w-full text-left">Send Message</button>
                </div>
                <div className="px-2 py-2">
                  <button onClick={() => { setOpen(false); /* edit */ }} className="w-full text-left">Edit Customer</button>
                </div>
              </div>
            </div>
          )
          return (require('react-dom').createPortal(menu, document.body) as any)
        })()
      )}
    </>
  )
}
