"use client"

import { useState } from "react"
import { Minus, Plus, Trash2, X, MessageCircle } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const WHATSAPP_NUMBER = "541122617501" // Tu número con código de país

interface OrderForm {
  nombre: string
  telefono: string
  direccion: string
  barrio: string
  referencia: string
  entrega: "delivery" | "retiro"
  pago: "efectivo" | "transferencia"
  observaciones: string
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

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<OrderForm>({
    nombre: "",
    telefono: "",
    direccion: "",
    barrio: "",
    referencia: "",
    entrega: "delivery",
    pago: "efectivo",
    observaciones: "",
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const generateWhatsAppMessage = () => {
    let message = "Hola Totore, quiero pedir:\n\n"

    items.forEach((item) => {
      message += `${item.name} x ${item.quantity} — ${formatPrice(item.price * item.quantity)}\n`
    })

    message += `\n*Total: ${formatPrice(totalPrice)}*\n\n`
    message += `*Nombre:* ${form.nombre}\n`
    message += `*Teléfono:* ${form.telefono}\n`
    
    if (form.entrega === "delivery") {
      message += `*Dirección:* ${form.direccion}\n`
      message += `*Barrio:* ${form.barrio}\n`
      if (form.referencia) {
        message += `*Referencia:* ${form.referencia}\n`
      }
    }
    
    message += `\n*Entrega:* ${form.entrega === "delivery" ? "Delivery" : "Retiro en local"}\n`
    message += `*Pago:* ${form.pago === "efectivo" ? "Efectivo" : "Transferencia"}\n`
    
    if (form.observaciones) {
      message += `\n*Observaciones:* ${form.observaciones}`
    }

    return encodeURIComponent(message)
  }

  const handleSendOrder = () => {
    const message = generateWhatsAppMessage()
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
    window.open(url, "_blank")
    clearCart()
    setShowForm(false)
    setIsCartOpen(false)
    setForm({
      nombre: "",
      telefono: "",
      direccion: "",
      barrio: "",
      referencia: "",
      entrega: "delivery",
      pago: "efectivo",
      observaciones: "",
    })
  }

  const isFormValid = () => {
    if (!form.nombre || !form.telefono) return false
    if (form.entrega === "delivery" && (!form.direccion || !form.barrio)) return false
    return true
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md bg-background flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="font-serif text-xl text-foreground">
            Tu Pedido
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingCartIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Tu carrito está vacío</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsCartOpen(false)}
            >
              Seguir comprando
            </Button>
          </div>
        ) : !showForm ? (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 cart-scrollbar">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 py-4 border-b border-border last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Footer */}
            <div className="border-t border-border px-6 py-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total</span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
                onClick={() => setShowForm(true)}
              >
                Continuar con el pedido
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Order Form */}
            <div className="flex-1 overflow-y-auto px-6 py-4 cart-scrollbar">
              <button
                onClick={() => setShowForm(false)}
                className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Volver al carrito
              </button>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleInputChange}
                    placeholder="Tu nombre"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleInputChange}
                    placeholder="Tu teléfono"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Método de entrega *</Label>
                  <RadioGroup
                    value={form.entrega}
                    onValueChange={(value: "delivery" | "retiro") =>
                      setForm((prev) => ({ ...prev, entrega: value }))
                    }
                    className="mt-2 flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="font-normal">
                        Delivery
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="retiro" id="retiro" />
                      <Label htmlFor="retiro" className="font-normal">
                        Retiro en local
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {form.entrega === "delivery" && (
                  <>
                    <div>
                      <Label htmlFor="direccion">Dirección *</Label>
                      <Input
                        id="direccion"
                        name="direccion"
                        value={form.direccion}
                        onChange={handleInputChange}
                        placeholder="Calle y número"
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="barrio">Barrio *</Label>
                      <Input
                        id="barrio"
                        name="barrio"
                        value={form.barrio}
                        onChange={handleInputChange}
                        placeholder="Tu barrio"
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="referencia">Referencia</Label>
                      <Input
                        id="referencia"
                        name="referencia"
                        value={form.referencia}
                        onChange={handleInputChange}
                        placeholder="Ej: Casa azul, timbre 2B"
                        className="mt-1.5"
                      />
                    </div>
                  </>
                )}

                <div>
                  <Label>Método de pago *</Label>
                  <RadioGroup
                    value={form.pago}
                    onValueChange={(value: "efectivo" | "transferencia") =>
                      setForm((prev) => ({ ...prev, pago: value }))
                    }
                    className="mt-2 flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="efectivo" id="efectivo" />
                      <Label htmlFor="efectivo" className="font-normal">
                        Efectivo
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="transferencia" id="transferencia" />
                      <Label htmlFor="transferencia" className="font-normal">
                        Transferencia
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea
                    id="observaciones"
                    name="observaciones"
                    value={form.observaciones}
                    onChange={handleInputChange}
                    placeholder="Algún comentario adicional..."
                    className="mt-1.5 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Form Footer */}
            <div className="border-t border-border px-6 py-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total del pedido</span>
                <span className="font-bold text-primary">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <Button
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2"
                size="lg"
                onClick={handleSendOrder}
                disabled={!isFormValid()}
              >
                <MessageCircle className="w-5 h-5" />
                Enviar pedido por WhatsApp
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
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
