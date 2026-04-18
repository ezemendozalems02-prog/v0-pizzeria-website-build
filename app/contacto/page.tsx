import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, MessageCircle, Instagram } from "lucide-react"

export const metadata = {
  title: "Contacto | Totore",
  description: "Encontranos en Balbín 2916, El Palomar. Abiertos de Martes a Domingo, 20:00 a 23:30.",
}

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20contacto%20-mOHjngdnmrB7nJQdJtJvtjPuSjFijx.jpg"
            alt="Contacto - TOTORE"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-secondary/50" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground">
            Contacto
          </h1>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Details */}
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-6">
                  Vení a visitarnos
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Estamos en el corazón de El Palomar, listos para recibirte con 
                  la mejor pizza napolitana del barrio.
                </p>
              </div>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Dirección</h3>
                    <p className="text-muted-foreground mt-1">
                      Balbín 2916<br />
                      El Palomar, Buenos Aires
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Horarios</h3>
                    <p className="text-muted-foreground mt-1">
                      Martes a Domingo<br />
                      20:00 — 23:30
                    </p>
                  </div>
                </div>
              </div>

              {/* Social & CTA */}
              <div className="pt-4 space-y-4">
                <div className="flex gap-4">
                  <a
                    href="https://wa.me/5491112345678"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5 text-secondary-foreground" />
                  </a>
                  <a
                    href="https://instagram.com/totore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5 text-secondary-foreground" />
                  </a>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <a
                    href="https://wa.me/5491112345678?text=Hola%20Totore!"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Pedir por WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            {/* Map */}
            <div className="aspect-square lg:aspect-[4/3] rounded-xl overflow-hidden bg-muted">
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
          </div>
        </div>
      </section>

      {/* Directions CTA */}
      <section className="py-12 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground mb-4">
            Encontranos fácilmente con Google Maps
          </p>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <a
              href="https://www.google.com/maps/dir//Balbin+2916+El+Palomar+Buenos+Aires"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Cómo llegar
            </a>
          </Button>
        </div>
      </section>
    </>
  )
}
