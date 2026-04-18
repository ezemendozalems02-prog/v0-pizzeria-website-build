import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export const metadata = {
  title: "Sobre Nosotros | Totore",
  description: "Conocé la historia de Totore, una pizzería de barrio con identidad propia, inspirada en la pizza napolitana.",
}

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20nosotros%20%281%29-S5TVL5cAsT2OhrRLD5w5p32uM45UTX.jpg"
            alt="Nosotros - TOTORE"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-secondary/50" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground">
            Sobre Nosotros
          </h1>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Nuestra historia
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Totore nace como una pizzería de barrio con identidad propia, inspirada 
              en la pizza napolitana y en el espíritu de compartir buena comida. 
              Cada pizza que hacemos lleva años de aprendizaje, pasión por los 
              ingredientes de calidad y el amor por nuestro oficio.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mt-4">
              Nuestro nombre viene de la tradición italiana de llamar a los 
              pizzeros con apodos cariñosos. En Totore, cada cliente es parte 
              de nuestra familia del barrio.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center text-foreground mb-12">
            Nuestros valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard
              title="Pizza Artesanal"
              description="Cada masa es fermentada durante 48 horas para lograr la textura perfecta. Sin atajos, sin apuros."
            />
            <ValueCard
              title="Ingredientes Reales"
              description="Trabajamos con proveedores locales y productos de primera calidad. Tomates San Marzano, fior di latte y aceite de oliva virgen."
            />
            <ValueCard
              title="Experiencia Simple"
              description="Creemos que lo bueno no tiene que ser complicado. Pizza, buena compañía y listo."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
            Probá nuestra pizza
          </h2>
          <p className="text-secondary-foreground/80 mb-8 max-w-md mx-auto">
            Hacé tu pedido online y recibilo en casa, o pasá a buscarlo cuando quieras.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/pedido-delivery">
              Pedir Ahora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}

function ValueCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}
