import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

// Usar service role para bypass de RLS en Storage
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'El archivo no puede superar 10MB' }, { status: 400 })
    }

    // Nombre de archivo único y limpio
    const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
    const filepath = `products/${filename}`

    console.log('[upload] Starting upload:', { filename, size: file.size, type: file.type })

    // Convertir a Uint8Array
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    // Subir a Supabase Storage bucket 'media'
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('media')
      .upload(filepath, fileBuffer, {
        contentType: file.type,
        upsert: false,
        cacheControl: '31536000',
      })

    if (uploadError) {
      console.error('[upload] Storage error:', uploadError.message)
      return NextResponse.json({ error: `Storage error: ${uploadError.message}` }, { status: 500 })
    }

    console.log('[upload] Upload successful:', uploadData)

    // URL pública
    const { data: urlData } = supabaseAdmin.storage
      .from('media')
      .getPublicUrl(filepath)

    const publicUrl = urlData.publicUrl

    console.log('[upload] Public URL generated:', publicUrl)

    return NextResponse.json({ url: publicUrl, filepath })
  } catch (error: any) {
    console.error('[upload] Unexpected error:', error?.message ?? error)
    return NextResponse.json({ error: `Unexpected error: ${error?.message ?? 'Unknown'}` }, { status: 500 })
  }
}
