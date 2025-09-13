"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getBlogPosts, blogCategories, type BlogPost } from "@/lib/blog"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, FileText } from "lucide-react"
import Link from "next/link"

/**
 * Admin Blog Management Page
 *
 * Provides CRUD operations for blog posts including listing, filtering,
 * and quick actions for managing blog content.
 *
 * @returns {JSX.Element} The admin blog management interface
 */
export default function AdminBlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // Get all blog posts
  const allPosts = getBlogPosts()

  // Filter posts based on search and filters
  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  // Get post statistics
  const stats = {
    total: allPosts.length,
    published: allPosts.filter((p) => p.status === "published").length,
    draft: allPosts.filter((p) => p.status === "draft").length,
    archived: allPosts.filter((p) => p.status === "archived").length,
  }

  const handleDeletePost = (postId: string) => {
    // In a real app, this would make an API call
    console.log("Delete post:", postId)
    // Show confirmation dialog and handle deletion
  }

  const handleStatusChange = (postId: string, newStatus: BlogPost["status"]) => {
    // In a real app, this would make an API call
    console.log("Change status:", postId, newStatus)
  }

  // Measured portal ActionMenu to avoid clipping and ensure proper placement
  function ActionMenu({ post }: { post: BlogPost }) {
    const btnRef = useRef<HTMLButtonElement | null>(null)
    const [open, setOpen] = useState(false)
    const [pos, setPos] = useState({ top: 0, left: 0 })

    // measure and compute a safe fixed position when opened
    useEffect(() => {
      if (!open) return
      const el = btnRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const menuWidth = 220
      // Prefer aligning menu so its right edge matches trigger right edge
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
                    <Link href={`/blog/${post.slug}`} className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>View Post</span>
                    </Link>
                  </div>
                  <div className="px-2 py-2">
                    <Link href={`/admin/blog/edit/${post.id}`} className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Link>
                  </div>
                  <div className="px-2 py-2">
                    {post.status === 'published' ? (
                      <button onClick={() => { setOpen(false); handleStatusChange(post.id, 'draft') }} className="w-full text-left">Unpublish</button>
                    ) : post.status === 'draft' ? (
                      <button onClick={() => { setOpen(false); handleStatusChange(post.id, 'published') }} className="w-full text-left">Publish</button>
                    ) : (
                      <button onClick={() => { setOpen(false); handleStatusChange(post.id, 'archived') }} className="w-full text-left">Archive</button>
                    )}
                  </div>
                  <div className="px-2 py-2">
                    <button onClick={() => { setOpen(false); handleDeletePost(post.id) }} className="w-full text-left text-destructive">Delete</button>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
          <p className="text-muted-foreground">Create and manage your blog posts</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Edit className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.archived}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>Manage your blog content and publications</CardDescription>
        </CardHeader>
  <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search posts..."
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
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {blogCategories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Posts Table */}
          <div className="rounded-md border">
            <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No posts found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{post.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{post.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            post.status === "published" ? "default" : post.status === "draft" ? "secondary" : "outline"
                          }
                        >
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{post.author}</TableCell>
                      <TableCell className="text-sm">{new Date(post.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <ActionMenu post={post} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
