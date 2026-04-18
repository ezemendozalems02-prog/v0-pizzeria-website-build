'use client'

import { useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { CloudUpload, Loader2, X } from 'lucide-react'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  label?: string
  height?: number
}

export function ImageUploader({ value, onChange, label, height = 160 }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen (PNG, JPG, GIF, WEBP)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo no puede superar los 10MB')
      return
    }

    setError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || 'Error al subir la imagen')
        console.error('[ImageUploader] Upload error:', data.error)
        return
      }

      console.log('[ImageUploader] Upload successful:', data.url)
      onChange(data.url)
      console.log('[ImageUploader] onChange called with URL:', data.url)
    } catch (err) {
      setError('No se pudo conectar con el servidor')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [onChange])

  const handleClick = () => {
    if (!uploading) fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => setDragOver(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    onChange(e.target.value)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    setError(null)
  }

  return (
    <div className="space-y-3">
      {/* Drop zone / preview */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ minHeight: height }}
        className={[
          'relative w-full rounded-2xl border-2 overflow-hidden cursor-pointer transition-all duration-200 flex flex-col items-center justify-center',
          dragOver
            ? 'border-[#C4322B] bg-[#C4322B]/5 scale-[0.99]'
            : value
            ? 'border-[#243329]/15 hover:border-[#C4322B]/40'
            : 'border-dashed border-[#243329]/25 bg-[#F5EFE8]/50 hover:bg-[#F5EFE8] hover:border-[#C4322B]/40',
        ].join(' ')}
      >
        {uploading ? (
          /* Uploading state */
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-[#C4322B]/10 flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-[#C4322B] animate-spin" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#243329]">Subiendo imagen...</p>
              <p className="text-xs text-[#243329]/50 mt-0.5">Guardando en Supabase Storage</p>
            </div>
          </div>
        ) : value ? (
          /* Preview mode */
          <>
            <Image
              key={value}
              src={value}
              alt="Vista previa"
              fill
              className="object-cover"
              unoptimized
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100 gap-3">
              <div className="flex flex-col items-center gap-1 text-white">
                <CloudUpload className="w-8 h-8" />
                <span className="text-xs font-semibold">Cambiar imagen</span>
              </div>
            </div>
            {/* Clear button */}
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors z-10"
              title="Quitar imagen"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            {/* Label badge */}
            {label && (
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded-lg text-white text-[10px] font-medium">
                {label}
              </div>
            )}
          </>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center gap-3 py-8 px-4">
            <div className="w-14 h-14 rounded-full bg-[#C4322B]/10 flex items-center justify-center">
              <CloudUpload className="w-7 h-7 text-[#C4322B]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#243329]">
                Arrastrá una imagen o hacé click para seleccionar
              </p>
              <p className="text-xs text-[#243329]/50 mt-1">
                PNG, JPG, GIF, WEBP — hasta 10MB
              </p>
            </div>
            <div className="px-4 py-1.5 bg-[#C4322B] text-white text-xs font-semibold rounded-lg">
              Seleccionar archivo
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
          {error}
        </p>
      )}

      {/* URL input */}
      <div>
        <label className="block text-xs font-semibold text-[#243329]/50 mb-1.5 uppercase tracking-wide">
          O pegá la URL de la imagen
        </label>
        <input
          type="url"
          value={value}
          onChange={handleUrlChange}
          placeholder="https://ejemplo.com/imagen.jpg"
          className="w-full px-3 py-2.5 text-xs border border-[#243329]/15 rounded-xl bg-white text-[#243329] placeholder:text-[#243329]/30 focus:outline-none focus:ring-2 focus:ring-[#C4322B]/20 focus:border-[#C4322B]/50 transition-all font-mono"
        />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
