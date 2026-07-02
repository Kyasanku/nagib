"use client";

import Image from "next/image";
import { Star, Check } from "lucide-react";
import { useAdmin } from "@/lib/adminStore";
import { formatPrice } from "@/lib/utils";
import DemoBanner from "@/components/admin/DemoBanner";
import PageTitle from "@/components/admin/PageTitle";

// The homepage hero shows the first "new release", and the "New Releases"
// row shows every artwork flagged as new. Toggling here updates that flag.
export default function AdminFeatured() {
  const { artworks, saveArtwork } = useAdmin();
  const visible = artworks.filter((a) => a.status !== "hidden");
  const hero = visible.find((a) => a.is_new) ?? visible[0];

  return (
    <div>
      <DemoBanner />
      <PageTitle
        title="Homepage"
        subtitle="Choose what greets visitors. The first featured piece becomes the cinematic hero; all featured pieces fill the “New Releases” row."
      />

      {hero && (
        <div className="mb-8 overflow-hidden rounded-3xl border border-gold/20">
          <div className="relative aspect-[21/9]">
            <Image src={hero.featured_image_url} alt={hero.title} fill className="object-cover" sizes="100vw" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-soft">
                <Star size={13} fill="currentColor" /> Current hero
              </p>
              <p className="mt-1 font-display text-3xl text-ivory">{hero.title}</p>
            </div>
          </div>
        </div>
      )}

      <p className="mb-4 text-sm text-ivory-muted">Toggle pieces to feature them on the homepage.</p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((a) => (
          <button
            key={a.id}
            onClick={() => saveArtwork({ id: a.id, is_new: !a.is_new })}
            className={`group relative overflow-hidden rounded-2xl border-2 text-left transition-all ${a.is_new ? "border-gold" : "border-black/[0.05] hover:border-black/[0.16]"}`}
          >
            <div className="relative aspect-[3/4]">
              <Image src={a.featured_image_url} alt={a.title} fill className="object-cover" sizes="25vw" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 to-transparent" />
              {a.is_new && (
                <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-gold text-ink">
                  <Check size={15} />
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="font-display text-sm text-ivory">{a.title}</p>
                <p className="text-xs text-ivory-dim">{formatPrice(a.price, a.currency)}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
