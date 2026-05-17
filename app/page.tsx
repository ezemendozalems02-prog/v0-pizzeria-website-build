import Link from "next/link"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { RealtimeBanner } from "@/components/realtime-banner"
import { createClient } from "@/lib/supabase/server"

const FALLBACK_BANNER =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20principal%20inicio-sgLjm1UietPhuULpK6QoJWyqFRFgFj.jpg"

// Lazy load StoreContent - no bloquea hero
const StoreContent = dynamic(
  () => import("@/components/store-content").then((mod) => ({ default: mod.StoreContent })),
  { loading: () => <div className="h-20" />, ssr: true }
)

export default async function HomePage() {
  // Pre-fetch banner en el servidor - el cliente recibe la URL correcta desde el primer render
  let initialBannerUrl = FALLBACK_BANNER
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("banners")
      .select("image_url")
      .eq("key", "home")
      .single()
    if (data?.image_url) initialBannerUrl = data.image_url
  } catch {
    // Si falla el fetch, usa el fallback - nunca rompe la página
  }

  return (
    <>
      <RealtimeBanner
        bannerKey="home"
        fallbackUrl={FALLBACK_BANNER}
        initialUrl={initialBannerUrl}
        alt="Pizza napolitana artesanal - TOTORE fresco, auténtica"
        priority
      >
        <div className="w-full px-4 sm:px-8 pb-6 sm:pb-10">
          <div className="flex flex-row gap-3">
            <Button
              asChild
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            >
              <Link href="/pedido-delivery">
                Pedir Delivery
                <ArrowRight className="ml-2 h-3 w-3" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="bg-background/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/20 shadow-lg"
            >
              <Link href="/pedido-delivery">
                Ver Menú
              </Link>
            </Button>
          </div>
        </div>
      </RealtimeBanner>

      <StoreContent />
    </>
  )
}
