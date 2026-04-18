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

  const [products, setProducts] = useState<Product[]>([])
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

  const [form, setForm] = useState({
    name: '',
    price: 0,
    description: '',
    image: '',
    active: true,
    category_id: '1',
    order_index: 0,
  })

  // Cargar productos
  const loadProducts = async () => {
    try {
      console.log('[ADMIN] Cargando productos...')
      setLoading(true)
      setError('')

      const { data, error: err } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) {
        console.error('[ADMIN] Error en query:', err)
        throw err
      }

      console.log('[ADMIN] Productos cargados:', data?.length)
      setProducts(data || [])
    } catch (err: any) {
      console.error('[ADMIN] Error al cargar:', err)
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const openCreate = () => {
    console.log('[ADMIN] Abriendo crear nuevo')
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
    setError('')
  }

  const openEdit = (product: Product) => {
    console.log('[ADMIN] Editando producto:', product.id)
    setForm(product)
    setEditingProduct(product)
    setIsCreating(false)
    setIsOpen(true)
    setError('')
  }

  const handleSave = async () => {
    try {
      console.log('[ADMIN] Guardando producto...', { isCreating, form })
      setSaving(true)
      setError('')
      setSuccess('')

      if (!form.name.trim()) {
        throw new Error('Nombre requerido')
      }

      if (!form.image.trim()) {
        throw new Error('Imagen requerida')
      }

      if (isCreating) {
        console.log('[ADMIN] Creando nuevo producto...')
        const newProduct = {
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
        }

        const { data, error: err } = await supabase
          .from('products')
          .insert([newProduct])
          .select()

        if (err) {
          console.error('[ADMIN] Error insert:', err)
          throw err
        }
        console.log('[ADMIN] Producto creado:', data)
        setSuccess('Producto creado correctamente')
      } else if (editingProduct) {
        console.log('[ADMIN] Actualizando producto:', editingProduct.id)
        const { data, error: err } = await supabase
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
          .select()

        if (err) {
          console.error('[ADMIN] Error update:', err)
          throw err
        }
        console.log('[ADMIN] Producto actualizado:', data)
        setSuccess('Producto actualizado correctamente')
      }

      setIsOpen(false)
      await loadProducts()
    } catch (err: any) {
      console.error('[ADMIN] Error:', err)
      setError(err.message || 'Error desconocido')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      console.log('[ADMIN] Eliminando:', deleteId)
      setDeleting(true)
      setError('')

      const { error: err } = await supabase
        .from('products')
        .delete()
        .eq('id', deleteId)

      if (err) {
        console.error('[ADMIN] Error delete:', err)
        throw err
      }

      console.log('[ADMIN] Producto eliminado')
      setSuccess('Producto eliminado')
      setDeleteId(null)
      await loadProducts()
    } catch (err: any) {
      console.error('[ADMIN] Error:', err)
      setError(err.message || 'Error al eliminar')
    } finally {
      setDeleting(false)
    }
  }

  const toggleActive = async (product: Product) => {
    try {
      console.log('[ADMIN] Toggling active:', product.id)
      const { error: err } = await supabase
        .from('products')
        .update({ active: !product.active })
        .eq('id', product.id)

      if (err) throw err
      await loadProducts()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='flex flex-col gap-6 max-w-7xl'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-admin-text'>Productos</h1>
          <p className='text-sm text-admin-muted mt-1'>
            {products.length} producto{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={openCreate} className='bg-primary hover:bg-primary/90 text-white'>
          <Plus className='w-4 h-4 mr-2' />
          Nuevo Producto
        </Button>
      </div>

      {/* Mensajes */}
      {success && (
        <div className='p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800'>
          <CheckCircle className='w-5 h-5 flex-shrink-0' />
          <p className='text-sm font-medium'>{success}</p>
        </div>
      )}

      {error && (
        <div className='p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800'>
          <AlertCircle className='w-5 h-5 flex-shrink-0' />
          <p className='text-sm font-medium'>{error}</p>
        </div>
      )}

      {/* Search */}
      <Input
        placeholder='Buscar productos...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='bg-white border-admin-border'
      />

      {/* Loading */}
      {loading && (
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='w-8 h-8 animate-spin text-admin-muted' />
        </div>
      )}

      {/* Tabla */}
      {!loading && (
        <div className='border border-admin-border rounded-lg overflow-hidden bg-white'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-admin-border bg-admin-bg'>
                  <th className='px-4 py-3 text-left font-semibold text-admin-text'>Imagen</th>
                  <th className='px-4 py-3 text-left font-semibold text-admin-text'>Nombre</th>
                  <th className='px-4 py-3 text-left font-semibold text-admin-text'>Descripción</th>
                  <th className='px-4 py-3 text-left font-semibold text-admin-text'>Precio</th>
                  <th className='px-4 py-3 text-left font-semibold text-admin-text'>Estado</th>
                  <th className='px-4 py-3 text-right font-semibold text-admin-text'>Acciones</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-admin-border'>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className='px-4 py-8 text-center text-admin-muted'>
                      {products.length === 0 ? 'No hay productos' : 'No se encontraron resultados'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((product) => (
                    <tr key={product.id} className='hover:bg-admin-bg/50 transition-colors'>
                      {/* Imagen */}
                      <td className='px-4 py-3'>
                        {product.image ? (
                          <div className='relative w-10 h-10 rounded-md overflow-hidden bg-admin-bg'>
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className='object-cover'
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className='w-10 h-10 rounded-md bg-admin-bg' />
                        )}
                      </td>

                      {/* Nombre */}
                      <td className='px-4 py-3 font-medium text-admin-text'>{product.name}</td>

                      {/* Descripción */}
                      <td className='px-4 py-3 text-admin-muted line-clamp-2'>
                        {product.description}
                      </td>

                      {/* Precio */}
                      <td className='px-4 py-3 text-admin-text'>${product.price.toFixed(2)}</td>

                      {/* Estado */}
                      <td className='px-4 py-3'>
                        <button
                          onClick={() => toggleActive(product)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            product.active
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {product.active ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>

                      {/* Acciones */}
                      <td className='px-4 py-3 text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <button
                            onClick={() => openEdit(product)}
                            className='p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors'
                          >
                            <Pencil className='w-4 h-4' />
                          </button>
                          <button
                            onClick={() => setDeleteId(product.id)}
                            className='p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors'
                          >
                            <Trash2 className='w-4 h-4' />
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

      {/* Dialog Crear/Editar */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='max-w-lg bg-white max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='text-admin-text'>
              {isCreating ? 'Crear Nuevo Producto' : 'Editar Producto'}
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            {/* Nombre */}
            <div>
              <label className='block text-sm font-medium text-admin-text mb-1'>
                Nombre *
              </label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder='Ej: Pizza Margarita'
                className='bg-white border-admin-border'
              />
            </div>

            {/* Precio */}
            <div>
              <label className='block text-sm font-medium text-admin-text mb-1'>Precio</label>
              <Input
                type='number'
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                placeholder='0.00'
                step='0.01'
                className='bg-white border-admin-border'
              />
            </div>

            {/* Descripción */}
            <div>
              <label className='block text-sm font-medium text-admin-text mb-1'>Descripción</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder='Describe el producto...'
                rows={3}
                className='bg-white border-admin-border'
              />
            </div>

            {/* Imagen */}
            <div>
              <label className='block text-sm font-medium text-admin-text mb-1'>
                Imagen URL *
              </label>
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder='https://ejemplo.com/imagen.jpg'
                className='bg-white border-admin-border'
              />
              {form.image && (
                <div className='mt-2 relative w-full h-32 rounded-lg overflow-hidden bg-admin-bg border border-admin-border'>
                  <Image
                    src={form.image}
                    alt='Preview'
                    fill
                    className='object-cover'
                    unoptimized
                  />
                </div>
              )}
            </div>

            {/* Upload de archivo */}
            <div>
              <label className='block text-sm font-medium text-admin-text mb-2'>
                O sube desde tu PC
              </label>
              <div className='border-2 border-dashed border-admin-border rounded-lg p-6 text-center hover:border-primary transition-colors'>
                <input
                  type='file'
                  accept='image/*'
                  className='hidden'
                  id='image-upload'
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return

                    try {
                      console.log('[ADMIN] Subiendo imagen:', file.name)
                      const formData = new FormData()
                      formData.append('file', file)

                      const res = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData,
                      })

                      const data = await res.json()
                      if (data.error) throw new Error(data.error)

                      console.log('[ADMIN] Imagen subida:', data.url)
                      setForm({ ...form, image: data.url })
                    } catch (err: any) {
                      setError(err.message)
                    }
                  }}
                />
                <label htmlFor='image-upload' className='cursor-pointer'>
                  <p className='text-sm font-medium text-admin-text'>Haz click para subir</p>
                  <p className='text-xs text-admin-muted mt-1'>PNG, JPG, GIF (máx 10MB)</p>
                </label>
              </div>
            </div>

            {/* Activo */}
            <div className='flex items-center gap-3'>
              <input
                type='checkbox'
                id='active'
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className='w-4 h-4 rounded border-admin-border'
              />
              <label htmlFor='active' className='text-sm font-medium text-admin-text cursor-pointer'>
                Mostrar en tienda
              </label>
            </div>
          </div>

          <DialogFooter className='gap-2 mt-6'>
            <Button
              variant='outline'
              onClick={() => setIsOpen(false)}
              disabled={saving}
              className='border-admin-border'
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className='bg-primary hover:bg-primary/90'>
              {saving ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
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
        <AlertDialogContent className='bg-white'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-admin-text'>Eliminar producto</AlertDialogTitle>
            <AlertDialogDescription className='text-admin-muted'>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='border-admin-border'>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className='bg-red-500 hover:bg-red-600'
            >
              {deleting ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
