import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, ArrowRight } from "lucide-react"
import { RealtimeBanner } from "@/components/realtime-banner"
import { StoreContent } from "@/components/store-content"

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <RealtimeBanner
        bannerKey="home"
        fallbackUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20principal%20inicio-sgLjm1UietPhuULpK6QoJWyqFRFgFj.jpg"
        alt="Pizza napolitana artesanal - TOTORE fresco, auténtica"
        className="relative h-[60vh] sm:h-[90vh] min-h-[320px] flex items-center"
        priority
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-20 flex items-end h-full">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Button asChild size="sm" className="sm:size-lg bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/pedido-delivery">
                Pedir Delivery
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="sm:size-lg border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/pedido-delivery">
                Ver Menú
              </Link>
            </Button>
          </div>
        </div>
      </RealtimeBanner>

      {/* Experience Section */}
      <StoreContent />
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
    <Link href={href} className="group relative aspect-[4/3] sm:aspect-[16/9] rounded-xl overflow-hidden block">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
        <h3 className="font-serif text-lg sm:text-2xl font-bold text-primary-foreground mb-2 sm:mb-3">
          {title}
        </h3>
        <span className="inline-flex items-center text-xs sm:text-sm font-medium text-primary-foreground/90 group-hover:text-primary-foreground transition-colors">
          Ver Menú
          <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
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
