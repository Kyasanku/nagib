"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Artwork, Category } from "@/lib/types";
import ArtworkCard from "./ArtworkCard";

const statusFilters = [
  { key: "all", label: "All" },
  { key: "available", label: "Available" },
  { key: "reserved", label: "Reserved" },
  { key: "sold", label: "Sold" },
] as const;

export default function GalleryGrid({
  artworks,
  categories,
  initialCategory,
}: {
  artworks: Artwork[];
  categories: Category[];
  initialCategory?: string;
}) {
  const [category, setCategory] = useState<string>(initialCategory ?? "all");
  const [status, setStatus] = useState<string>("all");

  const filtered = useMemo(() => {
    return artworks.filter((a) => {
      const catOk =
        category === "all" ||
        a.category?.slug === category ||
        a.category_id === category;
      const statusOk = status === "all" || a.status === status;
      return catOk && statusOk;
    });
  }, [artworks, category, status]);

  return (
    <div>
      {/* Filter bar */}
      <div className="sticky top-[68px] z-30 -mx-5 mb-8 border-y border-black/[0.05] bg-ink/80 px-5 py-4 backdrop-blur-xl md:-mx-10 md:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="row-scroll flex gap-2 overflow-x-auto">
            <FilterPill active={category === "all"} onClick={() => setCategory("all")}>
              All work
            </FilterPill>
            {categories.map((c) => (
              <FilterPill
                key={c.id}
                active={category === c.slug}
                onClick={() => setCategory(c.slug)}
              >
                {c.name}
              </FilterPill>
            ))}
          </div>
          <div className="flex gap-2">
            {statusFilters.map((s) => (
              <FilterPill
                key={s.key}
                active={status === s.key}
                onClick={() => setStatus(s.key)}
                subtle
              >
                {s.label}
              </FilterPill>
            ))}
          </div>
        </div>
      </div>

      <p className="mb-6 text-sm text-ivory-dim">
        {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
      </p>

      {filtered.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-black/10 py-24 text-center">
          <p className="font-display text-2xl text-ivory">Nothing here yet</p>
          <p className="mt-2 text-sm text-ivory-dim">
            Try another category or status filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((a) => (
            <ArtworkCard key={a.id} artwork={a} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  children,
  active,
  onClick,
  subtle,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  subtle?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all",
        active
          ? "border-gold bg-gold text-ink"
          : subtle
            ? "border-black/10 text-ivory-dim hover:border-black/20 hover:text-ivory"
            : "border-black/10 text-ivory-muted hover:border-black/20 hover:text-ivory"
      )}
    >
      {children}
    </button>
  );
}
