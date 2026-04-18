INSERT INTO banners (section, url, title) VALUES
  ('home', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20principal%20inicio-sgLjm1UietPhuULpK6QoJWyqFRFgFj.jpg', 'TOTORE fresco, auténtica'),
  ('about', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20nosotros%20%281%29-S5TVL5cAsT2OhrRLD5w5p32uM45UTX.jpg', 'Nosotros'),
  ('contact', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20contacto%20-mOHjngdnmrB7nJQdJtJvtjPuSjFijx.jpg', 'Contacto'),
  ('delivery', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20delivery%20%283%29-YIekcMePw6CwWhgh1SfnNmJ4vYKMdk.jpg', 'Delivery')
ON CONFLICT (section) DO UPDATE SET 
  url = EXCLUDED.url,
  title = EXCLUDED.title;
