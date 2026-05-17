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
    <div className={cn('relative w-full overflow-hidden bg-[#2C1810]', className)}>
      {/* Imagen SIEMPRE visible desde el primer paint - sin opacity/transition */}
      <Image
        key={imageUrl}
        src={imageUrl}
        alt={alt}
        width={1400}
        height={700}
        className="w-full h-auto block"
        priority={priority}
        fetchPriority={priority ? 'high' : 'auto'}
        quality={85}
        placeholder="empty"
      />
      
      {/* Loading overlay sutil - NO oculta la imagen */}
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5EFE8]/20 via-transparent to-[#2C1810]/10 pointer-events-none z-[1]" />
      )}
      
      {/* CTA Buttons - siempre visibles */}
      {children && (
        <div className="absolute inset-0 z-10 flex items-end pb-8 sm:pb-12">
          {children}
        </div>
      )}
    </div>
  )
}
