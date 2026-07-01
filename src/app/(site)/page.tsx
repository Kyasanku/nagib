import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Heart } from "lucide-react";
import Hero from "@/components/Hero";
import BrowseRow from "@/components/BrowseRow";
import AnimationCard from "@/components/AnimationCard";
import {
  getAnimations,
  getArtworks,
  getBrowseRows,
  getCollections,
  getFeaturedArtwork,
  getProfile,
} from "@/lib/data";

export default async function HomePage() {
  const [featured, rows, animations, collections, artworks, profile] =
    await Promise.all([
      getFeaturedArtwork(),
      getBrowseRows(),
      getAnimations(),
      getCollections(),
      getArtworks(),
      getProfile(),
    ]);

  return (
    <div>
      <Hero
        artwork={featured}
        profile={profile}
        stats={{ works: artworks.length, animations: animations.length }}
      />

      <div className="space-y-16 pb-24 pt-4">
        {/* First couple of rows */}
        {rows.slice(0, 2).map((row) => (
          <BrowseRow key={row.slug} row={row} />
        ))}

        {/* Animations feature strip */}
        <section className="px-5 md:px-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="eyebrow inline-flex items-center gap-2">
                <Sparkles size={13} className="text-gold" /> Now moving
              </p>
              <h2 className="mt-2 font-display text-3xl text-ivory md:text-4xl">
                Short Animations
              </h2>
            </div>
            <Link href="/animations" className="text-sm text-ivory-dim transition-colors hover:text-gold">
              All animations →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {animations.slice(0, 3).map((a) => (
              <AnimationCard key={a.id} animation={a} />
            ))}
          </div>
        </section>

        {/* Remaining rows */}
        {rows.slice(2).map((row) => (
          <BrowseRow key={row.slug} row={row} />
        ))}

        {/* Collections */}
        <section className="px-5 md:px-10">
          <div className="mb-5">
            <p className="eyebrow">Worlds &amp; series</p>
            <h2 className="mt-2 font-display text-3xl text-ivory md:text-4xl">Collections</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {collections.map((c) => (
              <Link
                key={c.id}
                href={`/gallery?collection=${c.slug}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-black/[0.06] shadow-soft"
              >
                <Image
                  src={c.cover_image_url}
                  alt={c.title}
                  fill
                  sizes="(max-width: 768px) 90vw, 32vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-display text-2xl text-white">{c.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-white/80">
                    {c.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Commission CTA band — bright & cute */}
        <section className="px-5 md:px-10">
          <div className="relative overflow-hidden rounded-[2rem] border border-gold/25 bg-gradient-to-br from-gold/10 via-ink-800 to-mint/10 p-10 text-center md:p-16">
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 animate-float rounded-full bg-gold/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 left-10 h-40 w-40 animate-float rounded-full bg-mint/20 blur-3xl [animation-delay:1s]" />
            <div className="relative mx-auto max-w-2xl">
              <p className="eyebrow inline-flex items-center gap-2">
                <Heart size={13} className="text-gold" /> Commissions open · Limited slots
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-ivory md:text-6xl">
                Commission something that doesn&apos;t exist yet.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-ivory-muted">
                Portraits, character designs, illustrations, and short animations —
                made for you, from the first sketch to the final frame.
              </p>
              <Link href="/commissions" className="btn-gold mx-auto mt-8">
                Start a commission <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
