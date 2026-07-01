"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useAdmin } from "@/lib/adminStore";
import type { Profile } from "@/lib/types";
import DemoBanner from "@/components/admin/DemoBanner";
import PageTitle from "@/components/admin/PageTitle";
import ImageUpload from "@/components/admin/ImageUpload";
import { Input, Label, Textarea } from "@/components/ui/Field";

export default function AdminProfile() {
  const { profile, saveProfile } = useAdmin();
  const [draft, setDraft] = useState<Profile>(profile);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setSaved(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await saveProfile(draft);
    setSaving(false);
    setSaved(true);
  }

  return (
    <div>
      <DemoBanner />
      <PageTitle title="Artist profile" subtitle="This powers your About page, footer and contact details." />

      <form onSubmit={submit} className="max-w-2xl space-y-5 rounded-3xl border border-black/[0.05] bg-ink-800/40 p-6 md:p-8">
        <ImageUpload
          value={draft.avatar_url ?? ""}
          onChange={(url) => set("avatar_url", url)}
          bucket="profile"
          label="Portrait"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label required>Display name</Label>
            <Input value={draft.display_name} onChange={(e) => set("display_name", e.target.value)} required />
          </div>
          <div>
            <Label>Location</Label>
            <Input value={draft.location ?? ""} onChange={(e) => set("location", e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Tagline</Label>
          <Input value={draft.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} />
        </div>
        <div>
          <Label>Bio</Label>
          <Textarea
            value={draft.bio ?? ""}
            onChange={(e) => set("bio", e.target.value)}
            className="min-h-[160px]"
            placeholder="Write your story… (blank lines start new paragraphs)"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Contact email</Label>
            <Input type="email" value={draft.email ?? ""} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <Label>Instagram handle</Label>
            <Input value={draft.instagram ?? ""} onChange={(e) => set("instagram", e.target.value)} placeholder="without the @" />
          </div>
          <div>
            <Label>Twitter / X handle</Label>
            <Input value={draft.twitter ?? ""} onChange={(e) => set("twitter", e.target.value)} />
          </div>
          <div>
            <Label>Behance handle</Label>
            <Input value={draft.behance ?? ""} onChange={(e) => set("behance", e.target.value)} />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button type="submit" disabled={saving} className="btn-gold">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : "Save profile"}
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-300">
              <Check size={16} /> Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
