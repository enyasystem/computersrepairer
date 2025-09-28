"use server"

import { db } from "@/lib/database"
import { supabaseServer } from '@/lib/supabase'
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createBlogPost(formData: FormData) {
  try {
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string
    let featured_image = formData.get('featured_image') as string
    const featuredImageFile = formData.get('featuredImageFile') as File | null
    const status = formData.get('status') as string
    const author_name = formData.get('author_name') as string
    const published_at = formData.get('published_at') as string

    if (!title || !slug || !content) throw new Error('Missing required fields')

    // Upload featured image if a file was provided
    if (featuredImageFile) {
      if (!supabaseServer) {
        throw new Error('Supabase storage client not configured (missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)')
      }

      const bucket = process.env.SUPABASE_BUCKET || 'public'
      const fileName = `blog-${Date.now()}-${featuredImageFile.name}`
      const path = `blog/${fileName}`
      const { data, error } = await supabaseServer.storage
        .from(bucket)
        .upload(path, featuredImageFile, { cacheControl: '3600', upsert: false })
      if (error) {
        console.error('[v0] Supabase upload for blog featured image failed', error)
        throw new Error('Supabase upload failed: ' + (error?.message || JSON.stringify(error)))
      }
      const publicRes = supabaseServer.storage.from(bucket).getPublicUrl(path)
      featured_image = publicRes?.data?.publicUrl || featured_image
    }

    const created = await db.createBlogPost({
      title,
      slug,
      content,
      excerpt,
      featured_image,
      status,
      author_name,
      published_at: published_at || null,
    })

    // Revalidate admin listing
    revalidatePath('/admin/blog')

    // Revalidate public-facing pages so updates show up immediately
    try {
      revalidatePath('/')
      revalidatePath('/blog')
      if (created?.slug) revalidatePath(`/blog/${created.slug}`)
    } catch (e) {
      console.warn('[v0] revalidate public blog paths failed', e)
    }

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

    // Fetch existing post to detect old slug for revalidation
    const existing = await db.getBlogPostById(id)
    const oldSlug = existing?.slug

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string
    let featured_image = formData.get('featured_image') as string
    const featuredImageFile = formData.get('featuredImageFile') as File | null
    const status = formData.get('status') as string
    const author_name = formData.get('author_name') as string
    const published_at = formData.get('published_at') as string

    // Upload featured image if a file was provided
    if (featuredImageFile) {
      if (!supabaseServer) {
        throw new Error('Supabase storage client not configured (missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)')
      }

      const bucket = process.env.SUPABASE_BUCKET || 'public'
      const fileName = `blog-${Date.now()}-${featuredImageFile.name}`
      const path = `blog/${fileName}`
      const { data, error } = await supabaseServer.storage
        .from(bucket)
        .upload(path, featuredImageFile, { cacheControl: '3600', upsert: false })
      if (error) {
        console.error('[v0] Supabase upload for blog featured image failed', error)
        throw new Error('Supabase upload failed: ' + (error?.message || JSON.stringify(error)))
      }
      const publicRes = supabaseServer.storage.from(bucket).getPublicUrl(path)
      featured_image = publicRes?.data?.publicUrl || featured_image
    }

    const updated = await db.updateBlogPost(id, {
      title,
      slug,
      content,
      excerpt,
      featured_image,
      status,
      author_name,
      published_at: published_at || null,
    })

    // Revalidate admin listing
    revalidatePath('/admin/blog')

    // Revalidate public-facing pages (homepage, blog list, old slug & new slug)
    try {
      revalidatePath('/')
      revalidatePath('/blog')
      if (oldSlug) revalidatePath(`/blog/${oldSlug}`)
      if (updated?.slug) revalidatePath(`/blog/${updated.slug}`)
    } catch (e) {
      console.warn('[v0] revalidate public blog paths failed', e)
    }

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
    const deleted = await db.deleteBlogPost(id)

    // Revalidate admin listing
    revalidatePath('/admin/blog')

    // Revalidate public-facing pages
    try {
      revalidatePath('/')
      revalidatePath('/blog')
      if (deleted?.slug) revalidatePath(`/blog/${deleted.slug}`)
    } catch (e) {
      console.warn('[v0] revalidate public blog paths failed', e)
    }
  } catch (err) {
    console.error('[v0] deleteBlogPost error', err)
    throw err
  }
}
