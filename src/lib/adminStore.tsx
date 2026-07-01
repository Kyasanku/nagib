"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "./supabase/client";
import { isSupabaseConfigured } from "./supabase/config";
import {
  sampleAnimations,
  sampleArtworks,
  sampleCategories,
  sampleCollections,
  sampleCommissions,
  sampleProfile,
} from "./sampleData";
import type {
  Animation,
  Artwork,
  Category,
  Collection,
  CommissionRequest,
  Profile,
} from "./types";

interface AdminState {
  configured: boolean;
  loading: boolean;
  artworks: Artwork[];
  categories: Category[];
  animations: Animation[];
  collections: Collection[];
  commissions: CommissionRequest[];
  profile: Profile;
  saveArtwork: (a: Partial<Artwork>) => Promise<void>;
  deleteArtwork: (id: string) => Promise<void>;
  saveAnimation: (a: Partial<Animation>) => Promise<void>;
  deleteAnimation: (id: string) => Promise<void>;
  saveCategory: (c: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  saveCollection: (c: Partial<Collection>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  setCommissionStatus: (id: string, status: CommissionRequest["status"]) => Promise<void>;
  saveProfile: (p: Partial<Profile>) => Promise<void>;
}

const Ctx = createContext<AdminState | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);

export function AdminStoreProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [artworks, setArtworks] = useState<Artwork[]>(sampleArtworks);
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [animations, setAnimations] = useState<Animation[]>(sampleAnimations);
  const [collections, setCollections] = useState<Collection[]>(sampleCollections);
  const [commissions, setCommissions] = useState<CommissionRequest[]>(sampleCommissions);
  const [profile, setProfile] = useState<Profile>(sampleProfile);

  const supabase = useMemo(() => createClient(), []);

