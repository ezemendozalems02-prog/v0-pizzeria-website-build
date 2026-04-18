'use client'

// Re-export types and hook from the central BannersProvider
// This keeps backward compatibility with any existing imports
export type { Banner, ConnectionStatus } from '@/components/banners-provider'
export { useBannersContext as useBanners } from '@/components/banners-provider'
