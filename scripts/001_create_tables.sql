-- Create admin users table
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text default 'admin',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create categories table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  slug text not null unique,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null,
  category_id uuid not null references public.categories(id) on delete cascade,
  image text,
  active boolean default true,
  order_index integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create banners table
create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  image_url text,
  overlay_text text,
  overlay_button_text text,
  overlay_button_link text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create content table (for home page texts)
create table if not exists public.content (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create config table (WhatsApp, address, hours, etc)
create table if not exists public.config (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text,
  type text default 'string',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on all tables
alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.banners enable row level security;
alter table public.content enable row level security;
alter table public.config enable row level security;

-- Admin users policies
create policy "Admin users can view all admins" on public.admin_users for select using (true);
create policy "Admin users can insert admin" on public.admin_users for insert with check (auth.uid() is not null);
create policy "Admin users can update own profile" on public.admin_users for update using (auth.uid() = id);

-- Categories policies (public read, admin write)
create policy "Anyone can view categories" on public.categories for select using (true);
create policy "Admins can insert categories" on public.categories for insert with check (
  exists (select 1 from public.admin_users where id = auth.uid())
);
create policy "Admins can update categories" on public.categories for update using (
  exists (select 1 from public.admin_users where id = auth.uid())
);
create policy "Admins can delete categories" on public.categories for delete using (
  exists (select 1 from public.admin_users where id = auth.uid())
);

-- Products policies (public read, admin write)
create policy "Anyone can view products" on public.products for select using (true);
create policy "Admins can insert products" on public.products for insert with check (
  exists (select 1 from public.admin_users where id = auth.uid())
);
create policy "Admins can update products" on public.products for update using (
  exists (select 1 from public.admin_users where id = auth.uid())
);
create policy "Admins can delete products" on public.products for delete using (
  exists (select 1 from public.admin_users where id = auth.uid())
);

-- Banners policies (public read, admin write)
create policy "Anyone can view banners" on public.banners for select using (true);
create policy "Admins can insert banners" on public.banners for insert with check (
  exists (select 1 from public.admin_users where id = auth.uid())
);
create policy "Admins can update banners" on public.banners for update using (
  exists (select 1 from public.admin_users where id = auth.uid())
);
create policy "Admins can delete banners" on public.banners for delete using (
  exists (select 1 from public.admin_users where id = auth.uid())
);

-- Content policies (public read, admin write)
create policy "Anyone can view content" on public.content for select using (true);
create policy "Admins can insert content" on public.content for insert with check (
  exists (select 1 from public.admin_users where id = auth.uid())
);
create policy "Admins can update content" on public.content for update using (
  exists (select 1 from public.admin_users where id = auth.uid())
);
create policy "Admins can delete content" on public.content for delete using (
  exists (select 1 from public.admin_users where id = auth.uid())
);

-- Config policies (public read, admin write)
create policy "Anyone can view config" on public.config for select using (true);
create policy "Admins can insert config" on public.config for insert with check (
  exists (select 1 from public.admin_users where id = auth.uid())
);
create policy "Admins can update config" on public.config for update using (
  exists (select 1 from public.admin_users where id = auth.uid())
);
create policy "Admins can delete config" on public.config for delete using (
  exists (select 1 from public.admin_users where id = auth.uid())
);
