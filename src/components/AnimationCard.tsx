import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { Animation } from "@/lib/types";

export default function AnimationCard({ animation }: { animation: Animation }) {
  return (
    <Link
      href={`/animations/${animation.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-black/[0.06] bg-ink-800 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-cinematic"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={animation.thumbnail_url}
          alt={animation.title}
          fill
          sizes="(max-width: 768px) 90vw, 32vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute inset-0 grid place-items-center">
          <span className="grid h-16 w-16 place-items-center rounded-full border border-white/40 bg-black/30 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-gold group-hover:bg-gold">
            <Play size={22} className="translate-x-0.5 text-white" fill="currentColor" />
          </span>
        </div>

        {animation.duration && (
          <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-1 font-mono text-xs text-white backdrop-blur">
            {animation.duration}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg text-ivory">{animation.title}</h3>
        <p className="mt-1 line-clamp-1 text-sm text-ivory-dim">
          {animation.description}
        </p>
      </div>
    </Link>
  );
}
