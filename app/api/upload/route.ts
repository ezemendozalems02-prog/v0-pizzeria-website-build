import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Solo se permiten imágenes' }, { status: 400 })
    }

    // createClient() es async en Next.js 16
    const supabase = await createClient()

    // Generar nombre de archivo único y seguro
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

    // Convertir File a ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    // Subir a Supabase Storage bucket 'media'
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filename, fileBuffer, {
        contentType: file.type,
        upsert: false,
        cacheControl: '3600',
      })

    if (uploadError) {
      console.error('[upload] Supabase Storage error:', uploadError.message)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(filename)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (error: any) {
    console.error('[upload] Unexpected error:', error)
    return NextResponse.json({ error: 'Error inesperado al subir el archivo' }, { status: 500 })
  }
}
