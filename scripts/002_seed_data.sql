-- Insert default categories
insert into public.categories (label, slug) values
  ('Pizzas', 'pizzas'),
  ('Bebidas', 'bebidas')
on conflict (slug) do nothing;

-- Insert banners
insert into public.banners (key, image_url, overlay_text, overlay_button_text, overlay_button_link) values
  ('hero', '/images/hero-pizza.jpg', 'Pizzeria TOTORE', 'Pedir Ahora', '/pedido-delivery'),
  ('favorites', '/images/favorites-banner.jpg', 'Nuestros Favoritos', 'Descubrir', '/pedido-delivery'),
  ('promos', '/images/promos-banner.jpg', 'Oferta Especial', 'Ver Más', '/pedido-delivery')
on conflict (key) do nothing;

-- Insert default content
insert into public.content (key, value) values
  ('home_badge', '🍕 Bienvenido a TOTORE'),
  ('home_title', 'Pizzas Artesanales Italianas'),
  ('home_subtitle', 'Frescas, deliciosas y hechas con ingredientes premium'),
  ('experience_1_title', 'Ingredientes Frescos'),
  ('experience_1_text', 'Utilizamos solo ingredientes premium directamente de Italia'),
  ('experience_2_title', 'Horno de Leña'),
  ('experience_2_text', 'Cocidas en nuestro auténtico horno de leña'),
  ('experience_3_title', 'Entrega Rápida'),
  ('experience_3_text', 'Recibe tu pizza en minutos, siempre caliente'),
  ('footer_about', 'TOTORE es una pizzería artesanal dedicada a traerte la auténtica experiencia italiana.')
on conflict (key) do nothing;

-- Insert default config
insert into public.config (key, value, type) values
  ('whatsapp_number', '+54 9 11 1234-5678', 'string'),
  ('address', 'Av. Principal 123, Buenos Aires, Argentina', 'string'),
  ('hours', 'Lun-Dom: 12:00 - 23:00', 'string'),
  ('instagram', 'https://instagram.com/totore', 'string'),
  ('email', 'contacto@totore.com', 'string')
on conflict (key) do nothing;
