'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Rating = 'bad' | 'ok' | 'good' | null
type Experience = 'delivery' | 'local' | 'retiro' | null

export default function EncuestaPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [experience, setExperience] = useState<Experience>(null)
  const [ratings, setRatings] = useState({
    quality: null as Rating,
    time: null as Rating,
    attention: null as Rating,
  })
  const [comment, setComment] = useState('')

  const isValid = experience && ratings.quality && ratings.time && ratings.attention

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setLoading(true)
    setError(null)

    try {
      const supabase = await createClient()
      const { error: insertError } = await supabase.from('survey_responses').insert({
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

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F5EFE8] flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full text-center">
          {/* Divider */}
          <div className="w-16 h-px bg-[#243329]/20 mx-auto mb-10" />
          
          <p className="font-serif text-3xl md:text-4xl tracking-wide text-[#243329] mb-3">
            TOTORE
          </p>
          <p className="text-[#243329]/60 text-sm tracking-widest uppercase mb-12">
            Gracias por tu feedback
          </p>

          <div className="mb-12">
            <p className="text-[#243329]/80 text-base leading-relaxed mb-8">
              Tu opinión nos ayuda a seguir<br />
              perfeccionando la experiencia TOTORE.
            </p>
          </div>

          {/* Divider */}
          <div className="w-16 h-px bg-[#243329]/20 mx-auto mb-10" />

          <button
            onClick={() => (window.location.href = '/')}
            className="inline-block px-8 py-3 bg-[#C4322B] text-white text-sm tracking-widest uppercase rounded-full hover:bg-[#a82a24] transition-colors duration-200"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5EFE8] px-6 py-20 md:py-28">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <header className="text-center mb-16">
          {/* Top divider */}
          <div className="w-16 h-px bg-[#243329]/20 mx-auto mb-10" />

          <h1 className="font-serif text-3xl md:text-4xl tracking-wide text-[#243329] mb-3">
            TOTORE
          </h1>
          <p className="text-[#243329]/60 text-sm tracking-widest uppercase mb-10">
            Encuesta de satisfaccion
          </p>

          {/* Bottom divider */}
          <div className="w-16 h-px bg-[#243329]/20 mx-auto mb-10" />

          <p className="text-[#243329]/70 text-base">
            Tu feedback nos ayuda a mejorar
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          {/* Rating: Quality */}
          <section className="mb-16">
            <p className="text-center text-[#243329] text-base mb-10">
              ¿Como calificarias la calidad de nuestros productos?
            </p>
            <RatingSelector
              value={ratings.quality}
              onChange={(val) => setRatings({ ...ratings, quality: val })}
            />
          </section>

          {/* Divider */}
          <div className="w-full h-px bg-[#243329]/10 mb-16" />

          {/* Rating: Time */}
          <section className="mb-16">
            <p className="text-center text-[#243329] text-base mb-10">
              ¿Como calificarias el tiempo de entrega?
            </p>
            <RatingSelector
              value={ratings.time}
              onChange={(val) => setRatings({ ...ratings, time: val })}
            />
          </section>

          {/* Divider */}
          <div className="w-full h-px bg-[#243329]/10 mb-16" />

          {/* Rating: Attention */}
          <section className="mb-16">
            <p className="text-center text-[#243329] text-base mb-10">
              ¿Como calificarias la atencion recibida?
            </p>
            <RatingSelector
              value={ratings.attention}
              onChange={(val) => setRatings({ ...ratings, attention: val })}
            />
          </section>

          {/* Divider */}
          <div className="w-full h-px bg-[#243329]/10 mb-16" />

          {/* Experience Origin */}
          <section className="mb-16">
            <p className="text-center text-[#243329] text-base mb-10">
              Origen de la experiencia
            </p>
            <div className="flex flex-col gap-4">
              <ExperienceCard
                value="delivery"
                title="Delivery"
                subtitle="PEDIDO A DOMICILIO"
                selected={experience === 'delivery'}
                onClick={() => setExperience('delivery')}
              />
              <ExperienceCard
                value="local"
                title="Local"
                subtitle="CONSUMICION EN EL LOCAL"
                selected={experience === 'local'}
                onClick={() => setExperience('local')}
              />
              <ExperienceCard
                value="retiro"
                title="Retiro"
                subtitle="RETIRO EN EL LOCAL"
                selected={experience === 'retiro'}
                onClick={() => setExperience('retiro')}
              />
            </div>
          </section>

          {/* Divider */}
          <div className="w-full h-px bg-[#243329]/10 mb-16" />

          {/* Comment */}
          <section className="mb-16">
            <p className="text-center text-[#243329] text-base mb-2">
              Comentario adicional
            </p>
            <p className="text-center text-[#243329]/50 text-sm mb-8">
              ¿Queres compartir algo mas?
            </p>
            <div className="relative">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 50))}
                placeholder="Escribe aqui..."
                maxLength={50}
                className="w-full h-28 p-4 bg-[#F5EFE8] border border-[#243329]/15 rounded-lg resize-none text-[#243329] placeholder:text-[#243329]/30 focus:outline-none focus:border-[#C4322B]/50 transition-colors"
              />
              <p className="text-right text-[#243329]/40 text-xs mt-2">
                {comment.length} / 50
              </p>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="mb-8 p-4 bg-[#C4322B]/10 border border-[#C4322B]/20 rounded-lg text-[#C4322B] text-sm text-center">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="text-center mb-12">
            <button
              type="submit"
              disabled={!isValid || loading}
              className="px-12 py-4 bg-[#C4322B] text-white text-sm tracking-widest uppercase rounded-full hover:bg-[#a82a24] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? 'Enviando...' : 'Enviar opinion'}
            </button>
          </div>

          {/* Footer text */}
          <footer className="text-center">
            <div className="w-16 h-px bg-[#243329]/20 mx-auto mb-8" />
            <p className="text-[#243329]/50 text-sm leading-relaxed mb-2">
              Buscamos seguir perfeccionando la experiencia TOTORE
            </p>
            <p className="text-[#243329]/40 text-xs tracking-widest uppercase">
              Gracias por elegirnos
            </p>
          </footer>
        </form>
      </div>
    </div>
  )
}

