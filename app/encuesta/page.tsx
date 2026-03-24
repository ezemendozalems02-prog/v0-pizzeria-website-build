'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type EmojiRating = 'bad' | 'ok' | 'good' | null

export default function EncuestaPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [experience, setExperience] = useState<'delivery' | 'local' | 'retiro' | null>(null)
  const [ratings, setRatings] = useState({
    quality: null as EmojiRating,
    time: null as EmojiRating,
    attention: null as EmojiRating,
  })
  const [comment, setComment] = useState('')

  const isValid =
    name.trim() &&
    email.includes('@') &&
    experience &&
    ratings.quality &&
    ratings.time &&
    ratings.attention

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setLoading(true)
    setError(null)

    try {
      const supabase = await createClient()
      const { error: insertError } = await supabase.from('survey_responses').insert({
        name: name.trim(),
        email: email.trim(),
        experience,
        quality_rating: ratings.quality,
        time_rating: ratings.time,
        attention_rating: ratings.attention,
        comment: comment.trim() || null,
      })

      if (insertError) throw insertError
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Error al enviar la encuesta')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <h1 className="font-serif text-4xl font-bold text-primary mb-3">¡Gracias!</h1>
            <p className="text-foreground text-lg">Tu opinión es muy importante para nosotros</p>
          </div>
          <div className="bg-primary/5 rounded-2xl p-8 mb-6 border border-primary/10">
            <p className="text-sm text-muted-foreground mb-4">
              Tus comentarios nos ayudan a mejorar cada día para ofrecerte la mejor experiencia en TOTORE.
            </p>
            <div className="text-center py-4">
              <p className="text-5xl">🍕</p>
            </div>
          </div>
          <Button
            onClick={() => window.location.href = '/'}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium"
          >
            Volver al Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
          Tu Opinión Importa
        </h1>
        <p className="text-muted-foreground text-lg">
          Ayúdanos a mejorar compartiendo tu experiencia en TOTORE
        </p>
      </div>

      {/* Hero Image */}
      <div className="max-w-2xl mx-auto mb-8 rounded-2xl overflow-hidden h-64 md:h-80 relative">
        <Image
          src="/images/survey-hero.jpg"
          alt="TOTORE pizzería"
          fill
          className="object-cover"
        />
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8"
      >
        {/* Contact Info */}
        <div className="mb-8">
          <h2 className="font-semibold text-foreground mb-4 text-lg">Datos de contacto</h2>
          <div className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 text-base"
              required
            />
            <Input
              type="email"
              placeholder="Tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 text-base"
              required
            />
          </div>
        </div>

        {/* Experience Type */}
        <div className="mb-8">
          <h2 className="font-semibold text-foreground mb-4 text-lg">¿Cómo fue tu experiencia?</h2>
          <div className="flex flex-col gap-3">
            {[
              { value: 'delivery' as const, label: '🚴 Delivery', desc: 'Pedido a domicilio' },
              { value: 'local' as const, label: '🏪 En el local', desc: 'Comer en TOTORE' },
              { value: 'retiro' as const, label: '🎒 Retiro', desc: 'Retiro en la puerta' },
            ].map(({ value, label, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => setExperience(value)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  experience === value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{label}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    experience === value
                      ? 'border-primary bg-primary'
                      : 'border-border'
                  }`}
                >
                  {experience === value && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Emoji Ratings */}
        <div className="mb-8">
          <h2 className="font-semibold text-foreground mb-6 text-lg">¿Cómo evaluarías?</h2>
          <div className="flex flex-col gap-8">
            <RatingCategory
              category="quality"
              label="Calidad de la Comida"
              value={ratings.quality}
              onChange={(val) => setRatings({ ...ratings, quality: val })}
            />
            <RatingCategory
              category="time"
              label="Tiempo de Entrega"
              value={ratings.time}
              onChange={(val) => setRatings({ ...ratings, time: val })}
            />
            <RatingCategory
              category="attention"
              label="Atención al Cliente"
              value={ratings.attention}
              onChange={(val) => setRatings({ ...ratings, attention: val })}
            />
          </div>
        </div>

        {/* Comment */}
        <div className="mb-8">
          <h2 className="font-semibold text-foreground mb-4 text-lg">Comentarios adicionales</h2>
          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 50))}
              placeholder="Cuéntanos qué podemos mejorar... (máximo 50 caracteres)"
              className="w-full h-24 p-4 border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-base"
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground mt-2 text-right">
              {comment.length}/50
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isValid || loading}
          className="w-full h-12 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-base"
        >
          {loading ? 'Enviando...' : '✓ Enviar Encuesta'}
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Tus respuestas nos ayudan a mejorar. Gracias por tu tiempo.
        </p>
      </form>
    </div>
  )
}

function RatingCategory({
  category,
  label,
  value,
  onChange,
}: {
  category: string
  label: string
  value: EmojiRating
  onChange: (val: EmojiRating) => void
}) {
  const options: { value: EmojiRating; emoji: string; label: string }[] = [
    { value: 'bad', emoji: '😞', label: 'Bien' },
    { value: 'ok', emoji: '😐', label: 'Normal' },
    { value: 'good', emoji: '😍', label: 'Excelente' },
  ]

  return (
    <div>
      <p className="font-medium text-foreground mb-4">{label}</p>
      <div className="flex gap-4 justify-around">
        {options.map(({ value: optValue, emoji, label: optLabel }) => (
          <button
            key={optValue}
            type="button"
            onClick={() => onChange(optValue)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all border-2 flex-1 ${
              value === optValue
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/30'
            }`}
          >
            <span className="text-5xl">{emoji}</span>
            <span
              className={`text-sm font-medium ${
                value === optValue ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {optLabel}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

