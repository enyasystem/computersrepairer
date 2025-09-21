"use client"

import { useMemo, useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { productCategories, formatPrice, type Product } from "@/lib/products"
import { formatCurrencyNGN } from "@/lib/format"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Package, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

type DbProduct = {
  id: number
  name: string
  description?: string
  full_description?: string
  price: number
  original_price?: number | null
  category: string
  brand?: string
  sku?: string
  image_url?: string | null
  in_stock: boolean
  stock_quantity: number
  badge?: string | null
  status: string
}

export default function AdminProductsClient({ products, total, page, perPage }: { products: DbProduct[]; total?: number; page?: number; perPage?: number }) {
  const router = useRouter()
  const [localProducts, setLocalProducts] = useState<DbProduct[]>(products || [])
  
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<string>("all")

  const allProducts = useMemo(() => localProducts, [localProducts])

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product: any) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku || "").toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || product.status === statusFilter
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && product.in_stock) ||
        (stockFilter === "out-of-stock" && !product.in_stock) ||
        (stockFilter === "low-stock" && product.in_stock && product.stock_quantity <= 10)

      return matchesSearch && matchesStatus && matchesCategory && matchesStock
    })
  }, [allProducts, searchTerm, statusFilter, categoryFilter, stockFilter])

  const stats = useMemo(() => ({
    total: allProducts.length,
    active: allProducts.filter((p: any) => p.status === "active").length,
    outOfStock: allProducts.filter((p: any) => !p.in_stock).length,
    lowStock: allProducts.filter((p: any) => p.in_stock && p.stock_quantity <= 10).length,
  }), [allProducts])

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    try {
      const res = await fetch("/api/admin/products/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId }),
      })
      const data = await res.json()
      if (data?.ok) {
        // update local state so counts update immediately without a full reload
        setLocalProducts((prev) => prev.filter((p) => p.id !== productId))
        try { router.refresh() } catch (e) {}
      } else {
        alert("Delete failed")
      }
    } catch (err) {
      console.error(err)
      alert("Delete failed")
    }
  }

  const handleStatusChange = async (productId: number, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/products/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, status: newStatus }),
      })
      const data = await res.json()
      if (data?.ok) {
        // update local copy to reflect new status immediately
        setLocalProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, status: newStatus } : p)))
        try { router.refresh() } catch (e) {}
      } else {
        alert("Status update failed")
      }
    } catch (err) {
      console.error(err)
      alert("Status update failed")
    }
  }

  // Small custom action menu rendered into document.body to avoid clipping/positioning issues
  function ActionMenu({ product }: { product: DbProduct }) {
    const btnRef = useRef<HTMLButtonElement | null>(null)
    const [open, setOpen] = useState(false)
    const [pos, setPos] = useState({ top: 0, left: 0 })

    useEffect(() => {
      if (!open) return
      const el = btnRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const menuWidth = 220
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
          // eslint-disable-next-line react/no-children-prop
          (function renderPortal() {
            const menu = (
              <div style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999, width: 220 }} className="bg-popover text-popover-foreground rounded-md border shadow-md p-2">
                <div className="text-sm font-medium px-2 py-1">Actions</div>
                <div className="divide-y">
                  <div className="px-2 py-2">
                    <Link href={`/shop/${product.id}`} className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>View Product</span>
                    </Link>
                  </div>
                  <div className="px-2 py-2">
                    <Link href={`/admin/products/edit/${product.id}`} className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Link>
                  </div>
                  <div className="px-2 py-2">
                    {product.status === 'active' ? (
                      <button onClick={() => { setOpen(false); handleStatusChange(product.id, 'inactive') }} className="w-full text-left">Deactivate</button>
                    ) : (
                      <button onClick={() => { setOpen(false); handleStatusChange(product.id, 'active') }} className="w-full text-left">Activate</button>
                    )}
                  </div>
                  <div className="px-2 py-2">
                    <button onClick={() => { setOpen(false); handleStatusChange(product.id, 'discontinued') }} className="w-full text-left">Discontinue</button>
                  </div>
                  <div className="px-2 py-2">
                    <button onClick={() => { setOpen(false); handleDeleteProduct(product.id) }} className="w-full text-left text-destructive">Delete</button>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
          <p className="text-muted-foreground">Manage your shop inventory and products</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <CheckCircle className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.outOfStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStock}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your product catalog and inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {productCategories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            {/* Desktop/large: table view */}
            <div className="hidden md:block">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No products found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product: any) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-md">
                            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">{product.brand}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{product.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{formatCurrencyNGN(Number(product.price))}</span>
                          {product.original_price && (
                            <span className="text-sm text-muted-foreground line-through">{formatCurrencyNGN(Number(product.original_price))}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              !product.in_stock
                                ? "bg-red-500"
                                : product.stock_quantity <= 10
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                          />
                          <span className="text-sm">{product.in_stock ? `${product.stock_quantity} units` : "Out of stock"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.status === "active" ? "default" : product.status === "inactive" ? "secondary" : "outline"}>{product.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <ActionMenu product={product} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              </Table>
            </div>

            {/* Mobile: card list with inline actions */}
            <div className="block md:hidden">
              <div className="space-y-3 p-3">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No products found matching your criteria.</div>
                ) : (
                  filteredProducts.map((product: any) => (
                    <div key={product.id} className="flex items-center justify-between space-x-3 border rounded-md p-3">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
                          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="font-medium truncate max-w-xs">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.brand}</div>
                          <div className="text-sm">{formatCurrencyNGN(Number(product.price))}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link href={`/admin/products/edit/${product.id}`} className="text-sm px-2 py-1 rounded bg-slate-100 hover:bg-slate-200">Edit</Link>
                        <button onClick={() => handleDeleteProduct(product.id)} className="text-sm px-2 py-1 rounded bg-red-50 text-destructive">Delete</button>
                        <button onClick={() => handleStatusChange(product.id, product.status === 'active' ? 'inactive' : 'active')} className="text-sm px-2 py-1 rounded bg-slate-50">{product.status === 'active' ? 'Deactivate' : 'Activate'}</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Pagination controls */}
      {typeof total !== 'undefined' && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Showing page {page} — {localProducts.length} products</div>
          <div className="flex items-center space-x-2">
            <Link href={`?page=${Math.max(1, (page || 1) - 1)}&perPage=${perPage || 10}`} className="px-3 py-1 rounded border hover:bg-slate-50">Previous</Link>
            <Link href={`?page=${(page || 1) + 1}&perPage=${perPage || 10}`} className="px-3 py-1 rounded border hover:bg-slate-50">Next</Link>
          </div>
        </div>
      )}
    </div>
  )
}
