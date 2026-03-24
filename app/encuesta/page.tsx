'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Star, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SurveyPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: '5',
    experience: '',
    origin: 'delivery',
    comments: '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = await createClient()

      const { error: dbError } = await supabase.from('survey_responses').insert({
        name: formData.name,
        email: formData.email,
        rating: parseInt(formData.rating),
        experience: formData.experience,
        order_origin: formData.origin,
        comments: formData.comments,
        submitted_at: new Date().toISOString(),
      })

      if (dbError) throw dbError

      setSubmitted(true)
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          rating: '5',
          experience: '',
          origin: 'delivery',
          comments: '',
        })
        setSubmitted(false)
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Error al enviar la encuesta')
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-primary animate-pulse" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            ¡Gracias!
          </h1>
          <p className="text-muted-foreground mb-8">
            Tu opinión es muy importante para nosotros. Nos ayuda a mejorar cada día.
          </p>
          <Link href="/" className="inline-block">
            <Button className="bg-primary hover:bg-primary/90">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full h-80 overflow-hidden">
        <Image
          src="/images/survey-hero.jpg"
          alt="Clientes disfrutando de pizza"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white text-balance mb-3">
            Tu opinión importa
          </h1>
          <p className="text-white/90 text-lg max-w-xl">
            Ayúdanos a mejorar compartiendo tu experiencia en TOTORE
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-background">
        <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Info */}
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Cuéntanos sobre ti
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground font-medium">
                    Nombre *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Tu nombre"
                    required
                    className="h-11 border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="h-11 border-border"
                  />
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-6 pb-8 border-b border-border">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Tu experiencia
                </h2>
              </div>

              {/* Origin */}
              <div className="space-y-3">
                <Label className="text-foreground font-medium">
                  ¿De dónde viniste? *
                </Label>
                <RadioGroup value={formData.origin} onValueChange={(val) => handleChange('origin', val)}>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/30 cursor-pointer transition">
                    <RadioGroupItem value="local" id="local" />
                    <Label htmlFor="local" className="cursor-pointer flex-1 font-normal">
                      Visitamos el local
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/30 cursor-pointer transition">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="cursor-pointer flex-1 font-normal">
                      Pedimos por delivery
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/30 cursor-pointer transition">
                    <RadioGroupItem value="takeaway" id="takeaway" />
                    <Label htmlFor="takeaway" className="cursor-pointer flex-1 font-normal">
                      Retiramos en el local
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Rating */}
              <div className="space-y-4">
                <Label className="text-foreground font-medium">
                  ¿Qué calificación nos das? *
                </Label>
                <div className="grid grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleChange('rating', star.toString())}
                      className={`py-3 px-2 rounded-lg border-2 transition flex items-center justify-center ${
                        parseInt(formData.rating) >= star
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <Star
                        className="w-6 h-6"
                        fill={parseInt(formData.rating) >= star ? 'currentColor' : 'none'}
                        color={parseInt(formData.rating) >= star ? '#C4322B' : '#999'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Type */}
              <div className="space-y-3">
                <Label className="text-foreground font-medium">
                  ¿Qué aspecto de tu experiencia fue más memorable? *
                </Label>
                <RadioGroup
                  value={formData.experience}
                  onValueChange={(val) => handleChange('experience', val)}
                >
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/30 cursor-pointer transition">
                    <RadioGroupItem value="quality" id="quality" />
                    <Label htmlFor="quality" className="cursor-pointer flex-1 font-normal">
                      Calidad de la comida
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/30 cursor-pointer transition">
                    <RadioGroupItem value="service" id="service" />
                    <Label htmlFor="service" className="cursor-pointer flex-1 font-normal">
                      Atención al cliente
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/30 cursor-pointer transition">
                    <RadioGroupItem value="atmosphere" id="atmosphere" />
                    <Label htmlFor="atmosphere" className="cursor-pointer flex-1 font-normal">
                      Ambiente del local
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/30 cursor-pointer transition">
                    <RadioGroupItem value="delivery" id="delivery-exp" />
                    <Label htmlFor="delivery-exp" className="cursor-pointer flex-1 font-normal">
                      Velocidad de entrega
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/30 cursor-pointer transition">
                    <RadioGroupItem value="price" id="price" />
                    <Label htmlFor="price" className="cursor-pointer flex-1 font-normal">
                      Relación precio-calidad
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="comments" className="text-foreground font-medium">
                  Comentarios adicionales
                </Label>
                <p className="text-sm text-muted-foreground">
                  Cuéntanos qué nos faltó o qué hicimos bien
                </p>
                <Textarea
                  id="comments"
                  value={formData.comments}
                  onChange={(e) => handleChange('comments', e.target.value)}
                  placeholder="Tu opinión aquí..."
                  className="min-h-32 border-border resize-none"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-4">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full h-12 border-border">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-medium"
              >
                {loading ? 'Enviando...' : 'Enviar encuesta'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
