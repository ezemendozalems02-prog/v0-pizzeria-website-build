'use client'

import Image from 'next/image'
import Link from 'next/link'

const HERO_IMAGE_MOBILE =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20principal%20inicio-sgLjm1UietPhuULpK6QoJWyqFRFgFj.jpg'
const HERO_IMAGE_DESKTOP =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20principal%20inicio-sgLjm1UietPhuULpK6QoJWyqFRFgFj.jpg'

export function StableHero() {
  return (
    <section id="hero" className="relative w-full overflow-hidden bg-black">
      {/* ━━━ MOBILE HERO ━━━ */}
      <div className="relative block md:hidden w-full overflow-hidden bg-black" style={{ height: 'calc(100svh - 64px)' }}>
        <Image
          src={HERO_IMAGE_MOBILE}
          alt="TOTORE Pizza - Fresco Auténtica"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-contain object-center"
        />

        {/* Overlay oscuro suave */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Botones CTA - overlay HTML */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center gap-3 px-5 pb-8">
          <Link
            href="/pedido-delivery"
            className="inline-flex items-center gap-2 rounded-xl bg-[#C4322B] px-5 py-3 text-base font-semibold text-white shadow-xl transition-all duration-300 active:scale-[0.98] hover:bg-[#a82a24]"
          >
            Pedir Delivery →
          </Link>

          <Link
            href="/pedido-delivery"
            className="inline-flex items-center rounded-xl border border-white/60 bg-white/10 backdrop-blur-md px-5 py-3 text-base font-semibold text-white transition-all duration-300 hover:bg-white/20"
          >
            Ver Menu
          </Link>
        </div>
      </div>

      {/* ━━━ DESKTOP HERO ━━━ */}
      <div className="relative hidden md:block w-full overflow-hidden bg-black" style={{ height: '760px' }}>
        <Image
          src={HERO_IMAGE_DESKTOP}
          alt="TOTORE Pizza - Fresco Auténtica"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Botones CTA - overlay HTML */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center gap-3 px-8 pb-14">
          <Link
            href="/pedido-delivery"
            className="inline-flex items-center gap-2 rounded-xl bg-[#C4322B] px-6 py-3 text-lg font-semibold text-white shadow-xl transition-all duration-300 active:scale-95 hover:bg-[#a82a24]"
          >
            Pedir Delivery →
          </Link>

          <Link
            href="/pedido-delivery"
            className="inline-flex items-center rounded-xl border border-white/60 bg-white/10 backdrop-blur-md px-6 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-white/20"
          >
            Ver Menu
          </Link>
        </div>
      </div>
    </section>
  )
}
