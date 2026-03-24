"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    // Mock auth — replace with real auth later
    setTimeout(() => {
      if (password === "totore2024") {
        sessionStorage.setItem("admin_auth", "true")
        router.push("/admin")
      } else {
        setError("Contraseña incorrecta.")
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-admin-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-admin-border shadow-sm p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-semibold text-admin-text">Panel de Administración</h1>
            <p className="text-sm text-admin-muted mt-1">Ingresá la contraseña para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-admin-text text-sm font-medium">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 bg-admin-bg border-admin-border text-admin-text"
                required
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}
            <Button
              type="submit"
              className="h-11 bg-primary hover:bg-primary/90 text-white font-medium"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>

          <p className="text-xs text-admin-muted text-center mt-6">
            Panel privado de TOTORE. Uso exclusivo del equipo.
          </p>
        </div>
      </div>
    </div>
  )
}
