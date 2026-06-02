'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, AlertCircle, Loader2, Send } from 'lucide-react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function ContactForm() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [asunto, setAsunto] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, telefono, asunto, mensaje }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Error al enviar el mensaje.')
        setStatus('error')
        return
      }

      setStatus('success')
      setNombre('')
      setEmail('')
      setTelefono('')
      setAsunto('')
      setMensaje('')
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
          Mensaje enviado
        </h4>
        <p className="text-muted-foreground max-w-xs">
          Recibimos tu mensaje y te vamos a responder a la brevedad.
        </p>
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => setStatus('idle')}
        >
          Enviar otro mensaje
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Nombre <span className="text-primary">*</span>
        </label>
        <Input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
          className="bg-background border-border focus:border-primary"
          required
          disabled={status === 'loading'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Email <span className="text-primary">*</span>
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

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Teléfono
        </label>
        <Input
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="11 1234-5678"
          className="bg-background border-border focus:border-primary"
          disabled={status === 'loading'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Asunto <span className="text-primary">*</span>
        </label>
        <Input
          value={asunto}
          onChange={(e) => setAsunto(e.target.value)}
          placeholder="Ej: Consulta sobre eventos"
          className="bg-background border-border focus:border-primary"
          required
          disabled={status === 'loading'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Mensaje <span className="text-primary">*</span>
        </label>
        <Textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Tu mensaje..."
          rows={5}
          className="bg-background border-border focus:border-primary resize-none"
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
            Enviar mensaje
          </>
        )}
      </Button>
    </form>
  )
}
