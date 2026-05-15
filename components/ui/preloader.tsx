'use client'

import { useEffect, useState } from 'react'

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
      {/* Pizza Icon - Animación flotante premium */}
      <style>{`
        @keyframes floatPizza {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.85;
          }
          50% {
            transform: translateY(-8px) rotate(6deg);
            opacity: 1;
          }
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.85;
          }
        }

        .pizza-icon {
          animation: floatPizza 3s ease-in-out infinite;
        }
      `}</style>

      <div className="flex flex-col items-center gap-4">
        {/* Pizza SVG Icon */}
        <svg
          className="pizza-icon"
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Pizza slice outline */}
          <path
            d="M32 4L52 44H12L32 4Z"
            fill="#C4322B"
            stroke="#2C1810"
            strokeWidth="1.5"
          />

          {/* Cheese highlights */}
          <circle cx="28" cy="22" r="2.5" fill="#FDB913" opacity="0.9" />
          <circle cx="36" cy="28" r="2" fill="#FDB913" opacity="0.8" />
          <circle cx="32" cy="36" r="2.5" fill="#FDB913" opacity="0.85" />

          {/* Toppings (basil) */}
          <path
            d="M24 30 Q22 28 24 26"
            stroke="#2D5016"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M40 32 Q42 30 40 28"
            stroke="#2D5016"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Olive highlight */}
          <circle cx="32" cy="20" r="1.5" fill="#556B2F" opacity="0.9" />
        </svg>

        {/* Text optional - comentado para mantener minimalista */}
        {/* <p className="text-sm font-medium text-[#2C1810] tracking-widest">CARGANDO</p> */}
      </div>
    </div>
  )
}
