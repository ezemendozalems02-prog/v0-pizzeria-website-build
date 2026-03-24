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
            src="/images/hero-pizza.jpg"
            alt="Pizza napolitana artesanal"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-xl">
            <span className="inline-block px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-full mb-6">
              Delivery desde las 20
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight text-balance">
              Pizza napolitana con identidad propia
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/90 leading-relaxed max-w-md">
              Pedí tu favorita o vení a buscarla. Totore es pizza, barrio y buena comida.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
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

      {/* Featured Section */}
      <section className="py-20 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-center text-foreground mb-12">
            Lo que nos hace únicos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeaturedBanner
              image="/images/favorites-banner.jpg"
              title="Favoritas del barrio"
              href="/pedido-delivery"
            />
            <FeaturedBanner
              image="/images/promos-banner.jpg"
              title="Promos Totore"
              href="/pedido-delivery"
            />
          </div>
        </div>
      </section>

      {/* Visit Us Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-center text-foreground mb-12">
            Vení a Totore
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Map */}
            <div className="aspect-video lg:aspect-[4/3] rounded-xl overflow-hidden bg-muted">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.5!2d-58.6!3d-34.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzAwLjAiUyA1OMKwMzYnMDAuMCJX!5e0!3m2!1sen!2sar!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Totore"
              />
            </div>
            {/* Info */}
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Dirección</h3>
                  <p className="text-muted-foreground mt-1">
                    Balbín 2916, El Palomar, Buenos Aires
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Horarios</h3>
                  <p className="text-muted-foreground mt-1">
                    Martes a Domingo<br />
                    20:00 a 23:30
                  </p>
                </div>
              </div>
              <Button asChild className="w-fit mt-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <a
                  href="https://www.google.com/maps/dir//Balbin+2916+El+Palomar+Buenos+Aires"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cómo llegar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
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

function FeaturedBanner({
  image,
  title,
  href,
}: {
  image: string
  title: string
  href: string
}) {
  return (
    <Link href={href} className="group relative aspect-[16/9] rounded-xl overflow-hidden block">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-serif text-2xl font-bold text-primary-foreground mb-3">
          {title}
        </h3>
        <span className="inline-flex items-center text-sm font-medium text-primary-foreground/90 group-hover:text-primary-foreground transition-colors">
          Ver Menú
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
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
