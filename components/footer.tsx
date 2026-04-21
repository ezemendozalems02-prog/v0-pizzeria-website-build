"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, MessageCircle } from "lucide-react"
import { useStore } from "@/lib/store"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pedido-delivery", label: "Pedido Delivery" },
  { href: "/sobre-nosotros", label: "Sobre Nosotros" },
  { href: "/contacto", label: "Contacto" },
  { href: "/encuesta", label: "Encuesta de Satisfacción" },
]

export function Footer() {
  const { config } = useStore()

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="TOTORE Logo"
                width={140}
                height={35}
                className="h-9 w-auto"
              />
            </Link>
            <p className="mt-3 text-secondary-foreground/80 text-sm leading-relaxed">
              {config.footerText}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-medium text-primary-foreground mb-4">Navegación</h3>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-secondary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-medium text-primary-foreground mb-4">Contacto</h3>
            <div className="flex flex-col gap-1 text-sm text-secondary-foreground/80">
              <p>{config.address}</p>
              <p className="mt-2 whitespace-pre-line">{config.hours}</p>
            </div>
            <div className="flex gap-4 mt-4">
              {config.instagram && (
                <a
                  href={config.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {config.whatsapp && (
                <a
                  href={`https://wa.me/${config.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-foreground/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-secondary-foreground/60">
              © {new Date().getFullYear()} Totore. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="text-xs text-secondary-foreground/60">
                {config.hours.split("\n")[0] || "Delivery desde las 20"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
