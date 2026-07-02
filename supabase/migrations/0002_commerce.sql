-- ============================================================
--  MIGRATION 0002 — Commerce, Courses & Donations
--  Run this on a project that already has the v1 schema.
--  (Fresh projects get everything from schema.sql.)
--  Safe to run more than once.
-- ============================================================

-- ── Enums ───────────────────────────────────────────────────
do $$ begin
  create type course_status as enum ('published', 'draft', 'hidden');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('pending', 'paid', 'failed', 'shipped', 'refunded');
exception when duplicate_object then null; end $$;

-- ── artworks: digital vs print offering ─────────────────────
alter table artworks add column if not exists digital_price   numeric(12,2);
alter table artworks add column if not exists print_price      numeric(12,2);
alter table artworks add column if not exists allow_digital    boolean not null default true;
alter table artworks add column if not exists allow_print      boolean not null default false;
alter table artworks add column if not exists digital_file_url text;

-- Backfill digital_price from legacy price where missing.
update artworks set digital_price = price where digital_price is null and price is not null;

-- ── courses ─────────────────────────────────────────────────
create table if not exists courses (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  description   text,
  thumbnail_url text not null default '',
  price         numeric(12,2),
  currency      text not null default 'UGX',
  level         text,
  status        course_status not null default 'draft',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists course_lessons (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references courses(id) on delete cascade,
  title       text not null,
  description text,
  video_url   text not null default '',
  duration    text,
  sort_order  int not null default 0,
  is_preview  boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists course_lessons_course_idx on course_lessons(course_id);

create table if not exists course_enrollments (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references courses(id) on delete cascade,
  order_id    uuid,
  buyer_email text not null,
  created_at  timestamptz not null default now()
);
create index if not exists course_enrollments_course_idx on course_enrollments(course_id);
create index if not exists course_enrollments_email_idx on course_enrollments(buyer_email);

-- ── orders (artwork purchases + course purchases + donations) ─
create table if not exists orders (
  id                 uuid primary key default gen_random_uuid(),
  reference          text not null unique,           -- tx_ref sent to Flutterwave
  item_type          text not null check (item_type in ('artwork_digital','artwork_print','course','donation')),
  item_id            uuid,
  item_title         text not null default '',
  buyer_name         text not null default '',
  buyer_email        text not null default '',
  buyer_phone        text,
  amount             numeric(12,2) not null default 0,
  currency           text not null default 'UGX',
  status             order_status not null default 'pending',
  flw_transaction_id text,
  shipping_name      text,
  shipping_address   text,
  shipping_city      text,
  shipping_country   text,
  shipping_phone     text,
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_email_idx on orders(buyer_email);

-- ── donations (stub for now; fulfilled later) ───────────────
create table if not exists donations (
  id         uuid primary key default gen_random_uuid(),
  name       text,
  email      text,
  amount     numeric(12,2),
  currency   text not null default 'UGX',
  message    text,
  status     text not null default 'pending' check (status in ('pending','paid','failed')),
  created_at timestamptz not null default now()
);

-- ── updated_at triggers ─────────────────────────────────────
drop trigger if exists trg_courses_updated on courses;
create trigger trg_courses_updated before update on courses
  for each row execute function set_updated_at();

drop trigger if exists trg_orders_updated on orders;
create trigger trg_orders_updated before update on orders
  for each row execute function set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────
alter table courses            enable row level security;
alter table course_lessons     enable row level security;
alter table course_enrollments enable row level security;
alter table orders             enable row level security;
alter table donations          enable row level security;

-- Public can browse published courses & their lessons.
drop policy if exists "public read courses" on courses;
create policy "public read courses" on courses for select using (status = 'published');

drop policy if exists "public read lessons" on course_lessons;
create policy "public read lessons" on course_lessons for select using (true);

-- Orders / enrollments / donations are written ONLY by trusted server code
-- (service role, which bypasses RLS). No public read/write. Admins (authed)
-- get full access for the dashboard.
drop policy if exists "auth all courses" on courses;
create policy "auth all courses" on courses for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "auth all lessons" on course_lessons;
create policy "auth all lessons" on course_lessons for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "auth all enrollments" on course_enrollments;
create policy "auth all enrollments" on course_enrollments for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "auth all orders" on orders;
create policy "auth all orders" on orders for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "auth all donations" on donations;
create policy "auth all donations" on donations for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ── Storage buckets ─────────────────────────────────────────
-- course thumbnails: public. deliverables (digital artwork files): PRIVATE,
-- served to buyers via short-lived signed URLs from the server.
insert into storage.buckets (id, name, public) values
  ('course', 'course', true),
  ('deliverables', 'deliverables', false)
on conflict (id) do nothing;

drop policy if exists "public read course bucket" on storage.objects;
create policy "public read course bucket" on storage.objects for select
  using (bucket_id = 'course');

drop policy if exists "auth write course bucket" on storage.objects;
create policy "auth write course bucket" on storage.objects for insert to authenticated
  with check (bucket_id in ('course','deliverables'));

drop policy if exists "auth manage deliverables" on storage.objects;
create policy "auth manage deliverables" on storage.objects for select to authenticated
  using (bucket_id = 'deliverables');
