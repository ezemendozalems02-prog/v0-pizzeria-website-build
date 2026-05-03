'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createCategory(label: string, slug: string) {
  try {
    // Validar entrada
    if (!label?.trim()) {
      return { success: false, error: 'El nombre de la categoría no puede estar vacío' }
    }
    if (!slug?.trim()) {
      return { success: false, error: 'El slug no puede estar vacío' }
    }

    const supabase = createAdminClient()

    // Insertar con SERVICE_ROLE_KEY (bypassa RLS)
    const { data, error } = await supabase
      .from('categories')
      .insert({ 
        label: label.trim(), 
        slug: slug.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('[createCategory] Supabase error:', error)
      throw error
    }

    console.log('[createCategory] Category created:', data)
    
    // Revalidar rutas relevantes
    revalidatePath('/admin/categorias')
    revalidatePath('/pedido-delivery')
    revalidatePath('/')

    return { success: true, data }
  } catch (err: any) {
    console.error('[createCategory] Exception:', err)
    return { success: false, error: err.message || 'Error al crear categoría' }
  }
}

export async function updateCategory(id: string, label: string, slug: string) {
  try {
    // Validar entrada
    if (!id) {
      return { success: false, error: 'ID de categoría requerido' }
    }
    if (!label?.trim()) {
      return { success: false, error: 'El nombre de la categoría no puede estar vacío' }
    }
    if (!slug?.trim()) {
      return { success: false, error: 'El slug no puede estar vacío' }
    }

    const supabase = createAdminClient()

    // Actualizar con SERVICE_ROLE_KEY (bypassa RLS)
    const { data, error } = await supabase
      .from('categories')
      .update({ 
        label: label.trim(), 
        slug: slug.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[updateCategory] Supabase error:', error)
      throw error
    }

    console.log('[updateCategory] Category updated:', data)

    // Revalidar rutas relevantes
    revalidatePath('/admin/categorias')
    revalidatePath('/pedido-delivery')
    revalidatePath('/')

    return { success: true, data }
  } catch (err: any) {
    console.error('[updateCategory] Exception:', err)
    return { success: false, error: err.message || 'Error al actualizar categoría' }
  }
}

export async function deleteCategory(id: string) {
  try {
    // Validar entrada
    if (!id) {
      return { success: false, error: 'ID de categoría requerido' }
    }

    const supabase = createAdminClient()

    // Eliminar con SERVICE_ROLE_KEY (bypassa RLS)
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[deleteCategory] Supabase error:', error)
      throw error
    }

    console.log('[deleteCategory] Category deleted:', id)

    // Revalidar rutas relevantes
    revalidatePath('/admin/categorias')
    revalidatePath('/pedido-delivery')
    revalidatePath('/')

    return { success: true }
  } catch (err: any) {
    console.error('[deleteCategory] Exception:', err)
    return { success: false, error: err.message || 'Error al eliminar categoría' }
  }
}

export async function loadCategories() {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('categories')
      .select('id, label, slug, created_at, updated_at')
      .order('label', { ascending: true })

    if (error) {
      console.error('[loadCategories] Supabase error:', error)
      throw error
    }

    console.log('[loadCategories] Loaded:', data?.length, 'categories')
    return { success: true, data }
  } catch (err: any) {
    console.error('[loadCategories] Exception:', err)
    return { success: false, error: err.message || 'Error al cargar categorías' }
  }
}
