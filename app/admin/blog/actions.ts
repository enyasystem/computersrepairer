"use server"

import { db } from "@/lib/database"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createBlogPost(formData: FormData) {
  try {
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string
    const featured_image = formData.get('featured_image') as string
    const status = formData.get('status') as string
    const author_name = formData.get('author_name') as string
    const published_at = formData.get('published_at') as string

    if (!title || !slug || !content) throw new Error('Missing required fields')

    await db.createBlogPost({
      title,
      slug,
      content,
      excerpt,
      featured_image,
      status,
      author_name,
      published_at: published_at || null,
    })

    revalidatePath('/admin/blog')
    redirect('/admin/blog')
  } catch (err) {
    const e: any = err
    try {
      const digest = e?.digest || e?.message
      if (typeof digest === 'string' && digest.startsWith('NEXT_REDIRECT')) throw e
    } catch (checkErr) {}
    console.error('[v0] createBlogPost error', err)
    throw err
  }
}

export async function updateBlogPost(formData: FormData) {
  try {
    const id = Number(formData.get('id') as string)
    if (!id) throw new Error('Missing id')

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string
    const featured_image = formData.get('featured_image') as string
    const status = formData.get('status') as string
    const author_name = formData.get('author_name') as string
    const published_at = formData.get('published_at') as string

    await db.updateBlogPost(id, {
      title,
      slug,
      content,
      excerpt,
      featured_image,
      status,
      author_name,
      published_at: published_at || null,
    })

    revalidatePath('/admin/blog')
    redirect('/admin/blog')
  } catch (err) {
    const e: any = err
    try {
      const digest = e?.digest || e?.message
      if (typeof digest === 'string' && digest.startsWith('NEXT_REDIRECT')) throw e
    } catch (checkErr) {}
    console.error('[v0] updateBlogPost error', err)
    throw err
  }
}

export async function deleteBlogPost(id: number) {
  try {
    await db.deleteBlogPost(id)
    revalidatePath('/admin/blog')
  } catch (err) {
    console.error('[v0] deleteBlogPost error', err)
    throw err
  }
}
