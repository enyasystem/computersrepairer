"use server"

import { db } from "@/lib/database"
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
    const imageUrl = formData.get("image") as string
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
      image_url: imageUrl,
      in_stock: inStock,
      stock_quantity: stockQuantity,
  badge: badge === "none" ? undefined : badge,
      status,
      specifications,
    })

    console.log("[v0] Product created successfully, redirecting...")

    // Revalidate the products page to show the new product
    revalidatePath("/admin/products")

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

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const fullDescription = formData.get('fullDescription') as string
    const price = formData.get('price') ? Number.parseFloat(formData.get('price') as string) : undefined
    const originalPrice = formData.get('originalPrice') ? Number.parseFloat(formData.get('originalPrice') as string) : undefined
    const category = formData.get('category') as string
    const brand = formData.get('brand') as string
    const sku = formData.get('sku') as string
    const imageUrl = formData.get('image') as string
    const inStock = formData.get('inStock') === 'true'
    const stockQuantity = formData.get('stockQuantity') ? Number.parseInt(formData.get('stockQuantity') as string) : undefined
    const badge = formData.get('badge') as string
    const status = formData.get('status') as string
    const specifications = formData.get('specifications') ? JSON.parse(formData.get('specifications') as string) : undefined

    const updated = await db.updateProduct(id, {
      name,
      description,
      full_description: fullDescription,
      price,
      original_price: originalPrice,
      category,
      brand,
      sku,
      image_url: imageUrl,
      in_stock: inStock,
      stock_quantity: stockQuantity,
      badge: badge === 'none' ? undefined : badge,
      status,
      specifications,
    })

    revalidatePath('/admin/products')
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