  // Load live data when configured.
  useEffect(() => {
    let active = true;
    (async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const [aw, cat, an, col, cm, pr] = await Promise.all([
        supabase.from("artworks").select("*, category:artwork_categories(*)").order("created_at", { ascending: false }),
        supabase.from("artwork_categories").select("*").order("sort_order"),
        supabase.from("animations").select("*").order("created_at", { ascending: false }),
        supabase.from("collections").select("*").order("created_at", { ascending: false }),
        supabase.from("commission_requests").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").limit(1).single(),
      ]);
      if (!active) return;
      if (aw.data) setArtworks(aw.data as Artwork[]);
      if (cat.data) setCategories(cat.data as Category[]);
      if (an.data) setAnimations(an.data as Animation[]);
      if (col.data) setCollections(col.data as Collection[]);
      if (cm.data) setCommissions(cm.data as CommissionRequest[]);
      if (pr.data) setProfile(pr.data as Profile);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [supabase]);

  // ── Artworks ──
  const saveArtwork = useCallback(async (a: Partial<Artwork>) => {
    const now = new Date().toISOString();
    if (supabase) {
      const payload = { ...a, updated_at: now };
      delete (payload as Record<string, unknown>).category;
      if (a.id) {
        await supabase.from("artworks").update(payload).eq("id", a.id);
      } else {
        await supabase.from("artworks").insert({ ...payload, created_at: now });
      }
      const { data } = await supabase.from("artworks").select("*, category:artwork_categories(*)").order("created_at", { ascending: false });
      if (data) setArtworks(data as Artwork[]);
      return;
    }
    setArtworks((prev) => {
      const cat = categories.find((c) => c.id === a.category_id) ?? null;
      if (a.id) return prev.map((x) => (x.id === a.id ? { ...x, ...a, category: cat, updated_at: now } : x));
      return [{ id: uid(), currency: "UGX", status: "available", created_at: now, updated_at: now, featured_image_url: "", title: "", slug: "", ...a, category: cat } as Artwork, ...prev];
    });
  }, [supabase, categories]);

  const deleteArtwork = useCallback(async (id: string) => {
    if (supabase) await supabase.from("artworks").delete().eq("id", id);
    setArtworks((prev) => prev.filter((x) => x.id !== id));
  }, [supabase]);

  // ── Animations ──
  const saveAnimation = useCallback(async (a: Partial<Animation>) => {
    const now = new Date().toISOString();
    if (supabase) {
      const payload = { ...a, updated_at: now };
      if (a.id) await supabase.from("animations").update(payload).eq("id", a.id);
      else await supabase.from("animations").insert({ ...payload, created_at: now });
      const { data } = await supabase.from("animations").select("*").order("created_at", { ascending: false });
      if (data) setAnimations(data as Animation[]);
      return;
    }
    setAnimations((prev) => {
      if (a.id) return prev.map((x) => (x.id === a.id ? { ...x, ...a, updated_at: now } : x));
      return [{ id: uid(), status: "published", created_at: now, updated_at: now, title: "", slug: "", thumbnail_url: "", video_url: "", duration: "", description: "", ...a } as Animation, ...prev];
    });
  }, [supabase]);

  const deleteAnimation = useCallback(async (id: string) => {
    if (supabase) await supabase.from("animations").delete().eq("id", id);
    setAnimations((prev) => prev.filter((x) => x.id !== id));
  }, [supabase]);

  // ── Categories ──
  const saveCategory = useCallback(async (c: Partial<Category>) => {
    if (supabase) {
      if (c.id) await supabase.from("artwork_categories").update(c).eq("id", c.id);
      else await supabase.from("artwork_categories").insert(c);
      const { data } = await supabase.from("artwork_categories").select("*").order("sort_order");
      if (data) setCategories(data as Category[]);
      return;
    }
    setCategories((prev) => {
      if (c.id) return prev.map((x) => (x.id === c.id ? { ...x, ...c } : x));
      return [...prev, { id: uid(), name: "", slug: "", description: null, sort_order: prev.length + 1, ...c } as Category];
    });
  }, [supabase]);

  const deleteCategory = useCallback(async (id: string) => {
    if (supabase) await supabase.from("artwork_categories").delete().eq("id", id);
    setCategories((prev) => prev.filter((x) => x.id !== id));
  }, [supabase]);

  // ── Collections ──
  const saveCollection = useCallback(async (c: Partial<Collection>) => {
    const now = new Date().toISOString();
    if (supabase) {
      const payload = { ...c };
      if (c.id) await supabase.from("collections").update(payload).eq("id", c.id);
      else await supabase.from("collections").insert({ ...payload, created_at: now });
      const { data } = await supabase.from("collections").select("*").order("created_at", { ascending: false });
      if (data) setCollections(data as Collection[]);
      return;
    }
    setCollections((prev) => {
      if (c.id) return prev.map((x) => (x.id === c.id ? { ...x, ...c } : x));
      return [{ id: uid(), title: "", slug: "", description: null, cover_image_url: "", artwork_ids: [], created_at: now, ...c } as Collection, ...prev];
    });
  }, [supabase]);

  const deleteCollection = useCallback(async (id: string) => {
    if (supabase) await supabase.from("collections").delete().eq("id", id);
    setCollections((prev) => prev.filter((x) => x.id !== id));
  }, [supabase]);

  // ── Commissions ──
  const setCommissionStatus = useCallback(async (id: string, status: CommissionRequest["status"]) => {
    const now = new Date().toISOString();
    if (supabase) await supabase.from("commission_requests").update({ status, updated_at: now }).eq("id", id);
    setCommissions((prev) => prev.map((x) => (x.id === id ? { ...x, status, updated_at: now } : x)));
  }, [supabase]);

  // ── Profile ──
  const saveProfile = useCallback(async (p: Partial<Profile>) => {
    if (supabase) {
      await supabase.from("profiles").update(p).eq("id", profile.id);
    }
    setProfile((prev) => ({ ...prev, ...p }));
  }, [supabase, profile.id]);

  const value: AdminState = {
    configured: isSupabaseConfigured,
    loading,
    artworks,
    categories,
    animations,
    collections,
    commissions,
    profile,
    saveArtwork,
    deleteArtwork,
    saveAnimation,
    deleteAnimation,
    saveCategory,
    deleteCategory,
    saveCollection,
    deleteCollection,
    setCommissionStatus,
    saveProfile,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmin must be used within AdminStoreProvider");
  return ctx;
}
