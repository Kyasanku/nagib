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
| `/artwork/[slug]` | Detail page: images, description, buy box (digital + print) with Flutterwave checkout |
| `/animations` · `/animations/[slug]` | Grid + watch page (MP4 / YouTube / Vimeo) |
| `/marketplace` | Available originals & prints |
| `/courses` · `/courses/[slug]` | Course catalogue + paywalled watch (free previews, enrolment-gated) |
| `/commissions` | Offerings, process, and the commission request form |
| `/support` | Donation stub (coming soon) |
| `/checkout/status` | Post-payment success / failure + fulfilment (download / watch / shipping) |
| `/about` · `/contact` | Bio & business inquiries |

**Admin** — served at **`/studio`** (a private, login-gated path)
| Route | Capabilities |
|---|---|
| `/studio` | Overview — stats, recent requests, quick actions |
| `/studio/artworks` | Upload / edit / delete; digital & print prices + toggles, status, digital file |
| `/studio/animations` | Add animation previews / video links, set status |
| `/studio/courses` | Create courses + lessons (with free previews), pricing, status |
| `/studio/orders` | All purchases; revenue; mark prints **shipped** |
| `/studio/categories` | Create & edit categories (become homepage rows + gallery filters) |
| `/studio/collections` | Group pieces into named collections |
| `/studio/commissions` | Move requests through New → Reviewing → Accepted → In Progress → Completed / Rejected |
| `/studio/featured` | Manage the homepage hero + New Releases row |
| `/studio/profile` | Edit artist bio, avatar, contact & socials |
| `/studio/login` | Supabase email/password auth (or straight-through in demo mode) |

---

## 🚀 Getting started

```bash
npm install
npm run dev          # http://localhost:3000  (runs on sample data)
```

The admin dashboard lives at **`/studio`** (login at `/studio/login`). In demo mode it opens
straight in. Edits update the UI live but don't persist until Supabase is connected.

```bash
npm run build && npm start   # production build
```

---

## 🔌 Connect Supabase (go live)

1. **Create a project** at [supabase.com](https://supabase.com).

2. **Run the SQL.** In the Supabase **SQL Editor**:
   - Fresh project → run [`supabase/schema.sql`](supabase/schema.sql) (includes everything:
     portfolio + commerce + courses + donations, RLS, storage buckets).
   - Already ran the v1 schema → just run [`supabase/migrations/0002_commerce.sql`](supabase/migrations/0002_commerce.sql).
   - Optional starter content: [`supabase/seed.sql`](supabase/seed.sql).

3. **Add environment variables** (locally in `.env.local`, and on **Vercel → Settings →
   Environment Variables**). Copy from [`.env.example`](.env.example):
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server-only, never commit
   NEXT_PUBLIC_BASE_URL=https://your-domain.com      # used for payment redirects
   ```
   Supabase keys are under **Project Settings → API**.

4. **Create the artist login.** In **Authentication → Users → Add user**, create an
   email/password account. That's the login at `/studio/login`. Public sign-ups are off —
   only the artist signs in. Once a real user exists, the middleware guards `/studio`.

5. **Redeploy** (Vercel) or **restart** (`npm run dev`). The app reads/writes live data
   automatically — no code changes needed.

---

## 💳 Payments — Flutterwave

Checkout is server-driven and verified by webhook, so amounts can't be tampered with from the
browser. Currency is **UGX** (Flutterwave supports it).

1. **Add keys** (from Flutterwave dashboard → **Settings → API Keys** — use **TEST** keys first)
   to `.env.local` / Vercel:
   ```bash
   FLW_SECRET_KEY=FLWSECK_TEST-xxxxx
   NEXT_PUBLIC_FLW_PUBLIC_KEY=FLWPUBK_TEST-xxxxx
   FLW_WEBHOOK_HASH=some-long-random-string
   ```

2. **Set the webhook.** Flutterwave dashboard → **Settings → Webhooks**:
   - URL: `https://your-domain.com/api/flutterwave/webhook`
   - Secret hash: the **same** value as `FLW_WEBHOOK_HASH`.

3. **How the flow works:**
   - Buyer picks **Digital** or **Print** (or enrols in a **Course**) → `POST /api/checkout`
     creates a `pending` order (price read from the DB) and returns a Flutterwave hosted link.
   - After paying, Flutterwave redirects to `/api/payment/callback`, which verifies the
     transaction and fulfils the order, then shows `/checkout/status`.
   - The **webhook** (`/api/flutterwave/webhook`) is the authoritative fallback and re-verifies
     every event before granting anything. Fulfilment is idempotent.
   - **Digital** → download served via `/api/deliverables/[orderId]` (signed URL from the
     private `deliverables` bucket). **Print** → order marked paid + the piece set to `sold`;
     ship it, then mark **shipped** in `/studio/orders`. **Course** → a `course_enrollment` is
     created and the buyer gets a watch link.

Until keys are present, checkout returns a friendly "payments not configured yet" notice and
nothing is charged.

### Digital & print pricing
Each artwork has independent **digital** and **print** prices with per-format toggles (set in
`/studio/artworks`). Print checkout collects a shipping address. Upload the digital deliverable
to the private `deliverables` bucket and paste its path into the artwork's *Digital file URL*.

### Courses
Create courses + lessons in `/studio/courses`; mark some lessons as **free previews**. Buyers
pay once for lifetime access. Access is granted via an enrolment link (`/courses/[slug]?e=…`).
Course videos accept MP4, YouTube or Vimeo URLs.

### Donations (stub)
`/support` collects donation *intent* but does **not** charge yet — it's wired to switch on
later (a `donations` table already exists).

---

## 🗄 Database

Tables created by `schema.sql`:

`profiles` · `artwork_categories` · `artworks` · `artwork_images` · `animations` ·
`collections` · `collection_items` · `commission_requests` · `purchase_inquiries` ·
`homepage_featured_items` · `courses` · `course_lessons` · `course_enrollments` ·
`orders` · `donations`

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
