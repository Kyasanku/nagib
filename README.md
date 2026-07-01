# Atelier Noir — Artist Portfolio, Marketplace & Commission Platform

A cinematic, Netflix-style gallery experience for an artist who draws, paints digitally,
illustrates, and is beginning to animate. Visitors **discover** work in horizontal browsing
rows, **watch** short animations, **acquire** available pieces, and **commission** custom work.
A full **studio dashboard** lets the artist run everything.

> **Runs with zero setup.** The whole app ships with a rich sample dataset, so you can
> `npm run dev` and explore the complete experience immediately. Wire up Supabase whenever
> you're ready to make it live.

Built with **Next.js (App Router) · TypeScript · Tailwind CSS · Supabase**.

---

## ✨ Design

Bright, minimal "paper studio" aesthetic — a warm off-white canvas, near-black type, a single
energetic tangerine accent, and soft floating colour blobs. A modern-yet-classic serif
(**Instrument Serif**) carries the legacy feel, a clean grotesque (**Hanken Grotesk**) handles
body text, and a mono (**Space Mono**) adds the techy touch on labels, tags and prices. Rounded
cards, generous space, a cute cinematic hero, and staggered reveals. Prices are shown in
**UGX**. The artwork is always the hero; the UI stays out of its way.

---

## 🗺 Pages

**Public**
| Route | Purpose |
|---|---|
| `/` | Cinematic hero + Netflix-style browsing rows, animations strip, collections, commission CTA |
| `/gallery` | Full grid with category + availability filters |
| `/artwork/[slug]` | Detail page: images, description, price, medium, dimensions, purchase inquiry |
| `/animations` | Grid of short animations |
| `/animations/[slug]` | Watch page (MP4 / YouTube / Vimeo) |
| `/marketplace` | Available originals & prints, trust strip, inquiry flow |
| `/commissions` | Offerings, process, and the commission request form |
| `/about` | Artist bio, facts, selected work |
| `/contact` | Business / collaboration inquiries |

**Admin** (`/admin`)
| Route | Capabilities |
|---|---|
| `/admin` | Overview — stats, recent requests, quick actions |
| `/admin/artworks` | Upload / edit / delete, set price, currency, medium, dimensions, status (available·sold·reserved·hidden) |
| `/admin/animations` | Add animation previews / video links, set status |
| `/admin/categories` | Create & edit categories (become homepage rows + gallery filters) |
| `/admin/collections` | Group pieces into named collections |
| `/admin/commissions` | View requests; move through New → Reviewing → Accepted → In Progress → Completed / Rejected |
| `/admin/featured` | Manage the homepage hero + New Releases row |
| `/admin/profile` | Edit artist bio, avatar, contact & socials |
| `/admin/login` | Supabase email/password auth (or straight-through in demo mode) |

---

## 🚀 Getting started

```bash
npm install
npm run dev          # http://localhost:3000  (runs on sample data)
```

Visit `/admin` — in demo mode it opens straight into the dashboard. Edits update the UI live
but don't persist until Supabase is connected.

```bash
npm run build && npm start   # production build
```

---

## 🔌 Connect Supabase (go live)

1. **Create a project** at [supabase.com](https://supabase.com).

2. **Run the schema.** In the Supabase **SQL Editor**, paste and run:
   - [`supabase/schema.sql`](supabase/schema.sql) — tables, enums, RLS policies, storage buckets
   - [`supabase/seed.sql`](supabase/seed.sql) — *(optional)* starter content

3. **Add environment variables.** Copy `.env.example` → `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server-only, never commit
   ```
   Find these under **Project Settings → API**.

4. **Create the artist login.** In **Authentication → Users → Add user**, create an
   email/password account. That's your admin login at `/admin/login`. (Email signups are
   disabled for the public — only you sign in.)

5. **Restart** `npm run dev`. The app now reads and writes live data automatically —
   no code changes needed.

---

## 🗄 Database

Tables created by `schema.sql`:

`profiles` · `artwork_categories` · `artworks` · `artwork_images` · `animations` ·
`collections` · `collection_items` · `commission_requests` · `purchase_inquiries` ·
`homepage_featured_items`

Highlights:
- **artworks** — `title, slug, description, category_id, price, currency,
  status(available|sold|reserved|hidden), medium, dimensions, year_created,
  featured_image_url, is_new, created_at, updated_at`
- **animations** — `title, slug, description, thumbnail_url, video_url, duration,
  status(published|draft|hidden), created_at, updated_at`
- **commission_requests** — `client_name, client_email, phone_number, commission_type,
  budget, deadline, description, reference_images[], status(new|reviewing|accepted|
  in_progress|completed|rejected), created_at, updated_at`

**Row Level Security** is enabled everywhere:
- Public can **read** visible/published content.
- Public can **insert** commission requests & purchase inquiries (lead capture).
- Only **authenticated** users (the artist) can create/update/delete content.

---

## 🖼 Storage

`schema.sql` creates four **public-read** buckets — `artwork`, `animation`, `collection`,
`profile` — with policies that allow uploads only from authenticated users. The admin
`ImageUpload` component uploads straight to these buckets and stores the public URL. You can
also paste an external image URL anywhere instead of uploading.

`next.config.mjs` already whitelists `*.supabase.co` and `images.unsplash.com` for
`next/image`.

---

## 🧱 Project structure

```
src/
  app/
    (site)/            # public pages (share Navbar + Footer via route-group layout)
      page.tsx         # home
      gallery/ artwork/[slug]/ animations/ animations/[slug]/
      marketplace/ commissions/ about/ contact/
    admin/             # dashboard (own layout + auth)
      page.tsx artworks/ animations/ categories/ collections/
      commissions/ featured/ profile/ login/
    api/               # inquiries + commissions POST handlers
  components/          # Navbar, Footer, Hero, BrowseRow, ArtworkCard, VideoPlayer, forms…
    admin/             # sidebar, modal, image upload, page chrome
    ui/                # Field primitives (Input, Textarea, Select, Label)
  lib/
    data.ts            # unified read API (Supabase → sample-data fallback)
    adminStore.tsx     # client store for dashboard CRUD (Supabase or in-memory demo)
    sampleData.ts      # zero-config content
    types.ts utils.ts
    supabase/          # browser + server + middleware clients, config
supabase/
  schema.sql seed.sql
```

---

## 🧭 How the data layer works

Every read goes through `src/lib/data.ts`; every admin write goes through
`src/lib/adminStore.tsx`. Both check whether Supabase env vars are present:

- **Configured** → live Supabase queries (with RLS).
- **Not configured** → the bundled sample dataset (reads) / in-memory state (writes).

This is why the app is fully explorable before any backend exists, and needs **no code
changes** to switch to live data.

---

## 🔭 Built to grow

The schema and structure are intentionally clean so you can later add:
- **Payments** — Stripe on top of `purchase_inquiries` / a future `orders` table.
- **Buyer accounts** — Supabase Auth already wired; add public sign-up + RLS by `user_id`.
- **Subscriptions & premium/private content** — add a `visibility`/`tier` column and gate
  reads by membership.
- **Print-on-demand, editions, waitlists** — extend `artworks` / add join tables.

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Lint |
