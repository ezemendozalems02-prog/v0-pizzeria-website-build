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

  return (
    <>
      {/* Mobile: imagen completa con aspect ratio natural, sin recorte */}
      <div className={cn('block sm:hidden w-full overflow-hidden', loading && 'bg-muted animate-pulse')}>
        <div style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.7s' }}>
          <Image
            key={imageUrl}
            src={imageUrl}
            alt={alt}
            width={1200}
            height={600}
            className="w-full h-auto object-contain"
            priority={priority}
            unoptimized
          />
        </div>
      </div>

      {/* Desktop: altura flexible con object-contain */}
      <div className={cn('hidden sm:block relative w-full overflow-hidden bg-muted', className, loading && 'animate-pulse')}>
        {loading && <div className="absolute inset-0 bg-muted animate-pulse" />}
        <div
          className="relative w-full transition-opacity duration-700"
          style={{ opacity: loading ? 0 : 1 }}
        >
          <Image
            key={imageUrl + '-desktop'}
            src={imageUrl}
            alt={alt}
            width={1400}
            height={700}
            className="w-full h-auto object-contain"
            priority={priority}
            unoptimized
          />
        </div>
        {children && (
          <div className="relative z-10">{children}</div>
        )}
      </div>
    </>
  )
}
