"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { productCategories, generateSKU, type Product } from "@/lib/products"
import { updateProduct } from "../actions"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Save, Eye, Upload } from "lucide-react"

export default function EditProductForm({ product }: { product: Product }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [specs, setSpecs] = useState(() => {
    try {
      return product.specifications || {}
    } catch (e) {
      return {}
    }
  })

  const [formData, setFormData] = useState({
    id: String(product.id),
    name: product.name || "",
    description: product.description || "",
    fullDescription: product.fullDescription || "",
    price: String(product.price || ""),
    originalPrice: product.originalPrice ? String(product.originalPrice) : "",
    category: product.category || "",
    brand: product.brand || "",
    sku: product.sku || "",
    image: product.image || "",
    inStock: product.inStock,
    stockQuantity: String(product.stockQuantity || 0),
    badge: product.badge || "",
    status: product.status || "inactive",
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === 'name' || field === 'brand') {
      const name = field === 'name' ? (value as string) : formData.name
      const brand = field === 'brand' ? (value as string) : formData.brand
      if (name && brand) setFormData((prev) => ({ ...prev, sku: generateSKU(name, brand) }))
    }
  }

  const handleSave = async (status: string) => {
    setIsLoading(true)
    try {
      const fd = new FormData()
      Object.entries(formData).forEach(([k, v]) => fd.append(k, String(v)))
      fd.set('status', status)
      fd.append('specifications', JSON.stringify(specs || {}))
      await updateProduct(fd)
    } catch (err) {
      console.error('[v0] updateProduct error', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setFormData((prev) => ({ ...prev, image: url }))
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/admin/products" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Edit Product</h1>
              <p className="text-muted-foreground">Update product information</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => handleSave('inactive')} disabled={isLoading || !formData.name}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={() => handleSave('active')} disabled={isLoading || !formData.name || !formData.price}>
              <Eye className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
            </div>
            <div className="space-y-4">
              <Label htmlFor="description">Short Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={3} />
            </div>
            <div className="space-y-4">
              <Label htmlFor="fullDescription">Full Description</Label>
              <Textarea id="fullDescription" value={formData.fullDescription} onChange={(e) => handleInputChange('fullDescription', e.target.value)} rows={6} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price</Label>
              <Input id="originalPrice" type="number" step="0.01" value={formData.originalPrice} onChange={(e) => handleInputChange('originalPrice', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock Quantity</Label>
              <Input id="stockQuantity" type="number" value={formData.stockQuantity} onChange={(e) => handleInputChange('stockQuantity', e.target.value)} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="inStock" checked={formData.inStock} onCheckedChange={(c) => handleInputChange('inStock', c as boolean)} />
              <Label htmlFor="inStock">In Stock</Label>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(v) => handleInputChange('category', v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {productCategories.map((c) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="image-upload">Product Image</Label>
              <div className="mt-2">
                {formData.image && (
                  <div className="aspect-square bg-muted rounded overflow-hidden mb-2">
                    <Image src={formData.image} alt="preview" width={300} height={300} className="object-cover" />
                  </div>
                )}
                <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <Button variant="outline" onClick={() => document.getElementById('image-upload')?.click()} className="w-full"> 
                  <Upload className="w-4 h-4 mr-2" /> Choose Image
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
