"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { blogCategories, generateSlug, calculateReadTime, type BlogPost } from "@/lib/blog"
import { ArrowLeft, Save, Eye, Upload } from "lucide-react"
import Link from "next/link"

/**
 * Create New Blog Post Page
 *
 * Rich editor interface for creating new blog posts with preview functionality,
 * category selection, and draft/publish options.
 *
 * @returns {JSX.Element} The new blog post creation interface
 */
export default function NewBlogPostPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "Admin User",
    image: "",
    status: "draft" as BlogPost["status"],
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async (status: BlogPost["status"]) => {
    setIsLoading(true)

    try {
      // Generate slug and read time
      const slug = generateSlug(formData.title)
      const readTime = calculateReadTime(formData.content)

      const newPost: Omit<BlogPost, "id"> = {
        ...formData,
        slug,
        readTime,
        status,
        date: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // In a real app, this would make an API call
      console.log("Saving post:", newPost)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to blog management
      router.push("/admin/blog")
    } catch (error) {
      console.error("Error saving post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, this would upload to a file storage service
      const imageUrl = URL.createObjectURL(file)
      handleInputChange("image", imageUrl)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin/blog" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Create New Post</h1>
                <p className="text-muted-foreground">Write and publish a new blog post</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => handleSave("draft")} disabled={isLoading || !formData.title}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleSave("published")}
                disabled={isLoading || !formData.title || !formData.content}
              >
                <Eye className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Post Content</CardTitle>
                  <CardDescription>Write your blog post content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Enter post title..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt *</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange("excerpt", e.target.value)}
                      placeholder="Brief description of the post..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange("content", e.target.value)}
                      placeholder="Write your blog post content here... You can use HTML tags for formatting."
                      rows={15}
                      className="mt-1 font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      You can use HTML tags for formatting. Rich text editor coming soon.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Post Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {blogCategories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => handleInputChange("author", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: BlogPost["status"]) => handleInputChange("status", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formData.image && (
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={formData.image || "/placeholder.svg"}
                          alt="Featured image preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="image-upload">Upload Image</Label>
                      <div className="mt-1">
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById("image-upload")?.click()}
                          className="w-full"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Image
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="image-url">Or Image URL</Label>
                      <Input
                        id="image-url"
                        value={formData.image}
                        onChange={(e) => handleInputChange("image", e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preview Info */}
              {formData.title && (
                <Card>
                  <CardHeader>
                    <CardTitle>Preview Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Slug:</span>
                      <span className="ml-2 text-muted-foreground">{generateSlug(formData.title)}</span>
                    </div>
                    {formData.content && (
                      <div>
                        <span className="font-medium">Read Time:</span>
                        <span className="ml-2 text-muted-foreground">{calculateReadTime(formData.content)}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
