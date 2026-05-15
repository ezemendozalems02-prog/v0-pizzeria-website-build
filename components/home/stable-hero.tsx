import Image from "next/image"
import Link from "next/link"

const HERO_IMAGE =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20principal%20inicio-sgLjm1UietPhuULpK6QoJWyqFRFgFj.jpg"

export function StableHero() {
  return (
    <>
      {/* MOBILE HERO - object-cover fullscreen con encuadre personalizado */}
      <section
        className="md:hidden relative w-full overflow-hidden bg-black"
        style={{ height: "calc(100svh - 64px)" }}
      >
        {/* Image - object-cover + object-position para mover encuadre vertical */}
        <Image
          src={HERO_IMAGE}
          alt="TOTORE pizza artesanal fresca auténtica"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[center_38%]"
        />

        {/* Overlay sutil */}
        <div className="absolute inset-0 bg-black/20 z-[1]" />

        {/* Botones sobre la imagen - integrados al hero */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 flex justify-center gap-3 px-5"
          style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom))" }}
        >
          <Link
            href="/pedido-delivery"
            className="inline-flex items-center gap-2 rounded-md bg-[#C4322B] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#a82a24] active:scale-[0.98]"
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
            className="inline-flex items-center rounded-md border border-white/50 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-white/20 active:scale-[0.98]"
          >
            Ver Menú
          </Link>
        </div>
      </section>

      {/* DESKTOP HERO - object-cover fullscreen */}
      <section className="hidden md:block relative w-full overflow-hidden bg-black h-[760px]">
        <Image
          src={HERO_IMAGE}
          alt="TOTORE pizza artesanal fresca auténtica"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 z-[1]" />

        {/* Botones */}
        <div className="absolute inset-0 z-20 flex items-end justify-center pb-16">
          <div className="flex flex-row gap-3">
            <Link
              href="/pedido-delivery"
              className="inline-flex items-center gap-2 rounded-md bg-[#C4322B] px-5 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#a82a24] active:scale-[0.98]"
            >
              Pedir Delivery
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
              className="inline-flex items-center rounded-md border border-white/50 bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-white/20 active:scale-[0.98]"
            >
              Ver Menú
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
