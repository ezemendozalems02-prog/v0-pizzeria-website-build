'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { ShoppingBag, Tag, Image as ImageIcon, FileText, Settings, ArrowRight, MessageSquare } from 'lucide-react'

const QUICK_LINKS = [
  {
    href: '/admin/productos',
    label: 'Editar Productos',
    description: 'Precios, nombres, imágenes y estado',
    icon: ShoppingBag,
    color: 'bg-red-50 text-red-600',
  },
  {
    href: '/admin/categorias',
    label: 'Editar Categorías',
    description: 'Gestionar categorías de productos',
    icon: Tag,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    href: '/admin/banners',
    label: 'Editar Banners',
    description: 'Hero, Favoritas y Promos',
    icon: ImageIcon,
    color: 'bg-green-50 text-green-600',
  },
  {
    href: '/admin/contenido',
    label: 'Editar Contenido',
    description: 'Textos del home y secciones',
    icon: FileText,
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    href: '/admin/encuestas',
    label: 'Ver Encuestas',
    description: 'Respuestas de satisfacción del cliente',
    icon: MessageSquare,
    color: 'bg-purple-50 text-purple-600',
  },
  {
    href: '/admin/configuracion',
    label: 'Configuración',
    description: 'WhatsApp, dirección y horarios',
    icon: Settings,
    color: 'bg-orange-50 text-orange-600',
  },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    productsCount: 0,
    categoriesCount: 0,
    loading: true,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClient()

        const [productsRes, categoriesRes] = await Promise.all([
          supabase.from('products').select('id').eq('active', true),
          supabase.from('categories').select('id'),
        ])

        setStats({
          productsCount: productsRes.data?.length ?? 0,
          categoriesCount: categoriesRes.data?.length ?? 0,
          loading: false,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        setStats((prev) => ({ ...prev, loading: false }))
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-admin-text mb-2">Bienvenido a TOTORE</h1>
        <p className="text-admin-muted">Panel de administración conectado a Supabase</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 border-admin-border bg-admin-card">
          <p className="text-sm text-admin-muted mb-2">Productos Activos</p>
          {stats.loading ? (
            <Skeleton className="h-10 w-20" />
          ) : (
            <p className="text-4xl font-bold text-primary">{stats.productsCount}</p>
          )}
        </Card>

        <Card className="p-6 border-admin-border bg-admin-card">
          <p className="text-sm text-admin-muted mb-2">Categorías</p>
          {stats.loading ? (
            <Skeleton className="h-10 w-20" />
          ) : (
            <p className="text-4xl font-bold text-primary">{stats.categoriesCount}</p>
          )}
        </Card>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-lg font-semibold text-admin-text mb-4">Accesos rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-admin-card border border-admin-border rounded-xl p-5 flex items-center gap-4 hover:border-primary/30 hover:shadow-sm transition-all"
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

