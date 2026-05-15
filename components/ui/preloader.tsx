'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mostrar preloader por 1000ms (1 segundo) - tiempo suficiente para que cargue el hero
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F5EFE8] transition-opacity duration-500"
      style={{
        opacity: isLoading ? 1 : 0,
        pointerEvents: isLoading ? 'auto' : 'none',
      }}
    >
      {/* Pizza Rocket Icon - Animación flotante premium */}
      <style>{`
        @keyframes floatPizza {
          0% {
            transform: translateY(0px) rotate(-5deg);
            opacity: 0.85;
          }
          50% {
            transform: translateY(-12px) rotate(5deg);
            opacity: 1;
          }
          100% {
            transform: translateY(0px) rotate(-5deg);
            opacity: 0.85;
          }
        }

        .pizza-icon {
          animation: floatPizza 3s ease-in-out infinite;
        }
      `}</style>

      <div className="pizza-icon">
        <Image
          src="/favicon.png"
          alt="Pizza Rocket - TOTORE"
          width="96"
          height="96"
          priority
        />
      </div>
    </div>
  )
}
