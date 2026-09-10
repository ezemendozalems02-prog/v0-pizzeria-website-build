"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import { createClient } from "@/lib/supabase/client"

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
  slug: string
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
  shippingCost: number
}

// ─── Initial Data ─────────────────────────────────────────────────────────────

const initialCategories: StoreCategory[] = [
  { id: "efb0f5e5-c9c3-4273-84fc-b8e2ed0529a5", slug: "pizzas", label: "Pizzas" },
  { id: "4208fb61-6dea-486c-bfe7-5376e8812c84", slug: "bebidas", label: "Bebidas" },
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
    title: "PIZZAS",
    subtitle: "",
    buttonText: "Ver Menú",
    buttonLink: "/pedido-delivery",
    image: "/images/favorites-banner.jpg",
  },
  {
    id: "promos",
    title: "NO-PIZZAS",
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
  visitTitle: "Vení a visitarnos",
}

const initialConfig: SiteConfig = {
  whatsapp: "+5491234567890",
  address: "Balbín 2916, El Palomar, Buenos Aires",
  hours: "Lun-Dom 20:00-00:00",
  instagram: "https://www.instagram.com/totorepizza/",
  footerText: "Pizza estilo italiana en Ciudad Jardín",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.7627!2d-58.5939368!3d-34.6019617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb85232ffb9d7%3A0xd6df09dedb7a8f01!2sAv.+Dr.+Ricardo+Balb%C3%ADn+2916%2C+B1684+El+Palomar%2C+Provincia+de+Buenos+Aires!5e0!3m2!1ses!2sar!4v1746000000000",
  shippingCost: 1000,
}

// ─── Store Context ────────────────────────────────────────────────────────────

interface StoreContextType {
  products: StoreProduct[]
  categories: StoreCategory[]
  banners: Banner[]
  content: SiteContent
  config: SiteConfig
  loading: boolean
  addProduct: (product: StoreProduct) => void
  updateProduct: (product: StoreProduct) => void
  deleteProduct: (id: string) => void
  addCategory: (category: StoreCategory) => void
  updateCategory: (category: StoreCategory) => void
  deleteCategory: (id: string) => void
  setConfig: (config: SiteConfig) => Promise<void>
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [categories, setCategories] = useState<StoreCategory[]>(initialCategories)
  const [banners] = useState<Banner[]>(initialBanners)
  const [content, setContent] = useState<SiteContent>(initialContent)
  const [config, setConfigState] = useState<SiteConfig>(initialConfig)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  // Cargar productos, categorías y contenido desde Supabase AL MONTAR
  useEffect(() => {
    loadCategories()
    loadProducts()
    loadContent()
    loadConfig()
    subscribeToProductsChanges()
    subscribeToContentChanges()
    subscribeToConfigChanges()
  }, [])

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, slug, label")
        .order("label", { ascending: true })

      if (error) {
        console.error("[Store] Error loading categories:", error)
        return
      }

      const mapped: StoreCategory[] = (data || []).map((c: any) => ({
        id: c.id,
        label: c.label,
        slug: c.slug,
      }))
      setCategories(mapped)
    } catch (err) {
      console.error("[Store] Unexpected error loading categories:", err)
    }
  }

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("order_index", { ascending: true })

      if (error) {
        console.error("[Store] Error loading products:", error)
        return
      }

      // Usar category_id directamente (UUID real de la DB)
      const mappedProducts: StoreProduct[] = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description,
        category: p.category_id ?? "",
        image: p.image,
        active: p.active,
      }))

      setProducts(mappedProducts)
    } catch (err) {
      console.error("[Store] Unexpected error loading products:", err)
    } finally {
      setLoading(false)
    }
  }

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("id", "home")
        .single()

      if (error) {
        console.error("[Store] Error loading content:", error)
        return
      }

      if (data) {
        const mappedContent: SiteContent = {
          heroTitle: data.hero_title,
          heroSubtitle: data.hero_subtitle,
          heroBadge: data.hero_badge,
          experienceTitle: data.experience_title,
          experienceCards: data.experience_cards,
          uniqueTitle: data.unique_title,
          visitTitle: data.visit_title,
        }
        setContent(mappedContent)
        console.log("[Store] Content loaded from DB")
      }
    } catch (err) {
      console.error("[Store] Unexpected error loading content:", err)
    }
  }

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from("site_config")
        .select("*")
        .eq("id", "main")
        .single()

      if (error) {
        console.error("[Store] Error loading config:", error)
        return
      }

      if (data) {
        setConfigState({
          whatsapp: data.whatsapp,
          address: data.address,
          hours: data.hours,
          instagram: data.instagram,
          footerText: data.footer_text,
          mapEmbedUrl: data.map_embed_url,
          shippingCost: Number(data.shipping_cost) || 0,
        })
        console.log("[Store] Config loaded from DB")
      }
    } catch (err) {
      console.error("[Store] Unexpected error loading config:", err)
    }
  }

  const subscribeToProductsChanges = () => {
    const subscription = supabase
      .channel("products-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        (payload: any) => {
          console.log("[Store] Realtime products update detected:", payload.eventType)
          loadProducts()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const subscribeToContentChanges = () => {
    const subscription = supabase
      .channel("content-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_content",
        },
        (payload: any) => {
          console.log("[Store] Realtime content update detected:", payload.eventType)
          loadContent()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const subscribeToConfigChanges = () => {
    const subscription = supabase
      .channel("config-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_config",
        },
        (payload: any) => {
          console.log("[Store] Realtime config update detected:", payload.eventType)
          loadConfig()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const addProduct = useCallback((product: StoreProduct) => {
    setProducts((prev) => [...prev, product])
  }, [])

  const updateProduct = useCallback((product: StoreProduct) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)))
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const addCategory = useCallback((category: StoreCategory) => {
    setCategories((prev) => [...prev, category])
  }, [])

  const updateCategory = useCallback((category: StoreCategory) => {
    setCategories((prev) => prev.map((c) => (c.id === category.id ? category : c)))
  }, [])

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const setConfig = useCallback(
    async (newConfig: SiteConfig) => {
      const { error } = await supabase.from("site_config").upsert(
        {
          id: "main",
          whatsapp: newConfig.whatsapp,
          address: newConfig.address,
          hours: newConfig.hours,
          instagram: newConfig.instagram,
          footer_text: newConfig.footerText,
          map_embed_url: newConfig.mapEmbedUrl,
          shipping_cost: newConfig.shippingCost,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )

      if (error) {
        console.error("[Store] Error saving config:", error)
        throw error
      }

      setConfigState(newConfig)
    },
    [supabase]
  )

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        banners,
        content,
        config,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        setConfig,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within StoreProvider")
  }
  return context
}
