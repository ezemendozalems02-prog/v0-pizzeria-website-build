"use client"

import Link from "next/link"
import { ShoppingBag, Tag, Image as ImageIcon, FileText, Settings, ArrowRight, Clock } from "lucide-react"
import { useStore } from "@/lib/store"

const QUICK_LINKS = [
  {
    href: "/admin/productos",
    label: "Editar Productos",
    description: "Precios, nombres, imágenes y estado",
    icon: ShoppingBag,
    color: "bg-red-50 text-red-600",
  },
  {
    href: "/admin/banners",
    label: "Editar Banners",
    description: "Hero, Favoritas y Promos",
    icon: ImageIcon,
    color: "bg-blue-50 text-blue-600",
  },
  {
    href: "/admin/contenido",
    label: "Editar Contenido",
    description: "Textos del home y secciones",
    icon: FileText,
    color: "bg-green-50 text-green-600",
  },
  {
    href: "/admin/configuracion",
    label: "Configuración",
    description: "WhatsApp, dirección y horarios",
    icon: Settings,
    color: "bg-orange-50 text-orange-600",
  },
]

export default function AdminDashboard() {
  const { products, categories, lastSaved } = useStore()
  const activeProducts = products.filter((p) => p.active).length

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-admin-text">Bienvenido, TOTORE</h1>
        <p className="text-sm text-admin-muted mt-1">
          Desde acá podés editar todo el contenido de tu sitio.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Productos totales"
          value={products.length}
          icon={<ShoppingBag className="w-5 h-5" />}
          color="text-primary"
          bg="bg-primary/10"
        />
        <StatCard
          label="Productos activos"
          value={activeProducts}
          icon={<ShoppingBag className="w-5 h-5" />}
          color="text-green-600"
          bg="bg-green-50"
        />
        <StatCard
          label="Categorías"
          value={categories.length}
          icon={<Tag className="w-5 h-5" />}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          label="Banners"
          value={3}
          icon={<ImageIcon className="w-5 h-5" />}
          color="text-orange-600"
          bg="bg-orange-50"
        />
      </div>

      {/* Last saved */}
      {lastSaved && (
        <div className="flex items-center gap-2 text-sm text-admin-muted bg-white border border-admin-border rounded-xl px-4 py-3">
          <Clock className="w-4 h-4 text-green-500" />
          Última actualización a las{" "}
          {lastSaved.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
        </div>
      )}

      {/* Quick links */}
      <div>
        <h2 className="text-base font-semibold text-admin-text mb-4">Accesos rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-white border border-admin-border rounded-xl p-5 flex items-center gap-4 hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-admin-text text-sm">{item.label}</p>
                <p className="text-xs text-admin-muted mt-0.5 truncate">{item.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-admin-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  color,
  bg,
}: {
  label: string
  value: number
  icon: React.ReactNode
  color: string
  bg: string
}) {
  return (
    <div className="bg-white border border-admin-border rounded-xl p-5">
      <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center ${color} mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-admin-text">{value}</p>
      <p className="text-xs text-admin-muted mt-0.5">{label}</p>
    </div>
  )
}
