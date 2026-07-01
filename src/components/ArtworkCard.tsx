import Image from "next/image";
import Link from "next/link";
import type { Artwork } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import StatusBadge from "./StatusBadge";

export default function ArtworkCard({
  artwork,
  className = "",
}: {
  artwork: Artwork;
  className?: string;
}) {
  return (
    <Link
      href={`/artwork/${artwork.slug}`}
      className={`group relative block overflow-hidden rounded-2xl border border-black/[0.06] bg-ink-800 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-cinematic ${className}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={artwork.featured_image_url}
          alt={artwork.title}
          fill
          sizes="(max-width: 768px) 60vw, 22vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

        <div className="absolute left-3 top-3">
          {artwork.is_new && artwork.status === "available" ? (
            <span className="chip border-gold/30 bg-white/90 text-gold-deep">New</span>
          ) : (
            <StatusBadge status={artwork.status} />
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="font-mono text-[0.65rem] uppercase tracking-widest text-gold-soft">
            {artwork.category?.name ?? artwork.medium}
          </p>
          <h3 className="mt-1 font-display text-xl leading-tight text-white">
            {artwork.title}
          </h3>
          <p className="mt-0.5 text-sm text-white/80">
            {formatPrice(artwork.price, artwork.currency)}
          </p>
        </div>
      </div>
    </Link>
  );
}
