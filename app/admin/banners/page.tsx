"use client"

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface Banner {
  id: string
  page: string
  title: string
  url: string
  updated_at: string
}

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Banner | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('banners')
        .select('*')
        .order('page', { ascending: true })
      setBanners((data as Banner[]) ?? [])
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
        .update({
          url: editing.url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editing.id)

      if (error) throw error

      setBanners(banners.map(b => b.id === editing.id ? editing : b))
      setEditing(null)
    } catch (err) {
      console.error('Error saving banner:', err)
    } finally {
      setSaving(false)
    }
  }

  const pageNames: Record<string, string> = {
    'home': 'Home - Principal',
    'sobre-nosotros': 'Sobre Nosotros',
    'contacto': 'Contacto',
    'pedido-delivery': 'Pedido Delivery',
  }

  return (
    <div className="max-w-7xl space-y-8">
      {/* Header */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#243329]/35 mb-2">
          Panel interno
        </p>
        <h1 className="font-serif text-4xl font-bold text-[#243329] leading-tight">
          Gestionar Banners
        </h1>
        <p className="text-sm text-[#243329]/60 mt-2">
          Editá las URLs de los banners para cada sección del sitio
        </p>
      </div>

      {/* Banners Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-[#243329]/10 rounded-2xl p-6 animate-pulse">
              <div className="h-40 bg-[#F5EFE8] rounded-xl mb-4" />
              <div className="h-4 bg-[#F5EFE8] rounded mb-2" />
              <div className="h-4 bg-[#F5EFE8] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white border border-[#243329]/10 rounded-2xl overflow-hidden">
              {/* Banner Preview */}
              <div className="relative h-40 bg-[#F5EFE8] overflow-hidden">
                {banner.url && (
                  <Image
                    src={banner.url}
                    alt={banner.page}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>

              {/* Banner Info */}
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-[#243329] mb-1">
                  {pageNames[banner.page] || banner.page}
                </h3>
                <p className="text-xs text-[#243329]/50 mb-4">
                  {banner.title}
                </p>

                {editing?.id === banner.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editing.url}
                      onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                      placeholder="URL del banner"
                      className="w-full h-20 px-3 py-2 text-xs border border-[#243329]/15 rounded-xl bg-[#F5EFE8]/60 text-[#243329] placeholder:text-[#243329]/30 focus:outline-none focus:ring-1 focus:ring-[#C4322B]/30 transition-all"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 px-3 py-2 bg-[#C4322B] text-white text-xs font-medium rounded-lg hover:bg-[#C4322B]/90 disabled:opacity-50 transition-colors"
                      >
                        {saving ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="flex-1 px-3 py-2 bg-[#F5EFE8] text-[#243329] text-xs font-medium rounded-lg hover:bg-[#F5EFE8]/70 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditing(banner)}
                    className="w-full px-3 py-2 bg-[#F5EFE8] text-[#243329] text-xs font-medium rounded-lg hover:bg-[#F5EFE8]/70 transition-colors"
                  >
                    Editar URL
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
