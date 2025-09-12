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
      badge: badge === "none" ? null : badge,
      status,
      specifications,
    })

    console.log("[v0] Product created successfully, redirecting...")

    // Revalidate the products page to show the new product
    revalidatePath("/admin/products")

    // Redirect to products page
    redirect("/admin/products")
  } catch (error) {
    console.error("[v0] Error creating product:", error)
    throw error
  }
}
