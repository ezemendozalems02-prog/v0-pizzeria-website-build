import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string | null) ?? 'products'

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo.' }, { status: 400 })
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Formato no permitido. Usá JPG, PNG, WebP o GIF.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 10 MB.' },
        { status: 400 }
      )
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const safeName = `${folder}/${folder}-${Date.now()}.${ext}`

    const blob = await put(safeName, file, { access: 'public' })

    return NextResponse.json({ url: blob.url })
  } catch (err: any) {
    console.error('[upload] error:', err)
    return NextResponse.json({ error: err.message || 'Error al subir la imagen.' }, { status: 500 })
  }
}
