'use client'

import { useBanners } from '@/hooks/use-banners'
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
  const { getBanner, loading } = useBanners()
  const banner = getBanner(bannerKey)
  const imageUrl = banner?.image_url || fallbackUrl

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: loading ? 0 : 1 }}
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
          unoptimized
          key={imageUrl}
        />
      </div>
      {/* Skeleton mientras carga */}
      {loading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      {children && (
        <div className="relative z-10 h-full">
          {children}
        </div>
      )}
    </div>
  )
}
