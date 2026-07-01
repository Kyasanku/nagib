"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Loader2, LinkIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input, Label } from "@/components/ui/Field";

// Uploads to a Supabase Storage bucket when configured; otherwise accepts a
// pasted URL so the admin remains fully usable in demo mode.
export default function ImageUpload({
  value,
  onChange,
  bucket = "artwork",
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const supabase = createClient();

    if (!supabase) {
      // Demo mode — preview locally via object URL.
      onChange(URL.createObjectURL(file));
      return;
    }

    setUploading(true);
    setError("");
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (upErr) {
      setError(upErr.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  }

  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-4">
        <div className="relative grid h-28 w-28 flex-none place-items-center overflow-hidden rounded-xl border border-black/10 bg-ink">
          {value ? (
            <Image src={value} alt="preview" fill className="object-cover" sizes="112px" unoptimized />
          ) : (
            <span className="text-xs text-ivory-dim">No image</span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <label className="btn-ghost cursor-pointer !py-2 !text-xs">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? "Uploading…" : "Upload file"}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
          <div className="relative">
            <LinkIcon size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ivory-dim" />
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="…or paste an image URL"
              className="!pl-9 !text-xs"
            />
          </div>
          {error && <p className="text-xs text-rose-300">{error}</p>}
        </div>
      </div>
    </div>
  );
}
