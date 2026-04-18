-- Insert or update banners for each section
INSERT INTO banners (key, image_url, overlay_text, overlay_button_text, overlay_button_link, created_at, updated_at)
VALUES
  (
    'home',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20principal%20inicio-sgLjm1UietPhuULpK6QoJWyqFRFgFj.jpg',
    'Pizza napolitana con identidad propia',
    'Pedir Delivery',
    '/pedido-delivery',
    NOW(),
    NOW()
  ),
  (
    'sobre-nosotros',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20nosotros%20%281%29-S5TVL5cAsT2OhrRLD5w5p32uM45UTX.jpg',
    'Nuestra historia',
    NULL,
    NULL,
    NOW(),
    NOW()
  ),
  (
    'contacto',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20contacto%20-mOHjngdnmrB7nJQdJtJvtjPuSjFijx.jpg',
    'Hablemos',
    NULL,
    NULL,
    NOW(),
    NOW()
  ),
  (
    'pedido-delivery',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20delivery%20%283%29-YIekcMePw6CwWhgh1SfnNmJ4vYKMdk.jpg',
    'Pedí tu Totore favorita',
    'Ver Menú',
    '/pedido-delivery',
    NOW(),
    NOW()
  )
ON CONFLICT (key) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  overlay_text = EXCLUDED.overlay_text,
  overlay_button_text = EXCLUDED.overlay_button_text,
  overlay_button_link = EXCLUDED.overlay_button_link,
  updated_at = NOW();
