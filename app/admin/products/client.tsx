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
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
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
  const { toast } = useToast()
  const [localProducts, setLocalProducts] = useState<DbProduct[]>(products || [])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState<DbProduct | null>(null)
  const [deleting, setDeleting] = useState(false)
  // unified delete (soft) flow only; hard delete UI removed
  const [liveLoading, setLiveLoading] = useState(true)
  
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<string>("all")

  const allProducts = useMemo(() => localProducts, [localProducts])

  // On mount, fetch live list from the admin API (bypass cache & use primary) to ensure UI reflects DB state
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLiveLoading(true)
        const res = await fetch('/api/admin/products/list?bypassCache=1&usePrimary=1')
        if (!res.ok) return
        const j = await res.json()
        if (!mounted) return
        if (j && Array.isArray(j.rows)) {
          setLocalProducts(j.rows)
        }
      } catch (err) {
        console.warn('[v0][client] Failed to fetch live products list', err)
      } finally {
        if (mounted) setLiveLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

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
    setDeleting(true)
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
        // close confirmation modal and clear selection
        try { setConfirmOpen(false) } catch (e) {}
        try { setDeletingProduct(null) } catch (e) {}
        try {
          toast({
            title: 'Product deleted',
            description: 'The product was deleted successfully.',
            action: (
              <ToastAction altText="Undo delete" onClick={async () => {
                try {
                  const r = await fetch('/api/admin/products/restore', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: productId }),
                  })
                  const j = await r.json()
                  if (j?.ok) {
                    // restore in local state and refresh
                    // Note: restored product fields are minimal; a refresh will fetch full data
                    // For now, call refresh and show a toast
                    try { router.refresh() } catch (e) {}
                    toast({ title: 'Restored', description: 'Product restored.' })
                  } else {
                    toast({ title: 'Undo failed', description: 'Could not restore product.' })
                  }
                } catch (err) {
                  console.error(err)
                  toast({ title: 'Undo failed', description: 'Could not restore product.' })
                }
              }}
              >Undo</ToastAction>
            ) as any,
          })
        } catch (e) {}
      } else {
        try { toast({ title: 'Delete failed', description: String(data?.error || 'Delete failed'), variant: 'destructive' }) } catch (e) {}
      }
    } catch (err) {
      console.error(err)
      try { toast({ title: 'Delete failed', description: 'Network error', variant: 'destructive' }) } catch (e) {}
    } finally {
      setDeleting(false)
    }
  }

  // Log when the modal Delete button is clicked to help debug id/stack issues
  const confirmDeleteClicked = async () => {
    if (!deletingProduct) return
    try {
      console.log('[v0][client] Confirm delete clicked id=', deletingProduct.id)
      console.log('[v0][client] Stack:', new Error().stack)
    } catch (e) {
      // ignore
    }
    // Always perform soft-delete (the API supports hard deletes via a flag but the UI exposes only soft delete)
    await handleDeleteProduct(deletingProduct.id)
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
        try { toast({ title: 'Product updated', description: `Status set to ${newStatus}` }) } catch (e) {}
      } else {
        try { toast({ title: 'Status update failed', description: String(data?.error || 'Update failed'), variant: 'destructive' }) } catch (e) {}
      }
    } catch (err) {
      console.error(err)
      try { toast({ title: 'Status update failed', description: 'Network error', variant: 'destructive' }) } catch (e) {}
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
                    <button onClick={() => { setOpen(false); setDeletingProduct(product); setConfirmOpen(true) }} className="w-full text-left text-destructive">Delete</button>
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
            {liveLoading ? (
              <div className="p-6">
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ) : (
              <>
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
                        filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {product.image_url ? (
                                  <Image src={product.image_url} alt={product.name} width={48} height={48} className="rounded-md object-cover" />
                                ) : (
                                  <div className="w-12 h-12 bg-slate-100 rounded-md" />
                                )}
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-xs text-muted-foreground">{product.brand || '—'}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{product.sku || '—'}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{formatCurrencyNGN(product.price)}</TableCell>
                            <TableCell>{product.in_stock ? `${product.stock_quantity}` : 'Out'}</TableCell>
                            <TableCell>
                              <Badge variant={product.status === 'active' ? 'secondary' : 'outline'}>{product.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="inline-flex items-center gap-2">
                                <ActionMenu product={product} />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile: stacked view */}
                <div className="md:hidden">
                  <div className="divide-y">
                    {filteredProducts.length === 0 ? (
                      <div className="p-6 text-center text-muted-foreground">No products found matching your criteria.</div>
                    ) : (
                      filteredProducts.map((product) => (
                        <div key={product.id} className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {product.image_url ? (
                              <Image src={product.image_url} alt={product.name} width={56} height={56} className="rounded-md object-cover" />
                            ) : (
                              <div className="w-14 h-14 bg-slate-100 rounded-md" />
                            )}
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-xs text-muted-foreground">{product.category} • {product.sku || '—'}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm">{formatCurrencyNGN(product.price)}</div>
                            <ActionMenu product={product} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

        </CardContent>
      </Card>

      {/* Confirm delete dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this product? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteClicked} className="bg-destructive text-white">{deleting ? 'Deleting...' : 'Delete'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
