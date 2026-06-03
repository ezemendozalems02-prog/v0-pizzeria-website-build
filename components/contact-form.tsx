'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, AlertCircle, Loader2, Send, Paperclip, X } from 'lucide-react'

type Status = 'idle' | 'loading' | 'success' | 'error'

const PUESTOS = [
  'Atención al cliente',
  'Cocina',
  'Caja',
  'Encargado/a',
  'Otro',
]

export function ContactForm() {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [puesto, setPuesto] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cv, setCv] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setCv(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const formData = new FormData()
      formData.append('nombre', nombre)
      formData.append('telefono', telefono)
      formData.append('email', email)
      formData.append('puesto', puesto)
      formData.append('mensaje', mensaje)
      if (cv) formData.append('cv', cv)

      const res = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Error al enviar la postulación.')
        setStatus('error')
        return
      }

      setStatus('success')
      setNombre('')
      setTelefono('')
      setEmail('')
      setPuesto('')
      setMensaje('')
      setCv(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch {
      setErrorMsg('No se pudo conectar. Verificá tu conexión e intentá de nuevo.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[360px] text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h4 className="font-serif text-xl font-bold text-foreground">
          Postulación enviada
        </h4>
        <p className="text-muted-foreground max-w-xs">
          Recibimos tu postulación. Si tu perfil encaja, te vamos a contactar a la brevedad.
        </p>
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => setStatus('idle')}
        >
          Enviar otra postulación
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Nombre y apellido */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Nombre y apellido <span className="text-primary">*</span>
        </label>
        <Input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre completo"
          className="bg-background border-border focus:border-primary"
          required
          disabled={status === 'loading'}
        />
      </div>

      {/* Telefono + Email en fila */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Teléfono <span className="text-primary">*</span>
          </label>
          <Input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="11 1234-5678"
            className="bg-background border-border focus:border-primary"
            required
            disabled={status === 'loading'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Correo electrónico <span className="text-primary">*</span>
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="bg-background border-border focus:border-primary"
            required
            disabled={status === 'loading'}
          />
        </div>
      </div>

      {/* Puesto de interés */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Puesto de interés <span className="text-primary">*</span>
        </label>
        <select
          value={puesto}
          onChange={(e) => setPuesto(e.target.value)}
          required
          disabled={status === 'loading'}
          className="w-full h-10 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="" disabled>Seleccioná un puesto</option>
          {PUESTOS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Mensaje adicional */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Mensaje adicional{' '}
          <span className="text-muted-foreground font-normal">(opcional)</span>
        </label>
        <Textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Contanos algo sobre vos, tu experiencia o por qué te gustaría trabajar con nosotros..."
          rows={4}
          className="bg-background border-border focus:border-primary resize-none"
          disabled={status === 'loading'}
        />
      </div>

      {/* Adjuntar CV */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Adjuntá tu CV <span className="text-primary">*</span>
        </label>
        <div
          className="flex items-center gap-3 border border-dashed border-border rounded-md px-4 py-3 bg-background cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-sm text-muted-foreground flex-1 truncate">
            {cv ? cv.name : 'PDF, DOC o DOCX — máx. 5 MB'}
          </span>
          {cv && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setCv(null)
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
              className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
          required
          disabled={status === 'loading'}
        />
      </div>

      {status === 'error' && (
        <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-medium"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Enviar postulación
          </>
        )}
      </Button>
    </form>
  )
}
