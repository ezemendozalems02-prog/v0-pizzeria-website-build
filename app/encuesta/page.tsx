'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type Rating = 'bad' | 'ok' | 'good' | null
type Experience = 'delivery' | 'local' | 'retiro' | null

export default function EncuestaPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [justSelected, setJustSelected] = useState<string | null>(null)

  const [experience, setExperience] = useState<Experience>(null)
  const [ratings, setRatings] = useState({
    quality: null as Rating,
    time: null as Rating,
    attention: null as Rating,
  })
  const [comment, setComment] = useState('')

  const isValid = experience && ratings.quality && ratings.time && ratings.attention

  // Trigger haptic-like visual feedback
  const triggerFeedback = useCallback((id: string) => {
    setJustSelected(id)
    setTimeout(() => setJustSelected(null), 300)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Map frontend rating values → DB CHECK constraint values
      // DB accepts: 'bad' | 'good' | 'excellent'
      const ratingMap: Record<string, 'bad' | 'good' | 'excellent'> = {
        bad: 'bad',
        ok: 'good',
        good: 'excellent',
      }

      // Map frontend experience values → DB CHECK constraint values
      // DB accepts: 'delivery' | 'pickup' | 'local'
      const originMap: Record<string, 'delivery' | 'pickup' | 'local'> = {
        delivery: 'delivery',
        retiro: 'pickup',
        local: 'local',
      }

      const { error: insertError } = await supabase.from('survey_responses').insert({
        order_origin: originMap[experience!],
        product_quality: ratingMap[ratings.quality!],
        delivery_time: ratingMap[ratings.time!],
        service_attention: ratingMap[ratings.attention!],
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
        <div 
          className="max-w-md w-full text-center"
          style={{
            animation: 'fadeInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          }}
        >
          {/* Animated checkmark */}
          <div 
            className="w-20 h-20 mx-auto mb-8 rounded-full bg-[#C4322B] flex items-center justify-center"
            style={{
              animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards',
              opacity: 0,
              transform: 'scale(0)',
            }}
          >
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
                style={{
                  strokeDasharray: 30,
                  strokeDashoffset: 30,
                  animation: 'drawCheck 0.4s ease-out 0.5s forwards',
                }}
              />
            </svg>
          </div>

          <p 
            className="font-serif text-3xl md:text-4xl tracking-wide text-[#243329] mb-3"
            style={{
              animation: 'fadeInUp 0.5s ease-out 0.3s forwards',
              opacity: 0,
            }}
          >
            Gracias
          </p>
          <p 
            className="text-[#243329]/60 text-sm tracking-widest uppercase mb-12"
            style={{
              animation: 'fadeInUp 0.5s ease-out 0.4s forwards',
              opacity: 0,
            }}
          >
            Tu opinion fue enviada
          </p>

          <div 
            className="mb-12"
            style={{
              animation: 'fadeInUp 0.5s ease-out 0.5s forwards',
              opacity: 0,
            }}
          >
            <p className="text-[#243329]/80 text-base leading-relaxed">
              Tu feedback nos ayuda a seguir<br />
              perfeccionando la experiencia TOTORE.
            </p>
          </div>

          <button
            onClick={() => (window.location.href = '/')}
            className="inline-block px-8 py-3 bg-[#C4322B] text-white text-sm tracking-widest uppercase rounded-full hover:bg-[#a82a24] active:scale-95 transition-all duration-200"
            style={{
              animation: 'fadeInUp 0.5s ease-out 0.6s forwards',
              opacity: 0,
            }}
          >
            Volver al inicio
          </button>
        </div>

        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes drawCheck {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}</style>
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
              id="quality"
              value={ratings.quality}
              onChange={(val) => {
                setRatings({ ...ratings, quality: val })
                triggerFeedback(`quality-${val}`)
              }}
              justSelected={justSelected}
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
              id="time"
              value={ratings.time}
              onChange={(val) => {
                setRatings({ ...ratings, time: val })
                triggerFeedback(`time-${val}`)
              }}
              justSelected={justSelected}
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
              id="attention"
              value={ratings.attention}
              onChange={(val) => {
                setRatings({ ...ratings, attention: val })
                triggerFeedback(`attention-${val}`)
              }}
              justSelected={justSelected}
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
                justSelected={justSelected === 'exp-delivery'}
                onClick={() => {
                  setExperience('delivery')
                  triggerFeedback('exp-delivery')
                }}
              />
              <ExperienceCard
                value="local"
                title="Local"
                subtitle="CONSUMICION EN EL LOCAL"
                selected={experience === 'local'}
                justSelected={justSelected === 'exp-local'}
                onClick={() => {
                  setExperience('local')
                  triggerFeedback('exp-local')
                }}
              />
              <ExperienceCard
                value="retiro"
                title="Retiro"
                subtitle="RETIRO EN EL LOCAL"
                selected={experience === 'retiro'}
                justSelected={justSelected === 'exp-retiro'}
                onClick={() => {
                  setExperience('retiro')
                  triggerFeedback('exp-retiro')
                }}
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
              className={`px-12 py-4 bg-[#C4322B] text-white text-sm tracking-widest uppercase rounded-full transition-all duration-300 touch-manipulation ${
                isValid && !loading
                  ? 'hover:bg-[#a82a24] hover:shadow-lg hover:shadow-[#C4322B]/30 active:scale-95'
                  : 'opacity-40 cursor-not-allowed'
              }`}
              style={{
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Enviando...
                </span>
              ) : (
                'Enviar opinion'
              )}
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
  id,
  value,
  onChange,
  justSelected,
}: {
  id: string
  value: Rating
  onChange: (val: Rating) => void
  justSelected: string | null
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
        const isJustSelected = justSelected === `${id}-${val}`
        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className="flex flex-col items-center gap-3 group touch-manipulation"
          >
            {/* Circle with icon */}
            <div
              className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-2 flex items-center justify-center transition-all duration-300 ease-out ${
                isSelected
                  ? 'bg-[#C4322B] border-[#C4322B]'
                  : 'bg-transparent border-[#243329]/20 group-hover:border-[#243329]/40 group-active:scale-90'
              } ${isJustSelected ? 'scale-110 shadow-lg shadow-[#C4322B]/30' : isSelected ? 'scale-105' : ''}`}
              style={{
                transform: isJustSelected ? 'scale(1.15)' : isSelected ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <RatingIcon type={val} selected={isSelected} />
            </div>
            {/* Label */}
            <span
              className={`text-xs tracking-widest uppercase transition-all duration-300 ${
                isSelected ? 'text-[#C4322B] font-medium' : 'text-[#243329]/50'
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
  justSelected,
  onClick,
}: {
  value: string
  title: string
  subtitle: string
  selected: boolean
  justSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full p-5 rounded-xl border text-left touch-manipulation transition-all duration-300 ease-out active:scale-[0.98] ${
        selected
          ? 'bg-[#C4322B] border-[#C4322B]'
          : 'bg-[#F5EFE8] border-[#243329]/15 hover:border-[#243329]/30'
      } ${justSelected ? 'shadow-lg shadow-[#C4322B]/20 scale-[1.02]' : ''}`}
      style={{
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={`text-base font-medium mb-1 transition-colors duration-300 ${
              selected ? 'text-white' : 'text-[#243329]'
            }`}
          >
            {title}
          </p>
          <p
            className={`text-xs tracking-widest uppercase transition-colors duration-300 ${
              selected ? 'text-white/70' : 'text-[#243329]/50'
            }`}
          >
            {subtitle}
          </p>
        </div>
        {/* Animated checkmark */}
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            selected
              ? 'bg-white border-white'
              : 'border-[#243329]/20'
          }`}
          style={{
            transform: justSelected ? 'scale(1.2)' : 'scale(1)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {selected && (
            <svg
              className="w-3.5 h-3.5 text-[#C4322B]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
                style={{
                  strokeDasharray: 20,
                  strokeDashoffset: justSelected ? 20 : 0,
                  transition: 'stroke-dashoffset 0.3s ease-out',
                }}
              />
            </svg>
          )}
        </div>
      </div>
    </button>
  )
}
