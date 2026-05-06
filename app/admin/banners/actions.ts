'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export async function saveBannerUrl(id: string, imageUrl: string) {
  try {
    if (!id) return { success: false, error: 'ID requerido' }
    if (!imageUrl?.trim()) return { success: false, error: 'URL de imagen requerida' }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('banners')
      .update({
        image_url: imageUrl.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[saveBannerUrl] Supabase error:', error)
      throw error
    }

    // Revalidate all pages that display banners
    revalidatePath('/')
    revalidatePath('/sobre-nosotros')
    revalidatePath('/contacto')
    revalidatePath('/pedido-delivery')
    revalidatePath('/admin/banners')

    return { success: true, data }
  } catch (err: any) {
    console.error('[saveBannerUrl] Exception:', err)
    return { success: false, error: err.message ?? 'Error al guardar el banner' }
  }
}
