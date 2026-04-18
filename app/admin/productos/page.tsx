'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Search, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ImageUpload } from '@/components/admin/image-upload'
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

export default function ProductsPage() {
  const supabase = createClient()

  // Estados de datos
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Estados de modal
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Estados de formulario
  const [form, setForm] = useState({
    name: '',
    price: 0,
    description: '',
    image: '',
    active: true,
    category_id: '1',
    order_index: 0,
  })

  // Estados de feedback
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Cargar productos al iniciar
  useEffect(() => {
    loadProducts()
  }, [])

  // Auto-limpiar mensajes
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('products')
        .select('*')
        .order('order_index', { ascending: true })

      if (err) throw err
      setProducts(data || [])
    } catch (err: any) {
      setError(`Error al cargar: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setForm({
      name: '',
      price: 0,
      description: '',
      image: '',
      active: true,
      category_id: '1',
      order_index: products.length,
    })
    setEditingProduct(null)
    setIsCreating(true)
    setIsOpen(true)
    setError(null)
  }

  const openEdit = (product: Product) => {
    setForm(product)
    setEditingProduct(product)
    setIsCreating(false)
    setIsOpen(true)
    setError(null)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)

      if (!form.name.trim()) {
        setError('El nombre es requerido')
        setSaving(false)
        return
      }

      if (!form.image.trim()) {
        setError('La imagen es requerida')
        setSaving(false)
        return
      }

      if (isCreating) {
        // Crear nuevo
        const { error: err } = await supabase.from('products').insert([
          {
            id: crypto.randomUUID(),
            name: form.name,
            price: Number(form.price),
            description: form.description,
            image: form.image,
            active: form.active,
            category_id: form.category_id,
            order_index: form.order_index,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        if (err) throw err
        setSuccess('Producto creado correctamente')
      } else if (editingProduct) {
        // Actualizar existente
        const { error: err } = await supabase
          .from('products')
          .update({
            name: form.name,
            price: Number(form.price),
            description: form.description,
            image: form.image,
            active: form.active,
            order_index: form.order_index,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingProduct.id)
        if (err) throw err
        setSuccess('Producto actualizado correctamente')
      }

      setIsOpen(false)
      await loadProducts()
    } catch (err: any) {
      setError(`Error: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      setDeleting(true)
      const { error: err } = await supabase.from('products').delete().eq('id', deleteId)
      if (err) throw err
      setSuccess('Producto eliminado')
      setDeleteId(null)
      await loadProducts()
    } catch (err: any) {
      setError(`Error: ${err.message}`)
    } finally {
      setDeleting(false)
    }
  }

  const toggleActive = async (product: Product) => {
    try {
      const { error: err } = await supabase
        .from('products')
        .update({ active: !product.active })
        .eq('id', product.id)
      if (err) throw err
      await loadProducts()
    } catch (err: any) {
      setError(`Error: ${err.message}`)
    }
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='flex flex-col gap-6 max-w-6xl'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-admin-text'>Productos</h1>
          <p className='text-sm text-admin-muted mt-1'>{products.length} productos en total</p>
        </div>
        <Button onClick={openCreate} className='bg-primary hover:bg-primary/90 text-white'>
          <Plus className='w-4 h-4 mr-2' />
          Nuevo
        </Button>
      </div>

      {/* Mensajes */}
      {success && (
        <div className='p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800 text-sm'>
          <CheckCircle className='w-5 h-5' />
          {success}
        </div>
      )}
      {error && (
        <div className='p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800 text-sm'>
          <AlertCircle className='w-5 h-5' />
          {error}
        </div>
      )}

      {/* Búsqueda */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted' />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Buscar productos...'
          className='pl-9'
        />
      </div>

      {/* Tabla */}
      {loading ? (
        <div className='flex justify-center py-12'>
          <Loader2 className='w-8 h-8 animate-spin text-admin-muted' />
        </div>
      ) : (
        <div className='bg-white border border-admin-border rounded-xl overflow-hidden'>
          <div className='grid grid-cols-[56px_1fr_120px_100px_100px_80px] gap-4 px-4 py-3 border-b bg-admin-bg'>
            <span className='text-xs font-medium uppercase text-admin-muted'></span>
            <span className='text-xs font-medium uppercase text-admin-muted'>Producto</span>
            <span className='text-xs font-medium uppercase text-admin-muted'>Precio</span>
            <span className='text-xs font-medium uppercase text-admin-muted'>Estado</span>
            <span className='text-xs font-medium uppercase text-admin-muted'>Categoría</span>
            <span className='text-xs font-medium uppercase text-admin-muted text-right'>Acciones</span>
          </div>

          {filtered.length === 0 ? (
            <div className='py-16 text-center text-admin-muted'>
              <p className='text-sm'>No hay productos</p>
            </div>
          ) : (
            <div className='divide-y'>
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className='grid grid-cols-[56px_1fr_120px_100px_100px_80px] gap-4 px-4 py-3 items-center hover:bg-admin-bg/50'
                >
                  {/* Imagen */}
                  <div className='relative w-10 h-10 rounded bg-admin-bg border border-admin-border overflow-hidden'>
                    {product.image && (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className='object-cover'
                        unoptimized
                      />
                    )}
                  </div>

                  {/* Nombre */}
                  <div>
                    <p className='text-sm font-medium text-admin-text'>{product.name}</p>
                    <p className='text-xs text-admin-muted truncate'>{product.description}</p>
                  </div>

                  {/* Precio */}
                  <p className='text-sm font-medium text-admin-text'>${product.price}</p>

                  {/* Estado */}
                  <Badge
                    variant='outline'
                    className={`cursor-pointer w-fit ${
                      product.active
                        ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                        : 'border-admin-border bg-admin-bg hover:bg-admin-bg/70'
                    }`}
                    onClick={() => toggleActive(product)}
                  >
                    {product.active ? 'Activo' : 'Inactivo'}
                  </Badge>

                  {/* Categoría */}
                  <p className='text-sm text-admin-muted'>{product.category_id}</p>

                  {/* Acciones */}
                  <div className='flex gap-1 justify-end'>
                    <button
                      onClick={() => openEdit(product)}
                      className='p-1.5 rounded hover:bg-primary/10 text-admin-muted hover:text-primary'
                    >
                      <Pencil className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => setDeleteId(product.id)}
                      className='p-1.5 rounded hover:bg-red-50 text-admin-muted hover:text-red-500'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Crear/Editar */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='max-w-lg max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>{isCreating ? 'Nuevo Producto' : 'Editar Producto'}</DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            {/* Nombre */}
            <div>
              <label className='block text-sm font-medium mb-1'>Nombre *</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder='Nombre del producto'
              />
            </div>

            {/* Precio */}
            <div>
              <label className='block text-sm font-medium mb-1'>Precio</label>
              <Input
                type='number'
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                placeholder='0.00'
                step='0.01'
              />
            </div>

            {/* Descripción */}
            <div>
              <label className='block text-sm font-medium mb-1'>Descripción</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder='Descripción del producto'
                rows={3}
              />
            </div>

            {/* Imagen - AQUÍ ESTÁ EL COMPONENTE DE UPLOAD */}
            <div>
              <label className='block text-sm font-medium mb-2'>Imagen *</label>
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                onError={(err) => setError(err)}
              />
            </div>

            {/* Activo */}
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='active'
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className='w-4 h-4 rounded'
              />
              <label htmlFor='active' className='text-sm'>
                Mostrar en tienda
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className='bg-primary hover:bg-primary/90 text-white'
            >
              {saving ? <Loader2 className='w-4 h-4 animate-spin mr-2' /> : null}
              {isCreating ? 'Crear' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmación Eliminar */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar producto</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className='bg-red-500 hover:bg-red-600'
            >
              {deleting ? <Loader2 className='w-4 h-4 animate-spin mr-2' /> : null}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
