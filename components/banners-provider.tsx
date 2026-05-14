'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface Banner {
  id: string
  key: string
  image_url: string
  overlay_text: string
  overlay_button_text: string | null
  overlay_button_link: string | null
  updated_at: string
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected'

interface BannersContextValue {
  banners: Banner[]
  loading: boolean
  status: ConnectionStatus
  getBanner: (key: string) => Banner | undefined
  updateBannerLocally: (id: string, image_url: string) => void
}

const BannersContext = createContext<BannersContextValue>({
  banners: [],
  loading: true,
  status: 'connecting',
  getBanner: () => undefined,
  updateBannerLocally: () => {},
})

export function BannersProvider({ children }: { children: React.ReactNode }) {
  const [banners, setBanners] = useState<Banner[]>([])
  // Empezar con loading=false para que el hero se muestre inmediatamente con fallback
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<ConnectionStatus>('connecting')
  // Use a ref to avoid stale closures in realtime handlers
  const channelRef = useRef<RealtimeChannel | null>(null)
  const supabase = useRef(createClient())

  useEffect(() => {
    const client = supabase.current
    // Marcar loading solo después del mount para no bloquear SSR/first paint
    setLoading(true)

    // 1. Initial fetch — bypass Next.js cache with cache: 'no-store'
    const loadBanners = async () => {
      const { data, error } = await client
        .from('banners')
        .select('*')
      if (error) {
        console.error('[BannersProvider] load error:', error.message)
        setStatus('disconnected')
      } else {
        setBanners((data as Banner[]) ?? [])
      }
      setLoading(false)
    }

    // 2. Realtime subscription — unique channel name per mount
    const channelName = `banners-realtime-${Date.now()}`
    const channel = client
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'banners' },
        (payload) => {
          const updated = payload.new as Banner
          setBanners((prev) =>
            prev.map((b) => (b.id === updated.id ? { ...b, ...updated } : b))
          )
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'banners' },
        (payload) => {
          const inserted = payload.new as Banner
          setBanners((prev) => {
            const exists = prev.find((b) => b.id === inserted.id)
            return exists ? prev : [...prev, inserted]
          })
        }
      )
      .subscribe((s) => {
        if (s === 'SUBSCRIBED') setStatus('connected')
        else if (s === 'CLOSED' || s === 'CHANNEL_ERROR') setStatus('disconnected')
      })

    channelRef.current = channel
    loadBanners()

    return () => {
      client.removeChannel(channel)
    }
  }, [])

  const getBanner = useCallback(
    (key: string) => banners.find((b) => b.key === key),
    [banners]
  )

  // Optimistic local update so the UI reflects changes instantly before Realtime fires
  const updateBannerLocally = useCallback((id: string, image_url: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, image_url } : b))
    )
  }, [])

  return (
    <BannersContext.Provider value={{ banners, loading, status, getBanner, updateBannerLocally }}>
      {children}
    </BannersContext.Provider>
  )
}

export function useBannersContext() {
  return useContext(BannersContext)
}
