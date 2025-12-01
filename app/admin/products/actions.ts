"use server"

import { db } from "@/lib/database"
import { uploadProductImage, deleteProductImage } from '@/lib/blob'
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createProduct(formData: FormData) {
  console.log("[v0] Server action createProduct called")

  try {
    // Extract form data
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const fullDescription = formData.get("fullDescription") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const originalPrice = formData.get("originalPrice")
      ? Number.parseFloat(formData.get("originalPrice") as string)
      : undefined
    const category = formData.get("category") as string
    const brand = formData.get("brand") as string
    const sku = formData.get("sku") as string
    const imageFile = formData.get('imageFile') as File | null
    const inStock = formData.get("inStock") === "true"
    const stockQuantity = Number.parseInt(formData.get("stockQuantity") as string)
    const badge = formData.get("badge") as string
    const status = formData.get("status") as string
    const specifications = formData.get("specifications") ? JSON.parse(formData.get("specifications") as string) : {}

    console.log("[v0] Form data extracted:", {
      name,
      description,
      price,
      category,
      brand,
      sku,
      status,
    })

    // Validate required fields
    if (!name || !description || !price || !category || !brand || !sku) {
      throw new Error("Missing required fields")
    }

    // Upload image to Vercel Blob if provided. Make failures non-fatal
    // so a temporary network issue doesn't crash the server action.
    let imageUrl: string | undefined
    if (imageFile) {
      imageUrl = await uploadProductImage(imageFile, imageFile.name)
    }

    // Create product in database
    const product = await db.createProduct({
      name,
      description,
      full_description: fullDescription,
      price,
      original_price: originalPrice,
      category,
      brand,
      sku,
      image_url: imageUrl || imageUrl,
      in_stock: inStock,
      stock_quantity: stockQuantity,
  badge: badge === "none" ? undefined : badge,
      status,
      specifications,
    })

    console.log("[v0] Product created successfully, redirecting...")

    // Revalidate the products page to show the new product in admin
    revalidatePath("/admin/products")

    // Revalidate public-facing shop pages so the new product appears immediately
    try {
      revalidatePath('/')
      revalidatePath('/shop')
      if (product?.id) revalidatePath(`/shop/${product.id}`)
    } catch (e) {
      console.warn('[v0] revalidate public shop paths failed', e)
    }

    // Redirect to products page
    redirect("/admin/products")
  } catch (error) {
    // Next.js uses an internal exception to perform redirects from server actions
    // (it throws a special NEXT_REDIRECT exception). Do not treat that as an
    // application error – rethrow it without logging so it doesn't appear as a
    // real error in the console. Log other unexpected errors for debugging.
    const err: any = error
    try {
      const digest = err?.digest || err?.message
      if (typeof digest === 'string' && digest.startsWith('NEXT_REDIRECT')) {
        throw err
      }
    } catch (checkErr) {
      // fallthrough to logging if something goes wrong checking
    }

    console.error("[v0] Error creating product:", error)
    throw error
  }
}

export async function updateProduct(formData: FormData) {
  console.log('[v0] Server action updateProduct called')

  try {
    const id = Number(formData.get('id') as string)
    if (!id) throw new Error('Missing product id')

    // Fetch existing product to detect any id/slug references (here we use id)
    const existing = await db.getProductById(id)

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const fullDescription = formData.get('fullDescription') as string
    const price = formData.get('price') ? Number.parseFloat(formData.get('price') as string) : undefined
    const originalPrice = formData.get('originalPrice') ? Number.parseFloat(formData.get('originalPrice') as string) : undefined
    const category = formData.get('category') as string
    const brand = formData.get('brand') as string
    const sku = formData.get('sku') as string
    const imageFile = formData.get('imageFile') as File | null
    const inStock = formData.get('inStock') === 'true'
    const stockQuantity = formData.get('stockQuantity') ? Number.parseInt(formData.get('stockQuantity') as string) : undefined
    const badge = formData.get('badge') as string
    const status = formData.get('status') as string
    const specifications = formData.get('specifications') ? JSON.parse(formData.get('specifications') as string) : undefined

    // Upload image to Vercel Blob if provided. Make failures non-fatal
    let imageUrl: string | undefined
    if (imageFile) {
      imageUrl = await uploadProductImage(imageFile, imageFile.name)
    }

    const updated = await db.updateProduct(id, {
      name,
      description,
      full_description: fullDescription,
      price,
      original_price: originalPrice,
      category,
      brand,
      sku,
      image_url: imageUrl || imageUrl,
      in_stock: inStock,
      stock_quantity: stockQuantity,
      badge: badge === 'none' ? undefined : badge,
      status,
      specifications,
    })

    // Revalidate admin listing
    revalidatePath('/admin/products')

    // Revalidate public-facing shop pages
    try {
      revalidatePath('/')
      revalidatePath('/shop')
      if (existing?.id) revalidatePath(`/shop/${existing.id}`)
      if (updated?.id) revalidatePath(`/shop/${updated.id}`)
    } catch (e) {
      console.warn('[v0] revalidate public shop paths failed', e)
    }

    redirect('/admin/products')
  } catch (err) {
    const e: any = err
    try {
      const digest = e?.digest || e?.message
      if (typeof digest === 'string' && digest.startsWith('NEXT_REDIRECT')) {
        throw e
      }
    } catch (checkErr) {}
    console.error('[v0] Error updating product', err)
    throw err
  }
}
