"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdmin } from "@/lib/adminStore";
import { formatPrice, slugify } from "@/lib/utils";
import type { Artwork } from "@/lib/types";
import DemoBanner from "@/components/admin/DemoBanner";
import PageTitle from "@/components/admin/PageTitle";
import Modal from "@/components/admin/Modal";
import ImageUpload from "@/components/admin/ImageUpload";
import StatusBadge from "@/components/StatusBadge";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";

const empty: Partial<Artwork> = {
  title: "",
  description: "",
  price: null,
  currency: "UGX",
  status: "available",
  medium: "",
  dimensions: "",
  year_created: new Date().getFullYear(),
  featured_image_url: "",
  is_new: true,
};

export default function AdminArtworks() {
  const { artworks, categories, saveArtwork, deleteArtwork } = useAdmin();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<Artwork>>(empty);

  function edit(a: Artwork) {
    setDraft(a);
    setOpen(true);
  }
  function create() {
    setDraft({ ...empty, category_id: categories[0]?.id });
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await saveArtwork({
      ...draft,
      slug: draft.slug || slugify(draft.title ?? "untitled"),
    });
    setOpen(false);
  }

  return (
    <div>
      <DemoBanner />
      <PageTitle
        title="Artworks"
        subtitle="Upload, price and manage every piece."
        action={
          <button onClick={create} className="btn-gold">
            <Plus size={16} /> New artwork
          </button>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-black/[0.05]">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-800 text-xs uppercase tracking-wider text-ivory-dim">
            <tr>
              <th className="px-4 py-3 font-medium">Piece</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.05]">
            {artworks.map((a) => (
              <tr key={a.id} className="bg-ink-800/40 hover:bg-ink-800">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 flex-none overflow-hidden rounded-lg border border-black/10">
                      {a.featured_image_url && (
                        <Image src={a.featured_image_url} alt={a.title} fill className="object-cover" sizes="48px" unoptimized />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-ivory">{a.title}</p>
                      <p className="text-xs text-ivory-dim">{a.medium}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-ivory-muted md:table-cell">
                  {a.category?.name ?? categories.find((c) => c.id === a.category_id)?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-ivory-muted">{formatPrice(a.price, a.currency)}</td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => edit(a)} className="grid h-9 w-9 place-items-center rounded-lg text-ivory-muted hover:bg-black/[0.05] hover:text-ivory">
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => confirm(`Delete "${a.title}"?`) && deleteArtwork(a.id)}
                      className="grid h-9 w-9 place-items-center rounded-lg text-ivory-muted hover:bg-black/[0.05] hover:text-rose-300"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={draft.id ? "Edit artwork" : "New artwork"}>
        <form onSubmit={submit} className="space-y-5">
          <ImageUpload
            value={draft.featured_image_url ?? ""}
            onChange={(url) => setDraft((d) => ({ ...d, featured_image_url: url }))}
            label="Featured image"
          />

          <div>
            <Label required>Title</Label>
            <Input
              value={draft.title ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              required
              placeholder="Ember Requiem"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={draft.description ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Category</Label>
              <Select
                value={draft.category_id ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, category_id: e.target.value }))}
              >
                <option value="">Uncategorised</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={draft.status ?? "available"}
                onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as Artwork["status"] }))}
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
                <option value="hidden">Hidden</option>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label>Price</Label>
              <Input
                type="number"
                value={draft.price ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value ? Number(e.target.value) : null }))}
                placeholder="1400"
              />
            </div>
            <div>
              <Label>Currency</Label>
              <Input
                value={draft.currency ?? "UGX"}
                onChange={(e) => setDraft((d) => ({ ...d, currency: e.target.value }))}
              />
            </div>
            <div>
              <Label>Year</Label>
              <Input
                type="number"
                value={draft.year_created ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, year_created: e.target.value ? Number(e.target.value) : null }))}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Medium</Label>
              <Input
                value={draft.medium ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, medium: e.target.value }))}
                placeholder="Digital painting"
              />
            </div>
            <div>
              <Label>Dimensions</Label>
              <Input
                value={draft.dimensions ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, dimensions: e.target.value }))}
                placeholder="5400 × 7200 px"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm text-ivory-muted">
            <input
              type="checkbox"
              checked={!!draft.is_new}
              onChange={(e) => setDraft((d) => ({ ...d, is_new: e.target.checked }))}
              className="h-4 w-4 accent-gold"
            />
            Mark as a new release (shows in “New Releases” row)
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-gold">{draft.id ? "Save changes" : "Create artwork"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
