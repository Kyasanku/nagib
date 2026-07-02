"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Play } from "lucide-react";
import { useAdmin } from "@/lib/adminStore";
import { slugify } from "@/lib/utils";
import type { Animation } from "@/lib/types";
import DemoBanner from "@/components/admin/DemoBanner";
import PageTitle from "@/components/admin/PageTitle";
import Modal from "@/components/admin/Modal";
import ImageUpload from "@/components/admin/ImageUpload";
import StatusBadge from "@/components/StatusBadge";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";

const empty: Partial<Animation> = {
  title: "",
  description: "",
  thumbnail_url: "",
  video_url: "",
  duration: "",
  status: "published",
};

export default function AdminAnimations() {
  const { animations, saveAnimation, deleteAnimation } = useAdmin();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<Animation>>(empty);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await saveAnimation({ ...draft, slug: draft.slug || slugify(draft.title ?? "untitled") });
    setOpen(false);
  }

  return (
    <div>
      <DemoBanner />
      <PageTitle
        title="Animations"
        subtitle="Add short animations by uploading a thumbnail and a video URL (MP4, YouTube or Vimeo)."
        action={
          <button onClick={() => { setDraft(empty); setOpen(true); }} className="btn-gold">
            <Plus size={16} /> New animation
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {animations.map((a) => (
          <div key={a.id} className="overflow-hidden rounded-2xl border border-black/[0.05] bg-ink-800/40">
            <div className="relative aspect-video">
              {a.thumbnail_url && (
                <Image src={a.thumbnail_url} alt={a.title} fill className="object-cover" sizes="33vw" unoptimized />
              )}
              <div className="absolute inset-0 grid place-items-center bg-ink/30">
                <Play size={28} className="text-ivory/80" fill="currentColor" />
              </div>
              <span className="absolute left-2 top-2"><StatusBadge status={a.status} /></span>
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-ivory">{a.title}</p>
                <p className="text-xs text-ivory-dim">{a.duration || "—"}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setDraft(a); setOpen(true); }} className="grid h-9 w-9 place-items-center rounded-lg text-ivory-muted hover:bg-black/[0.05] hover:text-ivory">
                  <Pencil size={15} />
                </button>
                <button onClick={() => confirm(`Delete "${a.title}"?`) && deleteAnimation(a.id)} className="grid h-9 w-9 place-items-center rounded-lg text-ivory-muted hover:bg-black/[0.05] hover:text-rose-300">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={draft.id ? "Edit animation" : "New animation"}>
        <form onSubmit={submit} className="space-y-5">
          <ImageUpload
            value={draft.thumbnail_url ?? ""}
            onChange={(url) => setDraft((d) => ({ ...d, thumbnail_url: url }))}
            bucket="animation"
            label="Thumbnail"
          />
          <div>
            <Label required>Title</Label>
            <Input value={draft.title ?? ""} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} required />
          </div>
          <div>
            <Label required>Video URL</Label>
            <Input
              value={draft.video_url ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, video_url: e.target.value }))}
              required
              placeholder="https://…/clip.mp4 or a YouTube/Vimeo link"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={draft.description ?? ""} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Duration</Label>
              <Input value={draft.duration ?? ""} onChange={(e) => setDraft((d) => ({ ...d, duration: e.target.value }))} placeholder="0:12" />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={draft.status ?? "published"} onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as Animation["status"] }))}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="hidden">Hidden</option>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-gold">{draft.id ? "Save changes" : "Create animation"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
