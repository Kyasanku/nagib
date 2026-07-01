"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdmin } from "@/lib/adminStore";
import { slugify } from "@/lib/utils";
import type { Category } from "@/lib/types";
import DemoBanner from "@/components/admin/DemoBanner";
import PageTitle from "@/components/admin/PageTitle";
import Modal from "@/components/admin/Modal";
import { Input, Label, Textarea } from "@/components/ui/Field";

const empty: Partial<Category> = { name: "", slug: "", description: "", sort_order: 1 };

export default function AdminCategories() {
  const { categories, artworks, saveCategory, deleteCategory } = useAdmin();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<Category>>(empty);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await saveCategory({ ...draft, slug: draft.slug || slugify(draft.name ?? "") });
    setOpen(false);
  }

  const count = (id: string) => artworks.filter((a) => a.category_id === id).length;

  return (
    <div>
      <DemoBanner />
      <PageTitle
        title="Categories"
        subtitle="These become the browsing rows on the homepage and filters in the gallery."
        action={
          <button onClick={() => { setDraft({ ...empty, sort_order: categories.length + 1 }); setOpen(true); }} className="btn-gold">
            <Plus size={16} /> New category
          </button>
        }
      />

      <div className="space-y-3">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-2xl border border-black/[0.05] bg-ink-800/40 p-4">
            <div>
              <div className="flex items-center gap-3">
                <p className="font-medium text-ivory">{c.name}</p>
                <span className="chip border-black/10 bg-black/[0.05] text-ivory-dim">{count(c.id)} pieces</span>
              </div>
              <p className="mt-0.5 text-sm text-ivory-dim">{c.description || `/${c.slug}`}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setDraft(c); setOpen(true); }} className="grid h-9 w-9 place-items-center rounded-lg text-ivory-muted hover:bg-black/[0.05] hover:text-ivory">
                <Pencil size={15} />
              </button>
              <button onClick={() => confirm(`Delete "${c.name}"?`) && deleteCategory(c.id)} className="grid h-9 w-9 place-items-center rounded-lg text-ivory-muted hover:bg-black/[0.05] hover:text-rose-300">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={draft.id ? "Edit category" : "New category"}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label required>Name</Label>
            <Input value={draft.name ?? ""} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} required placeholder="Character Art" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={draft.description ?? ""} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} className="min-h-[80px]" />
          </div>
          <div>
            <Label>Sort order</Label>
            <Input type="number" value={draft.sort_order ?? 1} onChange={(e) => setDraft((d) => ({ ...d, sort_order: Number(e.target.value) }))} />
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
