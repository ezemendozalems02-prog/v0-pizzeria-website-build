'use client'

import { useBannersContext } from '@/components/banners-provider'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface RealtimeBannerProps {
  bannerKey: string
  fallbackUrl: string
  initialUrl?: string  // URL pre-fetched en el servidor - evita flash en primera carga
  alt: string
  className?: string
  children?: React.ReactNode
  priority?: boolean
}

export function RealtimeBanner({
  bannerKey,
  fallbackUrl,
  initialUrl,
  alt,
  className,
  children,
  priority = false,
}: RealtimeBannerProps) {
  const { getBanner } = useBannersContext()
  const banner = getBanner(bannerKey)

  // Prioridad: URL de Supabase (realtime) → initialUrl (SSR) → fallback
  // Si el cliente ya cargó banners, usa el de Supabase; si no, usa initialUrl del servidor
  const imageUrl = banner?.image_url || initialUrl || fallbackUrl

  return (
    <div className={cn('relative w-full overflow-hidden bg-[#2C1810]', className)}>
      {/* Sin key dinámica - la misma URL del servidor al cliente, sin remount */}
      <Image
        src={imageUrl}
        alt={alt}
        width={1400}
        height={700}
        className="w-full h-auto block"
        priority={priority}
        fetchPriority={priority ? 'high' : 'auto'}
        quality={85}
        placeholder="empty"
        unoptimized={imageUrl.includes('blob.vercel-storage.com')}
      />

      {children && (
        <div className="absolute inset-0 z-10 flex items-end pb-8 sm:pb-12">
          {children}
        </div>
      )}
    </div>
  )
}
