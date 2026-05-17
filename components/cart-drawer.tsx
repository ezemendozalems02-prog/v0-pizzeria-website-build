"use client"

import { useState } from "react"
import { Minus, Plus, Trash2, X, MessageCircle, ChevronRight, MapPin } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

// Número con código de país completo: +54 9 11 2261-7501
const WHATSAPP_NUMBER = "5491122617501"

interface OrderForm {
  nombre: string
  telefono: string
  entrega: "delivery" | "retiro"
  direccion: string
  barrio: string
  referencia: string
  pago: "efectivo" | "transferencia"
  observaciones: string
}

const INITIAL_FORM: OrderForm = {
  nombre: "",
  telefono: "",
  entrega: "delivery",
  direccion: "",
  barrio: "",
  referencia: "",
  pago: "efectivo",
  observaciones: "",
}

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart()
  const { config } = useStore()

  const [showForm, setShowForm]     = useState(false)
  const [form, setForm]             = useState<OrderForm>(INITIAL_FORM)
  const [errors, setErrors]         = useState<Partial<Record<keyof OrderForm, string>>>({})
  const [sending, setSending]       = useState(false)

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof OrderForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof OrderForm, string>> = {}
    if (!form.nombre.trim())   newErrors.nombre   = "El nombre es obligatorio."
    if (!form.telefono.trim()) newErrors.telefono = "El teléfono es obligatorio."
    if (form.entrega === "delivery") {
      if (!form.direccion.trim()) newErrors.direccion = "La dirección es obligatoria para delivery."
      if (!form.barrio.trim())    newErrors.barrio    = "El barrio es obligatorio para delivery."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const buildMessage = (): string => {
    const sep = "━━━━━━━━━━━━━━━"

    const productos = items
      .map((item) => `• ${item.quantity}x ${item.name} — ${formatPrice(item.price * item.quantity)}`)
      .join("\n")

    const entregaLabel = form.entrega === "delivery" ? "Delivery" : "Retiro en local"
    const pagoLabel    = form.pago === "efectivo"    ? "Efectivo" : "Transferencia"

    let direccionLine = ""
    if (form.entrega === "delivery") {
      direccionLine += `\n📍 *Dirección:* ${form.direccion}`
      if (form.barrio)    direccionLine += `, ${form.barrio}`
      if (form.referencia) direccionLine += `\n📌 *Referencia:* ${form.referencia}`
    }

    const obsLine = form.observaciones.trim()
      ? `\n📝 *Observaciones:*\n${form.observaciones.trim()}\n`
      : ""

    // Calcular total con cargo de envío si es delivery
    const shippingCost = form.entrega === "delivery" ? (config?.shippingCost || 0) : 0
    const finalTotal = totalPrice + shippingCost

    // Línea de desglose si hay cargo de envío
    let desgloseLine = ""
    if (shippingCost > 0) {
      desgloseLine = `\nSubtotal: ${formatPrice(totalPrice)}\n🚚 Cargo envío: +${formatPrice(shippingCost)}`
    }

    const message = [
      `🍕 *NUEVO PEDIDO — TOTORE*`,
      ``,
      `👤 *Cliente:* ${form.nombre}`,
      `📞 *Teléfono:* ${form.telefono}`,
      `🚚 *Entrega:* ${entregaLabel}${direccionLine}`,
      `💳 *Pago:* ${pagoLabel}`,
      obsLine,
      sep,
      ``,
      `🛒 *PRODUCTOS:*`,
      ``,
      productos,
      ``,
      sep,
      ``,
      `💰 *TOTAL: ${formatPrice(finalTotal)}*${desgloseLine}`,
      ``,
      `Gracias 🙌`,
    ].join("\n")

    return message
  }

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return
    if (!validate()) return

    setSending(true)

    try {
      const message = buildMessage()
      const encoded = encodeURIComponent(message)
      const url     = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`

      // Open in new tab — works on iPhone Safari, Android Chrome, and desktop
      window.open(url, "_blank", "noopener,noreferrer")

      clearCart()
      setShowForm(false)
      setIsCartOpen(false)
      setForm(INITIAL_FORM)
      setErrors({})
    } finally {
      setSending(false)
    }
  }

  const handleClose = () => {
    setIsCartOpen(false)
    setShowForm(false)
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-md bg-[#FAF7F2] flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-[#E8E0D5] bg-[#FAF7F2]">
          <SheetTitle className="font-serif text-xl text-foreground tracking-tight">
            Tu Pedido
          </SheetTitle>
        </SheetHeader>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#F0EBE3] flex items-center justify-center">
              <ShoppingCartIcon className="w-8 h-8 text-[#A89880]" />
            </div>
            <p className="text-muted-foreground text-sm">Tu carrito está vacío</p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-sm text-primary underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              Seguir comprando
            </button>
          </div>

        ) : !showForm ? (
          /* ── CART ITEMS VIEW ── */
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 py-4 border-b border-[#E8E0D5] last:border-0 items-start"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-[#F0EBE3]"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatPrice(item.price)} c/u
                      </p>
                      <p className="text-sm font-semibold text-primary mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#C4A882] hover:text-destructive transition-colors p-0.5"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-1.5 bg-white border border-[#E8E0D5] rounded-xl px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-foreground hover:text-primary transition-colors"
                          aria-label="Restar"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-sm font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-foreground hover:text-primary transition-colors"
                          aria-label="Sumar"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#E8E0D5] bg-[#FAF7F2] px-6 py-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-xl font-bold text-primary">{formatPrice(totalPrice)}</span>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center justify-center gap-2 h-13 rounded-2xl bg-primary hover:bg-primary/90 active:scale-[0.98] text-primary-foreground font-display font-semibold text-base tracking-wide transition-all duration-150 shadow-md shadow-primary/20"
              >
                Continuar con el pedido
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>

        ) : (
          /* ── CHECKOUT FORM VIEW ── */
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Back */}
              <button
                onClick={() => setShowForm(false)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Volver al carrito
              </button>

              {/* Nombre */}
              <Field label="Nombre" required error={errors.nombre}>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  autoComplete="name"
                  className={inputCls(!!errors.nombre)}
                />
              </Field>

              {/* Teléfono */}
              <Field label="Teléfono" required error={errors.telefono}>
                <input
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="11 XXXX-XXXX"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  className={inputCls(!!errors.telefono)}
                />
              </Field>

              {/* Método de entrega */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Método de entrega <span className="text-primary">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["delivery", "retiro"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, entrega: opt }))}
                      className={`h-11 rounded-xl border text-sm font-medium transition-all duration-150 ${
                        form.entrega === opt
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-white border-[#E8E0D5] text-foreground hover:border-primary/40"
                      }`}
                    >
                      {opt === "delivery" ? "Delivery" : "Retiro en local"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dirección — solo si delivery */}
              {form.entrega === "delivery" && (
                <div className="space-y-3 pl-3 border-l-2 border-primary/20">
                  <Field label="Dirección" required error={errors.direccion}>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        name="direccion"
                        value={form.direccion}
                        onChange={handleChange}
                        placeholder="Calle y número"
                        autoComplete="street-address"
                        className={`${inputCls(!!errors.direccion)} pl-9`}
                      />
                    </div>
                  </Field>
                  <Field label="Barrio" required error={errors.barrio}>
                    <input
                      name="barrio"
                      value={form.barrio}
                      onChange={handleChange}
                      placeholder="Tu barrio"
                      className={inputCls(!!errors.barrio)}
                    />
                  </Field>
                  <Field label="Referencia">
                    <input
                      name="referencia"
                      value={form.referencia}
                      onChange={handleChange}
                      placeholder="Ej: Casa con portón negro"
                      className={inputCls(false)}
                    />
                  </Field>
                </div>
              )}

              {/* Método de pago */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Método de pago <span className="text-primary">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["efectivo", "transferencia"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, pago: opt }))}
                      className={`h-11 rounded-xl border text-sm font-medium transition-all duration-150 ${
                        form.pago === opt
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-white border-[#E8E0D5] text-foreground hover:border-primary/40"
                      }`}
                    >
                      {opt === "efectivo" ? "Efectivo" : "Transferencia"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Observaciones */}
              <Field label="Observaciones">
                <textarea
                  name="observaciones"
                  value={form.observaciones}
                  onChange={handleChange}
                  placeholder="Algún comentario adicional..."
                  rows={3}
                  className="w-full px-4 py-3 text-sm bg-white border border-[#E8E0D5] rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
                />
              </Field>
            </div>

            {/* Footer */}
            <div className="border-t border-[#E8E0D5] bg-[#FAF7F2] px-6 py-5 space-y-3">
              {/* Total breakdown */}
              <div className="space-y-2 pb-3 border-b border-[#E8E0D5]/50">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                {form.entrega === "delivery" && config?.shippingCost ? (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">🚚 Cargo por envío</span>
                    <span className="font-medium text-primary">+{formatPrice(config.shippingCost)}</span>
                  </div>
                ) : null}
              </div>

              {/* Final total */}
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-foreground">Total del pedido</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(totalPrice + (form.entrega === "delivery" ? (config?.shippingCost || 0) : 0))}
                </span>
              </div>

              <button
                onClick={handleWhatsAppOrder}
                disabled={sending}
                className="w-full flex items-center justify-center gap-2.5 h-14 rounded-2xl bg-[#25D366] hover:bg-[#1EB85A] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-display font-bold text-base tracking-wide transition-all duration-150 shadow-lg shadow-[#25D366]/30"
              >
                {sending ? (
                  <span className="animate-pulse">Preparando mensaje...</span>
                ) : (
                  <>
                    <WhatsAppIcon className="w-5 h-5" />
                    Enviar pedido por WhatsApp
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-muted-foreground">
                Se abrirá WhatsApp con tu pedido listo para enviar
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function inputCls(hasError: boolean) {
  return `w-full px-4 py-3 text-sm bg-white border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
    hasError
      ? "border-destructive focus:border-destructive focus:ring-destructive/20"
      : "border-[#E8E0D5] focus:border-primary/50"
  }`
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-primary ml-0.5">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  )
}

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function ShoppingCartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}
