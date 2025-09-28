"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminHeader } from '@/components/admin/header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { blogCategories, generateSlug, calculateReadTime } from '@/lib/blog'
import { createBlogPost, updateBlogPost } from '../actions'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Save, Eye, Upload } from 'lucide-react'
import Link from 'next/link'

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [post, setPost] = useState<any>(null)
  const [formData, setFormData] = useState({ title: '', excerpt: '', content: '', category: '', author: '', image: '', status: 'draft' })

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const res = await fetch(`/api/admin/blog/by-id?id=${params.id}`)
      if (!res.ok) return
      const j = await res.json()
      if (!mounted) return
      setPost(j.data)
      setFormData({
        title: j.data.title || '',
        excerpt: j.data.excerpt || '',
        content: j.data.content || '',
        category: j.data.category || '',
        author: j.data.author_name || '',
        image: j.data.featured_image || '',
        status: j.data.status || 'draft',
      })
    })()
    return () => { mounted = false }
  }, [params.id])

  const handleInputChange = (field: string, value: string) => setFormData((p) => ({ ...p, [field]: value }))

  const handleSave = async (status: string) => {
    setIsLoading(true)
    try {
      const form = new FormData()
      form.append('id', String(params.id))
      form.append('title', formData.title)
      form.append('slug', generateSlug(formData.title))
      form.append('content', formData.content)
      form.append('excerpt', formData.excerpt)
      form.append('featured_image', formData.image)
      form.append('status', status)
      form.append('author_name', formData.author)
      form.append('published_at', status === 'published' ? new Date().toISOString() : '')

      await updateBlogPost(form)
      toast({ title: 'Saved', description: 'Post updated' })
    } catch (err) {
      console.error(err)
      toast({ title: 'Save failed', description: 'Could not update post', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setFormData((p) => ({ ...p, image: url }))
    }
  }

  if (!post) return <div className="p-6">Loading...</div>

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin/blog" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Edit Post</h1>
                <p className="text-muted-foreground">Update your blog post</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => handleSave('draft')} disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={() => handleSave('published')} disabled={isLoading}>
                <Eye className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Post Content</CardTitle>
                  <CardDescription>Update your post content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input id="title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea id="excerpt" value={formData.excerpt} onChange={(e) => handleInputChange('excerpt', e.target.value)} rows={3} className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" value={formData.content} onChange={(e) => handleInputChange('content', e.target.value)} rows={15} className="mt-1 font-mono text-sm" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Post Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(v) => handleInputChange('category', v)}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {blogCategories.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" value={formData.author} onChange={(e) => handleInputChange('author', e.target.value)} className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(v) => handleInputChange('status', v as any)}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
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
                    {formData.image && <div className="aspect-video bg-muted rounded-lg overflow-hidden"><img src={formData.image} alt="Featured" className="w-full h-full object-cover" /></div>}
                    <div>
                      <Label htmlFor="image-upload">Upload Image</Label>
                      <div className="mt-1">
                        <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        <Button variant="outline" onClick={() => document.getElementById('image-upload')?.click()} className="w-full"><Upload className="w-4 h-4 mr-2" />Choose Image</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
