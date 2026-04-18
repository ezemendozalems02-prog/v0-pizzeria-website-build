'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface Banner {
  id: string
  key: string
  image_url: string
  overlay_text: string
  overlay_button_text: string
  overlay_button_link: string
  updated_at: string
}

const PAGE_NAMES: Record<string, string> = {
  'home': 'Home - Principal',
  'sobre-nosotros': 'Sobre Nosotros',
  'contacto': 'Contacto',
  'pedido-delivery': 'Pedido Delivery',
}

const KEY_ORDER = ['home', 'sobre-nosotros', 'contacto', 'pedido-delivery']

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Banner | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('banners')
        .select('*')
      if (error) console.error('[v0] Error loading banners:', error)
      const sorted = (data as Banner[] ?? []).sort(
        (a, b) => KEY_ORDER.indexOf(a.key) - KEY_ORDER.indexOf(b.key)
      )
      setBanners(sorted)
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('banners')
        .update({ image_url: editing.image_url })
        .eq('id', editing.id)
      if (error) throw error
      setBanners(banners.map(b => b.id === editing.id ? editing : b))
      setSavedId(editing.id)
      setTimeout(() => setSavedId(null), 2500)
      setEditing(null)
    } catch (err) {
      console.error('[v0] Error saving banner:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#243329]/35 mb-2">
          Panel interno
        </p>
        <h1 className="font-serif text-4xl font-bold text-[#243329] leading-tight">
          Gestionar Banners
        </h1>
        <p className="text-sm text-[#243329]/60 mt-2">
          Editá las imágenes de los banners para cada sección del sitio.
        </p>
      </div>

      {/* Banners Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-[#243329]/10 rounded-2xl overflow-hidden animate-pulse">
              <div className="h-44 bg-[#F5EFE8]" />
              <div className="p-6 space-y-3">
                <div className="h-5 bg-[#F5EFE8] rounded w-1/2" />
                <div className="h-4 bg-[#F5EFE8] rounded w-full" />
                <div className="h-9 bg-[#F5EFE8] rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white border border-[#243329]/10 rounded-2xl overflow-hidden">
              {/* Preview */}
              <div className="relative h-44 bg-[#F5EFE8]">
                {banner.image_url ? (
                  <Image
                    src={banner.image_url}
                    alt={PAGE_NAMES[banner.key] ?? banner.key}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#243329]/20 text-sm">
                    Sin imagen
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif text-xl font-bold text-[#243329]">
                    {PAGE_NAMES[banner.key] ?? banner.key}
                  </h3>
                  {savedId === banner.id && (
                    <span className="text-xs text-green-600 font-medium">Guardado</span>
                  )}
                </div>
                <p className="text-xs text-[#243329]/40 mb-4 font-mono truncate">
                  {banner.image_url || 'Sin URL configurada'}
                </p>

                {editing?.id === banner.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editing.image_url}
                      onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                      placeholder="https://..."
                      rows={3}
                      className="w-full px-3 py-2 text-xs border border-[#243329]/15 rounded-xl bg-[#F5EFE8]/60 text-[#243329] placeholder:text-[#243329]/30 focus:outline-none focus:ring-1 focus:ring-[#C4322B]/30 resize-none transition-all"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-2 bg-[#C4322B] text-white text-xs font-semibold rounded-lg hover:bg-[#C4322B]/90 disabled:opacity-50 transition-colors"
                      >
                        {saving ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="flex-1 py-2 bg-[#F5EFE8] text-[#243329] text-xs font-semibold rounded-lg hover:bg-[#243329]/10 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditing(banner)}
                    className="w-full py-2 bg-[#F5EFE8] text-[#243329] text-xs font-semibold rounded-lg hover:bg-[#243329]/10 transition-colors"
                  >
                    Editar imagen
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
