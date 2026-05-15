'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { loginSurveyPanel } from '../actions'
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react'

export default function SurveyLoginPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await loginSurveyPanel(username, password)
      if (result.success) {
        router.push('/encuestas')
        router.refresh()
      } else {
        setError(result.error ?? 'Error al iniciar sesión.')
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#F5EFE8] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Brand mark */}
        <div className="text-center mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#243329]/40 mb-3">
            TOTORE
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#243329]">
            Panel de Encuestas
          </h1>
          <p className="text-sm text-[#243329]/50 mt-2">
            Acceso restringido al equipo interno
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#243329]/10 rounded-3xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#243329]/40">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#243329]/30" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  disabled={isPending}
                  className="w-full h-11 pl-10 pr-4 text-sm border border-[#243329]/15 rounded-xl bg-[#F5EFE8]/50 text-[#243329] placeholder:text-[#243329]/30 focus:outline-none focus:ring-2 focus:ring-[#C4322B]/20 focus:border-[#C4322B]/40 transition-all disabled:opacity-50"
                  placeholder="encuestas"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#243329]/40">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#243329]/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={isPending}
                  className="w-full h-11 pl-10 pr-4 text-sm border border-[#243329]/15 rounded-xl bg-[#F5EFE8]/50 text-[#243329] placeholder:text-[#243329]/30 focus:outline-none focus:ring-2 focus:ring-[#C4322B]/20 focus:border-[#C4322B]/40 transition-all disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-[#C4322B] bg-[#C4322B]/6 border border-[#C4322B]/15 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending || !username || !password}
              className="h-11 rounded-xl bg-[#C4322B] text-white text-sm font-semibold hover:bg-[#B02B24] active:bg-[#9A2520] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#243329]/30 mt-8">
          Acceso exclusivo para uso interno
        </p>
      </div>
    </div>
  )
}
