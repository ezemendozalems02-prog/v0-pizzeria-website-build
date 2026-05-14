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
  
  // SIEMPRE usar fallback primero para evitar espacio vacío
  // La imagen del banner de Supabase se aplica cuando esté disponible
  const imageUrl = banner?.image_url || fallbackUrl

  return (
    <div className={cn('relative w-full overflow-hidden bg-[#2C1810]', className)} style={{ minHeight: 'max(300px, 40svh)' }}>
      {/* Imagen SIEMPRE visible desde el primer paint - nunca opacity 0 */}
      <Image
        key={imageUrl}
        src={imageUrl}
        alt={alt}
        width={1400}
        height={700}
        className="w-full h-auto block"
        priority={priority}
        fetchPriority={priority ? 'high' : 'auto'}
        sizes="100vw"
        placeholder="empty"
      />
      
      {/* Overlay de loading sutil - NO oculta la imagen, solo indica carga */}
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5EFE8]/30 via-transparent to-[#F5EFE8]/30 animate-pulse pointer-events-none z-5" />
      )}
      
      {/* Children (botones, texto) siempre visibles */}
      {children && (
        <div className="absolute inset-0 z-10 flex items-end pb-8 sm:pb-12">
          {children}
        </div>
      )}
    </div>
  )
}
