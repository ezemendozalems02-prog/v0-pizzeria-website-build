'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useProductsContext, type Product } from '@/components/products-provider'
import Image from 'next/image'
import {
  Wifi, WifiOff, Loader2, CheckCircle2, Pencil, Trash2,
  Eye, EyeOff, Upload, X, CloudUpload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price)

export default function ProductsAdminPage() {
  const { products, loading, status, updateProductLocally, refreshFromDB } = useProductsContext()
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [editForm, setEditForm] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openEdit = (product: Product) => {
    setEditProduct(product)
    setEditForm({ ...product })
  }

  const closeEdit = () => {
    setEditProduct(null)
    setEditForm(null)
  }

  // Upload image to Supabase Storage
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      console.error('[productos-admin] File is not an image')
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        setEditForm((prev: any) => ({ ...prev, image: data.url }))
      } else if (data.error) {
        console.error('[productos-admin] Upload error:', data.error)
      }
    } catch (err) {
      console.error('[productos-admin] Upload error:', err)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    if (!editForm) return
    setSaving(true)
    const targetId = editForm.id

    // Optimistic update
    updateProductLocally(targetId, {
      name: editForm.name,
      price: Number(editForm.price),
      description: editForm.description,
      image: editForm.image,
      active: editForm.active,
      order_index: Number(editForm.order_index),
    })
    closeEdit()

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('products')
        .update({
          name: editForm.name,
          price: Number(editForm.price),
          description: editForm.description,
          image: editForm.image,
          active: editForm.active,
          order_index: Number(editForm.order_index),
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetId)

      if (error) throw error
      await fetch('/api/banners/revalidate', { method: 'POST' }).catch(() => {})
      setSavedId(targetId)
      setTimeout(() => setSavedId(null), 3000)
      await refreshFromDB()
    } catch (err) {
      console.error('[productos-admin] Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (product: Product) => {
    updateProductLocally(product.id, { active: !product.active })
    const supabase = createClient()
    await supabase.from('products').update({ active: !product.active }).eq('id', product.id)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const supabase = createClient()
      await supabase.from('products').delete().eq('id', deleteId)
      await refreshFromDB()
    } catch (err) {
      console.error('[productos-admin] Delete error:', err)
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#243329]/35 mb-2">
            Panel interno
          </p>
          <h1 className="font-serif text-4xl font-bold text-[#243329] leading-tight">
            Gestionar Productos
          </h1>
          <p className="text-sm text-[#243329]/60 mt-2">
            Editá imágenes, precios y descripciones. Los cambios se reflejan en tiempo real.
          </p>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
          status === 'connected' ? 'bg-green-50 text-green-700 border-green-200'
          : status === 'connecting' ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {status === 'connected' ? <><Wifi className="w-3.5 h-3.5" /> En vivo</>
          : status === 'connecting' ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Conectando</>
          : <><WifiOff className="w-3.5 h-3.5" /> Sin conexión</>}
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-[#243329]/10 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-[#243329]/8 last:border-b-0 animate-pulse">
              <div className="w-11 h-11 rounded-full bg-[#F5EFE8] flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 bg-[#F5EFE8] rounded w-1/3" />
                <div className="h-3 bg-[#F5EFE8] rounded w-2/3" />
              </div>
              <div className="h-6 bg-[#F5EFE8] rounded-full w-20" />
              <div className="h-4 bg-[#F5EFE8] rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#243329]/10 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_180px_110px_80px_90px] gap-4 items-center px-6 py-3 bg-[#F5EFE8]/50 border-b border-[#243329]/10">
            <span className="text-xs font-semibold text-[#243329]/50 uppercase tracking-wide">Producto</span>
            <span className="text-xs font-semibold text-[#243329]/50 uppercase tracking-wide">Categoría</span>
            <span className="text-xs font-semibold text-[#243329]/50 uppercase tracking-wide">Precio</span>
            <span className="text-xs font-semibold text-[#243329]/50 uppercase tracking-wide">Estado</span>
            <span className="text-xs font-semibold text-[#243329]/50 uppercase tracking-wide text-right">Acciones</span>
          </div>

          {products.map((product) => (
            <div
              key={product.id}
              className={`grid grid-cols-[1fr_180px_110px_80px_90px] gap-4 items-center px-6 py-3.5 border-b border-[#243329]/8 last:border-b-0 transition-colors hover:bg-[#F5EFE8]/30 ${
                savedId === product.id ? 'bg-green-50/40' : ''
              }`}
            >
              {/* Product col */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-[#F5EFE8] flex-shrink-0 border border-[#243329]/10">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={44}
                      height={44}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#243329]/20 text-xs">?</div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#243329] truncate">{product.name}</p>
                    {savedId === product.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#243329]/50 truncate">{product.description}</p>
                </div>
              </div>

              {/* Category badge */}
              <div>
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-[#F5EFE8] text-[#243329]/70 border border-[#243329]/10">
                  {product.category}
                </span>
              </div>

              {/* Price */}
              <p className="text-sm font-bold text-[#C4322B]">
                {formatPrice(product.price)}
              </p>

              {/* Active toggle */}
              <button
                onClick={() => handleToggleActive(product)}
                title={product.active ? 'Activo — click para ocultar' : 'Oculto — click para activar'}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  product.active
                    ? 'text-green-500 hover:bg-green-50'
                    : 'text-[#243329]/25 hover:bg-[#F5EFE8]'
                }`}
              >
                {product.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              {/* Actions */}
              <div className="flex items-center gap-1 justify-end">
                <button
                  onClick={() => openEdit(product)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#243329]/40 hover:text-[#243329] hover:bg-[#F5EFE8] transition-colors"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(product.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#243329]/40 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={!!editProduct} onOpenChange={(open) => { if (!open) closeEdit() }}>
        <DialogContent className="max-w-md bg-white p-0 gap-0 overflow-hidden rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#243329]/10">
            <DialogTitle className="font-serif text-xl font-bold text-[#243329]">
              Editar producto
            </DialogTitle>
          </DialogHeader>

          {editForm && (
            <div className="px-6 py-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Image upload zone — prominent drag & drop */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.add('bg-[#C4322B]/10', 'border-[#C4322B]')
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('bg-[#C4322B]/10', 'border-[#C4322B]')
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove('bg-[#C4322B]/10', 'border-[#C4322B]')
                  const file = e.dataTransfer.files?.[0]
                  if (file?.type.startsWith('image/')) handleFileUpload(file)
                }}
                className="relative border-2 border-dashed border-[#243329]/20 rounded-2xl p-6 bg-[#F5EFE8]/40 hover:bg-[#F5EFE8] cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-8 h-8 text-[#C4322B] animate-spin" />
                    <p className="text-xs font-semibold text-[#243329]">Subiendo...</p>
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-10 h-10 text-[#C4322B]" />
                    <div className="text-center">
                      <p className="text-xs font-semibold text-[#243329]">
                        Arrastrá la imagen o hacé click
                      </p>
                      <p className="text-[10px] text-[#243329]/50 mt-0.5">
                        PNG, JPG, GIF
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Preview */}
              {editForm.image && (
                <div className="relative w-full h-40 rounded-xl overflow-hidden bg-[#F5EFE8] border border-[#243329]/10">
                  <Image
                    key={editForm.image}
                    src={editForm.image}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              {/* URL input */}
              <div>
                <label className="block text-xs font-semibold text-[#243329]/60 mb-1.5">
                  O pegá la URL directamente
                </label>
                <Input
                  value={editForm.image || ''}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="font-mono text-xs bg-white border-[#243329]/15 focus:border-[#C4322B]/40"
                />
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file)
                }}
              />

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-[#243329]/60 mb-1.5">
                  Nombre <span className="text-[#C4322B]">*</span>
                </label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="bg-white border-[#243329]/15 text-sm"
                />
              </div>

              {/* Price + Category row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#243329]/60 mb-1.5">
                    Precio (ARS) <span className="text-[#C4322B]">*</span>
                  </label>
                  <Input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="bg-white border-[#243329]/15 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#243329]/60 mb-1.5">
                    Categoría
                  </label>
                  <div className="h-10 px-3 flex items-center rounded-md border border-[#243329]/15 bg-[#F5EFE8]/60 text-sm text-[#243329]/60">
                    {editForm.category}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#243329]/60 mb-1.5">
                  Descripción
                </label>
                <Textarea
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="bg-white border-[#243329]/15 text-sm resize-none"
                />
              </div>

              {/* Order + Visible row */}
              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-xs font-semibold text-[#243329]/60 mb-1.5">
                    Orden
                  </label>
                  <Input
                    type="number"
                    value={editForm.order_index ?? 0}
                    onChange={(e) => setEditForm({ ...editForm, order_index: e.target.value })}
                    className="bg-white border-[#243329]/15 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#243329]/60 mb-1.5">
                    Visible
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, active: true })}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors border ${
                        editForm.active
                          ? 'bg-[#C4322B] text-white border-[#C4322B]'
                          : 'bg-white text-[#243329]/60 border-[#243329]/15 hover:bg-[#F5EFE8]'
                      }`}
                    >
                      Activo
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, active: false })}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors border ${
                        !editForm.active
                          ? 'bg-[#C4322B] text-white border-[#C4322B]'
                          : 'bg-white text-[#243329]/60 border-[#243329]/15 hover:bg-[#F5EFE8]'
                      }`}
                    >
                      Oculto
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={closeEdit}
                  variant="outline"
                  className="flex-1 border-[#243329]/15 text-[#243329]/70"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving || uploading}
                  className="flex-1 bg-[#C4322B] hover:bg-[#C4322B]/90 text-white font-semibold"
                >
                  {saving ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-1.5" /> Guardando...</>
                  ) : (
                    'Guardar'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null) }}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-[#243329]">Eliminar producto</AlertDialogTitle>
            <AlertDialogDescription className="text-[#243329]/60">
              Esta acción no se puede deshacer. El producto será eliminado definitivamente del catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#243329]/15 text-[#243329]">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

