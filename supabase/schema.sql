-- ============================================================
--  ATELIER NOIR — Artist Portfolio, Marketplace & Commissions
--  Supabase / PostgreSQL schema
--
--  Run this in the Supabase SQL Editor (or via `supabase db push`).
--  It is idempotent-ish: safe to run on a fresh project.
-- ============================================================

create extension if not exists "pgcrypto";

-- ── Enums ───────────────────────────────────────────────────
do $$ begin
  create type artwork_status as enum ('available', 'sold', 'reserved', 'hidden');
exception when duplicate_object then null; end $$;

do $$ begin
  create type animation_status as enum ('published', 'draft', 'hidden');
exception when duplicate_object then null; end $$;

do $$ begin
  create type commission_status as enum ('new', 'reviewing', 'accepted', 'in_progress', 'completed', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type inquiry_status as enum ('new', 'responded', 'closed');
exception when duplicate_object then null; end $$;

-- ── Helper: auto-update updated_at ──────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ── profiles ────────────────────────────────────────────────
-- One row per artist. Linked to auth.users so the artist can log in.
create table if not exists profiles (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade,
  display_name text not null default 'Artist',
  tagline      text,
  bio          text,
  avatar_url   text,
  location     text,
  email        text,
  instagram    text,
  twitter      text,
  behance      text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── artwork_categories ──────────────────────────────────────
create table if not exists artwork_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- ── artworks ────────────────────────────────────────────────
create table if not exists artworks (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  slug               text not null unique,
  description        text,
  category_id        uuid references artwork_categories(id) on delete set null,
  price              numeric(10,2),
  currency           text not null default 'UGX',
  status             artwork_status not null default 'available',
  medium             text,
  dimensions         text,
  year_created       int,
  featured_image_url text not null default '',
  is_new             boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists artworks_category_idx on artworks(category_id);
create index if not exists artworks_status_idx on artworks(status);

-- ── artwork_images (additional images per artwork) ──────────
create table if not exists artwork_images (
  id         uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references artworks(id) on delete cascade,
  image_url  text not null,
  alt        text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists artwork_images_artwork_idx on artwork_images(artwork_id);

-- ── animations ──────────────────────────────────────────────
create table if not exists animations (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  description   text,
  thumbnail_url text not null default '',
  video_url     text not null default '',
  duration      text,
  status        animation_status not null default 'draft',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── collections ─────────────────────────────────────────────
create table if not exists collections (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  description     text,
  cover_image_url text not null default '',
  created_at      timestamptz not null default now()
);

-- ── collection_items (join) ─────────────────────────────────
create table if not exists collection_items (
  id            uuid primary key default gen_random_uuid(),
  collection_id uuid not null references collections(id) on delete cascade,
  artwork_id    uuid not null references artworks(id) on delete cascade,
  sort_order    int not null default 0,
  unique (collection_id, artwork_id)
);

-- ── commission_requests ─────────────────────────────────────
create table if not exists commission_requests (
  id               uuid primary key default gen_random_uuid(),
  client_name      text not null,
  client_email     text not null,
  phone_number     text,
  commission_type  text not null,
  budget           text,
  deadline         date,
  description      text not null,
  reference_images text[],
  status           commission_status not null default 'new',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists commissions_status_idx on commission_requests(status);

-- ── purchase_inquiries (marketplace leads) ──────────────────
create table if not exists purchase_inquiries (
  id         uuid primary key default gen_random_uuid(),
  artwork_id uuid references artworks(id) on delete set null,
  buyer_name text not null,
  buyer_email text not null,
  message    text,
  status     inquiry_status not null default 'new',
  created_at timestamptz not null default now()
);

-- ── homepage_featured_items ─────────────────────────────────
create table if not exists homepage_featured_items (
  id          uuid primary key default gen_random_uuid(),
  item_type   text not null check (item_type in ('artwork','animation','collection')),
  item_id     uuid not null,
  headline    text,
  subheadline text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- ── updated_at triggers ─────────────────────────────────────
drop trigger if exists trg_artworks_updated on artworks;
create trigger trg_artworks_updated before update on artworks
  for each row execute function set_updated_at();

drop trigger if exists trg_animations_updated on animations;
create trigger trg_animations_updated before update on animations
  for each row execute function set_updated_at();

drop trigger if exists trg_commissions_updated on commission_requests;
create trigger trg_commissions_updated before update on commission_requests
  for each row execute function set_updated_at();

drop trigger if exists trg_profiles_updated on profiles;
create trigger trg_profiles_updated before update on profiles
  for each row execute function set_updated_at();

-- ============================================================
--  ROW LEVEL SECURITY
--  Public site: anyone can READ published/visible content.
--  Writes (admin): only authenticated users.
--  Lead capture: anyone can INSERT commissions & inquiries.
-- ============================================================
alter table profiles                enable row level security;
alter table artwork_categories      enable row level security;
alter table artworks                enable row level security;
alter table artwork_images          enable row level security;
alter table animations              enable row level security;
alter table collections             enable row level security;
alter table collection_items        enable row level security;
alter table commission_requests     enable row level security;
alter table purchase_inquiries      enable row level security;
alter table homepage_featured_items enable row level security;

-- Public read policies
create policy "public read profiles"     on profiles                for select using (true);
create policy "public read categories"   on artwork_categories      for select using (true);
create policy "public read artworks"     on artworks                for select using (status <> 'hidden');
create policy "public read images"       on artwork_images          for select using (true);
create policy "public read animations"   on animations              for select using (status = 'published');
create policy "public read collections"  on collections             for select using (true);
create policy "public read colitems"     on collection_items        for select using (true);
create policy "public read featured"     on homepage_featured_items for select using (true);

-- Public insert for lead capture (commissions & purchase inquiries)
create policy "public create commissions" on commission_requests for insert with check (true);
create policy "public create inquiries"   on purchase_inquiries   for insert with check (true);

-- Authenticated (admin) full access
create policy "auth all profiles"    on profiles                for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth all categories"  on artwork_categories      for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth all artworks"    on artworks                for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth all images"      on artwork_images          for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth all animations"  on animations              for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth all collections" on collections             for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth all colitems"    on collection_items        for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth all commissions" on commission_requests     for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth all inquiries"   on purchase_inquiries      for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth all featured"    on homepage_featured_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
--  STORAGE BUCKETS
--  Public-read buckets for imagery. Uploads restricted to
--  authenticated users via policies below.
-- ============================================================
insert into storage.buckets (id, name, public)
values
  ('artwork', 'artwork', true),
  ('animation', 'animation', true),
  ('collection', 'collection', true),
  ('profile', 'profile', true)
on conflict (id) do nothing;

-- Anyone can read from these public buckets
create policy "public read storage"
  on storage.objects for select
  using (bucket_id in ('artwork','animation','collection','profile'));

-- Only authenticated users can upload / modify / delete
create policy "auth write storage"
  on storage.objects for insert to authenticated
  with check (bucket_id in ('artwork','animation','collection','profile'));

create policy "auth update storage"
  on storage.objects for update to authenticated
  using (bucket_id in ('artwork','animation','collection','profile'));

create policy "auth delete storage"
  on storage.objects for delete to authenticated
  using (bucket_id in ('artwork','animation','collection','profile'));
