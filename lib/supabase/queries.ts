import { createClient } from './client'

export async function getProducts() {
  const supabase = createClient()
  return supabase.from('products').select('*').eq('active', true)
}

export async function getProduct(id: string) {
  const supabase = createClient()
  return supabase.from('products').select('*').eq('id', id).single()
}

export async function createProduct(data: any) {
  const supabase = createClient()
  return supabase.from('products').insert([data])
}

export async function updateProduct(id: string, data: any) {
  const supabase = createClient()
  return supabase.from('products').update(data).eq('id', id)
}

export async function deleteProduct(id: string) {
  const supabase = createClient()
  return supabase.from('products').delete().eq('id', id)
}

export async function getCategories() {
  const supabase = createClient()
  return supabase.from('categories').select('*').order('order', { ascending: true })
}

export async function createCategory(data: any) {
  const supabase = createClient()
  return supabase.from('categories').insert([data])
}

export async function updateCategory(id: string, data: any) {
  const supabase = createClient()
  return supabase.from('categories').update(data).eq('id', id)
}

export async function deleteCategory(id: string) {
  const supabase = createClient()
  return supabase.from('categories').delete().eq('id', id)
}

export async function getBanners() {
  const supabase = createClient()
  return supabase.from('banners').select('*')
}

export async function updateBanner(id: string, data: any) {
  const supabase = createClient()
  return supabase.from('banners').update(data).eq('id', id)
}

export async function getContent() {
  const supabase = createClient()
  return supabase.from('content').select('*').single()
}

export async function updateContent(data: any) {
  const supabase = createClient()
  return supabase.from('content').update(data).eq('id', 1)
}

export async function getConfig() {
  const supabase = createClient()
  return supabase.from('config').select('*').single()
}

export async function updateConfig(data: any) {
  const supabase = createClient()
  return supabase.from('config').update(data).eq('id', 1)
}
