/**
 * Customer inquiry data types and utilities
 *
 * Centralized inquiry data management with TypeScript interfaces
 * and mock data for the admin inquiry management system.
 */

export interface CustomerInquiry {
  id: string
  name: string
  email: string
  phone?: string
  service: string
  urgency: "low" | "medium" | "high" | "emergency"
  message: string
  status: "new" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "critical"
  assignedTo?: string
  response?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
}

export interface InquiryStats {
  total: number
  new: number
  inProgress: number
  resolved: number
  closed: number
  emergency: number
}

// Mock customer inquiries
export const mockInquiries: CustomerInquiry[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    service: "computer-repair",
    urgency: "high",
    message:
      "My laptop won't turn on after a power surge. It was working fine yesterday but now there's no response when I press the power button. I have important work files on it that I need to recover.",
    status: "new",
    priority: "high",
    createdAt: "2024-01-20T09:15:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    phone: "(555) 987-6543",
    service: "it-support",
    urgency: "emergency",
    message:
      "Our office network is completely down. None of our computers can access the internet or shared files. This is affecting our entire team's productivity. Please help ASAP!",
    status: "in-progress",
    priority: "critical",
    assignedTo: "Tech Support Team",
    response: "We've received your emergency request and are dispatching a technician immediately. ETA: 30 minutes.",
    createdAt: "2024-01-20T08:30:00Z",
    updatedAt: "2024-01-20T08:45:00Z",
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mike.davis@gmail.com",
    service: "data-recovery",
    urgency: "medium",
    message:
      "I accidentally deleted some important family photos from my external hard drive. Is there any way to recover them? The drive is still working fine otherwise.",
    status: "resolved",
    priority: "medium",
    assignedTo: "Data Recovery Team",
    response: "Good news! We were able to recover 95% of your deleted photos. Your drive is ready for pickup.",
    createdAt: "2024-01-18T14:20:00Z",
    updatedAt: "2024-01-19T16:30:00Z",
    resolvedAt: "2024-01-19T16:30:00Z",
  },
  {
    id: "4",
    name: "Lisa Chen",
    email: "lisa.chen@business.com",
    phone: "(555) 456-7890",
    service: "network-setup",
    urgency: "low",
    message:
      "We're opening a new office location and need help setting up the network infrastructure. Looking for a quote for 20 workstations with wireless access.",
    status: "new",
    priority: "low",
    createdAt: "2024-01-19T11:45:00Z",
    updatedAt: "2024-01-19T11:45:00Z",
  },
  {
    id: "5",
    name: "Robert Wilson",
    email: "rwilson@email.com",
    phone: "(555) 321-0987",
    service: "virus-removal",
    urgency: "high",
    message:
      "My computer is running extremely slow and I keep getting pop-up ads. I think it might be infected with malware. Can you help clean it up?",
    status: "in-progress",
    priority: "medium",
    assignedTo: "Security Team",
    response: "We've started the malware removal process. Your computer should be ready by end of day.",
    createdAt: "2024-01-19T16:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
]

/**
 * Get all inquiries with optional filtering
 */
export function getInquiries(filters?: {
  status?: CustomerInquiry["status"]
  urgency?: CustomerInquiry["urgency"]
  service?: string
}): CustomerInquiry[] {
  let filteredInquiries = mockInquiries

  if (filters?.status) {
    filteredInquiries = filteredInquiries.filter((inquiry) => inquiry.status === filters.status)
  }

  if (filters?.urgency) {
    filteredInquiries = filteredInquiries.filter((inquiry) => inquiry.urgency === filters.urgency)
  }

  if (filters?.service) {
    filteredInquiries = filteredInquiries.filter((inquiry) => inquiry.service === filters.service)
  }

  return filteredInquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

/**
 * Get a single inquiry by ID
 */
export function getInquiry(id: string): CustomerInquiry | undefined {
  return mockInquiries.find((inquiry) => inquiry.id === id)
}

/**
 * Get inquiry statistics
 */
export function getInquiryStats(): InquiryStats {
  const inquiries = getInquiries()

  return {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status === "new").length,
    inProgress: inquiries.filter((i) => i.status === "in-progress").length,
    resolved: inquiries.filter((i) => i.status === "resolved").length,
    closed: inquiries.filter((i) => i.status === "closed").length,
    emergency: inquiries.filter((i) => i.urgency === "emergency").length,
  }
}

/**
 * Get service display name
 */
export function getServiceDisplayName(service: string): string {
  const serviceMap: Record<string, string> = {
    "computer-repair": "Computer Repair",
    "it-support": "IT Support",
    "data-recovery": "Data Recovery",
    "network-setup": "Network Setup",
    "virus-removal": "Virus Removal",
    "hardware-upgrade": "Hardware Upgrade",
    consultation: "Consultation",
    other: "Other",
  }

  return serviceMap[service] || service
}

/**
 * Get urgency color class
 */
export function getUrgencyColor(urgency: CustomerInquiry["urgency"]): string {
  switch (urgency) {
    case "emergency":
      return "bg-red-500 text-white"
    case "high":
      return "bg-orange-500 text-white"
    case "medium":
      return "bg-yellow-500 text-black"
    case "low":
      return "bg-green-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

/**
 * Get status color class
 */
export function getStatusColor(status: CustomerInquiry["status"]): string {
  switch (status) {
    case "new":
      return "bg-blue-500 text-white"
    case "in-progress":
      return "bg-yellow-500 text-black"
    case "resolved":
      return "bg-green-500 text-white"
    case "closed":
      return "bg-gray-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

/**
 * Create a new inquiry from contact form data
 */
export function createInquiry(formData: {
  name: string
  email: string
  phone?: string
  service: string
  urgency: string
  message: string
}): Omit<CustomerInquiry, "id"> {
  // Ensure urgency is one of the allowed values; default to 'low' otherwise
  const allowedUrgencies: CustomerInquiry['urgency'][] = ["low", "medium", "high", "emergency"]
  const urgency = allowedUrgencies.includes(formData.urgency as CustomerInquiry['urgency'])
    ? (formData.urgency as CustomerInquiry['urgency'])
    : "low"

  const priority: CustomerInquiry['priority'] =
    urgency === "emergency" ? "critical" : urgency === "high" ? "high" : urgency === "medium" ? "medium" : "low"

  return {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    service: formData.service,
    urgency,
    message: formData.message,
    status: "new",
    priority,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
