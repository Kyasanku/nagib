"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdmin } from "@/lib/adminStore";
import { slugify } from "@/lib/utils";
import type { Collection } from "@/lib/types";
import DemoBanner from "@/components/admin/DemoBanner";
import PageTitle from "@/components/admin/PageTitle";
import Modal from "@/components/admin/Modal";
import ImageUpload from "@/components/admin/ImageUpload";
import { Input, Label, Textarea } from "@/components/ui/Field";

const empty: Partial<Collection> = { title: "", slug: "", description: "", cover_image_url: "", artwork_ids: [] };

export default function AdminCollections() {
  const { collections, artworks, saveCollection, deleteCollection } = useAdmin();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<Collection>>(empty);

  function toggle(id: string) {
    setDraft((d) => {
      const ids = new Set(d.artwork_ids ?? []);
      if (ids.has(id)) ids.delete(id); else ids.add(id);
      return { ...d, artwork_ids: [...ids] };
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await saveCollection({ ...draft, slug: draft.slug || slugify(draft.title ?? "") });
    setOpen(false);
  }

  return (
    <div>
      <DemoBanner />
      <PageTitle
        title="Collections"
        subtitle="Group related pieces into named bodies of work."
        action={
          <button onClick={() => { setDraft(empty); setOpen(true); }} className="btn-gold">
            <Plus size={16} /> New collection
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-2xl border border-black/[0.05] bg-ink-800/40">
            <div className="relative aspect-[4/3]">
              {c.cover_image_url && <Image src={c.cover_image_url} alt={c.title} fill className="object-cover" sizes="33vw" unoptimized />}
              <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
              <div className="absolute bottom-3 left-4">
                <p className="font-display text-xl text-ivory">{c.title}</p>
                <p className="text-xs text-ivory-muted">{c.artwork_ids?.length ?? 0} pieces</p>
              </div>
            </div>
            <div className="flex justify-end gap-1 p-3">
              <button onClick={() => { setDraft(c); setOpen(true); }} className="grid h-9 w-9 place-items-center rounded-lg text-ivory-muted hover:bg-black/[0.05] hover:text-ivory">
                <Pencil size={15} />
              </button>
              <button onClick={() => confirm(`Delete "${c.title}"?`) && deleteCollection(c.id)} className="grid h-9 w-9 place-items-center rounded-lg text-ivory-muted hover:bg-black/[0.05] hover:text-rose-300">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={draft.id ? "Edit collection" : "New collection"}>
        <form onSubmit={submit} className="space-y-5">
          <ImageUpload
            value={draft.cover_image_url ?? ""}
            onChange={(url) => setDraft((d) => ({ ...d, cover_image_url: url }))}
            bucket="collection"
            label="Cover image"
          />
          <div>
            <Label required>Title</Label>
            <Input value={draft.title ?? ""} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} required />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={draft.description ?? ""} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
          </div>
          <div>
            <Label>Pieces in this collection</Label>
            <div className="grid max-h-52 grid-cols-4 gap-2 overflow-y-auto rounded-xl border border-black/10 bg-ink p-3">
              {artworks.map((a) => {
                const selected = draft.artwork_ids?.includes(a.id);
                return (
                  <button
                    type="button"
                    key={a.id}
                    onClick={() => toggle(a.id)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${selected ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    {a.featured_image_url && <Image src={a.featured_image_url} alt={a.title} fill className="object-cover" sizes="80px" unoptimized />}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-gold">{draft.id ? "Save" : "Create"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
