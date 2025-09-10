/**
 * Blog data types and utilities
 *
 * Centralized blog data management with TypeScript interfaces
 * and mock data for the admin blog management system.
 */

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  readTime: string
  image: string
  category: string
  author: string
  status: "draft" | "published" | "archived"
  createdAt: string
  updatedAt: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string
}

// Mock blog categories
export const blogCategories: BlogCategory[] = [
  { id: "1", name: "Troubleshooting", slug: "troubleshooting", description: "Computer problem solving guides" },
  { id: "2", name: "Security", slug: "security", description: "Network and data security tips" },
  { id: "3", name: "Hardware", slug: "hardware", description: "Hardware upgrades and maintenance" },
  { id: "4", name: "Software", slug: "software", description: "Software optimization and tips" },
  { id: "5", name: "Data Management", slug: "data-management", description: "Backup and recovery strategies" },
  { id: "6", name: "Maintenance", slug: "maintenance", description: "Preventive care and maintenance" },
]

// Mock blog posts with enhanced data structure
export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "common-computer-problems-solutions",
    title: "Top 10 Common Computer Problems and Their Solutions",
    excerpt: "Learn how to troubleshoot the most frequent computer issues that affect both home and business users.",
    content: `<h2>Introduction</h2><p>Computer problems can be frustrating, especially when they disrupt your work or daily activities...</p>`,
    date: "2024-01-15",
    readTime: "8 min read",
    image: "/computer-troubleshooting-guide.jpg",
    category: "Troubleshooting",
    author: "Tech Support Team",
    status: "published",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    slug: "network-security-best-practices",
    title: "Network Security Best Practices for Small Businesses",
    excerpt: "Protect your business network from cyber threats with these essential security measures and protocols.",
    content: `<h2>Why Network Security Matters</h2><p>In today's digital landscape, network security is crucial...</p>`,
    date: "2024-01-12",
    readTime: "12 min read",
    image: "/network-security-firewall.jpg",
    category: "Security",
    author: "IT Security Team",
    status: "published",
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-12T09:00:00Z",
  },
  {
    id: "3",
    slug: "ssd-vs-hdd-upgrade-guide",
    title: "SSD vs HDD: Complete Upgrade Guide for 2024",
    excerpt: "Discover the benefits of upgrading to an SSD and learn how to migrate your data safely.",
    content: `<h2>SSD vs HDD: The Key Differences</h2><p>Understanding the differences between Solid State Drives...</p>`,
    date: "2024-01-10",
    readTime: "6 min read",
    image: "/ssd-hard-drive-upgrade.jpg",
    category: "Hardware",
    author: "Hardware Specialists",
    status: "published",
    createdAt: "2024-01-10T14:00:00Z",
    updatedAt: "2024-01-10T14:00:00Z",
  },
  {
    id: "4",
    slug: "windows-11-optimization-tips",
    title: "Windows 11 Optimization: Speed Up Your PC",
    excerpt: "Simple tweaks and settings to make your Windows 11 computer run faster and more efficiently.",
    content: `<h2>Getting Started</h2><p>Windows 11 offers many performance improvements...</p>`,
    date: "2024-01-08",
    readTime: "10 min read",
    image: "/windows-11-optimization-settings.jpg",
    category: "Software",
    author: "Software Team",
    status: "draft",
    createdAt: "2024-01-08T11:00:00Z",
    updatedAt: "2024-01-08T15:30:00Z",
  },
]

/**
 * Get all blog posts with optional filtering
 */
export function getBlogPosts(status?: BlogPost["status"]): BlogPost[] {
  if (status) {
    return mockBlogPosts.filter((post) => post.status === status)
  }
  return mockBlogPosts
}

/**
 * Get a single blog post by ID
 */
export function getBlogPost(id: string): BlogPost | undefined {
  return mockBlogPosts.find((post) => post.id === id)
}

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

/**
 * Calculate estimated reading time based on content length
 */
export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}
