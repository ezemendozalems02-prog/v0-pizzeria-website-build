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

    // Nombre único
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`
    const filepath = `products/${filename}`

    // Subir a Storage
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error } = await supabaseAdmin.storage
      .from('media')
      .upload(filepath, buffer, {
        contentType: file.type,
        upsert: false,
        cacheControl: '3600',
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // URL pública
    const { data: urlData } = supabaseAdmin.storage
      .from('media')
      .getPublicUrl(filepath)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 })
  }
}
