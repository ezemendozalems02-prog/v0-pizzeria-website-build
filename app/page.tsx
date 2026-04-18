import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20principal%20inicio-sgLjm1UietPhuULpK6QoJWyqFRFgFj.jpg"
            alt="Pizza napolitana artesanal - TOTORE fresco, auténtica"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 flex items-end min-h-[90vh]">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/pedido-delivery">
                Pedir Delivery
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/pedido-delivery">
                Ver Menú
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-center text-foreground mb-12">
            Un lugar para cada momento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ExperienceCard
              icon={<PizzaIcon className="w-8 h-8" />}
              title="Pizza Artesanal"
              description="Pizza napolitana hecha con ingredientes de calidad y fermentación cuidada."
            />
            <ExperienceCard
              icon={<DeliveryIcon className="w-8 h-8" />}
              title="Delivery Simple"
              description="Pedí directo desde la web y mandá el pedido por WhatsApp en segundos."
            />
            <ExperienceCard
              icon={<ShareIcon className="w-8 h-8" />}
              title="Para Compartir"
              description="Pizza, cerveza y buena compañía. El combo perfecto."
            />
          </div>
        </div>
      </section>
    </>
  )
}

function ExperienceCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-colors">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function PizzaIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 11h.01" />
      <path d="M11 15h.01" />
      <path d="M16 16h.01" />
      <path d="m2 16 20 6-6-20A20 20 0 0 0 2 16" />
      <path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4" />
    </svg>
  )
}

function DeliveryIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h6" />
      <circle cx="18" cy="19" r="3" />
      <path d="M3 7v5h2l2-5H3z" />
      <path d="M18 7h-3l-2 5h5" />
      <path d="M12 12V7" />
    </svg>
  )
}

function ShareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 11h1a3 3 0 0 1 0 6h-1" />
      <path d="M9 12v6" />
      <path d="M13 12v6" />
      <path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z" />
      <path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" />
    </svg>
  )
}
