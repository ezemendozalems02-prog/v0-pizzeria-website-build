"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import { products as initialProducts } from "@/lib/products"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StoreProduct {
  id: string
  name: string
  price: number
  description: string
  category: string
  image: string
  active: boolean
}

export interface StoreCategory {
  id: string
  label: string
}

export interface Banner {
  id: string
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  image: string
}

export interface SiteContent {
  heroTitle: string
  heroSubtitle: string
  heroBadge: string
  experienceTitle: string
  experienceCards: { icon: string; title: string; description: string }[]
  uniqueTitle: string
  visitTitle: string
}

export interface SiteConfig {
  whatsapp: string
  address: string
  hours: string
  instagram: string
  footerText: string
  mapEmbedUrl: string
}

// ─── Initial Data ─────────────────────────────────────────────────────────────

const initialCategories: StoreCategory[] = [
  { id: "pizzas", label: "Pizzas" },
  { id: "bebidas", label: "Bebidas" },
]

const initialBanners: Banner[] = [
  {
    id: "hero",
    title: "Pizza napolitana con identidad propia",
    subtitle: "Pedí tu favorita o vení a buscarla. Totore es pizza, barrio y buena comida.",
    buttonText: "Pedir Delivery",
    buttonLink: "/pedido-delivery",
    image: "/images/hero-pizza.jpg",
  },
  {
    id: "favoritas",
    title: "Favoritas del barrio",
    subtitle: "",
    buttonText: "Ver Menú",
    buttonLink: "/pedido-delivery",
    image: "/images/favorites-banner.jpg",
  },
  {
    id: "promos",
    title: "Promos Totore",
    subtitle: "",
    buttonText: "Ver Menú",
    buttonLink: "/pedido-delivery",
    image: "/images/promos-banner.jpg",
  },
]

const initialContent: SiteContent = {
  heroTitle: "Pizza napolitana con identidad propia",
  heroSubtitle: "Pedí tu favorita o vení a buscarla. Totore es pizza, barrio y buena comida.",
  heroBadge: "Delivery desde las 20",
  experienceTitle: "Un lugar para cada momento",
  experienceCards: [
    {
      icon: "pizza",
      title: "Pizza Artesanal",
      description: "Pizza napolitana hecha con ingredientes de calidad y fermentación cuidada.",
    },
    {
      icon: "delivery",
      title: "Delivery Simple",
      description: "Pedí directo desde la web y mandá el pedido por WhatsApp en segundos.",
    },
    {
      icon: "share",
      title: "Para Compartir",
      description: "Pizza, cerveza y buena compañía. El combo perfecto.",
    },
  ],
  uniqueTitle: "Lo que nos hace únicos",
  visitTitle: "Vení a Totore",
}

const initialConfig: SiteConfig = {
  whatsapp: "5491112345678",
  address: "Balbín 2916, El Palomar, Buenos Aires",
  hours: "Martes a Domingo — 20:00 a 23:30",
  instagram: "https://instagram.com/totore.pizza",
  footerText: "Pizza napolitana con identidad propia.",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.5!2d-58.6!3d-34.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzAwLjAiUyA1OMKwMzYnMDAuMCJX!5e0!3m2!1sen!2sar!4v1234567890",
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface StoreContextType {
  products: StoreProduct[]
  setProducts: (p: StoreProduct[]) => void
  addProduct: (p: StoreProduct) => void
  updateProduct: (p: StoreProduct) => void
  deleteProduct: (id: string) => void

  categories: StoreCategory[]
  setCategories: (c: StoreCategory[]) => void
  addCategory: (c: StoreCategory) => void
  updateCategory: (c: StoreCategory) => void
  deleteCategory: (id: string) => void

  banners: Banner[]
  updateBanner: (b: Banner) => void

  content: SiteContent
  setContent: (c: SiteContent) => void

  config: SiteConfig
  setConfig: (c: SiteConfig) => void

  lastSaved: Date | null
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<StoreProduct[]>(
    initialProducts.map((p) => ({ ...p, active: true }))
  )
  const [categories, setCategories] = useState<StoreCategory[]>(initialCategories)
  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [content, setContent] = useState<SiteContent>(initialContent)
  const [config, setConfig] = useState<SiteConfig>(initialConfig)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const touch = () => setLastSaved(new Date())

  const addProduct = useCallback((p: StoreProduct) => {
    setProducts((prev) => [...prev, p])
    touch()
  }, [])

  const updateProduct = useCallback((p: StoreProduct) => {
    setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)))
    touch()
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((x) => x.id !== id))
    touch()
  }, [])

  const addCategory = useCallback((c: StoreCategory) => {
    setCategories((prev) => [...prev, c])
    touch()
  }, [])

  const updateCategory = useCallback((c: StoreCategory) => {
    setCategories((prev) => prev.map((x) => (x.id === c.id ? c : x)))
    touch()
  }, [])

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((x) => x.id !== id))
    touch()
  }, [])

  const updateBanner = useCallback((b: Banner) => {
    setBanners((prev) => prev.map((x) => (x.id === b.id ? b : x)))
    touch()
  }, [])

  const wrappedSetContent = useCallback((c: SiteContent) => {
    setContent(c)
    touch()
  }, [])

  const wrappedSetConfig = useCallback((c: SiteConfig) => {
    setConfig(c)
    touch()
  }, [])

  const wrappedSetProducts = useCallback((p: StoreProduct[]) => {
    setProducts(p)
    touch()
  }, [])

  const wrappedSetCategories = useCallback((c: StoreCategory[]) => {
    setCategories(c)
    touch()
  }, [])

  return (
    <StoreContext.Provider
      value={{
        products,
        setProducts: wrappedSetProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        categories,
        setCategories: wrappedSetCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        banners,
        updateBanner,
        content,
        setContent: wrappedSetContent,
        config,
        setConfig: wrappedSetConfig,
        lastSaved,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within a StoreProvider")
  return ctx
}
