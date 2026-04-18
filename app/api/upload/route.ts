import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Solo se permiten archivos de imagen' }, { status: 400 })
    }

    // Validar tamaño (máx 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'El archivo no puede superar 10MB' }, { status: 400 })
    }

    // Generar nombre único
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`
    const filepath = `products/${filename}`

    // Convertir a buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Subir a Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from('media')
      .upload(filepath, buffer, {
        contentType: file.type,
        upsert: false,
        cacheControl: '3600',
      })

    if (uploadError) {
      console.error('[upload] Storage error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Obtener URL pública
    const { data: urlData } = supabaseAdmin.storage
      .from('media')
      .getPublicUrl(filepath)

    return NextResponse.json({
      url: urlData.publicUrl,
      filepath,
      filename,
    })
  } catch (error: any) {
    console.error('[upload] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Error al subir el archivo' },
      { status: 500 }
    )
  }
}
