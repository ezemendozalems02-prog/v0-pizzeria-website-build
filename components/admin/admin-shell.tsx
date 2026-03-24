"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  Image as ImageIcon,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/productos", label: "Productos", icon: ShoppingBag },
  { href: "/admin/categorias", label: "Categorías", icon: Tag },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/contenido", label: "Contenido", icon: FileText },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { lastSaved } = useStore()
  const [authed, setAuthed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (pathname === "/admin/login") {
      setAuthed(false)
      return
    }
    const auth = sessionStorage.getItem("admin_auth")
    if (auth !== "true") {
      router.replace("/admin/login")
    } else {
      setAuthed(true)
    }
  }, [pathname, router])

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (!authed) return null

  function handleLogout() {
    sessionStorage.removeItem("admin_auth")
    router.push("/admin/login")
  }

  const isActive = (item: (typeof NAV_ITEMS)[0]) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <div className="min-h-screen bg-admin-bg flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-secondary z-30 flex flex-col transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sidebar-border">
          <div>
            <span className="font-serif text-xl font-bold text-white tracking-wide">TOTORE</span>
            <p className="text-xs text-white/50 mt-0.5">Panel de Admin</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
                {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-sidebar-border flex flex-col gap-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Ver Sitio
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-10 h-16 bg-white border-b border-admin-border flex items-center px-4 lg:px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-admin-muted hover:text-admin-text"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page title via breadcrumb */}
          <div className="flex-1">
            <p className="text-sm font-semibold text-admin-text">
              {NAV_ITEMS.find((i) => isActive(i))?.label ?? "Admin"}
            </p>
          </div>

          {lastSaved && (
            <p className="text-xs text-admin-muted hidden sm:block">
              Guardado{" "}
              {lastSaved.toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}

          <Button
            variant="outline"
            size="sm"
            className="border-admin-border text-admin-muted hover:text-admin-text"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Salir
          </Button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
