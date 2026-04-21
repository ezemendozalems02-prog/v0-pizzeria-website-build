'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import type { SiteContent } from '@/lib/store'

export default function ContenidoPage() {
  const supabase = createClient()

  const [form, setForm] = useState<SiteContent>({
    heroTitle: 'Pizza napolitana con identidad propia',
    heroSubtitle: 'Pedí tu favorita o vení a buscarla. Totore es pizza, barrio y buena comida.',
    heroBadge: 'Delivery desde las 20',
    experienceTitle: 'Un lugar para cada momento',
    experienceCards: [
      {
        icon: 'pizza',
        title: 'Pizza Artesanal',
        description: 'Pizza napolitana hecha con ingredientes de calidad y fermentación cuidada.',
      },
      {
        icon: 'delivery',
        title: 'Delivery Simple',
        description: 'Pedí directo desde la web y mandá el pedido por WhatsApp en segundos.',
      },
      {
        icon: 'share',
        title: 'Para Compartir',
        description: 'Pizza, cerveza y buena compañía. El combo perfecto.',
      },
    ],
    uniqueTitle: 'Lo que nos hace únicos',
    visitTitle: 'Vení a visitarnos',
  })

  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar contenido desde DB al montar
  useEffect(() => {
    loadContent()
  }, [])

  async function loadContent() {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('site_content')
        .select('*')
        .eq('id', 'home')
        .single()

      if (fetchError) throw fetchError

      if (data) {
        setForm({
          heroTitle: data.hero_title,
          heroSubtitle: data.hero_subtitle,
          heroBadge: data.hero_badge,
          experienceTitle: data.experience_title,
          experienceCards: data.experience_cards,
          uniqueTitle: data.unique_title,
          visitTitle: data.visit_title,
        })
        console.log('[ADMIN] Contenido cargado desde DB')
      }
    } catch (err: any) {
      console.error('[ADMIN] Error cargando contenido:', err)
    } finally {
      setLoading(false)
    }
  }

  function set<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function setCard(index: number, field: 'title' | 'description', value: string) {
    const updated = form.experienceCards.map((card, i) =>
      i === index ? { ...card, [field]: value } : card
    )
    setForm((prev) => ({ ...prev, experienceCards: updated }))
  }

  async function handleSave() {
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      // Guardar en Supabase
      const { error: upsertError } = await supabase
        .from('site_content')
        .upsert(
          {
            id: 'home',
            hero_title: form.heroTitle,
            hero_subtitle: form.heroSubtitle,
            hero_badge: form.heroBadge,
            experience_title: form.experienceTitle,
            experience_cards: form.experienceCards,
            unique_title: form.uniqueTitle,
            visit_title: form.visitTitle,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        )

      if (upsertError) throw upsertError

      setSuccess(true)
      console.log('[ADMIN] Contenido guardado correctamente')
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      const msg = err.message || 'Error al guardar'
      setError(msg)
      console.error('[ADMIN] Error guardando contenido:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-admin-muted" />
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-8 max-w-2xl'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-admin-text'>Contenido del Home</h1>
          <p className='text-sm text-admin-muted mt-0.5'>
            Editá los textos que aparecen en la página principal. Los cambios se guardan en la base de datos.
          </p>
        </div>
        {success && (
          <div className='flex items-center gap-1.5 text-green-600 text-sm font-medium'>
            <CheckCircle className='w-4 h-4' />
            Guardado
          </div>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className='p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800 text-sm'>
          <AlertCircle className='w-5 h-5 flex-shrink-0' />
          {error}
        </div>
      )}

      {/* Hero section */}
      <Section title='Sección Hero'>
        <Field label='Badge superior'>
          <Input
            value={form.heroBadge}
            onChange={(e) => set('heroBadge', e.target.value)}
            placeholder='Delivery desde las 20'
            className='bg-admin-bg border-admin-border text-admin-text'
          />
        </Field>
        <Field label='Título principal'>
          <Textarea
            value={form.heroTitle}
            onChange={(e) => set('heroTitle', e.target.value)}
            rows={2}
            placeholder='Pizza napolitana con identidad propia'
            className='bg-admin-bg border-admin-border text-admin-text resize-none'
          />
        </Field>
        <Field label='Subtítulo / descripción'>
          <Textarea
            value={form.heroSubtitle}
            onChange={(e) => set('heroSubtitle', e.target.value)}
            rows={3}
            placeholder='Pedí tu favorita o vení a buscarla...'
            className='bg-admin-bg border-admin-border text-admin-text resize-none'
          />
        </Field>
      </Section>

      {/* Experience section */}
      <Section title='Sección Experiencia'>
        <Field label='Título de la sección'>
          <Input
            value={form.experienceTitle}
            onChange={(e) => set('experienceTitle', e.target.value)}
            placeholder='Un lugar para cada momento'
            className='bg-admin-bg border-admin-border text-admin-text'
          />
        </Field>
        <div className='flex flex-col gap-4'>
          {form.experienceCards.map((card, i) => (
            <div
              key={i}
              className='bg-admin-bg border border-admin-border rounded-xl p-4 flex flex-col gap-3'
            >
              <p className='text-xs font-semibold text-admin-muted uppercase tracking-wide'>
                Tarjeta {i + 1}
              </p>
              <Field label='Título'>
                <Input
                  value={card.title}
                  onChange={(e) => setCard(i, 'title', e.target.value)}
                  className='bg-white border-admin-border text-admin-text'
                />
              </Field>
              <Field label='Descripción'>
                <Textarea
                  value={card.description}
                  onChange={(e) => setCard(i, 'description', e.target.value)}
                  rows={2}
                  className='bg-white border-admin-border text-admin-text resize-none'
                />
              </Field>
            </div>
          ))}
        </div>
      </Section>

      {/* Unique section */}
      <Section title='Sección Destacados'>
        <Field label='Título de la sección'>
          <Input
            value={form.uniqueTitle}
            onChange={(e) => set('uniqueTitle', e.target.value)}
            placeholder='Lo que nos hace únicos'
            className='bg-admin-bg border-admin-border text-admin-text'
          />
        </Field>
      </Section>

      {/* Visit section */}
      <Section title='Sección Visita'>
        <Field label='Título de la sección'>
          <Input
            value={form.visitTitle}
            onChange={(e) => set('visitTitle', e.target.value)}
            placeholder='Vení a Totore'
            className='bg-admin-bg border-admin-border text-admin-text'
          />
        </Field>
      </Section>

      <Button
        onClick={handleSave}
        disabled={saving}
        className='bg-primary hover:bg-primary/90 text-white w-fit gap-2'
      >
        {saving && <Loader2 className='w-4 h-4 animate-spin' />}
        {saving ? 'Guardando...' : 'Guardar todos los cambios'}
      </Button>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className='bg-white border border-admin-border rounded-2xl overflow-hidden'>
      <div className='px-6 py-4 border-b border-admin-border bg-admin-bg'>
        <p className='font-semibold text-admin-text text-sm'>{title}</p>
      </div>
      <div className='px-6 py-5 flex flex-col gap-4'>{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='flex flex-col gap-1.5'>
      <Label className='text-admin-text font-medium text-sm'>{label}</Label>
      {children}
    </div>
  )
}

  function set<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function setCard(index: number, field: 'title' | 'description', value: string) {
    const updated = form.experienceCards.map((card, i) =>
      i === index ? { ...card, [field]: value } : card
    )
    setForm((prev) => ({ ...prev, experienceCards: updated }))
  }

  async function handleSave() {
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      // Guardar en Supabase
      const { error: upsertError } = await supabase
        .from('site_content')
        .upsert(
          {
            id: 'home',
            hero_title: form.heroTitle,
            hero_subtitle: form.heroSubtitle,
            hero_badge: form.heroBadge,
            experience_title: form.experienceTitle,
            experience_cards: form.experienceCards,
            unique_title: form.uniqueTitle,
            visit_title: form.visitTitle,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        )

      if (upsertError) throw upsertError

      setSuccess(true)
      console.log('[ADMIN] Contenido guardado correctamente')
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      const msg = err.message || 'Error al guardar'
      setError(msg)
      console.error('[ADMIN] Error guardando contenido:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='flex flex-col gap-8 max-w-2xl'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-admin-text'>Contenido del Home</h1>
          <p className='text-sm text-admin-muted mt-0.5'>
            Editá los textos que aparecen en la página principal. Los cambios se guardan en la base de datos.
          </p>
        </div>
        {success && (
          <div className='flex items-center gap-1.5 text-green-600 text-sm font-medium'>
            <CheckCircle className='w-4 h-4' />
            Guardado
          </div>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className='p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800 text-sm'>
          <AlertCircle className='w-5 h-5 flex-shrink-0' />
          {error}
        </div>
      )}

      {/* Hero section */}
      <Section title='Sección Hero'>
        <Field label='Badge superior'>
          <Input
            value={form.heroBadge}
            onChange={(e) => set('heroBadge', e.target.value)}
            placeholder='Delivery desde las 20'
            className='bg-admin-bg border-admin-border text-admin-text'
          />
        </Field>
        <Field label='Título principal'>
          <Textarea
            value={form.heroTitle}
            onChange={(e) => set('heroTitle', e.target.value)}
            rows={2}
            placeholder='Pizza napolitana con identidad propia'
            className='bg-admin-bg border-admin-border text-admin-text resize-none'
          />
        </Field>
        <Field label='Subtítulo / descripción'>
          <Textarea
            value={form.heroSubtitle}
            onChange={(e) => set('heroSubtitle', e.target.value)}
            rows={3}
            placeholder='Pedí tu favorita o vení a buscarla...'
            className='bg-admin-bg border-admin-border text-admin-text resize-none'
          />
        </Field>
      </Section>

      {/* Experience section */}
      <Section title='Sección Experiencia'>
        <Field label='Título de la sección'>
          <Input
            value={form.experienceTitle}
            onChange={(e) => set('experienceTitle', e.target.value)}
            placeholder='Un lugar para cada momento'
            className='bg-admin-bg border-admin-border text-admin-text'
          />
        </Field>
        <div className='flex flex-col gap-4'>
          {form.experienceCards.map((card, i) => (
            <div
              key={i}
              className='bg-admin-bg border border-admin-border rounded-xl p-4 flex flex-col gap-3'
            >
              <p className='text-xs font-semibold text-admin-muted uppercase tracking-wide'>
                Tarjeta {i + 1}
              </p>
              <Field label='Título'>
                <Input
                  value={card.title}
                  onChange={(e) => setCard(i, 'title', e.target.value)}
                  className='bg-white border-admin-border text-admin-text'
                />
              </Field>
              <Field label='Descripción'>
                <Textarea
                  value={card.description}
                  onChange={(e) => setCard(i, 'description', e.target.value)}
                  rows={2}
                  className='bg-white border-admin-border text-admin-text resize-none'
                />
              </Field>
            </div>
          ))}
        </div>
      </Section>

      {/* Unique section */}
      <Section title='Sección Destacados'>
        <Field label='Título de la sección'>
          <Input
            value={form.uniqueTitle}
            onChange={(e) => set('uniqueTitle', e.target.value)}
            placeholder='Lo que nos hace únicos'
            className='bg-admin-bg border-admin-border text-admin-text'
          />
        </Field>
      </Section>

      {/* Visit section */}
      <Section title='Sección Visita'>
        <Field label='Título de la sección'>
          <Input
            value={form.visitTitle}
            onChange={(e) => set('visitTitle', e.target.value)}
            placeholder='Vení a Totore'
            className='bg-admin-bg border-admin-border text-admin-text'
          />
        </Field>
      </Section>

      <Button
        onClick={handleSave}
        disabled={saving}
        className='bg-primary hover:bg-primary/90 text-white w-fit gap-2'
      >
        {saving && <Loader2 className='w-4 h-4 animate-spin' />}
        {saving ? 'Guardando...' : 'Guardar todos los cambios'}
      </Button>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className='bg-white border border-admin-border rounded-2xl overflow-hidden'>
      <div className='px-6 py-4 border-b border-admin-border bg-admin-bg'>
        <p className='font-semibold text-admin-text text-sm'>{title}</p>
      </div>
      <div className='px-6 py-5 flex flex-col gap-4'>{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='flex flex-col gap-1.5'>
      <Label className='text-admin-text font-medium text-sm'>{label}</Label>
      {children}
    </div>
  )
}
