// Sample data powers the entire experience with zero configuration.
// When Supabase env vars are present, the data layer prefers live data
// and only falls back here. Images are hosted on Unsplash (art/illustration).

import type {
  Animation,
  Artwork,
  Category,
  Collection,
  CommissionRequest,
  Profile,
} from "./types";

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const sampleCategories: Category[] = [
  { id: "c1", name: "Featured Art", slug: "featured-art", description: "Signature pieces, hand-picked.", sort_order: 1 },
  { id: "c2", name: "Character Art", slug: "character-art", description: "Original characters and design work.", sort_order: 2 },
  { id: "c3", name: "Sketches", slug: "sketches", description: "Raw studies and quick captures.", sort_order: 3 },
  { id: "c4", name: "Digital Painting", slug: "digital-painting", description: "Painterly digital compositions.", sort_order: 4 },
  { id: "c5", name: "Illustration", slug: "illustration", description: "Narrative and editorial illustration.", sort_order: 5 },
];

const now = "2026-06-01T10:00:00Z";

export const sampleArtworks: Artwork[] = [
  {
    id: "a1", title: "Ember Requiem", slug: "ember-requiem",
    description: "A lone figure suspended in a field of dying light. Painted over three weeks in layered glazes, Ember Requiem explores the quiet moment before a memory fades.",
    category_id: "c4", price: 5200000, currency: "UGX", status: "available",
    medium: "Digital painting", dimensions: "5400 × 7200 px", year_created: 2026,
    featured_image_url: img("photo-1549490349-8643362247b5"), is_new: true, created_at: now, updated_at: now,
  },
  {
    id: "a2", title: "The Cartographer's Dream", slug: "cartographers-dream",
    description: "An imagined city folded from paper and starlight. Ink and gouache, later finished digitally.",
    category_id: "c5", price: 3600000, currency: "UGX", status: "available",
    medium: "Ink & digital", dimensions: "4000 × 5000 px", year_created: 2026,
    featured_image_url: img("photo-1578321272176-b7bbc0679853"), is_new: true, created_at: now, updated_at: now,
  },
  {
    id: "a3", title: "Saffron", slug: "saffron",
    description: "Character study of a desert wanderer. Part of an ongoing series of original characters.",
    category_id: "c2", price: 2300000, currency: "UGX", status: "sold",
    medium: "Digital", dimensions: "3600 × 4800 px", year_created: 2025,
    featured_image_url: img("photo-1543857778-c4a1a3e0b2eb"), created_at: now, updated_at: now,
  },
  {
    id: "a4", title: "Grey Morning Study", slug: "grey-morning-study",
    description: "A twenty-minute graphite study. Unframed original available.",
    category_id: "c3", price: 680000, currency: "UGX", status: "available",
    medium: "Graphite on paper", dimensions: "A4", year_created: 2026,
    featured_image_url: img("photo-1513364776144-60967b0f800f"), is_new: true, created_at: now, updated_at: now,
  },
  {
    id: "a5", title: "Neon Hymn", slug: "neon-hymn",
    description: "The city breathes in magenta. A love letter to late nights and reflective streets.",
    category_id: "c4", price: 4100000, currency: "UGX", status: "reserved",
    medium: "Digital painting", dimensions: "6000 × 4000 px", year_created: 2025,
    featured_image_url: img("photo-1550684848-fac1c5b4e853"), created_at: now, updated_at: now,
  },
  {
    id: "a6", title: "Foxglove", slug: "foxglove",
    description: "A woodland spirit rendered in soft botanical tones. Original character concept.",
    category_id: "c2", price: 2750000, currency: "UGX", status: "available",
    medium: "Digital", dimensions: "4000 × 5200 px", year_created: 2026,
    featured_image_url: img("photo-1502691876148-a84978e59af8"), created_at: now, updated_at: now,
  },
  {
    id: "a7", title: "Tidewalker", slug: "tidewalker",
    description: "Concept piece for a personal narrative project. Ink wash and digital light.",
    category_id: "c5", price: 3300000, currency: "UGX", status: "available",
    medium: "Ink & digital", dimensions: "4500 × 6000 px", year_created: 2025,
    featured_image_url: img("photo-1517816743773-6e0fd518b4a6"), created_at: now, updated_at: now,
  },
  {
    id: "a8", title: "Portrait in Rust", slug: "portrait-in-rust",
    description: "Commissioned portrait exploring warm oxidised palettes.",
    category_id: "c4", price: 4800000, currency: "UGX", status: "sold",
    medium: "Digital painting", dimensions: "4000 × 5000 px", year_created: 2025,
    featured_image_url: img("photo-1578926375605-eaf7559b1458"), created_at: now, updated_at: now,
  },
  {
    id: "a9", title: "Quiet Machines", slug: "quiet-machines",
    description: "Mechanical study in graphite — the beauty of things that no longer run.",
    category_id: "c3", price: 780000, currency: "UGX", status: "available",
    medium: "Graphite on paper", dimensions: "A3", year_created: 2026,
    featured_image_url: img("photo-1531913764164-f85c52e6e654"), is_new: true, created_at: now, updated_at: now,
  },
  {
    id: "a10", title: "Marigold Procession", slug: "marigold-procession",
    description: "Festival illustration bursting with warmth, movement and colour.",
    category_id: "c5", price: 3800000, currency: "UGX", status: "available",
    medium: "Digital", dimensions: "6000 × 4000 px", year_created: 2026,
    featured_image_url: img("photo-1547891654-e66ed7ebb968"), created_at: now, updated_at: now,
  },
  {
    id: "a11", title: "Hollow Crown", slug: "hollow-crown",
    description: "Antagonist design for an original fantasy series.",
    category_id: "c2", price: 3200000, currency: "UGX", status: "available",
    medium: "Digital", dimensions: "4000 × 5600 px", year_created: 2025,
    featured_image_url: img("photo-1519681393784-d120267933ba"), created_at: now, updated_at: now,
  },
  {
    id: "a12", title: "Salt & Static", slug: "salt-and-static",
    description: "Experimental mixed-media study, scanned and reworked.",
    category_id: "c3", price: 900000, currency: "UGX", status: "hidden",
    medium: "Mixed media", dimensions: "A4", year_created: 2026,
    featured_image_url: img("photo-1541701494587-cb58502866ab"), created_at: now, updated_at: now,
  },
];

