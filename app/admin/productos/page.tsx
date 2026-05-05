'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductActive,
  loadCategories,
} from './actions'

interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  active: boolean
  category_id: string
  order_index: number
  created_at: string
  updated_at: string
}

interface Category {
  id: string
  label: string
  slug: string
}

const defaultForm = {
  name: '',
  price: 0,
  description: '',
  image: '',
  active: true,
  category_id: '',
  order_index: 0,
}

export default function ProductsPage() {
  const supabase = createClient()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  const [form, setForm] = useState(defaultForm)

  // Load products (reads are allowed via anon key SELECT policy)
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')

      const { data, error: err } = await supabase
        .from('products')
        .select('*')
        .order('order_index', { ascending: true })

      if (err) throw err
      setProducts(data ?? [])
    } catch (err: any) {
      setError(`Error al cargar productos: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Load categories using admin client via server action
  const fetchCategories = async () => {
    const result = await loadCategories()
    if (result.success) {
      setCategories(result.data)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const openCreate = () => {
    const firstCategoryId = categories[0]?.id ?? ''
    setForm({ ...defaultForm, order_index: products.length, category_id: firstCategoryId })
    setEditingProduct(null)
    setIsCreating(true)
    setIsOpen(true)
    setError('')
    setSuccess('')
  }

  const openEdit = (product: Product) => {
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      active: product.active,
      category_id: product.category_id,
      order_index: product.order_index,
    })
    setEditingProduct(product)
    setIsCreating(false)
    setIsOpen(true)
    setError('')
    setSuccess('')
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    const result = isCreating
      ? await createProduct(form)
      : await updateProduct(editingProduct!.id, form)

    setSaving(false)

    if (!result.success) {
      setError(result.error ?? 'Error desconocido')
      return
    }

    setSuccess(isCreating ? 'Producto creado correctamente' : 'Producto actualizado correctamente')
    setIsOpen(false)
    await fetchProducts()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    setError('')

    const result = await deleteProduct(deleteId)

    setDeleting(false)

    if (!result.success) {
      setError(result.error ?? 'Error al eliminar')
      setDeleteId(null)
      return
    }

    setSuccess('Producto eliminado')
    setDeleteId(null)
    await fetchProducts()
  }

  const handleToggleActive = async (product: Product) => {
    const result = await toggleProductActive(product.id, !product.active)
    if (!result.success) {
      setError(result.error ?? 'Error al cambiar estado')
      return
    }
    await fetchProducts()
  }

  const getCategoryLabel = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.label ?? '—'
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-admin-text">Productos</h1>
          <p className="text-sm text-admin-muted mt-1">
            {products.length} producto{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={openCreate} className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Feedback */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Search */}
      <Input
        placeholder="Buscar productos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-white border-admin-border"
      />

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-admin-muted" />
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="border border-admin-border rounded-lg overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-admin-border bg-admin-bg">
                  <th className="px-4 py-3 text-left font-semibold text-admin-text">Imagen</th>
                  <th className="px-4 py-3 text-left font-semibold text-admin-text">Nombre</th>
                  <th className="px-4 py-3 text-left font-semibold text-admin-text">Categoría</th>
                  <th className="px-4 py-3 text-left font-semibold text-admin-text">Precio</th>
                  <th className="px-4 py-3 text-left font-semibold text-admin-text">Estado</th>
                  <th className="px-4 py-3 text-right font-semibold text-admin-text">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-admin-muted">
                      {products.length === 0 ? 'No hay productos' : 'Sin resultados'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((product) => (
                    <tr key={product.id} className="hover:bg-admin-bg/50 transition-colors">
                      <td className="px-4 py-3">
                        {product.image ? (
                          <div className="relative w-10 h-10 rounded-md overflow-hidden bg-admin-bg">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-admin-bg" />
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-admin-text">{product.name}</td>
                      <td className="px-4 py-3 text-admin-muted">
                        {getCategoryLabel(product.category_id)}
                      </td>
                      <td className="px-4 py-3 text-admin-text">
                        ${Number(product.price).toLocaleString('es-AR')}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            product.active
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {product.active ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(product)}
                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(product.id)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-admin-text">
              {isCreating ? 'Nuevo Producto' : 'Editar Producto'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-admin-text mb-1">Nombre *</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: Pizza Margarita"
                className="bg-white border-admin-border"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-admin-text mb-1">Categoría *</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full rounded-md border border-admin-border bg-white px-3 py-2 text-sm text-admin-text focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="" disabled>
                  Seleccionar categoría
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-admin-text mb-1">Precio</label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                step="1"
                min="0"
                className="bg-white border-admin-border"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-admin-text mb-1">Descripción</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe el producto..."
                rows={3}
                className="bg-white border-admin-border"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-admin-text mb-1">
                Imagen URL *
              </label>
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="bg-white border-admin-border"
              />
              {form.image && (
                <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden bg-admin-bg border border-admin-border">
                  <Image
                    src={form.image}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
            </div>

            {/* File upload */}
            <div>
              <label className="block text-sm font-medium text-admin-text mb-2">
                O sube desde tu PC
              </label>
              <div className="border-2 border-dashed border-admin-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    try {
                      setUploadingImage(true)
                      const formData = new FormData()
                      formData.append('file', file)
                      const res = await fetch('/api/upload', { method: 'POST', body: formData })
                      const data = await res.json()
                      if (data.error) throw new Error(data.error)
                      setForm((prev) => ({ ...prev, image: data.url }))
                    } catch (err: any) {
                      setError(err.message)
                    } finally {
                      setUploadingImage(false)
                    }
                  }}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {uploadingImage ? (
                    <Loader2 className="w-5 h-5 animate-spin text-admin-muted mx-auto" />
                  ) : (
                    <>
                      <p className="text-sm font-medium text-admin-text">Haz click para subir</p>
                      <p className="text-xs text-admin-muted mt-1">PNG, JPG, WEBP (max 10MB)</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Order index */}
            <div>
              <label className="block text-sm font-medium text-admin-text mb-1">Orden</label>
              <Input
                type="number"
                value={form.order_index}
                onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
                min="0"
                className="bg-white border-admin-border"
              />
            </div>

            {/* Active */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="active"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-4 h-4 rounded border-admin-border"
              />
              <label htmlFor="active" className="text-sm font-medium text-admin-text cursor-pointer">
                Mostrar en tienda
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={saving}
              className="border-admin-border"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary hover:bg-primary/90"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : isCreating ? (
                'Crear'
              ) : (
                'Actualizar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-admin-text">Eliminar producto</AlertDialogTitle>
            <AlertDialogDescription className="text-admin-muted">
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-admin-border">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
