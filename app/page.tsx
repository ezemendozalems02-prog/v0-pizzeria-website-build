'use client'

import { useEffect } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { RealtimeBanner } from "@/components/realtime-banner"

// Lazy load StoreContent to prevent blocking hero render
const StoreContent = dynamic(() => import("@/components/store-content").then(mod => ({ default: mod.StoreContent })), {
  loading: () => (
    <div className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-96 bg-gradient-to-br from-[#F5EFE8] via-[#F9F6F0] to-[#F5EFE8] rounded-lg animate-pulse" />
      </div>
    </div>
  ),
  ssr: true,
})

export default function HomePage() {
  // Forzar scroll arriba al montar - evita que el navegador restaure scroll anterior
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual"
      window.scrollTo(0, 0)
    }
  }, [])

  return (
    <>
      {/* Hero Section - PRIMER componente, sin nada antes */}
      <RealtimeBanner
        bannerKey="home"
        fallbackUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20principal%20inicio-sgLjm1UietPhuULpK6QoJWyqFRFgFj.jpg"
        alt="Pizza napolitana artesanal - TOTORE fresco, auténtica"
        priority
      >
        <div className="w-full px-4 sm:px-8 pb-6 sm:pb-10">
          <div className="flex flex-row gap-3">
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
              <Link href="/pedido-delivery">
                Pedir Delivery
                <ArrowRight className="ml-2 h-3 w-3" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="bg-background/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/20 shadow-lg">
              <Link href="/pedido-delivery">
                Ver Menú
              </Link>
            </Button>
          </div>
        </div>
      </RealtimeBanner>

      {/* Experience Section */}
      <StoreContent />
    </>
  )
}