/* ============================================
   Rating Selector Component
   ============================================ */

function RatingSelector({
  value,
  onChange,
}: {
  value: Rating
  onChange: (val: Rating) => void
}) {
  const options: { val: Rating; label: string }[] = [
    { val: 'bad', label: 'MALA' },
    { val: 'ok', label: 'NORMAL' },
    { val: 'good', label: 'MUY BUENA' },
  ]

  return (
    <div className="flex justify-center gap-6 md:gap-10">
      {options.map(({ val, label }) => {
        const isSelected = value === val
        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className="flex flex-col items-center gap-3 group"
          >
            {/* Circle with icon */}
            <div
              className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-2 flex items-center justify-center transition-all duration-200 transform ${
                isSelected
                  ? 'bg-[#C4322B] border-[#C4322B] scale-105'
                  : 'bg-transparent border-[#243329]/20 group-hover:border-[#243329]/40'
              }`}
            >
              <RatingIcon type={val} selected={isSelected} />
            </div>
            {/* Label */}
            <span
              className={`text-xs tracking-widest uppercase transition-colors duration-200 ${
                isSelected ? 'text-[#C4322B]' : 'text-[#243329]/50'
              }`}
            >
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ============================================
   Rating Icon Component (Minimalist SVG)
   ============================================ */

function RatingIcon({ type, selected }: { type: Rating; selected: boolean }) {
  const color = selected ? '#FFFFFF' : '#243329'
  const opacity = selected ? 1 : 0.4

  if (type === 'bad') {
    // Sad face - minimalist
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ opacity }}>
        <circle cx="9" cy="11" r="1.5" fill={color} />
        <circle cx="19" cy="11" r="1.5" fill={color} />
        <path
          d="M9 20C9 20 11.5 17 14 17C16.5 17 19 20 19 20"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (type === 'ok') {
    // Neutral face - minimalist
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ opacity }}>
        <circle cx="9" cy="11" r="1.5" fill={color} />
        <circle cx="19" cy="11" r="1.5" fill={color} />
        <line x1="9" y1="19" x2="19" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }

  // Happy face - minimalist
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ opacity }}>
      <circle cx="9" cy="11" r="1.5" fill={color} />
      <circle cx="19" cy="11" r="1.5" fill={color} />
      <path
        d="M9 17C9 17 11.5 20 14 20C16.5 20 19 17 19 17"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* ============================================
   Experience Card Component
   ============================================ */

function ExperienceCard({
  value,
  title,
  subtitle,
  selected,
  onClick,
}: {
  value: string
  title: string
  subtitle: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full p-5 rounded-lg border text-left transition-all duration-200 ${
        selected
          ? 'bg-[#C4322B] border-[#C4322B]'
          : 'bg-[#F5EFE8] border-[#243329]/15 hover:border-[#243329]/30'
      }`}
    >
      <p
        className={`text-base font-medium mb-1 transition-colors ${
          selected ? 'text-white' : 'text-[#243329]'
        }`}
      >
        {title}
      </p>
      <p
        className={`text-xs tracking-widest uppercase transition-colors ${
          selected ? 'text-white/70' : 'text-[#243329]/50'
        }`}
      >
        {subtitle}
      </p>
    </button>
  )
}
