import Image from "next/image"
import { DeliveryCatalog } from "@/components/delivery-catalog"

export const metadata = {
  title: "Pedido Delivery | Totore",
  description: "Pedí tu pizza Totore favorita y enviá tu pedido por WhatsApp de forma simple.",
}

export default function DeliveryPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[320px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20delivery%20%283%29-YIekcMePw6CwWhgh1SfnNmJ4vYKMdk.jpg"
            alt="Delivery - TOTORE"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-secondary/50" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-xl">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight text-balance">
              Pedí tu Totore favorita
            </h1>
            <p className="mt-4 text-base sm:text-lg text-primary-foreground/90 leading-relaxed">
              Elegí pizzas y bebidas, agregá al carrito y enviá tu pedido por WhatsApp de forma simple.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <DeliveryCatalog />
    </>
  )
}
