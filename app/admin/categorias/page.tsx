"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Pencil, Trash2, Check, X, Loader2 } from "lucide-react"
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
import { createClient } from "@/lib/supabase/client"
import { createCategory, updateCategory, deleteCategory } from "./actions"

interface Category {
  id: string
  slug: string
  label: string
  product_count?: number
}

export default function CategoriasPage() {
  const supabase = createClient()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null) // id of row being saved

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState("")
  const [newLabel, setNewLabel] = useState("")
  const [showNew, setShowNew] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // ── Load categories + product counts ──────────────────────────────────────
  const loadCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Get categories
      const { data: cats, error: catsErr } = await supabase
        .from("categories")
        .select("id, slug, label")
        .order("label", { ascending: true })

      if (catsErr) throw catsErr

      // Get product counts per category_id
      const { data: products, error: prodsErr } = await supabase
        .from("products")
        .select("category_id")

      if (prodsErr) throw prodsErr

      const countMap: Record<string, number> = {}
      for (const p of products ?? []) {
        if (p.category_id) {
          countMap[p.category_id] = (countMap[p.category_id] ?? 0) + 1
        }
      }

      setCategories(
        (cats ?? []).map((c) => ({ ...c, product_count: countMap[c.id] ?? 0 }))
      )
    } catch (err: any) {
      setError(err?.message ?? "Error al cargar categorías")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  // ── Add ───────────────────────────────────────────────────────────────────
  async function handleAdd() {
    const trimmed = newLabel.trim()
    if (!trimmed) return

    const slug = trimmed
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

    setSaving("new")
    setError(null)
    try {
      const result = await createCategory(trimmed, slug)

      if (!result.success) throw new Error(result.error)

      setNewLabel("")
      setShowNew(false)
      await loadCategories()
    } catch (err: any) {
      setError(err?.message ?? "Error al agregar categoría")
    } finally {
      setSaving(null)
    }
  }

  // ── Update ────────────────────────────────────────────────────────────────
  async function handleUpdate(cat: Category) {
    const trimmed = editLabel.trim()
    if (!trimmed) { setEditingId(null); return }

    const slug = trimmed
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

    setSaving(cat.id)
    setError(null)
    try {
      const result = await updateCategory(cat.id, trimmed, slug)

      if (!result.success) throw new Error(result.error)

      setEditingId(null)
      await loadCategories()
    } catch (err: any) {
      setError(err?.message ?? "Error al actualizar categoría")
    } finally {
      setSaving(null)
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteId) return
    setSaving(deleteId)
    setError(null)
    try {
      const result = await deleteCategory(deleteId)

      if (!result.success) throw new Error(result.error)

      setDeleteId(null)
      await loadCategories()
    } catch (err: any) {
      setError(err?.message ?? "Error al eliminar categoría")
    } finally {
      setSaving(null)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text">Categorías</h1>
          <p className="text-sm text-admin-muted mt-0.5">{categories.length} categoría{categories.length !== 1 ? "s" : ""}</p>
        </div>
        <Button
          onClick={() => { setShowNew(true); setError(null) }}
          className="bg-primary hover:bg-primary/90 text-white"
          disabled={showNew}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva categoría
        </Button>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white border border-admin-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_110px_100px] gap-4 px-5 py-3 border-b border-admin-border bg-admin-bg">
          <p className="text-xs font-medium text-admin-muted uppercase tracking-wide">Nombre</p>
          <p className="text-xs font-medium text-admin-muted uppercase tracking-wide">Productos</p>
          <p className="text-xs font-medium text-admin-muted uppercase tracking-wide text-right">Acciones</p>
        </div>

        {/* New row */}
        {showNew && (
          <div className="grid grid-cols-[1fr_110px_100px] gap-4 px-5 py-3 border-b border-admin-border bg-primary/5 items-center">
            <Input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Ej: Postres"
              className="h-8 text-sm bg-white border-admin-border"
              autoFocus
              disabled={saving === "new"}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd()
                if (e.key === "Escape") { setShowNew(false); setNewLabel("") }
              }}
            />
            <p className="text-sm text-admin-muted">—</p>
            <div className="flex gap-1 justify-end">
              <button
                onClick={handleAdd}
                disabled={saving === "new" || !newLabel.trim()}
                className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors disabled:opacity-40"
              >
                {saving === "new" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              </button>
              <button
                onClick={() => { setShowNew(false); setNewLabel("") }}
                disabled={saving === "new"}
                className="p-1.5 rounded-lg text-admin-muted hover:bg-admin-bg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Category rows */}
        <div className="divide-y divide-admin-border">
          {categories.length === 0 && !showNew && (
            <p className="px-5 py-6 text-sm text-admin-muted text-center">
              No hay categorías. Agregá una con el botón de arriba.
            </p>
          )}
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="grid grid-cols-[1fr_110px_100px] gap-4 px-5 py-3 items-center hover:bg-admin-bg/50 transition-colors"
            >
              {editingId === cat.id ? (
                <Input
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className="h-8 text-sm bg-white border-admin-border"
                  autoFocus
                  disabled={saving === cat.id}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUpdate(cat)
                    if (e.key === "Escape") setEditingId(null)
                  }}
                />
              ) : (
                <div>
                  <p className="text-sm font-medium text-admin-text">{cat.label}</p>
                  <p className="text-xs text-admin-muted/60">{cat.slug}</p>
                </div>
              )}

              <p className="text-sm text-admin-muted">{cat.product_count ?? 0} productos</p>

              <div className="flex gap-1 justify-end">
                {editingId === cat.id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(cat)}
                      disabled={saving === cat.id}
                      className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors disabled:opacity-40"
                    >
                      {saving === cat.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      disabled={saving === cat.id}
                      className="p-1.5 rounded-lg text-admin-muted hover:bg-admin-bg transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setEditingId(cat.id); setEditLabel(cat.label) }}
                      disabled={!!saving}
                      className="p-1.5 rounded-lg text-admin-muted hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-40"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(cat.id)}
                      disabled={!!saving}
                      className="p-1.5 rounded-lg text-admin-muted hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
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
              {(() => {
                const cat = categories.find((c) => c.id === deleteId)
                const count = cat?.product_count ?? 0
                return count > 0
                  ? `Esta categoría tiene ${count} producto${count !== 1 ? "s" : ""} asignado${count !== 1 ? "s" : ""}. Los productos quedarán sin categoría. ¿Continuar?`
                  : "¿Seguro que querés eliminar esta categoría?"
              })()}
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
              {saving === deleteId ? <Loader2 className="w-4 h-4 animate-spin" /> : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
