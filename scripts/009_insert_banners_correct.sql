-- Insert banners with correct column names (key, image_url, overlay_text, etc.)
INSERT INTO banners (key, image_url, overlay_text, overlay_button_text, overlay_button_link)
VALUES
  (
    'home',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20principal%20inicio-sgLjm1UietPhuULpK6QoJWyqFRFgFj.jpg',
    'Home - Principal',
    'Pedir Delivery',
    '/pedido-delivery'
  ),
  (
    'sobre-nosotros',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20nosotros%20%281%29-S5TVL5cAsT2OhrRLD5w5p32uM45UTX.jpg',
    'Sobre Nosotros',
    NULL,
    NULL
  ),
  (
    'contacto',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20contacto%20-mOHjngdnmrB7nJQdJtJvtjPuSjFijx.jpg',
    'Contacto',
    NULL,
    NULL
  ),
  (
    'pedido-delivery',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20delivery%20%283%29-YIekcMePw6CwWhgh1SfnNmJ4vYKMdk.jpg',
    'Pedido Delivery',
    NULL,
    NULL
  )
ON CONFLICT (key) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  overlay_text = EXCLUDED.overlay_text,
  overlay_button_text = EXCLUDED.overlay_button_text,
  overlay_button_link = EXCLUDED.overlay_button_link,
  updated_at = now();
