import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { StoreContent } from "@/components/store-content"

const HERO_IMAGE = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20principal%20inicio-sgLjm1UietPhuULpK6QoJWyqFRFgFj.jpg"

export default function HomePage() {
  return (
    <>
      {/* Pure Hero - No dependencies, renders immediately */}
      <section
        className="relative w-full overflow-hidden bg-black"
        style={{ height: "100svh" }}
      >
        {/* Image - fill + object-cover for fullscreen, priority for fast load */}
        <Image
          src={HERO_IMAGE}
          alt="TOTORE pizza artesanal fresca auténtica"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={85}
          className="object-cover object-center"
          style={{
            objectFit: "cover",
            objectPosition: "center",
            backgroundColor: "#000",
          }}
        />

        {/* Overlay - subtle dark overlay */}
        <div className="absolute inset-0 bg-black/15 z-[1]" />

        {/* CTA Buttons - bottom center */}
        <div className="absolute inset-0 z-20 flex items-end justify-center pb-12">
          <div className="flex flex-row gap-3 px-5 flex-wrap justify-center">
            <Link
              href="/pedido-delivery"
              className="inline-flex items-center gap-2 rounded-md bg-[#C4322B] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#a82a24] active:scale-[0.98]"
            >
              Pedir Delivery
              <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              href="/pedido-delivery"
              className="inline-flex items-center rounded-md border border-white/50 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-white/20 active:scale-[0.98]"
            >
              Ver Menú
            </Link>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <StoreContent />
    </>
  )
}
