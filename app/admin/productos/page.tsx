'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useProductsContext } from '@/components/products-provider'
import Image from 'next/image'
import { Wifi, WifiOff, Loader2, CheckCircle2, Edit2, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function ProductsAdminPage() {
  const { products, loading, status, updateProductLocally, refreshFromDB } = useProductsContext()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)

  const startEdit = (product: any) => {
    setEditingId(product.id)
    setEditForm({ ...product })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm(null)
  }

  const handleSave = async () => {
    if (!editForm) return
    setSaving(true)
    const targetId = editForm.id
    
    // 1. Optimistic local update — UI reflects change immediately
    updateProductLocally(targetId, {
      name: editForm.name,
      price: editForm.price,
      description: editForm.description,
      image: editForm.image,
      active: editForm.active,
    })
    
    setEditingId(null)
    setEditForm(null)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('products')
        .update({
          name: editForm.name,
          price: editForm.price,
          description: editForm.description,
          image: editForm.image,
          active: editForm.active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetId)

      if (error) throw error

      // 2. Bust Next.js cache so server-rendered pages see the new data
      await fetch('/api/banners/revalidate', { method: 'POST' }).catch(() => {})
      
      // 3. Show success indicator after DB confirms
      setSavedId(targetId)
      setTimeout(() => setSavedId(null), 3000)
      
      // 4. Manual refresh to sync with DB
      await refreshFromDB()
    } catch (err) {
      console.error('[productos-admin] Error saving:', err)
      // On error, Realtime will eventually correct the state from DB
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-7xl space-y-8">
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
            Editá precios, imágenes y descripciones. Los cambios se reflejan en tiempo real.
          </p>
        </div>

        {/* Realtime status badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
          status === 'connected'
            ? 'bg-green-50 text-green-700 border-green-200'
            : status === 'connecting'
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {status === 'connected' ? (
            <><Wifi className="w-3.5 h-3.5" /> En vivo</>
          ) : status === 'connecting' ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Conectando</>
          ) : (
            <><WifiOff className="w-3.5 h-3.5" /> Sin conexión</>
          )}
        </div>
      </div>

      {/* Realtime info bar */}
      {status === 'connected' && (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-100 rounded-xl text-xs text-green-700">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
          Sincronización activa — Los cambios en precios e imágenes se ven enseguida en la web y en todas las sesiones.
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-white border border-[#243329]/10 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3 bg-white rounded-xl border border-[#243329]/10 overflow-hidden">
          {products.map((product) => {
            const isEditing = editingId === product.id
            const isSaved = savedId === product.id

            return (
              <div
                key={product.id}
                className={`p-4 border-b border-[#243329]/10 last:border-b-0 transition-all duration-200 ${
                  isEditing ? 'bg-[#F5EFE8]/40' : 'hover:bg-[#F5EFE8]/20'
                } ${isSaved ? 'bg-green-50/30' : ''}`}
              >
                {isEditing ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-semibold text-[#243329]/60 mb-1">
                          Nombre
                        </label>
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="bg-white border-[#243329]/15 text-sm"
                        />
                      </div>

                      {/* Price */}
                      <div>
                        <label className="block text-xs font-semibold text-[#243329]/60 mb-1">
                          Precio ($)
                        </label>
                        <Input
                          type="number"
                          value={editForm.price}
                          onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                          className="bg-white border-[#243329]/15 text-sm"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-semibold text-[#243329]/60 mb-1">
                        Descripción
                      </label>
                      <Textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows={2}
                        className="bg-white border-[#243329]/15 text-sm resize-none"
                      />
                    </div>

                    {/* Image URL */}
                    <div>
                      <label className="block text-xs font-semibold text-[#243329]/60 mb-1">
                        URL de imagen
                      </label>
                      <Textarea
                        value={editForm.image}
                        onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                        rows={2}
                        className="bg-white border-[#243329]/15 text-sm font-mono text-[11px] resize-none"
                      />
                    </div>

                    {/* Active toggle */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editForm.active}
                        onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                        className="rounded border-[#243329]/20"
                      />
                      <label className="text-xs font-medium text-[#243329]">Producto activo</label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-[#C4322B] hover:bg-[#C4322B]/90 text-white text-xs font-semibold"
                      >
                        {saving ? (
                          <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> Guardando...</>
                        ) : (
                          <><Save className="w-3.5 h-3.5 mr-1" /> Guardar cambios</>
                        )}
                      </Button>
                      <Button
                        onClick={cancelEdit}
                        variant="outline"
                        className="flex-1 text-xs font-semibold"
                      >
                        <X className="w-3.5 h-3.5 mr-1" /> Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[#F5EFE8]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#243329] truncate">
                          {product.name}
                        </h3>
                        {!product.active && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-semibold rounded">
                            Inactivo
                          </span>
                        )}
                        {isSaved && (
                          <span className="flex items-center gap-1 text-green-700 text-xs font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Actualizado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#243329]/60 line-clamp-1 mt-0.5">
                        {product.description}
                      </p>
                      <p className="text-sm font-bold text-[#C4322B] mt-1">
                        ${product.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Edit Button */}
                    <Button
                      onClick={() => startEdit(product)}
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      <Edit2 className="w-4 h-4 mr-1" /> Editar
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

