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
  // Reads from the shared context — no extra DB fetch, no extra WebSocket
  const { getBanner, loading } = useBannersContext()
  const banner = getBanner(bannerKey)
  // Use DB value if available; fall back to the hardcoded URL during first load
  const imageUrl = banner?.image_url || fallbackUrl

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Skeleton while initial load is in progress */}
      {loading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: loading ? 0 : 1 }}
      >
        {/* key={imageUrl} forces React to remount the Image when the URL changes */}
        <Image
          key={imageUrl}
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
          unoptimized
        />
      </div>
      {children && (
        <div className="relative z-10 h-full">
          {children}
        </div>
      )}
    </div>
  )
}
