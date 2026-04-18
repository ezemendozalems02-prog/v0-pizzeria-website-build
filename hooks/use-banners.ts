'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface Banner {
  id: string
  key: string
  image_url: string
  overlay_text: string
  overlay_button_text: string
  overlay_button_link: string
  updated_at: string
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected'

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<ConnectionStatus>('connecting')

  const getBanner = useCallback(
    (key: string): Banner | undefined => banners.find((b) => b.key === key),
    [banners]
  )

  useEffect(() => {
    const supabase = createClient()
    let channel: RealtimeChannel

    const loadBanners = async () => {
      const { data, error } = await supabase.from('banners').select('*')
      if (error) {
        console.error('[useBanners] Error loading:', error.message)
        setStatus('disconnected')
      } else {
        setBanners((data as Banner[]) ?? [])
      }
      setLoading(false)
    }

    const subscribe = () => {
      channel = supabase
        .channel('banners-realtime')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'banners' },
          (payload) => {
            const updated = payload.new as Banner
            setBanners((prev) =>
              prev.map((b) => (b.id === updated.id ? updated : b))
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
    }

    loadBanners()
    subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { banners, loading, status, getBanner }
}