export const sampleAnimations: Animation[] = [
  {
    id: "n1", title: "Lantern", slug: "lantern",
    description: "A 12-second loop following a paper lantern as it drifts through a sleeping town. Hand-animated, 24fps.",
    thumbnail_url: img("photo-1523712999610-f77fbcfc3843"),
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "0:12", status: "published", created_at: now, updated_at: now,
  },
  {
    id: "n2", title: "First Light", slug: "first-light",
    description: "Animated study of dawn breaking over water. Frame-by-frame colour keys.",
    thumbnail_url: img("photo-1500534623283-312aade485b7"),
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: "0:20", status: "published", created_at: now, updated_at: now,
  },
  {
    id: "n3", title: "Foxglove — Turnaround", slug: "foxglove-turnaround",
    description: "Character turnaround animation for the Foxglove design.",
    thumbnail_url: img("photo-1502691876148-a84978e59af8"),
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: "0:08", status: "published", created_at: now, updated_at: now,
  },
  {
    id: "n4", title: "Tide (WIP)", slug: "tide-wip",
    description: "Work-in-progress test for an upcoming short.",
    thumbnail_url: img("photo-1505142468610-359e7d316be0"),
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    duration: "0:15", status: "published", created_at: now, updated_at: now,
  },
];

export const sampleCollections: Collection[] = [
  {
    id: "col1", title: "The Wanderers", slug: "the-wanderers",
    description: "An evolving series of original characters who travel between imagined worlds.",
    cover_image_url: img("photo-1543857778-c4a1a3e0b2eb"),
    artwork_ids: ["a3", "a6", "a11"], created_at: now,
  },
  {
    id: "col2", title: "Nocturnes", slug: "nocturnes",
    description: "Paintings made after dark, about the dark.",
    cover_image_url: img("photo-1550684848-fac1c5b4e853"),
    artwork_ids: ["a1", "a5", "a7"], created_at: now,
  },
  {
    id: "col3", title: "Paper Studies", slug: "paper-studies",
    description: "Graphite and ink works on paper — the daily practice.",
    cover_image_url: img("photo-1513364776144-60967b0f800f"),
    artwork_ids: ["a4", "a9", "a12"], created_at: now,
  },
];

export const sampleCommissions: CommissionRequest[] = [
  {
    id: "cm1", client_name: "Priya Anand", client_email: "priya@example.com", phone_number: "+1 555 0192",
    commission_type: "Character Design", budget: "$800–1200", deadline: "2026-08-15",
    description: "Two original characters for a tabletop campaign — full colour, front and back.",
    reference_images: null, status: "new", created_at: now, updated_at: now,
  },
  {
    id: "cm2", client_name: "Marco Díaz", client_email: "marco@example.com", phone_number: null,
    commission_type: "Portrait", budget: "$400", deadline: "2026-07-20",
    description: "Anniversary portrait of my partner and me in your painterly style.",
    reference_images: null, status: "reviewing", created_at: now, updated_at: now,
  },
  {
    id: "cm3", client_name: "Studio Halcyon", client_email: "hello@halcyon.example", phone_number: "+44 20 7946 0000",
    commission_type: "Short Animation", budget: "$5000+", deadline: "2026-10-01",
    description: "A 15-second animated logo sting for our brand refresh.",
    reference_images: null, status: "in_progress", created_at: now, updated_at: now,
  },
];

export const sampleProfile: Profile = {
  id: "p1",
  display_name: "Nagibu Semwanga",
  tagline: "Kampala-based artist drawing quiet worlds & the characters who wander them.",
  bio: "I'm an illustrator and digital painter working out of Kampala, Uganda, moving between traditional graphite and digital light. My work lives at the seam between memory and invention — imagined cities, wandering characters, and the small quiet moments that hold a whole story. Lately I've been teaching my drawings to move, one frame at a time.\n\nI take on a limited number of commissions each season and sell both originals and archival prints. If a piece speaks to you, reach out — I'd love to know where it lands.",
  avatar_url: img("photo-1507003211169-0a1dd7228f2d", 600),
  location: "Kampala, Uganda",
  email: "studio@nagibusemwanga.art",
  instagram: "nagibu.draws",
  twitter: "nagibudraws",
  behance: "nagibusemwanga",
};
