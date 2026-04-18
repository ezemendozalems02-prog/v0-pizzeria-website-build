'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  onError?: (error: string) => void
}

export function ImageUpload({ value, onChange, onError }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    try {
      setError(null)

      if (!file.type.startsWith('image/')) {
        throw new Error('Solo se permiten imágenes (PNG, JPG, GIF, WEBP)')
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('El archivo no puede superar 10MB')
      }

      setUploading(true)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al subir la imagen')
      }

      onChange(data.url)
      setError(null)
    } catch (err: any) {
      const msg = err.message || 'Error desconocido'
      setError(msg)
      onError?.(msg)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file) handleUpload(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div className='space-y-2'>
      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
          uploading
            ? 'bg-gray-50 border-gray-300'
            : 'border-admin-border bg-white hover:bg-admin-bg hover:border-blue-500'
        }`}
      >
        <div className='flex flex-col items-center justify-center gap-2'>
          {uploading ? (
            <>
              <Loader2 className='w-8 h-8 animate-spin text-primary' />
              <p className='text-sm font-medium text-admin-text'>Subiendo imagen...</p>
            </>
          ) : (
            <>
              <Upload className='w-8 h-8 text-admin-muted' />
              <div className='text-center'>
                <p className='text-sm font-medium text-admin-text'>
                  Arrastra una imagen o haz click aquí
                </p>
                <p className='text-xs text-admin-muted mt-0.5'>PNG, JPG, GIF (máx 10MB)</p>
              </div>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleUpload(file)
          }}
          disabled={uploading}
        />
      </div>

      {/* Error */}
      {error && (
        <div className='p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2'>
          <AlertCircle className='w-4 h-4 flex-shrink-0' />
          {error}
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className='relative group'>
          <div className='relative w-full h-40 rounded-lg overflow-hidden bg-admin-bg border border-admin-border'>
            <Image src={value} alt='Preview' fill className='object-cover' unoptimized />
          </div>
          <button
            onClick={() => onChange('')}
            className='absolute top-2 right-2 p-1 bg-white rounded-lg border border-admin-border opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50'
            title='Eliminar imagen'
          >
            <X className='w-4 h-4 text-red-500' />
          </button>
        </div>
      )}
    </div>
  )
}

function AlertCircle({ className }: { className: string }) {
  return (
    <svg
      className={className}
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <circle cx='12' cy='12' r='10' />
      <path d='M12 8v4M12 16h.01' />
    </svg>
  )
}
