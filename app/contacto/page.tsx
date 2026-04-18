import { RealtimeBanner } from "@/components/realtime-banner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Instagram, MapPin, Clock } from "lucide-react"

export const metadata = {
  title: "Contacto | Totore",
  description: "Encontranos en Balbín 2916, El Palomar. Abiertos de Martes a Domingo, 20:00 a 23:30.",
}

export default function ContactPage() {
  return (
    <>
      {/* Hero Banner */}
      <RealtimeBanner
        bannerKey="contacto"
        fallbackUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20contacto%20-mOHjngdnmrB7nJQdJtJvtjPuSjFijx.jpg"
        alt="Contacto - TOTORE"
        className="relative h-[40vh] min-h-[300px]"
        priority
      />

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Contact Info */}
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Hablemos
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Podés contactarnos por WhatsApp para consultas rápidas, seguirnos en Instagram 
                para ver nuestras novedades, o completar el formulario para mensajes más extensos.
              </p>

              <div className="space-y-4">
                <ContactInfoCard
                  icon={<MessageCircle className="w-6 h-6 text-primary" />}
                  label="WhatsApp"
                  value="+54 9 11 1234 5678"
                  href="https://wa.me/5491112345678"
                />
                <ContactInfoCard
                  icon={<Instagram className="w-6 h-6 text-primary" />}
                  label="Instagram"
                  value="@totore.pizza"
                  href="https://instagram.com/totore.pizza"
                />
                <ContactInfoCard
                  icon={<MapPin className="w-6 h-6 text-primary" />}
                  label="Dirección"
                  value="Balbín 2916, El Palomar"
                  href="https://maps.google.com/?q=Balbin+2916+El+Palomar"
                />
                <ContactInfoCard
                  icon={<Clock className="w-6 h-6 text-primary" />}
                  label="Horarios"
                  value="Mar-Dom: 20:00 - 23:30"
                />
              </div>

              <Button asChild className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                <a href="https://wa.me/5491112345678?text=Hola%20Totore!" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Escribir por WhatsApp
                </a>
              </Button>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-muted rounded-xl p-8">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                Envianos un mensaje
              </h3>
              <p className="text-muted-foreground mb-6">
                Completá el formulario y te responderemos a la brevedad.
              </p>

              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nombre <span className="text-primary">*</span>
                  </label>
                  <Input
                    placeholder="Tu nombre"
                    className="bg-background border-border focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email <span className="text-primary">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    className="bg-background border-border focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Teléfono
                  </label>
                  <Input
                    type="tel"
                    placeholder="11 1234-5678"
                    className="bg-background border-border focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mensaje <span className="text-primary">*</span>
                  </label>
                  <Textarea
                    placeholder="Tu mensaje..."
                    rows={5}
                    className="bg-background border-border focus:border-primary resize-none"
                  />
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-medium">
                  Enviar mensaje
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-muted py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl overflow-hidden h-[400px] border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.3!2d-58.63!3d-34.64!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb0!2sTotore!5e0!3m2!1ses!2sar!4v1234567890"
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
      </section>
    </>
  )
}

function ContactInfoCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  const content = (
    <div className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border hover:border-primary/30 transition-colors cursor-pointer">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-foreground">{label}</h4>
        <p className="text-muted-foreground text-sm mt-1">{value}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return content
}
