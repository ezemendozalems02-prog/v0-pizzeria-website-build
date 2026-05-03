'use server'

import { createClient } from '@/lib/supabase/server'

export async function createCategory(label: string, slug: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({ label, slug })
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al crear categoría' }
  }
}

export async function updateCategory(id: string, label: string, slug: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('categories')
      .update({ label, slug, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al actualizar categoría' }
  }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al eliminar categoría' }
  }
}
