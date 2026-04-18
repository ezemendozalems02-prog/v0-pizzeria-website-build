import { DeliveryCatalog } from "@/components/delivery-catalog"
import { RealtimeBanner } from "@/components/realtime-banner"

export const metadata = {
  title: "Pedido Delivery | Totore",
  description: "Pedí tu pizza Totore favorita y enviá tu pedido por WhatsApp de forma simple.",
}

export default function DeliveryPage() {
  return (
    <>
      {/* Hero Section */}
      <RealtimeBanner
        bannerKey="pedido-delivery"
        fallbackUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20delivery%20%283%29-YIekcMePw6CwWhgh1SfnNmJ4vYKMdk.jpg"
        alt="Delivery - TOTORE"
        className="relative h-[50vh] sm:h-[40vh] min-h-[280px] sm:min-h-[320px]"
        priority
      />

      {/* Catalog Section */}
      <DeliveryCatalog />
    </>
  )
}
