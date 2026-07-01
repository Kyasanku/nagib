"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Row } from "@/lib/types";
import ArtworkCard from "./ArtworkCard";

export default function BrowseRow({ row }: { row: Row }) {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="group/row relative">
      <div className="mb-4 flex items-end justify-between px-5 md:px-10">
        <div>
          <h2 className="font-display text-2xl text-ivory md:text-3xl">{row.title}</h2>
        </div>
        <Link
          href={`/gallery?category=${row.slug}`}
          className="text-sm text-ivory-dim transition-colors hover:text-gold"
        >
          View all →
        </Link>
      </div>

      <div className="relative">
        {/* Arrows */}
        <button
          onClick={() => scroll(-1)}
          className="absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-ink/70 p-2 text-ivory opacity-0 backdrop-blur transition-opacity duration-300 hover:bg-ink group-hover/row:opacity-100 md:grid"
          aria-label="Scroll left"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={() => scroll(1)}
          className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-ink/70 p-2 text-ivory opacity-0 backdrop-blur transition-opacity duration-300 hover:bg-ink group-hover/row:opacity-100 md:grid"
          aria-label="Scroll right"
        >
          <ChevronRight size={22} />
        </button>

        <div
          ref={scroller}
          className="row-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 md:px-10"
        >
          {row.items.map((art) => (
            <div
              key={art.id}
              className="w-[60vw] flex-none snap-start sm:w-[42vw] md:w-[24vw] lg:w-[19vw] xl:w-[15vw]"
            >
              <ArtworkCard artwork={art} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
