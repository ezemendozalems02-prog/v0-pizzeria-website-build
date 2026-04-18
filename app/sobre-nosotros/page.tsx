import Image from "next/image"

export const metadata = {
  title: "Sobre Nosotros | Totore",
  description: "Conocé la historia de Totore, una pizzería de barrio con identidad propia, inspirada en la pizza napolitana.",
}

export default function AboutPage() {
  return (
    <section className="relative h-[40vh] min-h-[300px]">
      <div className="absolute inset-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20nosotros%20%281%29-S5TVL5cAsT2OhrRLD5w5p32uM45UTX.jpg"
          alt="Nosotros - TOTORE"
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  )
}
