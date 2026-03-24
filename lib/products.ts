export interface Product {
  id: string
  name: string
  price: number
  description: string
  category: "pizzas" | "bebidas"
  image: string
}

export const products: Product[] = [
  // Pizzas
  {
    id: "muzzarella",
    name: "Muzzarella",
    price: 14000,
    description: "Salsa de tomate, extra muzza, orégano y aceitunas verdes.",
    category: "pizzas",
    image: "/images/products/muzzarella.jpg",
  },
  {
    id: "margherita",
    name: "Margherita",
    price: 14500,
    description: "Salsa de tomate, fior di latte y albahaca fresca.",
    category: "pizzas",
    image: "/images/products/margherita.jpg",
  },
  {
    id: "fugazzeta",
    name: "Fugazzeta",
    price: 14000,
    description: "Mozzarella, cebolla blanca, cebolla morada y toque de provolone.",
    category: "pizzas",
    image: "/images/products/fugazzeta.jpg",
  },
  {
    id: "jamon-morron",
    name: "Jamón y Morrón",
    price: 15500,
    description: "Salsa de tomate, mozzarella, jamón, morrones asados y aceitunas.",
    category: "pizzas",
    image: "/images/products/jamon-morron.jpg",
  },
  {
    id: "quattro-formaggi",
    name: "Quattro Formaggi",
    price: 15000,
    description: "Mozzarella, parmesano, provolone y queso azul.",
    category: "pizzas",
    image: "/images/products/quattro-formaggi.jpg",
  },
  {
    id: "pepperoni",
    name: "Pepperoni",
    price: 15000,
    description: "Salsa de tomate, mozzarella, pepperoni y miel picante.",
    category: "pizzas",
    image: "/images/products/pepperoni.jpg",
  },
  {
    id: "capricciosa",
    name: "Capricciosa",
    price: 15500,
    description: "Salsa de tomate, mozzarella, hongos, alcauciles, jamón y aceitunas negras.",
    category: "pizzas",
    image: "/images/products/capricciosa.jpg",
  },
  {
    id: "bianca",
    name: "Bianca",
    price: 15000,
    description: "Crema de parmesano, mozzarella, queso ahumado, papas, romero y ajo confitado.",
    category: "pizzas",
    image: "/images/products/bianca.jpg",
  },
  {
    id: "mortazza",
    name: "Mortazza",
    price: 16000,
    description: "Salsa de tomate, fior di latte, mortadela con pistachos, ricota y pesto.",
    category: "pizzas",
    image: "/images/products/mortazza.jpg",
  },
  {
    id: "pastrami",
    name: "Pastrami",
    price: 16500,
    description: "Salsa de tomate, mozzarella, pastrón, pepinillos y miel mostaza.",
    category: "pizzas",
    image: "/images/products/pastrami.jpg",
  },
  {
    id: "pomodorina",
    name: "Pomodorina",
    price: 15000,
    description: "Salsa de tomate, mozzarella, cebolla morada, cherry y cilantro.",
    category: "pizzas",
    image: "/images/products/pomodorina.jpg",
  },
  {
    id: "carbonara",
    name: "Carbonara",
    price: 16000,
    description: "Crema de parmesano, mozzarella, panceta, huevo y pimienta negra.",
    category: "pizzas",
    image: "/images/products/carbonara.jpg",
  },
  // Bebidas
  {
    id: "agua",
    name: "Agua",
    price: 3000,
    description: "Con o sin gas.",
    category: "bebidas",
    image: "/images/products/agua.jpg",
  },
  {
    id: "aquarius",
    name: "Aquarius",
    price: 3000,
    description: "Bebida refrescante de pomelo o naranja.",
    category: "bebidas",
    image: "/images/products/aquarius.jpg",
  },
  {
    id: "coca-cola",
    name: "Coca Cola",
    price: 3500,
    description: "Común o Zero.",
    category: "bebidas",
    image: "/images/products/coca-cola.jpg",
  },
  {
    id: "sprite",
    name: "Sprite",
    price: 3500,
    description: "Común o Zero.",
    category: "bebidas",
    image: "/images/products/sprite.jpg",
  },
  {
    id: "heineken-330",
    name: "Cerveza Heineken 330cc",
    price: 4500,
    description: "Cerveza lager premium holandesa.",
    category: "bebidas",
    image: "/images/products/heineken-330.jpg",
  },
  {
    id: "peroni-330",
    name: "Cerveza Peroni 330cc",
    price: 7000,
    description: "Cerveza italiana premium.",
    category: "bebidas",
    image: "/images/products/peroni-330.jpg",
  },
  {
    id: "peroni-660",
    name: "Cerveza Peroni 660cc",
    price: 11000,
    description: "Cerveza italiana premium, tamaño grande.",
    category: "bebidas",
    image: "/images/products/peroni-660.jpg",
  },
]

export const categories = [
  { id: "todas", label: "Todas" },
  { id: "pizzas", label: "Pizzas" },
  { id: "bebidas", label: "Bebidas" },
] as const

export type CategoryId = (typeof categories)[number]["id"]
