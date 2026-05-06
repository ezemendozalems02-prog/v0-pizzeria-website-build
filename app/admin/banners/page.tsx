'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import {
  Wifi,
  WifiOff,
  Loader2,
  CheckCircle2,
  ImageIcon,
  Upload,
  X,
  LinkIcon,
} from 'lucide-react'
import { useBannersContext, type Banner } from '@/components/banners-provider'
import { saveBannerUrl } from './actions'

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_NAMES: Record<string, string> = {
  'home': 'Home — Principal',
  'sobre-nosotros': 'Sobre Nosotros',
  'contacto': 'Contacto',
  'pedido-delivery': 'Pedido Delivery',
}

const KEY_ORDER = ['home', 'sobre-nosotros', 'contacto', 'pedido-delivery', 'hero', 'favorites', 'promos']

const ACCEPTED = 'image/jpeg,image/jpg,image/png,image/webp,image/gif'
const MAX_MB = 10

// ─── Types ─────────────────────────────────────────────────────────────────── 

type UploadTab = 'file' | 'url'

interface EditState {
  id: string
  tab: UploadTab
  urlInput: string
  previewUrl: string
  file: File | null
  dragOver: boolean
  uploadProgress: number    // 0-100, -1 = error
  uploadError: string | null
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function BannersAdminPage() {
  const { banners, loading, status, updateBannerLocally } = useBannersContext()
  const [editing, setEditing] = useState<EditState | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sorted = [...banners].sort(
    (a, b) => KEY_ORDER.indexOf(a.key) - KEY_ORDER.indexOf(b.key)
  )

  // ── Open edit panel ──────────────────────────────────────────────────────
  const startEdit = (banner: Banner) => {
    setEditing({
      id: banner.id,
      tab: 'file',
      urlInput: banner.image_url,
      previewUrl: banner.image_url,
      file: null,
      dragOver: false,
      uploadProgress: 0,
      uploadError: null,
    })
    setSaveError(null)
  }

  const cancelEdit = () => {
    setEditing(null)
    setSaveError(null)
  }

  // ── Tab switch ───────────────────────────────────────────────────────────
  const switchTab = (tab: UploadTab) => {
    if (!editing) return
    setEditing({ ...editing, tab, uploadError: null })
  }

  // ── URL input ────────────────────────────────────────────────────────────
  const handleUrlChange = (val: string) => {
    if (!editing) return
    setEditing({ ...editing, urlInput: val, previewUrl: val })
  }

  // ── File validation (client-side) ────────────────────────────────────────
  const validateFile = (file: File): string | null => {
    const accepted = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!accepted.includes(file.type)) {
      return 'Formato no permitido. Usá JPG, PNG, WebP o GIF.'
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      return `El archivo supera los ${MAX_MB} MB permitidos.`
    }
    return null
  }

