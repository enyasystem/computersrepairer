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
import { Checkbox } from "@/components/ui/checkbox"
import { AdminHeader } from "@/components/admin/header"
import { productCategories, generateSKU, type Product } from "@/lib/products"
import { ArrowLeft, Save, Eye, Upload, Plus, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createProduct } from "../actions"

/**
 * Create New Product Page
 *
 * Comprehensive product creation interface with inventory management,
 * specifications, and image upload functionality.
 *
 * @returns {JSX.Element} The new product creation interface
 */
export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [specifications, setSpecifications] = useState<Array<{ key: string; value: string }>>([{ key: "", value: "" }])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fullDescription: "",
    price: "",
    originalPrice: "",
    category: "",
    brand: "",
    sku: "",
    image: "",
    inStock: true,
    stockQuantity: "",
    badge: "" as Product["badge"] | "",
    status: "active" as Product["status"],
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Auto-generate SKU when name or brand changes
    if (field === "name" || field === "brand") {
      const name = field === "name" ? (value as string) : formData.name
      const brand = field === "brand" ? (value as string) : formData.brand
      if (name && brand) {
        setFormData((prev) => ({
          ...prev,
          sku: generateSKU(name, brand),
        }))
      }
    }
  }

  const handleSpecificationChange = (index: number, field: "key" | "value", value: string) => {
    const newSpecs = [...specifications]
    newSpecs[index][field] = value
    setSpecifications(newSpecs)
  }

  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }])
  }

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index))
  }

  const handleSave = async (status: Product["status"]) => {
    console.log("[v0] handleSave called with status:", status)
    setIsLoading(true)

    try {
      // Convert specifications array to object
      const specsObject = specifications
        .filter((spec) => spec.key && spec.value)
        .reduce((acc, spec) => ({ ...acc, [spec.key]: spec.value }), {})

      console.log("[v0] Preparing form data for submission")

      // Create FormData object for server action
      const formDataForServer = new FormData()
      formDataForServer.append("name", formData.name)
      formDataForServer.append("description", formData.description)
      formDataForServer.append("fullDescription", formData.fullDescription)
      formDataForServer.append("price", formData.price)
      if (formData.originalPrice) formDataForServer.append("originalPrice", formData.originalPrice)
      formDataForServer.append("category", formData.category)
      formDataForServer.append("brand", formData.brand)
      formDataForServer.append("sku", formData.sku)
      formDataForServer.append("image", formData.image)
      formDataForServer.append("inStock", formData.inStock.toString())
      formDataForServer.append("stockQuantity", formData.stockQuantity)
      formDataForServer.append("badge", formData.badge || "none")
      formDataForServer.append("status", status)
      formDataForServer.append("specifications", JSON.stringify(specsObject))

      console.log("[v0] Calling server action...")

      // Call server action
      await createProduct(formDataForServer)
    } catch (error) {
      console.error("[v0] Error saving product:", error)
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
      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin/products" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
                <p className="text-muted-foreground">Create a new product for your shop</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => handleSave("inactive")} disabled={isLoading || !formData.name}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={() => handleSave("active")} disabled={isLoading || !formData.name || !formData.price}>
                <Eye className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                  <CardDescription>Basic product details and descriptions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter product name..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="brand">Brand *</Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => handleInputChange("brand", e.target.value)}
                        placeholder="Enter brand name..."
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Short Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Brief product description..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fullDescription">Full Description</Label>
                    <Textarea
                      id="fullDescription"
                      value={formData.fullDescription}
                      onChange={(e) => handleInputChange("fullDescription", e.target.value)}
                      placeholder="Detailed product description..."
                      rows={6}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                  <CardDescription>Technical specifications and features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {specifications.map((spec, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Specification name"
                          value={spec.key}
                          onChange={(e) => handleSpecificationChange(index, "key", e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Value"
                          value={spec.value}
                          onChange={(e) => handleSpecificationChange(index, "value", e.target.value)}
                          className="flex-1"
                        />
                        {specifications.length > 1 && (
                          <Button variant="outline" size="sm" onClick={() => removeSpecification(index)}>
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" onClick={addSpecification} className="w-full bg-transparent">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Specification
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing & Inventory */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Inventory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="0.00"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="originalPrice">Original Price</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                      placeholder="0.00"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) => handleInputChange("stockQuantity", e.target.value)}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inStock"
                      checked={formData.inStock}
                      onCheckedChange={(checked) => handleInputChange("inStock", checked)}
                    />
                    <Label htmlFor="inStock">In Stock</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Product Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {productCategories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      placeholder="Auto-generated"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="badge">Badge</Label>
                    <Select value={formData.badge} onValueChange={(value) => handleInputChange("badge", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select badge" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Badge</SelectItem>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Sale">Sale</SelectItem>
                        <SelectItem value="Best Seller">Best Seller</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: Product["status"]) => handleInputChange("status", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="discontinued">Discontinued</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Product Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formData.image && (
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                        <Image
                          src={formData.image || "/placeholder.svg"}
                          alt="Product image preview"
                          width={300}
                          height={300}
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
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
