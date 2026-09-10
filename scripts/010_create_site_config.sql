-- Create site_config table (whatsapp, address, hours, instagram, footer, map, shipping cost)
create table if not exists public.site_config (
  id text primary key default 'main',
  whatsapp text,
  address text,
  hours text,
  instagram text,
  footer_text text,
  map_embed_url text,
  shipping_cost numeric default 0,
  updated_at timestamp with time zone default now()
);

-- Seed default row (matches current in-app defaults)
insert into public.site_config (id, whatsapp, address, hours, instagram, footer_text, map_embed_url, shipping_cost)
values (
  'main',
  '+5491234567890',
  'Balbín 2916, El Palomar, Buenos Aires',
  'Lun-Dom 20:00-00:00',
  'https://www.instagram.com/totorepizza/',
  'Pizza estilo italiana en Ciudad Jardín',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.7627!2d-58.5939368!3d-34.6019617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb85232ffb9d7%3A0xd6df09dedb7a8f01!2sAv.+Dr.+Ricardo+Balb%C3%ADn+2916%2C+B1684+El+Palomar%2C+Provincia+de+Buenos+Aires!5e0!3m2!1ses!2sar!4v1746000000000',
  1000
)
on conflict (id) do nothing;

-- Enable RLS
alter table public.site_config enable row level security;

-- Anyone can read (needed for the public site to show shipping cost, whatsapp, etc.)
create policy "Anyone can view site_config" on public.site_config for select using (true);

-- Only logged-in admins can write
create policy "Authenticated users can insert site_config" on public.site_config
  for insert to authenticated with check (true);

create policy "Authenticated users can update site_config" on public.site_config
  for update to authenticated using (true) with check (true);
