import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const bannerKey = formData.get('bannerKey') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo.' }, { status: 400 })
    }

    // Validate type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Formato no permitido. Usá JPG, PNG, WebP o GIF.' },
        { status: 400 }
      )
    }

    // Validate size
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 10 MB.' },
        { status: 400 }
      )
    }

    // Build a clean file name: banner-home-1234567890.jpg
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const safeName = `banners/banner-${bannerKey ?? 'upload'}-${Date.now()}.${ext}`

    const blob = await put(safeName, file, {
      access: 'public',
    })

    return NextResponse.json({ url: blob.url })
  } catch (err) {
    console.error('[banner-upload] error:', err)
    return NextResponse.json({ error: 'Error al subir la imagen.' }, { status: 500 })
  }
}
