'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Search, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
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

interface FormData {
  name: string
  price: number
  description: string
  image: string
  active: boolean
  category_id: string
  order_index: number
}

export default function ProductsPage() {
  const supabase = createClient()

  // Data states
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Modal states
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [isCreateMode, setIsCreateMode] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form states
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: 0,
    description: '',
    image: '',
    active: true,
    category_id: '1',
    order_index: 0,
  })

  // Feedback states
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)

  // Cargar productos desde Supabase
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setErrorMessage(null)

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error

      setProducts(data || [])
    } catch (err: any) {
      setErrorMessage(`Error al cargar productos: ${err.message}`)
      console.error('Load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  )

  // Abrir modal para crear
  const handleCreate = () => {
    setFormData({
      name: '',
      price: 0,
      description: '',
      image: '',
      active: true,
      category_id: '1',
      order_index: (products?.length ?? 0) + 1,
    })
    setEditProduct(null)
    setIsCreateMode(true)
    setIsDialogOpen(true)
    setErrorMessage(null)
  }

  // Abrir modal para editar
  const handleEdit = (product: Product) => {
    setFormData(product)
    setEditProduct(product)
    setIsCreateMode(false)
    setIsDialogOpen(true)
    setErrorMessage(null)
  }

  // Guardar producto (crear o actualizar)
  const handleSave = async () => {
    try {
      setSaving(true)
      setErrorMessage(null)

      // Validaciones
      if (!formData.name.trim()) {
        setErrorMessage('El nombre del producto es requerido')
        setSaving(false)
        return
      }

      if (!formData.image.trim()) {
        setErrorMessage('La imagen del producto es requerida')
        setSaving(false)
        return
      }

      if (isCreateMode) {
        // Crear nuevo producto
        const newProduct: Product = {
          id: crypto.randomUUID(),
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const { error } = await supabase
          .from('products')
          .insert([newProduct])

        if (error) throw error

        // Actualizar estado local
        setProducts((prev) => [...prev, newProduct])
        setSuccessMessage('Producto creado correctamente')
        setSavedId(newProduct.id)
      } else if (editProduct) {
        // Actualizar producto existente
        const { error } = await supabase
          .from('products')
          .update({
            name: formData.name,
            price: formData.price,
            description: formData.description,
            image: formData.image,
            active: formData.active,
            order_index: formData.order_index,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editProduct.id)

        if (error) throw error

        // Actualizar estado local
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editProduct.id
              ? { ...p, ...formData, updated_at: new Date().toISOString() }
              : p
          )
        )

        setSuccessMessage('Producto actualizado correctamente')
        setSavedId(editProduct.id)
      }

      // Cerrar modal y limpiar
      setIsDialogOpen(false)
      setTimeout(() => {
        setSuccessMessage(null)
        setSavedId(null)
      }, 3000)
    } catch (err: any) {
      setErrorMessage(`Error al guardar: ${err.message}`)
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  // Eliminar producto
  const handleDelete = async () => {
    if (!deleteId) return

    try {
      setDeleting(true)
      setErrorMessage(null)

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', deleteId)

      if (error) throw error

      // Actualizar estado local
      setProducts((prev) => prev.filter((p) => p.id !== deleteId))

      setSuccessMessage('Producto eliminado correctamente')
      setDeleteId(null)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setErrorMessage(`Error al eliminar: ${err.message}`)
      console.error('Delete error:', err)
    } finally {
      setDeleting(false)
    }
  }

  // Alternar estado activo
  const handleToggleActive = async (product: Product) => {
    try {
      const newActive = !product.active

      const { error } = await supabase
        .from('products')
        .update({ active: newActive })
        .eq('id', product.id)

      if (error) throw error

      // Actualizar estado local
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, active: newActive } : p
        )
      )
    } catch (err: any) {
      setErrorMessage(`Error al cambiar estado: ${err.message}`)
      console.error('Toggle error:', err)
    }
  }

  return (
    <div className='flex flex-col gap-6 max-w-6xl'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
        <div className='flex-1'>
          <h1 className='text-2xl font-semibold text-admin-text'>Productos</h1>
          <p className='text-sm text-admin-muted mt-0.5'>
            {products.length} productos en total
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className='bg-primary hover:bg-primary/90 text-white w-fit'
        >
          <Plus className='w-4 h-4 mr-2' />
          Nuevo producto
        </Button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className='p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800 text-sm'>
          <CheckCircle className='w-5 h-5 flex-shrink-0' />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className='p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800 text-sm'>
          <AlertCircle className='w-5 h-5 flex-shrink-0' />
          {errorMessage}
        </div>
      )}

      {/* Search */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted' />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Buscar productos...'
          className='pl-9 bg-white border-admin-border text-admin-text'
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='w-8 h-8 animate-spin text-admin-muted' />
        </div>
      )}

      {/* Products Table */}
      {!loading && (
        <div className='bg-white border border-admin-border rounded-xl overflow-hidden'>
          {/* Table header */}
          <div className='grid grid-cols-[56px_1fr_140px_120px_100px_100px] gap-4 px-4 py-3 border-b border-admin-border bg-admin-bg'>
            <p className='text-xs font-medium text-admin-muted uppercase tracking-wide'></p>
            <p className='text-xs font-medium text-admin-muted uppercase tracking-wide'>
              Producto
            </p>
            <p className='text-xs font-medium text-admin-muted uppercase tracking-wide'>
              Categoría
            </p>
            <p className='text-xs font-medium text-admin-muted uppercase tracking-wide'>Precio</p>
            <p className='text-xs font-medium text-admin-muted uppercase tracking-wide'>Estado</p>
            <p className='text-xs font-medium text-admin-muted uppercase tracking-wide text-right'>
              Acciones
            </p>
          </div>

          {/* Table rows */}
          {filtered.length === 0 ? (
            <div className='py-16 text-center text-admin-muted'>
              <p className='text-sm'>
                {products.length === 0 ? 'No hay productos creados aún' : 'No se encontraron productos.'}
              </p>
            </div>
          ) : (
            <div className='divide-y divide-admin-border'>
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className='grid grid-cols-[56px_1fr_140px_120px_100px_100px] gap-4 px-4 py-3 items-center hover:bg-admin-bg/50 transition-colors'
                >
                  {/* Image */}
                  <div className='relative w-10 h-10 rounded-lg overflow-hidden bg-admin-bg border border-admin-border flex-shrink-0'>
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className='object-cover'
                        unoptimized
                      />
                    ) : (
                      <div className='w-full h-full bg-admin-bg' />
                    )}
                  </div>

                  {/* Name + description */}
                  <div className='min-w-0'>
                    <div className='flex items-center gap-2'>
                      <p className='font-medium text-admin-text text-sm truncate'>{product.name}</p>
                      {savedId === product.id && (
                        <CheckCircle className='w-3.5 h-3.5 text-green-500 flex-shrink-0' />
                      )}
                    </div>
                    <p className='text-xs text-admin-muted truncate mt-0.5'>
                      {product.description}
                    </p>
                  </div>

                  {/* Category */}
                  <p className='text-sm text-admin-muted'>{product.category_id}</p>

                  {/* Price */}
                  <p className='text-sm font-medium text-admin-text'>
                    ${Number(product.price).toFixed(2)}
                  </p>

                  {/* Status */}
                  <Badge
                    variant='outline'
                    className={
                      product.active
                        ? 'border-green-200 bg-green-50 text-green-700 cursor-pointer hover:bg-green-100'
                        : 'border-admin-border bg-admin-bg text-admin-muted cursor-pointer hover:bg-admin-bg/70'
                    }
                    onClick={() => handleToggleActive(product)}
                  >
                    {product.active ? 'Activo' : 'Inactivo'}
                  </Badge>

                  {/* Actions */}
                  <div className='flex items-center gap-1 justify-end'>
                    <button
                      onClick={() => handleEdit(product)}
                      className='p-1.5 rounded-lg text-admin-muted hover:text-primary hover:bg-primary/10 transition-colors'
                      title='Editar'
                    >
                      <Pencil className='w-3.5 h-3.5' />
                    </button>
                    <button
                      onClick={() => setDeleteId(product.id)}
                      className='p-1.5 rounded-lg text-admin-muted hover:text-red-500 hover:bg-red-50 transition-colors'
                      title='Eliminar'
                    >
                      <Trash2 className='w-3.5 h-3.5' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='max-w-lg max-h-[90vh] overflow-y-auto bg-white'>
          <DialogHeader>
            <DialogTitle className='text-admin-text'>
              {isCreateMode ? 'Nuevo producto' : 'Editar producto'}
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            {/* Product Name */}
            <div>
              <label className='block text-sm font-medium text-admin-text mb-1'>
                Nombre del Producto *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder='Ej: Pizza Margarita'
                className='bg-white border-admin-border text-admin-text'
              />
            </div>

            {/* Price */}
            <div>
              <label className='block text-sm font-medium text-admin-text mb-1'>Precio</label>
              <Input
                type='number'
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                placeholder='0.00'
                step='0.01'
                className='bg-white border-admin-border text-admin-text'
              />
            </div>

            {/* Description */}
            <div>
              <label className='block text-sm font-medium text-admin-text mb-1'>Descripción</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder='Describe el producto...'
                rows={3}
                className='bg-white border-admin-border text-admin-text'
              />
            </div>

            {/* Image URL */}
            <div>
              <label className='block text-sm font-medium text-admin-text mb-1'>
                URL de la Imagen *
              </label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder='https://ejemplo.com/imagen.jpg'
                className='bg-white border-admin-border text-admin-text'
              />
              {formData.image && (
                <div className='mt-2 relative w-full h-32 rounded-lg overflow-hidden bg-admin-bg border border-admin-border'>
                  <Image
                    src={formData.image}
                    alt='Preview'
                    fill
                    className='object-cover'
                    unoptimized
                  />
                </div>
              )}
            </div>

            {/* Active Toggle */}
            <div className='flex items-center gap-3'>
              <input
                type='checkbox'
                id='active'
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className='w-4 h-4 rounded border-admin-border text-primary cursor-pointer'
              />
              <label htmlFor='active' className='text-sm font-medium text-admin-text cursor-pointer'>
                Mostrar en la tienda
              </label>
            </div>
          </div>

          <DialogFooter className='gap-2'>
            <Button
              variant='outline'
              onClick={() => setIsDialogOpen(false)}
              className='border-admin-border text-admin-text'
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className='bg-primary hover:bg-primary/90 text-white gap-2'
            >
              {saving && <Loader2 className='w-4 h-4 animate-spin' />}
              {isCreateMode ? 'Crear' : 'Actualizar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className='bg-white'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-admin-text'>Eliminar producto</AlertDialogTitle>
            <AlertDialogDescription className='text-admin-muted'>
              Esta acción no se puede deshacer. El producto será eliminado del catálogo y la base de
              datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='border-admin-border text-admin-text'>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className='bg-red-500 hover:bg-red-600 text-white gap-2'
            >
              {deleting && <Loader2 className='w-4 h-4 animate-spin' />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
