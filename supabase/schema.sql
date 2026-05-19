-- BeGamers Store — Supabase Schema
-- Execute no SQL Editor do novo projeto

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ─── Categories ───────────────────────────────────────────
create table categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  parent_id   uuid references categories(id),
  image_url   text,
  description text,
  is_active   boolean default true,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- ─── Products ─────────────────────────────────────────────
create table products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text unique not null,
  description  text,
  brand        text,
  category_id  uuid references categories(id),
  price        numeric(10,2) not null,
  price_old    numeric(10,2),
  pix_discount numeric(3,2) default 0.10,
  installments int default 12,
  stock        int default 0,
  sku          text unique,
  weight       numeric(8,3),
  is_active    boolean default true,
  is_featured  boolean default false,
  tags         text[] default '{}',
  accent_color text default '#cc0000',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ─── Product Images ───────────────────────────────────────
create table product_images (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url        text not null,
  alt        text,
  sort_order int default 0,
  is_primary boolean default false
);

-- ─── Product Variants ─────────────────────────────────────
create table product_variants (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references products(id) on delete cascade,
  name           text not null,
  value          text not null,
  price_modifier numeric(10,2) default 0,
  stock          int default 0,
  sku            text
);

-- ─── Customers ────────────────────────────────────────────
create table customers (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  cpf        text unique,
  phone      text,
  birth_date date,
  created_at timestamptz default now()
);

-- ─── Addresses ────────────────────────────────────────────
create table addresses (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  label       text default 'Casa',
  recipient   text not null,
  cep         text not null,
  street      text not null,
  number      text not null,
  complement  text,
  district    text not null,
  city        text not null,
  state       char(2) not null,
  is_default  boolean default false,
  created_at  timestamptz default now()
);

-- ─── Carts ────────────────────────────────────────────────
create table carts (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  session_id  text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table cart_items (
  id         uuid primary key default gen_random_uuid(),
  cart_id    uuid not null references carts(id) on delete cascade,
  product_id uuid not null references products(id),
  variant_id uuid references product_variants(id),
  quantity   int not null default 1,
  price      numeric(10,2) not null,
  created_at timestamptz default now()
);

-- ─── Orders ───────────────────────────────────────────────
create sequence if not exists order_seq start 1;

create table orders (
  id              uuid primary key default gen_random_uuid(),
  order_number    text unique,
  customer_id     uuid references customers(id),
  address_id      uuid references addresses(id),
  status          text not null default 'pending'
    check (status in ('pending','paid','processing','shipped','delivered','cancelled','refunded')),
  payment_method  text,
  payment_status  text default 'pending',
  infinitepay_id  text,
  subtotal        numeric(10,2) not null,
  discount        numeric(10,2) default 0,
  shipping        numeric(10,2) default 0,
  total           numeric(10,2) not null,
  notes           text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id),
  variant_id uuid references product_variants(id),
  name       text not null,
  sku        text,
  quantity   int not null,
  price      numeric(10,2) not null,
  total      numeric(10,2) not null
);

-- ─── Reviews ──────────────────────────────────────────────
create table reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  customer_id uuid references customers(id),
  rating      int not null check (rating between 1 and 5),
  title       text,
  body        text,
  is_verified boolean default false,
  is_approved boolean default false,
  created_at  timestamptz default now()
);

-- ─── Wishlist ─────────────────────────────────────────────
create table wishlists (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  product_id  uuid not null references products(id) on delete cascade,
  created_at  timestamptz default now(),
  unique(customer_id, product_id)
);

-- ─── Coupons ──────────────────────────────────────────────
create table coupons (
  id         uuid primary key default gen_random_uuid(),
  code       text unique not null,
  type       text not null check (type in ('percent','fixed')),
  value      numeric(10,2) not null,
  min_order  numeric(10,2) default 0,
  max_uses   int,
  used_count int default 0,
  expires_at timestamptz,
  is_active  boolean default true,
  created_at timestamptz default now()
);

-- ─── Newsletter ───────────────────────────────────────────
create table newsletter (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  subscribed_at timestamptz default now()
);

-- ─── Admin Users ──────────────────────────────────────────
create table admin_users (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  name       text not null,
  role       text not null default 'editor'
    check (role in ('super_admin','admin','editor')),
  password_hash text not null,
  is_active  boolean default true,
  created_at timestamptz default now()
);

-- ─── Settings ─────────────────────────────────────────────
create table settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz default now()
);

insert into settings (key, value) values
  ('store_name', '"BeGamers Store"'),
  ('free_shipping_threshold', '299'),
  ('pix_discount', '0.10'),
  ('max_installments', '12');

-- ─── Functions & Triggers ─────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

create trigger carts_updated_at
  before update on carts
  for each row execute function update_updated_at();

create or replace function generate_order_number()
returns trigger language plpgsql as $$
begin
  new.order_number = 'BGS' || to_char(now(), 'YYYYMMDD') || lpad(nextval('order_seq')::text, 4, '0');
  return new;
end;
$$;

create trigger orders_number
  before insert on orders
  for each row execute function generate_order_number();

-- ─── RLS Policies ─────────────────────────────────────────

-- Products: público pode ler, só admin escreve
alter table products enable row level security;
create policy "products_select" on products for select using (is_active = true);

-- Categories: público pode ler
alter table categories enable row level security;
create policy "categories_select" on categories for select using (is_active = true);

-- Customers: só o próprio user
alter table customers enable row level security;
create policy "customers_own" on customers for all using (auth.uid() = id);

-- Addresses: só o próprio customer
alter table addresses enable row level security;
create policy "addresses_own" on addresses for all using (
  auth.uid() = customer_id
);

-- Carts: session ou user
alter table carts enable row level security;
create policy "carts_own" on carts for all using (
  auth.uid() = customer_id or customer_id is null
);

alter table cart_items enable row level security;
create policy "cart_items_own" on cart_items for all using (
  exists(select 1 from carts where carts.id = cart_id and (auth.uid() = carts.customer_id or carts.customer_id is null))
);

-- Orders: só o próprio customer
alter table orders enable row level security;
create policy "orders_own" on orders for select using (auth.uid() = customer_id);

-- Reviews: público lê aprovados, auth cria
alter table reviews enable row level security;
create policy "reviews_select" on reviews for select using (is_approved = true);
create policy "reviews_insert" on reviews for insert with check (auth.uid() = customer_id);

-- Wishlist
alter table wishlists enable row level security;
create policy "wishlist_own" on wishlists for all using (auth.uid() = customer_id);

-- Newsletter: insert público
alter table newsletter enable row level security;
create policy "newsletter_insert" on newsletter for insert with check (true);

-- ─── Storage Buckets ──────────────────────────────────────
-- Execute no dashboard: Storage > Create bucket
-- Bucket: "products" (public)
-- Bucket: "categories" (public)
-- Bucket: "general" (private)
