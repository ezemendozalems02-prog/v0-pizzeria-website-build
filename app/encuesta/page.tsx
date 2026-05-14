'use client'

import { useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Rating = 'bad' | 'ok' | 'good' | null
type Experience = 'delivery' | 'retiro' | null

const STEPS = ['calidad', 'tiempo', 'atencion', 'origen', 'comentario'] as const
type Step = typeof STEPS[number]

const STEP_LABELS: Record<Step, string> = {
  calidad: 'Calidad',
  tiempo: 'Entrega',
  atencion: 'Atencion',
  origen: 'Origen',
  comentario: 'Comentario',
}

export default function EncuestaPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [animating, setAnimating] = useState(false)
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

  const totalSteps = STEPS.length

  const canAdvance = useCallback(() => {
    const step = STEPS[currentStep]
    if (step === 'calidad') return ratings.quality !== null
    if (step === 'tiempo') return ratings.time !== null
    if (step === 'atencion') return ratings.attention !== null
    if (step === 'origen') return experience !== null
    return true // comentario is optional
  }, [currentStep, ratings, experience])

  const goTo = useCallback((index: number) => {
    if (animating) return
    setDirection(index > currentStep ? 'forward' : 'back')
    setAnimating(true)
    setTimeout(() => {
      setCurrentStep(index)
      setAnimating(false)
    }, 260)
  }, [animating, currentStep])

  const handleNext = useCallback(() => {
    if (!canAdvance()) return
    if (currentStep < totalSteps - 1) {
      goTo(currentStep + 1)
    }
  }, [canAdvance, currentStep, totalSteps, goTo])

  const handleBack = useCallback(() => {
    if (currentStep > 0) goTo(currentStep - 1)
  }, [currentStep, goTo])

  // Auto-advance on rating select (except last two steps)
  const handleRating = useCallback((field: 'quality' | 'time' | 'attention', val: Rating) => {
    setRatings(prev => ({ ...prev, [field]: val }))
    setTimeout(() => {
      setDirection('forward')
      setAnimating(true)
      setTimeout(() => {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1))
        setAnimating(false)
      }, 260)
    }, 320)
  }, [totalSteps])

  const handleExperience = useCallback((val: Experience) => {
    setExperience(val)
    setTimeout(() => {
      setDirection('forward')
      setAnimating(true)
      setTimeout(() => {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1))
        setAnimating(false)
      }, 260)
    }, 320)
  }, [totalSteps])

  const handleSubmit = async () => {
    if (!experience || !ratings.quality || !ratings.time || !ratings.attention) return
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const ratingMap: Record<string, 'bad' | 'good' | 'excellent'> = {
        bad: 'bad', ok: 'good', good: 'excellent',
      }
      const originMap: Record<string, 'delivery' | 'pickup' | 'local'> = {
        delivery: 'delivery', retiro: 'pickup',
      }
      const { error: insertError } = await supabase.from('survey_responses').insert({
        order_origin: originMap[experience],
        product_quality: ratingMap[ratings.quality],
        delivery_time: ratingMap[ratings.time],
        service_attention: ratingMap[ratings.attention],
        comment: comment.trim() || null,
      })
      if (insertError) throw insertError
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Error al enviar')
    } finally {
      setLoading(false)
    }
  }

  // --- Success ---
  if (submitted) {
    return (
      <div className="min-h-screen pt-16 bg-[#F5EFE8] flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center" style={{ animation: 'fadeUp 0.5s ease forwards' }}>
          <div
            className="w-20 h-20 mx-auto mb-8 rounded-full bg-[#C4322B] flex items-center justify-center"
            style={{ animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both' }}
          >
            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-serif text-4xl text-[#243329] mb-2" style={{ animation: 'fadeUp 0.5s ease 0.2s both' }}>Gracias</p>
          <p className="text-[#243329]/50 text-xs tracking-widest uppercase mb-8" style={{ animation: 'fadeUp 0.5s ease 0.3s both' }}>Tu opinion fue enviada</p>
          <p className="text-[#243329]/70 text-sm leading-relaxed mb-10" style={{ animation: 'fadeUp 0.5s ease 0.4s both' }}>
            Tu feedback nos ayuda a seguir perfeccionando la experiencia TOTORE.
          </p>
          <button
            onClick={() => (window.location.href = '/')}
            className="px-8 py-3 bg-[#C4322B] text-white text-xs tracking-widest uppercase rounded-full hover:bg-[#a82a24] active:scale-95 transition-all"
            style={{ animation: 'fadeUp 0.5s ease 0.5s both' }}
          >
            Volver al inicio
          </button>
        </div>
        <Keyframes />
      </div>
    )
  }

  const stepKey = STEPS[currentStep]

  return (
    <div className="min-h-screen pt-16 bg-[#F5EFE8] flex flex-col">
      {/* Top header */}
      <header className="flex flex-col items-center pt-12 pb-6 px-6">
        <p className="font-serif text-2xl text-[#243329] tracking-wide mb-1">TOTORE</p>
        <p className="text-[#243329]/50 text-xs tracking-widest uppercase">Encuesta de satisfaccion</p>
      </header>

      {/* Progress bar only */}
      <div className="px-6 pb-8 max-w-lg mx-auto w-full">
        <div className="relative h-1 bg-[#243329]/10 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-[#C4322B] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Slide content */}
      <div className="flex-1 overflow-hidden relative max-w-lg mx-auto w-full px-6">
        <div
          key={currentStep}
          className="w-full"
          style={{
            animation: animating
              ? 'none'
              : direction === 'forward'
              ? 'slideInRight 0.28s cubic-bezier(0.4,0,0.2,1) forwards'
              : 'slideInLeft 0.28s cubic-bezier(0.4,0,0.2,1) forwards',
          }}
        >
          {/* Step: Calidad */}
          {stepKey === 'calidad' && (
            <StepWrapper question="Como calificarias la calidad de nuestros productos?">
              <RatingSelector
                id="quality"
                value={ratings.quality}
                onChange={(val) => handleRating('quality', val)}
              />
            </StepWrapper>
          )}

          {/* Step: Tiempo */}
          {stepKey === 'tiempo' && (
            <StepWrapper question="Como calificarias el tiempo de entrega?">
              <RatingSelector
                id="time"
                value={ratings.time}
                onChange={(val) => handleRating('time', val)}
              />
            </StepWrapper>
          )}

          {/* Step: Atencion */}
          {stepKey === 'atencion' && (
            <StepWrapper question="Como calificarias la atencion recibida?">
              <RatingSelector
                id="attention"
                value={ratings.attention}
                onChange={(val) => handleRating('attention', val)}
              />
            </StepWrapper>
          )}

          {/* Step: Origen */}
          {stepKey === 'origen' && (
            <StepWrapper question="Como fue tu experiencia?">
              <div className="flex flex-col gap-3 w-full">
                <ExperienceCard
                  title="Delivery"
                  subtitle="Pedido a domicilio"
                  selected={experience === 'delivery'}
                  onClick={() => handleExperience('delivery')}
                />
                <ExperienceCard
                  title="Retiro"
                  subtitle="Retiro en el local"
                  selected={experience === 'retiro'}
                  onClick={() => handleExperience('retiro')}
                />
              </div>
            </StepWrapper>
          )}

          {/* Step: Comentario */}
          {stepKey === 'comentario' && (
            <StepWrapper question="Queres agregar algun comentario?" hint="Opcional — maximo 50 caracteres">
              <div className="w-full">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 50))}
                  placeholder="Escribi aqui..."
                  maxLength={50}
                  rows={4}
                  className="w-full p-4 bg-white/60 border border-[#243329]/15 rounded-xl resize-none text-[#243329] placeholder:text-[#243329]/30 focus:outline-none focus:border-[#C4322B]/40 transition-colors text-sm"
                />
                <p className="text-right text-[#243329]/40 text-xs mt-1.5">{comment.length} / 50</p>
              </div>
              {error && (
                <div className="w-full p-3 bg-[#C4322B]/10 border border-[#C4322B]/20 rounded-lg text-[#C4322B] text-sm text-center mt-2">
                  {error}
                </div>
              )}
            </StepWrapper>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="px-6 pb-12 pt-6 max-w-lg mx-auto w-full">
        <div className="flex items-center gap-3">
          {/* Back */}
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
              currentStep === 0
                ? 'border-[#243329]/10 text-[#243329]/20 cursor-not-allowed'
                : 'border-[#243329]/20 text-[#243329]/60 hover:border-[#243329]/40 active:scale-95'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next / Submit */}
          {stepKey === 'comentario' ? (
            <button
              onClick={handleSubmit}
              disabled={loading || !experience || !ratings.quality || !ratings.time || !ratings.attention}
              className="flex-1 h-12 bg-[#C4322B] text-white text-xs tracking-widest uppercase rounded-full hover:bg-[#a82a24] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Enviando...
                </>
              ) : (
                'Enviar opinion'
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canAdvance()}
              className={`flex-1 h-12 rounded-full text-xs tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 ${
                canAdvance()
                  ? 'bg-[#C4322B] text-white hover:bg-[#a82a24] active:scale-[0.98]'
                  : 'bg-[#243329]/8 text-[#243329]/30 cursor-not-allowed'
              }`}
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <Keyframes />
    </div>
  )
}

/* ---- Step Wrapper ---- */
function StepWrapper({ question, hint, children }: { question: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="text-center">
        <p className="text-[#243329] text-lg font-medium leading-snug max-w-xs mx-auto">{question}</p>
        {hint && <p className="text-[#243329]/45 text-xs mt-2 tracking-wide">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

/* ---- Rating Selector ---- */
function RatingSelector({ id, value, onChange }: { id: string; value: Rating; onChange: (val: Rating) => void }) {
  const options: { val: Rating; label: string }[] = [
    { val: 'bad', label: 'Mala' },
    { val: 'ok', label: 'Normal' },
    { val: 'good', label: 'Muy buena' },
  ]
  return (
    <div className="flex justify-center gap-6 md:gap-10">
      {options.map(({ val, label }) => {
        const selected = value === val
        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className="flex flex-col items-center gap-3 group touch-manipulation"
          >
            <div
              className={`w-18 h-18 w-[72px] h-[72px] rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                selected
                  ? 'bg-[#C4322B] border-[#C4322B] scale-110 shadow-lg shadow-[#C4322B]/25'
                  : 'bg-white/60 border-[#243329]/15 group-hover:border-[#243329]/30 group-active:scale-95'
              }`}
            >
              <RatingIcon type={val} selected={selected} />
            </div>
            <span className={`text-xs tracking-wide transition-colors duration-200 ${selected ? 'text-[#C4322B] font-medium' : 'text-[#243329]/45'}`}>
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ---- Rating Icon ---- */
function RatingIcon({ type, selected }: { type: Rating; selected: boolean }) {
  const color = selected ? '#FFFFFF' : '#243329'
  const opacity = selected ? 1 : 0.45
  if (type === 'bad') return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ opacity }}>
      <circle cx="9" cy="11" r="1.5" fill={color} />
      <circle cx="19" cy="11" r="1.5" fill={color} />
      <path d="M9 20C9 20 11.5 17 14 17C16.5 17 19 20 19 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
  if (type === 'ok') return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ opacity }}>
      <circle cx="9" cy="11" r="1.5" fill={color} />
      <circle cx="19" cy="11" r="1.5" fill={color} />
      <line x1="9" y1="19" x2="19" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ opacity }}>
      <circle cx="9" cy="11" r="1.5" fill={color} />
      <circle cx="19" cy="11" r="1.5" fill={color} />
      <path d="M9 17C9 17 11.5 20 14 20C16.5 20 19 17 19 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/* ---- Experience Card ---- */
function ExperienceCard({ title, subtitle, selected, onClick }: { title: string; subtitle: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full p-5 rounded-xl border text-left touch-manipulation transition-all duration-300 active:scale-[0.98] ${
        selected ? 'bg-[#C4322B] border-[#C4322B] shadow-lg shadow-[#C4322B]/20' : 'bg-white/60 border-[#243329]/12 hover:border-[#243329]/25'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-base font-medium mb-0.5 ${selected ? 'text-white' : 'text-[#243329]'}`}>{title}</p>
          <p className={`text-xs tracking-wide ${selected ? 'text-white/65' : 'text-[#243329]/45'}`}>{subtitle}</p>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${selected ? 'bg-white border-white' : 'border-[#243329]/20'}`}>
          {selected && (
            <svg className="w-3 h-3 text-[#C4322B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </button>
  )
}

/* ---- CSS Keyframes ---- */
function Keyframes() {
  return (
    <style jsx global>{`
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(48px); }
        to   { opacity: 1; transform: translateX(0);    }
      }
      @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-48px); }
        to   { opacity: 1; transform: translateX(0);     }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0);    }
      }
      @keyframes popIn {
        from { opacity: 0; transform: scale(0); }
        to   { opacity: 1; transform: scale(1); }
      }
    `}</style>
  )
}
