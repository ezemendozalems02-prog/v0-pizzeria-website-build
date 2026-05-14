import Image from "next/image"
import Link from "next/link"

const HERO_IMAGE =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20principal%20inicio-sgLjm1UietPhuULpK6QoJWyqFRFgFj.jpg"

/**
 * Enhanced StableHero con logo texto superpuesto (alternativa para mejor legibilidad en mobile)
 * Descomenta en StableHero si el logo queda cortado incluso con object-position
 */
export function StableHeroWithOverlay() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-[#2C1810]"
      style={{ height: "100svh" }}
    >
      {/* Imagen de fondo */}
      <Image
        src={HERO_IMAGE}
        alt="TOTORE pizza artesanal fresca auténtica"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Overlay oscuro sutil */}
      <div className="absolute inset-0 bg-black/30 z-[1]" />

      {/* Logo y texto superpuesto - centrado, nunca cortado */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        {/* Logo texto TOTORE */}
        <div className="text-center">
          <h1 className="
            font-serif
            text-5xl sm:text-7xl md:text-8xl
            font-bold
            text-white
            drop-shadow-lg
            max-w-[90vw]
            leading-tight
          ">
            TOTORE
          </h1>
          <p className="
            font-accent
            text-lg sm:text-2xl
            text-white/90
            drop-shadow-md
            mt-2 sm:mt-4
          ">
            fresco auténtica
          </p>
        </div>
      </div>

      {/* Botones CTA -- posicionados abajo */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="w-full px-4 sm:px-8 pb-8 sm:pb-14" style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}>
          <div className="flex flex-row gap-3 flex-wrap">
            <Link
              href="/pedido-delivery"
              className="inline-flex items-center gap-2 rounded-md bg-[#C4322B] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#a82a24] active:scale-95"
            >
              Pedir Delivery
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/pedido-delivery"
              className="inline-flex items-center rounded-md border border-white/50 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-white/20 active:scale-95"
            >
              Ver Menu
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
