'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

const REVALIDATE_PATHS = ['/', '/pedido-delivery', '/admin/productos']

function revalidateAll() {
  REVALIDATE_PATHS.forEach((p) => revalidatePath(p))
}

export async function createProduct(data: {
  name: string
  price: number
  description: string
  image: string
  active: boolean
  category_id: string
  order_index: number
}) {
  try {
    if (!data.name?.trim()) return { success: false, error: 'Nombre requerido' }
    if (!data.image?.trim()) return { success: false, error: 'Imagen requerida' }
    if (!data.category_id?.trim()) return { success: false, error: 'Categoría requerida' }

    const supabase = createAdminClient()

    const { data: row, error } = await supabase
      .from('products')
      .insert({
        id: crypto.randomUUID(),
        name: data.name.trim(),
        price: Number(data.price),
        description: data.description?.trim() ?? '',
        image: data.image.trim(),
        active: data.active,
        category_id: data.category_id,
        order_index: data.order_index ?? 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    revalidateAll()
    return { success: true, data: row }
  } catch (err: any) {
    console.error('[createProduct]', err)
    return { success: false, error: err.message ?? 'Error al crear producto' }
  }
}

export async function updateProduct(
  id: string,
  data: {
    name: string
    price: number
    description: string
    image: string
    active: boolean
    category_id: string
    order_index: number
  }
) {
  try {
    if (!id) return { success: false, error: 'ID requerido' }
    if (!data.name?.trim()) return { success: false, error: 'Nombre requerido' }

    const supabase = createAdminClient()

    const { data: row, error } = await supabase
      .from('products')
      .update({
        name: data.name.trim(),
        price: Number(data.price),
        description: data.description?.trim() ?? '',
        image: data.image.trim(),
        active: data.active,
        category_id: data.category_id,
        order_index: data.order_index ?? 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidateAll()
    return { success: true, data: row }
  } catch (err: any) {
    console.error('[updateProduct]', err)
    return { success: false, error: err.message ?? 'Error al actualizar producto' }
  }
}

export async function deleteProduct(id: string) {
  try {
    if (!id) return { success: false, error: 'ID requerido' }

    const supabase = createAdminClient()

    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) throw error

    revalidateAll()
    return { success: true }
  } catch (err: any) {
    console.error('[deleteProduct]', err)
    return { success: false, error: err.message ?? 'Error al eliminar producto' }
  }
}

export async function toggleProductActive(id: string, active: boolean) {
  try {
    if (!id) return { success: false, error: 'ID requerido' }

    const supabase = createAdminClient()

    const { error } = await supabase
      .from('products')
      .update({ active, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error

    revalidateAll()
    return { success: true }
  } catch (err: any) {
    console.error('[toggleProductActive]', err)
    return { success: false, error: err.message ?? 'Error al cambiar estado' }
  }
}

export async function loadCategories() {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('categories')
      .select('id, label, slug')
      .order('label', { ascending: true })

    if (error) throw error
    return { success: true, data: data ?? [] }
  } catch (err: any) {
    console.error('[loadCategories]', err)
    return { success: false, error: err.message ?? 'Error al cargar categorías', data: [] }
  }
}
