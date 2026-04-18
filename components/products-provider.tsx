'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
  image: string
  active: boolean
  category_id: string
  order_index: number
  created_at: string
  updated_at: string
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected'

interface ProductsContextType {
  products: Product[]
  loading: boolean
  status: ConnectionStatus
  getProduct: (id: string) => Product | undefined
  updateProductLocally: (id: string, updates: Partial<Product>) => void
  refreshFromDB: () => Promise<void>
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<ConnectionStatus>('connecting')

  // Helper: fetch products with category JOIN
  const fetchProductsWithCategories = useCallback(async (supabase: ReturnType<typeof createClient>) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        description,
        image,
        active,
        category_id,
        order_index,
        created_at,
        updated_at,
        categories(label, slug)
      `)
      .order('order_index', { ascending: true })

    if (error) throw error

    return (data as any[])?.map((item: any) => ({
      ...item,
      category: item.categories?.label || 'Sin categoría',
      category_slug: item.categories?.slug || '',
    })) as Product[] ?? []
  }, [])

  // 1. Initial fetch from Supabase with category JOIN
  useEffect(() => {
    const loadProducts = async () => {
      const supabase = createClient()
      try {
        const transformed = await fetchProductsWithCategories(supabase)
        setProducts(transformed)
      } catch (err) {
        console.error('[ProductsProvider] load error:', err)
        setStatus('disconnected')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [fetchProductsWithCategories])

  // 2. Setup Realtime subscription
  useEffect(() => {
    if (loading) return

    const supabase = createClient()
    let channel: RealtimeChannel

    const setupRealtime = () => {
      channel = supabase
        .channel(`products-realtime-${Date.now()}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'products' },
          async (payload) => {
            // Re-fetch the updated row with category JOIN so label is preserved
            const id = (payload.new as Product).id
            const { data } = await supabase
              .from('products')
              .select(`id, name, price, description, image, active, category_id, order_index, created_at, updated_at, categories(label, slug)`)
              .eq('id', id)
              .single()
            if (data) {
              const enriched = {
                ...(data as any),
                category: (data as any).categories?.label || 'Sin categoría',
                category_slug: (data as any).categories?.slug || '',
              } as Product
              setProducts((prev) => prev.map((p) => (p.id === id ? enriched : p)))
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'products' },
          async (payload) => {
            const id = (payload.new as Product).id
            const { data } = await supabase
              .from('products')
              .select(`id, name, price, description, image, active, category_id, order_index, created_at, updated_at, categories(label, slug)`)
              .eq('id', id)
              .single()
            if (data) {
              const enriched = {
                ...(data as any),
                category: (data as any).categories?.label || 'Sin categoría',
                category_slug: (data as any).categories?.slug || '',
              } as Product
              setProducts((prev) => {
                const exists = prev.find((p) => p.id === id)
                return exists ? prev : [...prev, enriched]
              })
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'products' },
          (payload) => {
            const deletedId = (payload.old as { id: string }).id
            setProducts((prev) => prev.filter((p) => p.id !== deletedId))
          }
        )
        .subscribe((s) => {
          if (s === 'SUBSCRIBED') setStatus('connected')
          else if (s === 'CLOSED' || s === 'CHANNEL_ERROR') setStatus('disconnected')
        })
    }

    setupRealtime()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loading])

  // Optimistic local update
  const updateProductLocally = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updates,
              updated_at: new Date().toISOString(),
            }
          : p
      )
    )
  }, [])

  // Manual refresh from DB
  const refreshFromDB = useCallback(async () => {
    const supabase = createClient()
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          description,
          image,
          active,
          category_id,
          order_index,
          created_at,
          updated_at,
          categories(label, slug)
        `)
        .order('order_index', { ascending: true })
      
      if (error) throw error
      
      const transformed = (data as any[])?.map((item: any) => ({
        ...item,
        category: item.categories?.label || 'Sin categoría',
        category_slug: item.categories?.slug || '',
      })) ?? []
      
      setProducts(transformed as Product[])
    } catch (err) {
      console.error('[v0] Products: refresh error', err)
    }
  }, [])

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  )

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        status,
        getProduct,
        updateProductLocally,
        refreshFromDB,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProductsContext() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProductsContext must be used within ProductsProvider')
  return ctx
}
