"use client"

import { useCart } from "@/lib/cart-context"
import { Check } from "lucide-react"

export function AddedToast() {
  const { lastAddedItem } = useCart()

  if (!lastAddedItem) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-secondary text-secondary-foreground px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Check className="w-4 h-4 text-primary-foreground" />
        </div>
        <p className="text-sm font-medium">
          <span className="text-primary-foreground">{lastAddedItem}</span>{" "}
          <span className="text-secondary-foreground/80">agregado al carrito</span>
        </p>
      </div>
    </div>
  )
}
