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

  // 1. Initial fetch from Supabase
  useEffect(() => {
    const loadProducts = async () => {
      console.log('[v0] Products: loading initial data from Supabase')
      const supabase = createClient()
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('order_index', { ascending: true })
        
        if (error) throw error
        console.log('[v0] Products: loaded', data?.length, 'items')
        setProducts((data as Product[]) ?? [])
      } catch (err) {
        console.error('[v0] Products: load error', err)
        setStatus('disconnected')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

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
          (payload) => {
            const updated = payload.new as Product
            console.log('[v0] Products: Realtime UPDATE', updated.id, updated.name)
            setProducts((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p))
            )
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'products' },
          (payload) => {
            const inserted = payload.new as Product
            console.log('[v0] Products: Realtime INSERT', inserted.id, inserted.name)
            setProducts((prev) => {
              const exists = prev.find((p) => p.id === inserted.id)
              return exists ? prev : [...prev, inserted]
            })
          }
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'products' },
          (payload) => {
            const deleted = payload.old as Product
            console.log('[v0] Products: Realtime DELETE', deleted.id)
            setProducts((prev) => prev.filter((p) => p.id !== deleted.id))
          }
        )
        .subscribe((s) => {
          if (s === 'SUBSCRIBED') {
            console.log('[v0] Products: Realtime connected')
            setStatus('connected')
          } else if (s === 'CLOSED' || s === 'CHANNEL_ERROR') {
            console.log('[v0] Products: Realtime disconnected')
            setStatus('disconnected')
          }
        })
    }

    setupRealtime()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loading])

  // Optimistic local update
  const updateProductLocally = useCallback((id: string, updates: Partial<Product>) => {
    console.log('[v0] Products: optimistic update', id, updates)
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
    console.log('[v0] Products: manual refresh from DB')
    const supabase = createClient()
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('order_index', { ascending: true })
      
      if (error) throw error
      setProducts((data as Product[]) ?? [])
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
