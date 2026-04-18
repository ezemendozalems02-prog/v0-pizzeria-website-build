'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useBannersContext, type Banner } from '@/components/banners-provider'
import Image from 'next/image'
import { Wifi, WifiOff, Loader2, CheckCircle2, ImageIcon, CloudUpload } from 'lucide-react'

const PAGE_NAMES: Record<string, string> = {
  'home': 'Home — Principal',
  'sobre-nosotros': 'Sobre Nosotros',
  'contacto': 'Contacto',
  'pedido-delivery': 'Pedido Delivery',
}

const KEY_ORDER = ['home', 'sobre-nosotros', 'contacto', 'pedido-delivery', 'hero', 'favorites', 'promos']

export default function BannersAdminPage() {
  const { banners, loading, status, updateBannerLocally } = useBannersContext()
  const [editing, setEditing] = useState<{ id: string; image_url: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        setEditing((e) => e ? { ...e, image_url: data.url } : e)
        setPreviewUrl(data.url)
      }
    } catch (err) {
      console.error('[banners-admin] Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const sorted = [...banners].sort(
    (a, b) => KEY_ORDER.indexOf(a.key) - KEY_ORDER.indexOf(b.key)
  )

  const startEdit = (banner: Banner) => {
    setEditing({ id: banner.id, image_url: banner.image_url })
    setPreviewUrl(banner.image_url)
  }

  const handleUrlChange = (val: string) => {
    setEditing((e) => e ? { ...e, image_url: val } : e)
    setPreviewUrl(val)
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    const targetId = editing.id
    const newUrl = editing.image_url.trim()
    // 1. Optimistic local update — UI reflects change immediately
    updateBannerLocally(targetId, newUrl)
    setEditing(null)
    setPreviewUrl('')
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('banners')
        .update({ image_url: newUrl, updated_at: new Date().toISOString() })
        .eq('id', targetId)
      if (error) throw error
      // 2. Bust Next.js cache so server-rendered pages see the new image
      await fetch('/api/banners/revalidate', { method: 'POST' }).catch(() => {})
      // 3. Show success indicator after DB confirms
      setSavedId(targetId)
      setTimeout(() => setSavedId(null), 3000)
    } catch (err) {
      console.error('[banners-admin] Error saving:', err)
      // On error, Realtime will eventually correct the state from DB
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#243329]/35 mb-2">
            Panel interno
          </p>
          <h1 className="font-serif text-4xl font-bold text-[#243329] leading-tight">
            Gestionar Banners
          </h1>
          <p className="text-sm text-[#243329]/60 mt-2">
            Editá las imágenes de los banners. Los cambios se reflejan en el sitio en tiempo real.
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
          Sincronización activa — Los cambios que guardes se aplican al instante en todas las secciones del sitio sin recargar la página.
        </div>
      )}

      {/* Banners Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-[#243329]/10 rounded-2xl overflow-hidden animate-pulse">
              <div className="h-48 bg-[#F5EFE8]" />
              <div className="p-6 space-y-3">
                <div className="h-5 bg-[#F5EFE8] rounded w-1/2" />
                <div className="h-3 bg-[#F5EFE8] rounded w-full" />
                <div className="h-9 bg-[#F5EFE8] rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sorted.map((banner) => {
            const isEditing = editing?.id === banner.id
            const currentPreview = isEditing ? previewUrl : banner.image_url

            return (
              <div
                key={banner.id}
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200 ${
                  isEditing
                    ? 'border-[#C4322B]/30 ring-2 ring-[#C4322B]/10'
                    : 'border-[#243329]/10 hover:border-[#243329]/20'
                }`}
              >
                {/* Preview */}
                <div className="relative h-48 bg-[#F5EFE8]">
                  {currentPreview ? (
                    <Image
                      src={currentPreview}
                      alt={PAGE_NAMES[banner.key] ?? banner.key}
                      fill
                      className="object-cover transition-all duration-500"
                      unoptimized
                      key={currentPreview}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#243329]/20">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-xs">Sin imagen</span>
                    </div>
                  )}

                  {/* Live indicator when editing */}
                  {isEditing && previewUrl && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 text-white text-[10px] rounded-full font-medium">
                      Vista previa
                    </div>
                  )}

                  {/* Saved flash */}
                  {savedId === banner.id && (
                    <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg text-green-700 text-sm font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        Actualizado en tiempo real
                      </div>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-serif text-lg font-bold text-[#243329]">
                      {PAGE_NAMES[banner.key] ?? banner.key}
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#243329]/35 mb-5 font-mono truncate">
                    {banner.image_url || 'Sin URL configurada'}
                  </p>

                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#243329]/60 mb-1.5">
                          URL de la imagen
                        </label>
                        <div className="flex gap-2 items-start">
                          <textarea
                            value={editing.image_url}
                            onChange={(e) => handleUrlChange(e.target.value)}
                            placeholder="https://... o subí un archivo"
                            rows={2}
                            autoFocus
                            className="flex-1 px-3 py-2 text-xs border border-[#243329]/15 rounded-xl bg-[#F5EFE8]/60 text-[#243329] placeholder:text-[#243329]/25 focus:outline-none focus:ring-2 focus:ring-[#C4322B]/20 focus:border-[#C4322B]/40 resize-none transition-all font-mono"
                          />
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
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            title="Subir imagen desde archivo"
                            className="w-10 h-10 flex-shrink-0 rounded-xl bg-[#F5EFE8] border border-[#243329]/15 flex items-center justify-center text-[#243329]/60 hover:bg-[#243329]/10 disabled:opacity-50 transition-colors"
                          >
                            {uploading
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <CloudUpload className="w-4 h-4" />
                            }
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          disabled={saving || uploading || !editing.image_url.trim()}
                          className="flex-1 py-2.5 bg-[#C4322B] text-white text-xs font-semibold rounded-lg hover:bg-[#C4322B]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
                        >
                          {saving ? (
                            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando...</>
                          ) : (
                            'Guardar y publicar'
                          )}
                        </button>
                        <button
                          onClick={() => { setEditing(null); setPreviewUrl('') }}
                          className="flex-1 py-2.5 bg-[#F5EFE8] text-[#243329] text-xs font-semibold rounded-lg hover:bg-[#243329]/10 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(banner)}
                      className="w-full py-2.5 bg-[#F5EFE8] text-[#243329] text-xs font-semibold rounded-lg hover:bg-[#243329]/8 transition-colors"
                    >
                      Editar imagen
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
