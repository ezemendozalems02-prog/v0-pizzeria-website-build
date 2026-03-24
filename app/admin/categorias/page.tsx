"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { useStore, type StoreCategory } from "@/lib/store"

export default function CategoriasPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState("")
  const [newLabel, setNewLabel] = useState("")
  const [showNew, setShowNew] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function productCount(catId: string) {
    return products.filter((p) => p.category === catId).length
  }

  function startEdit(cat: StoreCategory) {
    setEditingId(cat.id)
    setEditLabel(cat.label)
  }

  function confirmEdit(cat: StoreCategory) {
    if (editLabel.trim()) {
      updateCategory({ ...cat, label: editLabel.trim() })
    }
    setEditingId(null)
  }

  function handleAdd() {
    if (!newLabel.trim()) return
    addCategory({
      id: newLabel.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      label: newLabel.trim(),
    })
    setNewLabel("")
    setShowNew(false)
  }

  function handleDelete() {
    if (deleteId) {
      deleteCategory(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text">Categorías</h1>
          <p className="text-sm text-admin-muted mt-0.5">{categories.length} categorías</p>
        </div>
        <Button
          onClick={() => setShowNew(true)}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva categoría
        </Button>
      </div>

      <div className="bg-white border border-admin-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_100px_100px] gap-4 px-5 py-3 border-b border-admin-border bg-admin-bg">
          <p className="text-xs font-medium text-admin-muted uppercase tracking-wide">Nombre</p>
          <p className="text-xs font-medium text-admin-muted uppercase tracking-wide">Productos</p>
          <p className="text-xs font-medium text-admin-muted uppercase tracking-wide text-right">Acciones</p>
        </div>

        {/* New row */}
        {showNew && (
          <div className="grid grid-cols-[1fr_100px_100px] gap-4 px-5 py-3 border-b border-admin-border bg-primary/5 items-center">
            <Input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Nombre de la categoría"
              className="h-8 text-sm bg-white border-admin-border"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd()
                if (e.key === "Escape") setShowNew(false)
              }}
            />
            <p className="text-sm text-admin-muted">—</p>
            <div className="flex gap-1 justify-end">
              <button
                onClick={handleAdd}
                className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowNew(false)}
                className="p-1.5 rounded-lg text-admin-muted hover:bg-admin-bg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Rows */}
        <div className="divide-y divide-admin-border">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="grid grid-cols-[1fr_100px_100px] gap-4 px-5 py-3 items-center hover:bg-admin-bg/50 transition-colors"
            >
              {editingId === cat.id ? (
                <Input
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className="h-8 text-sm bg-white border-admin-border"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") confirmEdit(cat)
                    if (e.key === "Escape") setEditingId(null)
                  }}
                />
              ) : (
                <p className="text-sm font-medium text-admin-text">{cat.label}</p>
              )}

              <p className="text-sm text-admin-muted">{productCount(cat.id)} productos</p>

              <div className="flex gap-1 justify-end">
                {editingId === cat.id ? (
                  <>
                    <button
                      onClick={() => confirmEdit(cat)}
                      className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 rounded-lg text-admin-muted hover:bg-admin-bg transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(cat)}
                      className="p-1.5 rounded-lg text-admin-muted hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(cat.id)}
                      className="p-1.5 rounded-lg text-admin-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-admin-muted">
        Las categorías se usan en el catálogo de delivery y en los filtros del menú.
      </p>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-admin-text">Eliminar categoría</AlertDialogTitle>
            <AlertDialogDescription className="text-admin-muted">
              Los productos de esta categoría quedarán sin categoría asignada. ¿Continuar?
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
