"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useStore, type Banner } from "@/lib/store"

const BANNER_META: Record<string, { name: string; description: string; hasSubtitle: boolean }> = {
  hero: {
    name: "Hero Principal",
    description: "Banner grande en el inicio del sitio",
    hasSubtitle: true,
  },
  favoritas: {
    name: "Favoritas del barrio",
    description: "Banner secundario en la sección de destacados",
    hasSubtitle: false,
  },
  promos: {
    name: "Promos Totore",
    description: "Banner secundario en la sección de destacados",
    hasSubtitle: false,
  },
}

export default function BannersPage() {
  const { banners, updateBanner } = useStore()
  const [savedId, setSavedId] = useState<string | null>(null)

  function handleSave(banner: Banner) {
    updateBanner(banner)
    setSavedId(banner.id)
    setTimeout(() => setSavedId(null), 2500)
  }

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-admin-text">Banners</h1>
        <p className="text-sm text-admin-muted mt-0.5">
          Editá los banners que aparecen en el home del sitio.
        </p>
      </div>

      {banners.map((banner) => {
        const meta = BANNER_META[banner.id]
        return (
          <BannerCard
            key={banner.id}
            banner={banner}
            meta={meta}
            saved={savedId === banner.id}
            onSave={handleSave}
          />
        )
      })}
    </div>
  )
}

function BannerCard({
  banner,
  meta,
  saved,
  onSave,
}: {
  banner: Banner
  meta: { name: string; description: string; hasSubtitle: boolean }
  saved: boolean
  onSave: (b: Banner) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<Banner>(banner)
  const [imageMode, setImageMode] = useState<"url" | "upload">("url")
  const [previewError, setPreviewError] = useState(false)

  function set<K extends keyof Banner>(key: K, value: Banner[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      set("image", ev.target?.result as string)
      setPreviewError(false)
    }
    reader.readAsDataURL(file)
  }

  const hasPreview = form.image && !previewError

  return (
    <div className="bg-white border border-admin-border rounded-2xl overflow-hidden">
      {/* Preview */}
      <div className="relative w-full aspect-[16/7] bg-admin-bg">
        {hasPreview ? (
          <Image
            src={form.image}
            alt={meta.name}
            fill
            className="object-cover"
            onError={() => setPreviewError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-admin-muted">
            <Upload className="w-8 h-8 opacity-30" />
          </div>
        )}
        {/* Overlay preview */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-end p-6 pointer-events-none">
          <div>
            {form.title && (
              <p className="text-white font-serif text-2xl font-bold leading-tight text-balance">
                {form.title}
              </p>
            )}
            {form.subtitle && (
              <p className="text-white/80 text-sm mt-1 max-w-xs">{form.subtitle}</p>
            )}
            {form.buttonText && (
              <span className="inline-block mt-2 px-3 py-1 bg-white/20 text-white text-xs rounded-full">
                {form.buttonText}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="font-semibold text-admin-text">{meta.name}</p>
            <p className="text-xs text-admin-muted mt-0.5">{meta.description}</p>
          </div>
          {saved && (
            <div className="flex items-center gap-1.5 text-green-600 text-xs font-medium">
              <CheckCircle className="w-4 h-4" />
              Guardado
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {/* Image */}
          <div className="flex flex-col gap-2">
            <Label className="text-admin-text font-medium text-sm">Imagen</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setImageMode("url")}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  imageMode === "url"
                    ? "bg-primary text-white border-primary"
                    : "border-admin-border text-admin-muted hover:text-admin-text"
                }`}
              >
                URL
              </button>
              <button
                type="button"
                onClick={() => setImageMode("upload")}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  imageMode === "upload"
                    ? "bg-primary text-white border-primary"
                    : "border-admin-border text-admin-muted hover:text-admin-text"
                }`}
              >
                Subir archivo
              </button>
            </div>
            {imageMode === "url" ? (
              <Input
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={form.image.startsWith("data:") ? "" : form.image}
                onChange={(e) => {
                  set("image", e.target.value)
                  setPreviewError(false)
                }}
                className="bg-admin-bg border-admin-border text-admin-text"
              />
            ) : (
              <>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-admin-border text-admin-muted hover:text-admin-text w-fit"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Elegir imagen
                </Button>
              </>
            )}
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-admin-text font-medium text-sm">Título</Label>
            <Input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Título del banner"
              className="bg-admin-bg border-admin-border text-admin-text"
            />
          </div>

          {/* Subtitle (only for hero) */}
          {meta.hasSubtitle && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-admin-text font-medium text-sm">Subtítulo</Label>
              <Textarea
                value={form.subtitle}
                onChange={(e) => set("subtitle", e.target.value)}
                placeholder="Descripción breve bajo el título"
                rows={2}
                className="bg-admin-bg border-admin-border text-admin-text resize-none"
              />
            </div>
          )}

          {/* Button text + link */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-admin-text font-medium text-sm">Texto del botón</Label>
              <Input
                value={form.buttonText}
                onChange={(e) => set("buttonText", e.target.value)}
                placeholder="Ver Menú"
                className="bg-admin-bg border-admin-border text-admin-text"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-admin-text font-medium text-sm">Link del botón</Label>
              <Input
                value={form.buttonLink}
                onChange={(e) => set("buttonLink", e.target.value)}
                placeholder="/pedido-delivery"
                className="bg-admin-bg border-admin-border text-admin-text"
              />
            </div>
          </div>

          <Button
            onClick={() => onSave(form)}
            className="bg-primary hover:bg-primary/90 text-white w-fit"
          >
            Guardar cambios
          </Button>
        </div>
      </div>
    </div>
  )
}
