"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { useAdmin } from "@/lib/adminStore";
import { formatPrice, slugify } from "@/lib/utils";
import type { Course, CourseLesson } from "@/lib/types";
import DemoBanner from "@/components/admin/DemoBanner";
import PageTitle from "@/components/admin/PageTitle";
import Modal from "@/components/admin/Modal";
import ImageUpload from "@/components/admin/ImageUpload";
import StatusBadge from "@/components/StatusBadge";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";

const empty: Partial<Course> = {
  title: "", description: "", thumbnail_url: "", price: null,
  currency: "UGX", level: "", status: "draft", lessons: [],
};

const newLesson = (): CourseLesson => ({
  id: Math.random().toString(36).slice(2),
  course_id: "", title: "", description: null, video_url: "",
  duration: "", sort_order: 0, is_preview: false,
});

export default function AdminCourses() {
  const { courses, saveCourse, deleteCourse } = useAdmin();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<Course>>(empty);

  const lessons = draft.lessons ?? [];
  const setLessons = (next: CourseLesson[]) => setDraft((d) => ({ ...d, lessons: next }));
  const updateLesson = (i: number, patch: Partial<CourseLesson>) =>
    setLessons(lessons.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await saveCourse({ ...draft, slug: draft.slug || slugify(draft.title ?? "untitled") });
    setOpen(false);
  }

  return (
    <div>
      <DemoBanner />
      <PageTitle
        title="Courses"
        subtitle="Create paid video courses. Add lessons with video links (MP4, YouTube or Vimeo); mark a few as free previews."
        action={
          <button onClick={() => { setDraft({ ...empty, lessons: [newLesson()] }); setOpen(true); }} className="btn-gold">
            <Plus size={16} /> New course
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-2xl border border-black/[0.06] bg-ink-800">
            <div className="relative aspect-video">
              {c.thumbnail_url && <Image src={c.thumbnail_url} alt={c.title} fill className="object-cover" sizes="33vw" unoptimized />}
              <span className="absolute left-2 top-2"><StatusBadge status={c.status} /></span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-ivory">{c.title}</p>
                  <p className="text-xs text-ivory-dim">{c.lessons?.length ?? 0} lessons · {formatPrice(c.price, c.currency)}</p>
                </div>
                <div className="flex flex-none gap-1">
                  <button onClick={() => { setDraft(c); setOpen(true); }} className="grid h-9 w-9 place-items-center rounded-lg text-ivory-muted hover:bg-black/[0.05] hover:text-ivory">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => confirm(`Delete "${c.title}"?`) && deleteCourse(c.id)} className="grid h-9 w-9 place-items-center rounded-lg text-ivory-muted hover:bg-black/[0.05] hover:text-rose-600">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={draft.id ? "Edit course" : "New course"}>
        <form onSubmit={submit} className="space-y-5">
          <ImageUpload
            value={draft.thumbnail_url ?? ""}
            onChange={(url) => setDraft((d) => ({ ...d, thumbnail_url: url }))}
            bucket="course"
            label="Thumbnail"
          />
          <div>
            <Label required>Title</Label>
            <Input value={draft.title ?? ""} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} required />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={draft.description ?? ""} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label>Price (UGX)</Label>
              <Input type="number" value={draft.price ?? ""} onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value ? Number(e.target.value) : null }))} placeholder="120000" />
            </div>
            <div>
              <Label>Level</Label>
              <Input value={draft.level ?? ""} onChange={(e) => setDraft((d) => ({ ...d, level: e.target.value }))} placeholder="Beginner" />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={draft.status ?? "draft"} onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as Course["status"] }))}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="hidden">Hidden</option>
              </Select>
            </div>
          </div>

          {/* Lessons */}
          <div className="rounded-2xl border border-black/[0.06] bg-ink p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-ivory">Lessons</p>
              <button type="button" onClick={() => setLessons([...lessons, newLesson()])} className="text-sm text-gold-deep hover:underline">
                + Add lesson
              </button>
            </div>
            <div className="space-y-3">
              {lessons.map((l, i) => (
                <div key={l.id} className="rounded-xl border border-black/[0.06] bg-ink-800 p-3">
                  <div className="flex items-center gap-2">
                    <GripVertical size={14} className="text-ivory-dim" />
                    <Input value={l.title} onChange={(e) => updateLesson(i, { title: e.target.value })} placeholder={`Lesson ${i + 1} title`} className="!py-2" />
                    <button type="button" onClick={() => setLessons(lessons.filter((_, idx) => idx !== i))} className="grid h-8 w-8 flex-none place-items-center rounded-lg text-ivory-dim hover:text-rose-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-[2fr_1fr]">
                    <Input value={l.video_url} onChange={(e) => updateLesson(i, { video_url: e.target.value })} placeholder="Video URL (mp4 / YouTube / Vimeo)" className="!py-2 !text-xs" />
                    <Input value={l.duration ?? ""} onChange={(e) => updateLesson(i, { duration: e.target.value })} placeholder="Duration e.g. 12:30" className="!py-2 !text-xs" />
                  </div>
                  <label className="mt-2 flex items-center gap-2 text-xs text-ivory-muted">
                    <input type="checkbox" checked={l.is_preview} onChange={(e) => updateLesson(i, { is_preview: e.target.checked })} className="h-4 w-4 accent-gold" />
                    Free preview (watchable before purchase)
                  </label>
                </div>
              ))}
              {lessons.length === 0 && <p className="text-sm text-ivory-dim">No lessons yet.</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-gold">{draft.id ? "Save course" : "Create course"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
