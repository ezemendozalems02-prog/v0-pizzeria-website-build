'use client'

import { useEffect, useState } from 'react'
import { createClient } from './supabase/client'

interface Store {
  products: any[]
  categories: any[]
  banners: any[]
  content: any
  config: any
  loading: boolean
  error: string | null
}

export function useAdminStore() {
  const [store, setStore] = useState<Store>({
    products: [],
    categories: [],
    banners: [],
    content: null,
    config: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()

        const [productsRes, categoriesRes, bannersRes, contentRes, configRes] = await Promise.all([
          supabase.from('products').select('*').eq('active', true),
          supabase.from('categories').select('*'),
          supabase.from('banners').select('*'),
          supabase.from('content').select('*').single(),
          supabase.from('config').select('*').single(),
        ])

        setStore({
          products: productsRes.data || [],
          categories: categoriesRes.data || [],
          banners: bannersRes.data || [],
          content: contentRes.data,
          config: configRes.data,
          loading: false,
          error: null,
        })
      } catch (err: any) {
        setStore((prev) => ({
          ...prev,
          loading: false,
          error: err.message,
        }))
      }
    }

    fetchData()
  }, [])

  return store
}
