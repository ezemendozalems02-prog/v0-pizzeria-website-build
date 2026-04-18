import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = (formData.get('bucket') as string) || 'media'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Crear cliente Supabase en servidor
    const supabase = createClient()

    // Generar path único
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`
    const filepath = `${bucket}/${filename}`

    // Convertir File a Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from('media')
      .upload(filepath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) throw error

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(filepath)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (error) {
    console.error('[upload] Error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
