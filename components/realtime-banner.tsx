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
  const { getBanner } = useBannersContext()
  const banner = getBanner(bannerKey)
  const imageUrl = banner?.image_url || fallbackUrl

  return (
    <section
      className={cn(
        // Altura FIJA desde el primer render - NUNCA depende de contenido/imagen
        // Mobile: 100svh menos header (76px), Tablet: 640px, Desktop: 760px
        'relative w-full overflow-hidden bg-[#2C1810]',
        'min-h-[calc(100svh-76px)] md:min-h-[640px] lg:min-h-[760px]',
        className
      )}
    >
      {/* Imagen con fill + object-cover - ocupa SIEMPRE el 100% del contenedor */}
      <Image
        key={imageUrl}
        src={imageUrl}
        alt={alt}
        fill
        priority={priority}
        fetchPriority={priority ? 'high' : 'auto'}
        sizes="100vw"
        className="object-cover"
      />

      {/* Children (botones, texto) siempre visibles encima de la imagen */}
      {children && (
        <div className="absolute inset-0 z-10 flex items-end pb-8 sm:pb-12">
          {children}
        </div>
      )}
    </section>
  )
}
