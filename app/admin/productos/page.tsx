"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Pencil, Trash2, Search, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useStore, type StoreProduct } from "@/lib/store"
import { ProductForm } from "@/components/admin/product-form"

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useStore()
  const [search, setSearch] = useState("")
  const [editProduct, setEditProduct] = useState<StoreProduct | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  )

  function getCategoryLabel(id: string) {
    return categories.find((c) => c.id === id)?.label ?? id
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(price)
  }

  function handleSave(p: StoreProduct) {
    if (creating) {
      addProduct(p)
    } else {
      updateProduct(p)
    }
    setSavedId(p.id)
    setTimeout(() => setSavedId(null), 2000)
    setEditProduct(null)
    setCreating(false)
  }

  function handleDelete() {
    if (deleteId) {
      deleteProduct(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-admin-text">Productos</h1>
          <p className="text-sm text-admin-muted mt-0.5">{products.length} productos en total</p>
        </div>
        <Button
          onClick={() => setCreating(true)}
          className="bg-primary hover:bg-primary/90 text-white w-fit"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo producto
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar productos..."
          className="pl-9 bg-white border-admin-border text-admin-text"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-admin-border rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[56px_1fr_140px_120px_100px_100px] gap-4 px-4 py-3 border-b border-admin-border bg-admin-bg">
          <p className="text-xs font-medium text-admin-muted uppercase tracking-wide"></p>
          <p className="text-xs font-medium text-admin-muted uppercase tracking-wide">Producto</p>
          <p className="text-xs font-medium text-admin-muted uppercase tracking-wide">Categoría</p>
          <p className="text-xs font-medium text-admin-muted uppercase tracking-wide">Precio</p>
          <p className="text-xs font-medium text-admin-muted uppercase tracking-wide">Estado</p>
          <p className="text-xs font-medium text-admin-muted uppercase tracking-wide text-right">Acciones</p>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-admin-muted">
            <p className="text-sm">No se encontraron productos.</p>
          </div>
        ) : (
          <div className="divide-y divide-admin-border">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-[56px_1fr_140px_120px_100px_100px] gap-4 px-4 py-3 items-center hover:bg-admin-bg/50 transition-colors"
              >
                {/* Image */}
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-admin-bg border border-admin-border flex-shrink-0">
                  {product.image ? (
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-admin-bg" />
                  )}
                </div>

                {/* Name + description */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-admin-text text-sm truncate">{product.name}</p>
                    {savedId === product.id && (
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-admin-muted truncate mt-0.5">{product.description}</p>
                </div>

                {/* Category */}
                <p className="text-sm text-admin-muted">{getCategoryLabel(product.category)}</p>

                {/* Price */}
                <p className="text-sm font-medium text-admin-text">{formatPrice(product.price)}</p>

                {/* Status */}
                <Badge
                  variant="outline"
                  className={
                    product.active
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-admin-border bg-admin-bg text-admin-muted"
                  }
                >
                  {product.active ? "Activo" : "Inactivo"}
                </Badge>

                {/* Actions */}
                <div className="flex items-center gap-1 justify-end">
                  <button
                    onClick={() => setEditProduct(product)}
                    className="p-1.5 rounded-lg text-admin-muted hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(product.id)}
                    className="p-1.5 rounded-lg text-admin-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit dialog */}
      <Dialog
        open={!!editProduct || creating}
        onOpenChange={(open) => {
          if (!open) {
            setEditProduct(null)
            setCreating(false)
          }
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-admin-text">
              {creating ? "Nuevo producto" : "Editar producto"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editProduct ?? undefined}
            onSave={handleSave}
            onCancel={() => {
              setEditProduct(null)
              setCreating(false)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-admin-text">Eliminar producto</AlertDialogTitle>
            <AlertDialogDescription className="text-admin-muted">
              Esta acción no se puede deshacer. El producto será eliminado del catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-admin-border text-admin-text">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
