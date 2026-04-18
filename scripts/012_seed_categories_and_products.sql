-- ============================================================
-- 012_seed_categories_and_products.sql
-- Idempotent: safe to run multiple times (uses ON CONFLICT)
-- Schema:
--   categories: id (uuid PK), label (text UNIQUE), slug (text UNIQUE)
--   products:   id (uuid PK), name, description, price (numeric),
--               category_id (uuid FK → categories.id), image (text),
--               active (bool), order_index (int)
-- ============================================================

-- Step 1: Upsert categories
INSERT INTO categories (label, slug)
VALUES
  ('Pizzas',  'pizzas'),
  ('Bebidas', 'bebidas')
ON CONFLICT (slug) DO UPDATE
  SET label = EXCLUDED.label;

-- Step 2: Clear stale products to avoid duplicates on re-run
TRUNCATE products RESTART IDENTITY CASCADE;

-- Step 3: Insert 20 products referencing category UUIDs by slug
INSERT INTO products (name, description, price, category_id, image, active, order_index)
SELECT
  p.name, p.description, p.price,
  c.id AS category_id,
  p.image, p.active, p.order_index
FROM (VALUES
  -- PIZZAS (12)
  ('Margherita',       'Salsa de tomate, mozzarella fresca y albahaca.',                                        1800, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pizza_marg-u0CMnNgFe3hq4tISL2T3gXv5LQb7Bc.jpg',      true, 1),
  ('Napolitana',       'Tomate, mozzarella, anchoas y aceitunas negras.',                                       2100, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pizza_napo-Fx0gSGNFLEDPHOGw8UlUhpAnlFAyBt.jpg',      true, 2),
  ('Fugazzeta',        'Cebolla caramelizada y mozzarella abundante, sin salsa.',                               1900, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pizza_fuga-FiGn0H8TwpTQgMCt9i8fEJxkqYFnQz.jpg',      true, 3),
  ('Calabresa',        'Salsa de tomate, mozzarella y chorizo calabrese picante.',                              2200, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pizza_cala-Sd3ALcKJyvLtPECSTkYV3RX8z5ZcKf.jpg',      true, 4),
  ('Cuatro Quesos',    'Blend de mozzarella, gorgonzola, parmesano y provolone.',                               2400, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pizza_4que-eJl2HMCHvQBkVimgFMYDdtMt7Yj6KL.jpg',      true, 5),
  ('Prosciutto',       'Salsa de tomate, mozzarella y jamón crudo.',                                           2500, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pizza_pros-s3BUwDqPa1LlVCCkrHrFSoX5eIiPaY.jpg',      true, 6),
  ('Rúcula y Parmesano','Base de aceite de oliva, mozzarella, rúcula fresca y láminas de parmesano.',          2600, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pizza_ruca-w6Uh7Np0FaxHqKjvOnPSmBdcX9TlEs.jpg',      true, 7),
  ('Pollo y Champiñones','Salsa blanca, mozzarella, pollo asado y champiñones salteados.',                     2400, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pizza_poll-ClZ2Jkp0XovBhQgUwDmN1Ry7TsFqHe.jpg',      true, 8),
  ('Verdura',          'Calabacín, morrones asados, berenjenas y mozzarella.',                                  2100, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pizza_verd-G8mJlTqPncBRLDsYvXAe0Fw4KZiOhU.jpg',      true, 9),
  ('Totore Especial',  'La firma de la casa: ingredientes secretos seleccionados del chef.',                    2800, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pizza_espe-R3qA9wXh2KpTMNvFCeUYdmG5LsIjlO.jpg',      true, 10),
  ('Americana',        'Salsa de tomate, mozzarella, panceta y huevo.',                                        2300, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pizza_amer-LmP8dNcKqBrIeZYxGuW6TjF0OwVsSh.jpg',      true, 11),
  ('Diavola',          'Salsa de tomate, mozzarella y salame picante con chili.',                               2200, 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pizza_diav-Nk7XsZtFbWoLRcQHmPyJ2iGpV9eUaD.jpg',      true, 12),
  -- BEBIDAS (8)
  ('Coca-Cola 500ml',  'Bebida gaseosa clásica bien fría.',                                                     700,  'bebidas','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coca_500-AiMnOqZ3BsLKWeVlCYTtPdUm8JXfRv.jpg',        true, 13),
  ('Coca-Cola 1.5L',   'Familiar para compartir en la mesa.',                                                  1100,  'bebidas','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coca_15-H4RuNfQlCpOsGDkYxWbvT7EjXmZeIa.jpg',         true, 14),
  ('Sprite 500ml',     'Gaseosa lima-limón refrescante.',                                                        700,  'bebidas','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sprite_500-Bs2JlMvNpOcQeXrKgTyWd9UAFiYhZu.jpg',     true, 15),
  ('Agua sin Gas 500ml','Agua mineral natural.',                                                                  500,  'bebidas','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agua_sg-Ep7KnTcWmBfXqRLyDsUzVi3OhJgYaP.jpg',        true, 16),
  ('Agua con Gas 500ml','Agua mineral con gas natural.',                                                          550,  'bebidas','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agua_cg-Qn8RoUvXpLmBzHiKsWtFd4CeJlYgNj.jpg',       true, 17),
  ('Jugo de Naranja',  'Jugo exprimido al momento, 100% natural.',                                               900,  'bebidas','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jugo_na-Vr5KoQwXpTcBsHlNyMiUzFd2EjAgYe.jpg',        true, 18),
  ('Cerveza 500ml',    'Cerveza rubia artesanal, bien fría.',                                                   1200,  'bebidas','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cerveza-Lp9MsUvYqBnCkWrGxTeZd7FiHaOjXN.jpg',        true, 19),
  ('Fernet con Coca',  'Fernet Branca con Coca-Cola, combinación clásica argentina.',                           1500,  'bebidas','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fernet-Jm4NpRqYwKcLoBsXtUzVe8GiDhFaWl.jpg',        true, 20)
) AS p(name, description, price, slug, image, active, order_index)
JOIN categories c ON c.slug = p.slug;
