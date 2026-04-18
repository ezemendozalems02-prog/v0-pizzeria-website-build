import Image from "next/image"

export const metadata = {
  title: "Contacto | Totore",
  description: "Encontranos en Balbín 2916, El Palomar. Abiertos de Martes a Domingo, 20:00 a 23:30.",
}

export default function ContactPage() {
  return (
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
    </section>
  )
}
