-- Insert categories first
INSERT INTO categories (label, slug) VALUES 
('Pizzas', 'pizzas'),
('Bebidas', 'bebidas')
ON CONFLICT DO NOTHING;

-- Get the category IDs (assuming they're in order)
WITH cats AS (
  SELECT id, slug FROM categories WHERE slug IN ('pizzas', 'bebidas')
),
pizza_cat AS (SELECT id FROM cats WHERE slug = 'pizzas'),
drink_cat AS (SELECT id FROM cats WHERE slug = 'bebidas')

-- Insert pizzas
INSERT INTO products (name, description, price, category_id, image, active, order_index) 
SELECT name, description, price, 
  CASE WHEN category = 'pizzas' THEN (SELECT id FROM pizza_cat) ELSE (SELECT id FROM drink_cat) END,
  image, true, order_index
FROM (VALUES
  ('Pizza Margherita', 'Mozzarella fresca, tomate y albahaca', 890, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/margherita-5XPFK7q8Z1qR9vD2mN3oL4p5.jpg', 1),
  ('Pizza Pepperoni', 'Mozzarella, salsa de tomate y pepperoni', 950, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pepperoni-2aB4cDeFgHiJ5kLmN6oPqRsT.jpg', 2),
  ('Pizza 4 Quesos', 'Mozzarella, gorgonzola, parmesano y brie', 1050, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4quesos-8uVwXyZ1aBcDeFgHiJkLmNoP.jpg', 3),
  ('Pizza Hawaiana', 'Jamón, piña, mozzarella', 980, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hawaiana-3qRsTuVwXyZ1aBcDeFgHiJkL.jpg', 4),
  ('Pizza BBQ', 'Carne, cebolla, salsa BBQ', 1020, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bbq-9mNoPqRsTuVwXyZ1aBcDeFgH.jpg', 5),
  ('Pizza Vegetariana', 'Pimiento, cebolla, champiñones, tomate', 850, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vegetariana-1iJkLmNoPqRsTuVwXyZ1aBcD.jpg', 6),
  ('Pizza Especial Totore', 'Jamón, champiñones, huevo, mozzarella', 1100, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/especial-6eFgHiJkLmNoPqRsTuVwXyZ1.jpg', 7),
  ('Pizza Fugazza', 'Cebolla, mozzarella, oregano', 780, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fugazza-4aBcDeFgHiJkLmNoPqRsTuVw.jpg', 8),
  ('Pizza Caprese', 'Tomate, mozzarella di bufala, albahaca', 1000, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/caprese-7XyZ1aBcDeFgHiJkLmNoPqRs.jpg', 9),
  ('Pizza Carnes', 'Jamón, chorizo, carne molida, tocino', 1080, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/carnes-2TuVwXyZ1aBcDeFgHiJkLmNo.jpg', 10),
  ('Pizza Siciliana', 'Salsa, mozzarella, cebolla, oliva negra', 920, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/siciliana-5PqRsTuVwXyZ1aBcDeFgHiJk.jpg', 11),
  ('Pizza Focaccia', 'Pan crujiente, aceite, romero', 650, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/focaccia-8LmNoPqRsTuVwXyZ1aBcDeF.jpg', 12),
  ('Coca Cola 2L', 'Bebida refrescante clásica', 320, 'bebidas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coca-1gHiJkLmNoPqRsTuVwXyZ1aB.jpg', 13),
  ('Fanta Naranja 2L', 'Bebida refrescante de naranja', 280, 'bebidas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fanta-4cDeFgHiJkLmNoPqRsTuVwXy.jpg', 14),
  ('Sprite 2L', 'Bebida refrescante de limón', 280, 'bebidas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sprite-6Z1aBcDeFgHiJkLmNoPqRsTu.jpg', 15),
  ('Agua Mineral 1.5L', 'Agua natural purificada', 150, 'bebidas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agua-3VwXyZ1aBcDeFgHiJkLmNoPq.jpg', 16),
  ('Cerveza Artesanal 500ml', 'Cerveza negra, sabor completo', 450, 'bebidas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cerveza-7Rs TuVwXyZ1aBcDeFgHiJkLmN.jpg', 17),
  ('Jugo Natural Naranja 1L', 'Jugo fresco de naranja exprimida', 380, 'bebidas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jugo-2oPqRsTuVwXyZ1aBcDeFgHiJ.jpg', 18),
  ('Horchata Casera 1L', 'Bebida tradicional argentina', 320, 'bebidas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/horchata-5kLmNoPqRsTuVwXyZ1aBcDe.jpg', 19),
  ('Té Helado 1L', 'Té fresco con hielo', 200, 'bebidas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/te-9FgHiJkLmNoPqRsTuVwXyZ1.jpg', 20)
) AS t(name, description, price, category, image, order_index)
ON CONFLICT DO NOTHING;
