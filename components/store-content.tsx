'use client'

import { useStore } from '@/lib/store'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBannersContext } from '@/components/banners-provider'

export function StoreContent() {
  const { content } = useStore()
  const { getBanner } = useBannersContext()

  return (
    <>
      {/* Experience Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-accent text-4xl sm:text-5xl font-normal text-center text-foreground mb-12 tracking-wide">
            {content.experienceTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.experienceCards.map((card, i) => (
              <ExperienceCard
                key={i}
                icon={getIconComponent(card.icon)}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-accent text-4xl sm:text-5xl font-normal text-center text-foreground mb-12 tracking-wide">
            {content.uniqueTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeaturedBanner
              image={getBanner('favorites')?.image_url ?? '/images/favorites-banner.jpg'}
              title="PIZZAS"
              subtitle="12 sabores de pizza"
              href="/pedido-delivery"
            />
            <FeaturedBanner
              image={getBanner('promos')?.image_url ?? '/images/promos-banner.jpg'}
              title="NO-PIZZAS"
              subtitle="Bebidas & postres"
              href="/pedido-delivery"
            />
          </div>
        </div>
      </section>

      {/* Visit Us Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-accent text-4xl sm:text-5xl font-normal text-center text-foreground mb-12 tracking-wide">
            {content.visitTitle}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Map */}
            <div className="aspect-video lg:aspect-[4/3] rounded-xl overflow-hidden bg-muted">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.7627!2d-58.5939368!3d-34.6019617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb85232ffb9d7%3A0xd6df09dedb7a8f01!2sAv.+Dr.+Ricardo+Balb%C3%ADn+2916%2C+B1684+El+Palomar%2C+Provincia+de+Buenos+Aires!5e0!3m2!1ses!2sar!4v1746000000000"
                width="100%"
                height="100%"
                style={{ border: 0 } as any}
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
    <div className="flex flex-col items-center text-center gap-4 p-6">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-2 tracking-tight">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  )
}

function FeaturedBanner({
  image,
  title,
  subtitle,
  href,
}: {
  image: string
  title: string
  subtitle?: string
  href: string
}) {
  return (
    <Link href={href} className="group relative rounded-xl overflow-hidden block">
      <div className="relative w-full aspect-[16/9] sm:aspect-[2/1]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
        <h3 className="font-display text-lg sm:text-2xl font-bold text-primary-foreground mb-1 sm:mb-2 tracking-widest uppercase">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs sm:text-sm text-primary-foreground/80 mb-2 sm:mb-3">
            {subtitle}
          </p>
        )}
        <span className="inline-flex items-center text-xs sm:text-sm font-medium text-primary-foreground/90 group-hover:text-primary-foreground transition-colors">
          Ver Menú
          <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

function getIconComponent(iconName: string) {
  const iconProps = { className: 'w-8 h-8 text-primary' }
  
  switch (iconName) {
    case 'pizza':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...iconProps}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z" />
        </svg>
      )
    case 'delivery':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...iconProps}>
          <path d="M18 18.5a1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5-1.5 1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5m1.5-9l1.96 2.5H17V9.5m-11 9a1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5-1.5 1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5M5 9.5h8V12H4V9.5M3 4h11v2H3Z" />
        </svg>
      )
    case 'share':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...iconProps}>
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.27c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.56 9.31 6.88 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.88 0 1.56-.31 2.04-.81l7.05 4.27c-.05.23-.09.46-.09.7 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z" />
        </svg>
      )
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...iconProps}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z" />
        </svg>
      )
  }
}
