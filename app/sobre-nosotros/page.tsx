import type React from "react"
import Image from "next/image"
import { RealtimeBanner } from "@/components/realtime-banner"

export const metadata = {
  title: "Sobre Nosotros | Totore",
  description: "Conocé la historia de Totore, una pizzería de barrio con identidad propia, inspirada en la pizza napolitana.",
}

export default function AboutPage() {
  return (
    <>
      {/* Hero Banner */}
      <RealtimeBanner
        bannerKey="sobre-nosotros"
        fallbackUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20nosotros%20%281%29-S5TVL5cAsT2OhrRLD5w5p32uM45UTX.jpg"
        alt="Nosotros - TOTORE"
        className="w-full"
        priority
      />

      {/* Our Story Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <span className="inline-block text-sm font-semibold tracking-wide text-primary mb-4">
                NUESTRA HISTORIA
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
                Una pasión por la cocina fresca
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                En Totore buscamos ofrecer una experiencia práctica, rica y visualmente cuidada. 
                Nuestra propuesta combina ingredientes frescos, opciones variadas y una estética 
                propia para que cada pedido se sienta especial.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Desde pizzas hasta bebidas y combinaciones destacadas, trabajamos para que pedir 
                sea simple y disfrutar sea memorable. Cada plato refleja nuestro compromiso con 
                la calidad y la autenticidad.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Creemos que la buena comida tiene el poder de transformar momentos ordinarios en 
                experiencias extraordinarias. Por eso, cuidamos cada detalle de tu pedido.
              </p>
            </div>

            {/* Right Image */}
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20principal%20inicio-sgLjm1UietPhuULpK6QoJWyqFRFgFj.jpg"
                alt="Pizza Totore"
                fill
                className="object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold tracking-wide text-primary mb-4">
              NUESTROS VALORES
            </span>
            <h2 className="font-accent text-4xl sm:text-5xl font-normal text-foreground mb-4 tracking-wide">
              Lo que nos define
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Principios que guían cada decisión y cada plato que preparamos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard
              icon={<IconLeaf />}
              title="Frescura"
              description="Ingredientes seleccionados cuidadosamente y preparaciones del día para garantizar calidad en cada bocado."
            />
            <ValueCard
              icon={<IconWheat />}
              title="Calidad"
              description="Estándares premium en cada detalle, desde la selección de productos hasta la presentación final."
            />
            <ValueCard
              icon={<IconFlame />}
              title="Experiencia simple"
              description="Un proceso de pedido pensado para vos, intuitivo, rápido y sin complicaciones."
            />
            <ValueCard
              icon={<IconHandshake />}
              title="Compromiso"
              description="Trabajamos cada día para superar expectativas y crear momentos especiales alrededor de la comida."
            />
          </div>
        </div>
      </section>
    </>
  )
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-background rounded-xl p-6 border border-border hover:border-primary/30 transition-colors group">
      <div className="w-12 h-12 rounded-lg bg-primary/8 flex items-center justify-center text-primary mb-5 group-hover:bg-primary/15 transition-colors">
        {icon}
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function IconLeaf() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

function IconWheat() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 22 16 8" />
      <path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
      <path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
      <path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
      <path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" />
      <path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
    </svg>
  )
}

function IconFlame() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  )
}

function IconHandshake() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
      <path d="m21 3 1 11h-2" />
      <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
      <path d="M3 4h8" />
    </svg>
  )
}
