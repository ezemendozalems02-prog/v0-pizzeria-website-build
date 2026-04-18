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
        className="h-[40vh] min-h-[300px]"
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
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
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
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Lo que nos define
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Principios que guían cada decisión y cada plato que preparamos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard
              icon="🌾"
              title="Frescura"
              description="Ingredientes seleccionados cuidadosamente y preparaciones del día para garantizar calidad en cada bocado."
            />
            <ValueCard
              icon="⭐"
              title="Calidad"
              description="Estándares premium en cada detalle, desde la selección de productos hasta la presentación final."
            />
            <ValueCard
              icon="❤️"
              title="Experiencia simple"
              description="Un proceso de pedido pensado para vos, intuitivo, rápido y sin complicaciones."
            />
            <ValueCard
              icon="👥"
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
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="bg-background rounded-xl p-6 border border-border hover:border-primary/20 transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}
