// Unified read API for the public site. Every page imports from here.
// When Supabase is configured it reads live data; otherwise it serves the
// sample dataset so the full experience is available with zero setup.

import { createServerSupabase } from "./supabase/server";
import {
  sampleAnimations,
  sampleArtworks,
  sampleCategories,
  sampleCollections,
  sampleProfile,
} from "./sampleData";
import type {
  Animation,
  Artwork,
  Category,
  Collection,
  Profile,
  Row,
} from "./types";

function withCategory(a: Artwork, cats: Category[]): Artwork {
  return { ...a, category: cats.find((c) => c.id === a.category_id) ?? null };
}

// ── Artworks ───────────────────────────────────────────────
export async function getArtworks(opts?: { includeHidden?: boolean }): Promise<Artwork[]> {
  const supabase = await createServerSupabase();
  if (supabase) {
    const { data } = await supabase
      .from("artworks")
      .select("*, category:artwork_categories(*)")
      .order("created_at", { ascending: false });
    if (data) {
      return (data as Artwork[]).filter(
        (a) => opts?.includeHidden || a.status !== "hidden"
      );
    }
  }
  const cats = sampleCategories;
  return sampleArtworks
    .filter((a) => opts?.includeHidden || a.status !== "hidden")
    .map((a) => withCategory(a, cats));
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  const supabase = await createServerSupabase();
  if (supabase) {
    const { data } = await supabase
      .from("artworks")
      .select("*, category:artwork_categories(*), images:artwork_images(*)")
      .eq("slug", slug)
      .single();
    if (data) return data as Artwork;
  }
  const found = sampleArtworks.find((a) => a.slug === slug);
  return found ? withCategory(found, sampleCategories) : null;
}

// ── Categories ─────────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
  const supabase = await createServerSupabase();
  if (supabase) {
    const { data } = await supabase
      .from("artwork_categories")
      .select("*")
      .order("sort_order");
    if (data) return data as Category[];
  }
  return sampleCategories;
}

// ── Netflix-style rows ─────────────────────────────────────
export async function getBrowseRows(): Promise<Row[]> {
  const [artworks, categories] = await Promise.all([
    getArtworks(),
    getCategories(),
  ]);

  const rows: Row[] = [];

  const newReleases = artworks.filter((a) => a.is_new);
  if (newReleases.length)
    rows.push({ title: "New Releases", slug: "new-releases", items: newReleases });

  for (const cat of categories) {
    const items = artworks.filter((a) => a.category_id === cat.id);
    if (items.length) rows.push({ title: cat.name, slug: cat.slug, items });
  }

  const sold = artworks.filter((a) => a.status === "sold");
  if (sold.length) rows.push({ title: "From the Archive · Sold", slug: "sold", items: sold });

  return rows;
}

// ── Animations ─────────────────────────────────────────────
export async function getAnimations(): Promise<Animation[]> {
  const supabase = await createServerSupabase();
  if (supabase) {
    const { data } = await supabase
      .from("animations")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });
    if (data) return data as Animation[];
  }
  return sampleAnimations.filter((a) => a.status === "published");
}

export async function getAnimationBySlug(slug: string): Promise<Animation | null> {
  const supabase = await createServerSupabase();
  if (supabase) {
    const { data } = await supabase
      .from("animations")
      .select("*")
      .eq("slug", slug)
      .single();
    if (data) return data as Animation;
  }
  return sampleAnimations.find((a) => a.slug === slug) ?? null;
}

// ── Collections ────────────────────────────────────────────
export async function getCollections(): Promise<Collection[]> {
  const supabase = await createServerSupabase();
  if (supabase) {
    const { data } = await supabase
      .from("collections")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) return data as Collection[];
  }
  return sampleCollections;
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const collections = await getCollections();
  return collections.find((c) => c.slug === slug) ?? null;
}

// ── Profile ────────────────────────────────────────────────
export async function getProfile(): Promise<Profile> {
  const supabase = await createServerSupabase();
  if (supabase) {
    const { data } = await supabase.from("profiles").select("*").limit(1).single();
    if (data) return data as Profile;
  }
  return sampleProfile;
}

// ── Hero / featured ────────────────────────────────────────
export async function getFeaturedArtwork(): Promise<Artwork> {
  const artworks = await getArtworks();
  return artworks.find((a) => a.is_new) ?? artworks[0];
}
