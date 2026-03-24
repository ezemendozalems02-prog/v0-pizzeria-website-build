'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@totore.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = await createClient()
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      if (data.user) {
        router.push('/admin')
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-admin-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-admin-border shadow-sm p-8">
          <div className="flex flex-col items-center mb-8">
            <h1 className="font-serif text-2xl font-bold text-primary mb-1">TOTORE</h1>
            <h2 className="text-lg font-semibold text-admin-text">Panel de Administración</h2>
            <p className="text-sm text-admin-muted mt-1">Ingresá tu email y contraseña</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-admin-text text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@totore.com"
                disabled={loading}
                className="h-11 bg-admin-bg border-admin-border text-admin-text"
                required
                autoFocus
              />
            </div>

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
                disabled={loading}
                className="h-11 bg-admin-bg border-admin-border text-admin-text"
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 border border-red-200">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-11 bg-primary hover:bg-primary/90 text-white font-medium"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
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
