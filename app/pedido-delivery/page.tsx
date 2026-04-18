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
      <section className="relative h-[40vh] min-h-[320px]">
        <div className="absolute inset-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20delivery%20%283%29-YIekcMePw6CwWhgh1SfnNmJ4vYKMdk.jpg"
            alt="Delivery - TOTORE"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Catalog Section */}
      <DeliveryCatalog />
    </>
  )
}
