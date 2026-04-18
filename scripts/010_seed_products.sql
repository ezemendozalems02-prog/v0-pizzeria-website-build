-- Insert products (pizzas and drinks)
INSERT INTO products (id, name, price, description, category, image, active, order_index, created_at, updated_at) VALUES
-- Pizzas
('muzzarella', 'Muzzarella', 14000, 'Salsa de tomate, extra muzza, orégano y aceitunas verdes.', 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/products/muzzarella-EJ3qR2pK4nL9mO5pQ6rS7t.jpg', true, 1, now(), now()),
('margherita', 'Margherita', 14500, 'Salsa de tomate, fior di latte y albahaca fresca.', 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/products/margherita-U8vW9xY0zA1bC2dE3fG4h.jpg', true, 2, now(), now()),
('fugazzeta', 'Fugazzeta', 14000, 'Mozzarella, cebolla blanca, cebolla morada y toque de provolone.', 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/products/fugazzeta-I5jK6lM7nO8pQ9rS0tU1v.jpg', true, 3, now(), now()),
('jamon-morron', 'Jamón y Morrón', 15500, 'Salsa de tomate, mozzarella, jamón, morrones asados y aceitunas.', 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/products/jamon-morron-W2xY3zA4bC5dE6fG7hI8j.jpg', true, 4, now(), now()),
('quattro-formaggi', 'Quattro Formaggi', 15000, 'Mozzarella, parmesano, provolone y queso azul.', 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/products/quattro-formaggi-K9lM0nO1pQ2rS3tU4vW5x.jpg', true, 5, now(), now()),
('pepperoni', 'Pepperoni', 15000, 'Salsa de tomate, mozzarella, pepperoni y miel picante.', 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/products/pepperoni-Y6zA7bC8dE9fG0hI1jK2l.jpg', true, 6, now(), now()),
('capricciosa', 'Capricciosa', 15500, 'Salsa de tomate, mozzarella, hongos, alcauciles, jamón y aceitunas negras.', 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/products/capricciosa-M3nO4pQ5rS6tU7vW8xY9z.jpg', true, 7, now(), now()),
('bianca', 'Bianca', 15000, 'Crema de parmesano, mozzarella, queso ahumado, papas, romero y ajo confitado.', 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/products/bianca-A0bB1cC2dD3eE4fF5gG6h.jpg', true, 8, now(), now()),
('mortazza', 'Mortazza', 16000, 'Salsa de tomate, fior di latte, mortadela con pistachos, ricota y pesto.', 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/products/mortazza-I7jJ8kK9lL0mM1nN2oO3p.jpg', true, 9, now(), now()),
('pastrami', 'Pastrami', 16500, 'Salsa de tomate, mozzarella, pastrón, pepinillos y miel mostaza.', 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/products/pastrami-Q4rR5sS6tT7uU8vV9wW0x.jpg', true, 10, now(), now()),
('pomodorina', 'Pomodorina', 15000, 'Salsa de tomate, mozzarella, cebolla morada, cherry y cilantro.', 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/products/pomodorina-Y1zA2bB3cC4dD5eE6fF7g.jpg', true, 11, now(), now()),
('carbonara', 'Carbonara', 16000, 'Crema de parmesano, mozzarella, panceta, huevo y pimienta negra.', 'pizzas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/products/carbonara-H8iI9jJ0kK1lL2mM3nN4o.jpg', true, 12, now(), now()),
-- Bebidas
('agua', 'Agua', 3000, 'Con o sin gas.', 'bebidas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/products/agua-P5qQ6rR7sS8tT9uU0vV1w.jpg', true, 13, now(), now()),
('aquarius', 'Aquarius', 3000, 'Bebida refrescante de pomelo o naranja.', 'bebidas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/products/aquarius-X2yY3zA4bB5cC6dD7eE8f.jpg', true, 14, now(), now()),
('coca-cola', 'Coca Cola', 3500, 'Común o Zero.', 'bebidas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/products/coca-cola-G9hH0iI1jJ2kK3lL4mM5n.jpg', true, 15, now(), now()),
('sprite', 'Sprite', 3500, 'Común o Zero.', 'bebidas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/products/sprite-O6pP7qQ8rR9sS0tT1uU2v.jpg', true, 16, now(), now()),
('heineken-330', 'Cerveza Heineken 330cc', 4500, 'Cerveza lager premium holandesa.', 'bebidas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/products/heineken-330-W3xX4yY5zA6bB7cC8dD9e.jpg', true, 17, now(), now()),
('peroni-330', 'Cerveza Peroni 330cc', 7000, 'Cerveza italiana premium.', 'bebidas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/products/peroni-330-F0gG1hH2iI3jJ4kK5lL6m.jpg', true, 18, now(), now()),
('peroni-660', 'Cerveza Peroni 660cc', 11000, 'Cerveza italiana premium, tamaño grande.', 'bebidas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/products/peroni-660-N7oO8pP9qQ0rR1sS2tT3u.jpg', true, 19, now(), now())
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  active = EXCLUDED.active,
  updated_at = now();
