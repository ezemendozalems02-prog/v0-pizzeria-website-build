'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2, AlertCircle } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  onError?: (error: string) => void
}

export function ImageUpload({ value, onChange, onError }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleFileSelect = async (file: File) => {
    try {
      setError(null)

      // Validar que sea imagen
      if (!file.type.startsWith('image/')) {
        const msg = 'Solo se permiten archivos de imagen'
        setError(msg)
        onError?.(msg)
        return
      }

      // Validar tamaño (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        const msg = 'El archivo no puede superar 10MB'
        setError(msg)
        onError?.(msg)
        return
      }

      setUploading(true)

      // Generar nombre único
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(2, 9)
      const ext = file.name.split('.').pop() || 'jpg'
      const filename = `products/${timestamp}-${random}.${ext}`

      // Convertir a ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()
      const fileBuffer = new Uint8Array(arrayBuffer)

      // Subir a Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filename, fileBuffer, {
          contentType: file.type,
          upsert: false,
          cacheControl: '3600',
        })

      if (uploadError) {
        throw uploadError
      }

      // Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(filename)

      const publicUrl = publicUrlData.publicUrl
      onChange(publicUrl)
      setError(null)
    } catch (err: any) {
      const msg = err?.message || 'Error al subir la imagen'
      setError(msg)
      onError?.(msg)
      console.error('[ImageUpload] Error:', err)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  return (
    <div className='space-y-3'>
      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
          uploading
            ? 'border-blue-300 bg-blue-50'
            : 'border-admin-border hover:border-primary bg-admin-bg hover:bg-primary/5'
        }`}
      >
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileSelect(file)
          }}
          className='hidden'
        />

        <div className='flex flex-col items-center justify-center gap-2'>
          {uploading ? (
            <>
              <Loader2 className='w-8 h-8 text-primary animate-spin' />
              <p className='text-sm font-medium text-admin-text'>Subiendo imagen...</p>
            </>
          ) : (
            <>
              <Upload className='w-8 h-8 text-admin-muted' />
              <div className='text-center'>
                <p className='text-sm font-medium text-admin-text'>
                  Arrastra la imagen aquí o haz click
                </p>
                <p className='text-xs text-admin-muted mt-1'>
                  PNG, JPG, GIF, WEBP (máx 10MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className='flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg'>
          <AlertCircle className='w-4 h-4 text-red-600 flex-shrink-0' />
          <p className='text-xs text-red-600'>{error}</p>
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className='space-y-2'>
          <label className='block text-xs font-medium text-admin-muted uppercase tracking-wide'>
            Vista previa
          </label>
          <div className='relative w-full h-40 rounded-lg overflow-hidden bg-admin-bg border border-admin-border'>
            <Image
              src={value}
              alt='Preview'
              fill
              className='object-cover'
              unoptimized
            />
            <button
              onClick={() => onChange('')}
              className='absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded text-white transition-colors'
              title='Eliminar imagen'
            >
              <X className='w-4 h-4' />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
