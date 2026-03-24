"use client"

import { useState, useMemo } from "react"
import { Search, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { products, categories, type CategoryId, type Product } from "@/lib/products"

export function DeliveryCatalog() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<CategoryId>("todas")
  const { addItem, setIsCartOpen, totalItems } = useCart()

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesCategory =
        activeCategory === "todas" || product.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, activeCategory])

  const pizzas = filteredProducts.filter((p) => p.category === "pizzas")
  const bebidas = filteredProducts.filter((p) => p.category === "bebidas")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddItem = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
    })
  }

  return (
    <section className="py-8 sm:py-12 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Search and Filters - Sticky on mobile */}
        <div className="sticky top-16 z-30 bg-background pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:static">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className={
                    activeCategory === category.id
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0"
                      : "border-border hover:border-primary/50 flex-shrink-0"
                  }
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Cart FAB */}
        <div className="fixed bottom-6 right-6 z-40 md:hidden">
          <Button
            size="lg"
            className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-secondary text-secondary-foreground text-xs flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Button>
        </div>

        {/* Products Grid */}
        <div className="mt-8 space-y-12">
          {/* Pizzas Section */}
          {(activeCategory === "todas" || activeCategory === "pizzas") &&
            pizzas.length > 0 && (
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Pizzas
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {pizzas.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAdd={() => handleAddItem(product)}
                      formatPrice={formatPrice}
                    />
                  ))}
                </div>
              </div>
            )}

          {/* Bebidas Section */}
          {(activeCategory === "todas" || activeCategory === "bebidas") &&
            bebidas.length > 0 && (
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Bebidas
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {bebidas.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAdd={() => handleAddItem(product)}
                      formatPrice={formatPrice}
                    />
                  ))}
                </div>
              </div>
            )}

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No encontramos productos que coincidan con tu búsqueda.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory("todas")
                }}
              >
                Ver todos los productos
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function ProductCard({
  product,
  onAdd,
  formatPrice,
}: {
  product: Product
  onAdd: () => void
  formatPrice: (price: number) => string
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 flex flex-col hover:border-primary/30 transition-colors">
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg font-semibold text-foreground">
            {product.name}
          </h3>
          <span className="text-primary font-bold whitespace-nowrap">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {product.description}
        </p>
      </div>
      <Button
        onClick={onAdd}
        className="mt-4 w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        Agregar
      </Button>
    </div>
  )
}
