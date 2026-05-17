"use client"

import { useState } from "react"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useStore, type SiteConfig } from "@/lib/store"

export default function ConfiguracionPage() {
  const { config, setConfig } = useStore()
  const [form, setForm] = useState<SiteConfig>(config)
  const [saved, setSaved] = useState(false)

  function set<K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    setConfig(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text">Configuración</h1>
          <p className="text-sm text-admin-muted mt-0.5">
            Datos de contacto, horarios y redes sociales del local.
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Guardado
          </div>
        )}
      </div>

      {/* Contact */}
      <Section title="Contacto y Ubicación">
        <Field label="Número de WhatsApp" hint="Solo números, con código de país. Ej: 5491112345678">
          <Input
            value={form.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
            placeholder="5491112345678"
            className="bg-admin-bg border-admin-border text-admin-text font-mono"
          />
        </Field>
        <Field label="Dirección del local">
          <Input
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="Balbín 2916, El Palomar, Buenos Aires"
            className="bg-admin-bg border-admin-border text-admin-text"
          />
        </Field>
        <Field label="URL de Google Maps Embed" hint="Embed URL desde Google Maps > Compartir > Insertar">
          <Textarea
            value={form.mapEmbedUrl}
            onChange={(e) => set("mapEmbedUrl", e.target.value)}
            rows={3}
            placeholder="https://www.google.com/maps/embed?pb=..."
            className="bg-admin-bg border-admin-border text-admin-text resize-none font-mono text-xs"
          />
        </Field>
      </Section>

      {/* Hours */}
      <Section title="Horarios">
        <Field label="Horario de atención">
          <Textarea
            value={form.hours}
            onChange={(e) => set("hours", e.target.value)}
            rows={3}
            placeholder="Martes a Domingo — 20:00 a 23:30"
            className="bg-admin-bg border-admin-border text-admin-text resize-none"
          />
        </Field>
        <p className="text-xs text-admin-muted -mt-2">
          Podés usar saltos de línea para separar días o turnos.
        </p>
      </Section>

      {/* Social */}
      <Section title="Redes Sociales">
        <Field label="Instagram (URL completa)">
          <Input
            value={form.instagram}
            onChange={(e) => set("instagram", e.target.value)}
            placeholder="https://instagram.com/totore.pizza"
            className="bg-admin-bg border-admin-border text-admin-text"
          />
        </Field>
      </Section>

      {/* Shipping Cost */}
      <Section title="Cargo por Envío">
        <Field label="Monto del cargo (en pesos)" hint="Se sumará al total cuando se seleccione Delivery">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-admin-text">$</span>
            <Input
              type="number"
              value={form.shippingCost}
              onChange={(e) => set("shippingCost", Number(e.target.value))}
              placeholder="1000"
              className="bg-admin-bg border-admin-border text-admin-text font-mono"
            />
          </div>
        </Field>
      </Section>

      {/* Footer */}
      <Section title="Footer del sitio">
        <Field label="Texto del footer">
          <Input
            value={form.footerText}
            onChange={(e) => set("footerText", e.target.value)}
            placeholder="Pizza napolitana con identidad propia."
            className="bg-admin-bg border-admin-border text-admin-text"
          />
        </Field>
      </Section>

      <Button
        onClick={handleSave}
        className="bg-primary hover:bg-primary/90 text-white w-fit"
      >
        Guardar configuración
      </Button>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-admin-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-admin-border bg-admin-bg">
        <p className="font-semibold text-admin-text text-sm">{title}</p>
      </div>
      <div className="px-6 py-5 flex flex-col gap-4">{children}</div>
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-admin-text font-medium text-sm">{label}</Label>
      {children}
      {hint && <p className="text-xs text-admin-muted">{hint}</p>}
    </div>
  )
}
