"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useStore, type StoreProduct } from "@/lib/store"

interface Props {
  product?: StoreProduct
  onSave: (p: StoreProduct) => void
  onCancel: () => void
}

export function ProductForm({ product, onSave, onCancel }: Props) {
  const { categories } = useStore()
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<StoreProduct>(
    product ?? {
      id: `product-${Date.now()}`,
      name: "",
      price: 0,
      description: "",
      category: categories[0]?.id ?? "pizzas",
      image: "",
      active: true,
    }
  )
  const [imageMode, setImageMode] = useState<"url" | "upload">("url")
  const [previewError, setPreviewError] = useState(false)

  function set<K extends keyof StoreProduct>(key: K, value: StoreProduct[K]) {
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(form)
  }

  const hasPreview = form.image && !previewError

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Image */}
      <div className="flex flex-col gap-2">
        <Label className="text-admin-text font-medium">Imagen del producto</Label>

        {/* Preview */}
        {hasPreview ? (
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-admin-bg border border-admin-border">
            <Image
              src={form.image}
              alt="Preview"
              fill
              className="object-cover"
              onError={() => setPreviewError(true)}
            />
          </div>
        ) : (
          <div className="w-full aspect-[4/3] rounded-xl bg-admin-bg border-2 border-dashed border-admin-border flex flex-col items-center justify-center text-admin-muted">
            <Upload className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm">Sin imagen</p>
          </div>
        )}

        {/* Mode toggle */}
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
              className="border-admin-border text-admin-muted hover:text-admin-text"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Elegir imagen
            </Button>
          </>
        )}
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-admin-text font-medium">Nombre</Label>
        <Input
          required
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Ej: Margherita"
          className="bg-admin-bg border-admin-border text-admin-text"
        />
      </div>

      {/* Category + Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-admin-text font-medium">Categoría</Label>
          <Select value={form.category} onValueChange={(v) => set("category", v)}>
            <SelectTrigger className="bg-admin-bg border-admin-border text-admin-text">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-admin-text font-medium">Precio ($)</Label>
          <Input
            required
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => set("price", Number(e.target.value))}
            placeholder="15000"
            className="bg-admin-bg border-admin-border text-admin-text"
          />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-admin-text font-medium">Descripción</Label>
        <Textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Ingredientes y descripción del producto..."
          rows={3}
          className="bg-admin-bg border-admin-border text-admin-text resize-none"
        />
      </div>

      {/* Active toggle */}
      <div className="flex items-center justify-between bg-admin-bg border border-admin-border rounded-xl px-4 py-3">
        <div>
          <p className="text-sm font-medium text-admin-text">Estado del producto</p>
          <p className="text-xs text-admin-muted mt-0.5">
            {form.active ? "Visible en el catálogo" : "Oculto del catálogo"}
          </p>
        </div>
        <Switch
          checked={form.active}
          onCheckedChange={(v) => set("active", v)}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white">
          Guardar cambios
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-admin-border text-admin-text"
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
