import Image from "next/image"
import Link from "next/link"

const HERO_IMAGE =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20principal%20inicio-sgLjm1UietPhuULpK6QoJWyqFRFgFj.jpg"

export function StableHero() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-[#2C1810]"
      style={{ height: "100svh" }}
    >
      {/* Imagen de fondo -- renderiza inmediatamente con priority + fill */}
      <Image
        src={HERO_IMAGE}
        alt="TOTORE pizza artesanal"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover"
      />

      {/* Overlay oscuro sutil */}
      <div className="absolute inset-0 bg-black/20 z-[1]" />

      {/* Botones CTA -- posicionados abajo a la izquierda */}
      <div className="absolute inset-0 z-10 flex items-end">
        <div className="w-full px-4 sm:px-8 pb-10 sm:pb-14">
          <div className="flex flex-row gap-3">
            <Link
              href="/pedido-delivery"
              className="inline-flex items-center gap-2 rounded-md bg-[#C4322B] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#a82a24]"
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
              className="inline-flex items-center rounded-md border border-white/50 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Ver Menu
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