  // ── File selected (input or drop) ────────────────────────────────────────
  const handleFileSelected = (file: File) => {
    if (!editing) return
    const err = validateFile(file)
    if (err) {
      setEditing({ ...editing, file: null, uploadError: err, uploadProgress: -1 })
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setEditing({
      ...editing,
      file,
      previewUrl: objectUrl,
      uploadError: null,
      uploadProgress: 0,
    })
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelected(file)
    e.target.value = ''
  }

  // ── Drag & drop ──────────────────────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (editing) setEditing({ ...editing, dragOver: true })
  }
  const handleDragLeave = () => {
    if (editing) setEditing({ ...editing, dragOver: false })
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!editing) return
    setEditing({ ...editing, dragOver: false })
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileSelected(file)
  }

  // ── Upload file to Vercel Blob, then save URL to DB ──────────────────────
  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    setSaveError(null)

    try {
      let finalUrl = ''

      if (editing.tab === 'file' && editing.file) {
        // ── Upload to Vercel Blob via API route ──
        setEditing({ ...editing, uploadProgress: 10 })

        const formData = new FormData()
        formData.append('file', editing.file)
        formData.append('bannerKey', banners.find(b => b.id === editing.id)?.key ?? 'banner')

        // Simulate progress while uploading
        const progressInterval = setInterval(() => {
          setEditing(prev => prev ? {
            ...prev,
            uploadProgress: Math.min((prev.uploadProgress || 10) + 15, 85)
          } : prev)
        }, 300)

        const res = await fetch('/api/banners/upload', {
          method: 'POST',
          body: formData,
        })

        clearInterval(progressInterval)

        const json = await res.json()
        if (!res.ok || json.error) {
          throw new Error(json.error ?? 'Error al subir la imagen.')
        }

        setEditing(prev => prev ? { ...prev, uploadProgress: 95 } : prev)
        finalUrl = json.url

      } else if (editing.tab === 'url') {
        // ── Save URL directly ──
        finalUrl = editing.urlInput.trim()
        if (!finalUrl) throw new Error('Ingresá una URL válida.')
      } else {
        throw new Error('Seleccioná un archivo o ingresá una URL.')
      }

      // ── Optimistic update → DB save via server action ──
      updateBannerLocally(editing.id, finalUrl)
      const result = await saveBannerUrl(editing.id, finalUrl)

      if (!result.success) throw new Error(result.error)

      setEditing(prev => prev ? { ...prev, uploadProgress: 100 } : prev)
      setSavedId(editing.id)
      setTimeout(() => setSavedId(null), 3000)
      setEditing(null)

    } catch (err: any) {
      console.error('[banners-admin] save error:', err)
      setSaveError(err.message ?? 'Error al guardar.')
      setEditing(prev => prev ? { ...prev, uploadProgress: -1 } : prev)
    } finally {
      setSaving(false)
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────
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
            Subí imágenes desde tu dispositivo o pegá una URL. Los cambios se reflejan en el sitio en tiempo real.
          </p>
        </div>

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

      {status === 'connected' && (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-100 rounded-xl text-xs text-green-700">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
          Sincronización activa — Los cambios se aplican al instante en todas las secciones del sitio.
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
            const currentPreview = isEditing ? editing.previewUrl : banner.image_url

            return (
              <div
                key={banner.id}
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200 ${
                  isEditing
                    ? 'border-[#C4322B]/30 ring-2 ring-[#C4322B]/10'
                    : 'border-[#243329]/10 hover:border-[#243329]/20'
                }`}
              >
                {/* Preview image */}
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

                  {isEditing && editing.previewUrl && editing.previewUrl !== banner.image_url && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 text-white text-[10px] rounded-full font-medium backdrop-blur-sm">
                      Vista previa
                    </div>
                  )}

                  {savedId === banner.id && (
                    <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg text-green-700 text-sm font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        Actualizado
                      </div>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-6">
                  <h3 className="font-serif text-lg font-bold text-[#243329] mb-1">
                    {PAGE_NAMES[banner.key] ?? banner.key}
                  </h3>
                  <p className="text-[11px] text-[#243329]/35 mb-5 font-mono truncate">
                    {banner.image_url || 'Sin imagen configurada'}
                  </p>

                  {isEditing ? (
                    <div className="space-y-4">
                      {/* Tabs */}
                      <div className="flex rounded-lg overflow-hidden border border-[#243329]/10 text-xs font-semibold">
                        <button
                          onClick={() => switchTab('file')}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 transition-colors ${
                            editing.tab === 'file'
                              ? 'bg-[#C4322B] text-white'
                              : 'bg-[#F5EFE8] text-[#243329]/60 hover:text-[#243329]'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Subir archivo
                        </button>
                        <button
                          onClick={() => switchTab('url')}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 transition-colors ${
                            editing.tab === 'url'
                              ? 'bg-[#C4322B] text-white'
                              : 'bg-[#F5EFE8] text-[#243329]/60 hover:text-[#243329]'
                          }`}
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                          Pegar URL
                        </button>
                      </div>

                      {/* Tab: File upload */}
                      {editing.tab === 'file' && (
                        <div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept={ACCEPTED}
                            onChange={handleFileInput}
                            className="hidden"
                          />

                          {/* Drop zone */}
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                              editing.dragOver
                                ? 'border-[#C4322B] bg-[#C4322B]/5 scale-[1.01]'
                                : editing.file
                                ? 'border-green-400 bg-green-50'
                                : 'border-[#243329]/20 bg-[#F5EFE8]/60 hover:border-[#243329]/40 hover:bg-[#F5EFE8]'
                            }`}
                          >
                            {editing.file ? (
                              <>
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                                <div className="text-center">
                                  <p className="text-xs font-semibold text-[#243329] truncate max-w-[200px]">
                                    {editing.file.name}
                                  </p>
                                  <p className="text-[10px] text-[#243329]/40 mt-0.5">
                                    {(editing.file.size / 1024 / 1024).toFixed(2)} MB — Clic para cambiar
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="w-10 h-10 rounded-full bg-[#243329]/8 flex items-center justify-center">
                                  <Upload className="w-5 h-5 text-[#243329]/50" />
                                </div>
                                <div className="text-center">
                                  <p className="text-xs font-semibold text-[#243329]">
                                    Arrastrá o hacé clic para seleccionar
                                  </p>
                                  <p className="text-[10px] text-[#243329]/40 mt-1">
                                    JPG, PNG, WebP, GIF · Máx. {MAX_MB} MB
                                  </p>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Upload progress bar */}
                          {saving && editing.uploadProgress > 0 && editing.uploadProgress < 100 && (
                            <div className="mt-3">
                              <div className="flex justify-between text-[10px] text-[#243329]/50 mb-1">
                                <span>Subiendo imagen...</span>
                                <span>{editing.uploadProgress}%</span>
                              </div>
                              <div className="h-1.5 bg-[#243329]/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#C4322B] rounded-full transition-all duration-300"
                                  style={{ width: `${editing.uploadProgress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tab: URL */}
                      {editing.tab === 'url' && (
                        <div>
                          <label className="block text-xs font-semibold text-[#243329]/60 mb-1.5">
                            URL de la imagen
                          </label>
                          <textarea
                            value={editing.urlInput}
                            onChange={(e) => handleUrlChange(e.target.value)}
                            placeholder="https://..."
                            rows={3}
                            autoFocus
                            className="w-full px-3 py-2 text-xs border border-[#243329]/15 rounded-xl bg-[#F5EFE8]/60 text-[#243329] placeholder:text-[#243329]/25 focus:outline-none focus:ring-2 focus:ring-[#C4322B]/20 focus:border-[#C4322B]/40 resize-none transition-all font-mono"
                          />
                        </div>
                      )}

                      {/* Errors */}
                      {(editing.uploadError || saveError) && (
                        <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700">
                          <X className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                          <span>{editing.uploadError || saveError}</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          disabled={
                            saving ||
                            (editing.tab === 'file' && !editing.file) ||
                            (editing.tab === 'url' && !editing.urlInput.trim())
                          }
                          className="flex-1 py-2.5 bg-[#C4322B] text-white text-xs font-semibold rounded-lg hover:bg-[#C4322B]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
                        >
                          {saving ? (
                            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando...</>
                          ) : (
                            'Guardar y publicar'
                          )}
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={saving}
                          className="flex-1 py-2.5 bg-[#F5EFE8] text-[#243329] text-xs font-semibold rounded-lg hover:bg-[#243329]/10 transition-colors disabled:opacity-40"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(banner)}
                      className="w-full py-2.5 bg-[#F5EFE8] text-[#243329] text-xs font-semibold rounded-lg hover:bg-[#243329]/8 transition-colors flex items-center justify-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Cambiar imagen
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
