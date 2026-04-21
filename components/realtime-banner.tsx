'use client'

import { useBannersContext } from '@/components/banners-provider'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface RealtimeBannerProps {
  bannerKey: string
  fallbackUrl: string
  alt: string
  className?: string
  children?: React.ReactNode
  priority?: boolean
}

export function RealtimeBanner({
  bannerKey,
  fallbackUrl,
  alt,
  className,
  children,
  priority = false,
}: RealtimeBannerProps) {
  const { getBanner, loading } = useBannersContext()
  const banner = getBanner(bannerKey)
  const imageUrl = banner?.image_url || fallbackUrl

  // Para mobile y desktop usamos la misma estructura: imagen natural + children absolutos
  return (
    <div className={cn('relative w-full overflow-hidden', className)}>
      {loading && <div className="absolute inset-0 bg-muted animate-pulse z-10" />}
      <div style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.7s' }}>
        <Image
          key={imageUrl}
          src={imageUrl}
          alt={alt}
          width={1400}
          height={700}
          className="w-full h-auto block"
          priority={priority}
          unoptimized
        />
      </div>
      {children && (
        <div className="absolute inset-0 z-10 flex items-end">
          {children}
        </div>
      )}
    </div>
  )
}
