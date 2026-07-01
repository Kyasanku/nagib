import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Artwork, Profile } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function Hero({
  artwork,
  profile,
  stats,
}: {
  artwork: Artwork;
  profile: Profile;
  stats: { works: number; animations: number };
}) {
  const firstName = profile.display_name.split(" ")[0];

  return (
    <section className="relative overflow-hidden px-5 pb-10 pt-28 md:px-10 md:pb-20 md:pt-36">
      {/* Playful floating accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-10 top-28 h-40 w-40 animate-float rounded-full bg-gold/15 blur-2xl" />
        <div className="absolute right-[8%] top-16 h-24 w-24 animate-float rounded-full bg-mint/20 blur-2xl [animation-delay:1.5s]" />
        <div className="absolute bottom-6 left-[35%] h-28 w-28 animate-float rounded-full bg-sky/10 blur-2xl [animation-delay:0.8s]" />
      </div>

      <div className="mx-auto grid max-w-[1400px] items-center gap-10 md:grid-cols-2 lg:gap-16">
        {/* Left — the pitch */}
        <div className="text-center md:text-left">
          <p className="eyebrow inline-flex items-center gap-2">
            <Sparkles size={13} className="text-gold" /> Original art · Kampala, Uganda
          </p>

          <h1 className="mt-5 font-display text-[3.25rem] leading-[0.95] tracking-tight text-ivory sm:text-6xl lg:text-7xl">
            Hi, I&apos;m {firstName}.
            <span className="block text-gold">I draw quiet worlds.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-ivory-muted md:mx-0 md:text-lg">
            {profile.tagline} Browse the gallery, watch drawings learn to move, and
            commission something made only for you.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
            <Link href="/gallery" className="btn-gold w-full sm:w-auto">
              Explore the gallery <ArrowRight size={16} />
            </Link>
            <Link href="/commissions" className="btn-ghost w-full sm:w-auto">
              Commission a piece
            </Link>
          </div>

          {/* Techy mono stat ticker */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs text-ivory-dim md:justify-start">
            <span><span className="text-gold-soft">{stats.works}</span> works</span>
            <span className="text-ivory-dim/40">/</span>
            <span><span className="text-gold-soft">{stats.animations}</span> animations</span>
            <span className="text-ivory-dim/40">/</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              open for commissions
            </span>
          </div>
        </div>

        {/* Right — featured piece */}
        <div className="relative mx-auto w-full max-w-md md:max-w-none">
          <Link
            href={`/artwork/${artwork.slug}`}
            className="group relative block"
          >
            {/* Cute tilted accent panel behind */}
            <div className="absolute inset-0 -z-10 translate-x-3 translate-y-3 rotate-2 rounded-[2rem] bg-gold/20 transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4" />

            <div className="relative overflow-hidden rounded-[2rem] border border-black/[0.06] bg-ink-800 shadow-cinematic">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={artwork.featured_image_url}
                  alt={artwork.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, 45vw"
                  className="animate-ken-burns object-cover"
                />
              </div>

              {/* Floating "featured" chip */}
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-ivory shadow-soft backdrop-blur">
                ★ Featured work
              </span>

              {/* Caption bar */}
              <div className="flex items-center justify-between gap-3 border-t border-black/[0.06] bg-ink-800 px-5 py-4">
                <div>
                  <p className="font-display text-xl leading-tight text-ivory">{artwork.title}</p>
                  <p className="text-xs text-ivory-dim">{artwork.medium}</p>
                </div>
                <span className="whitespace-nowrap rounded-full bg-gold/10 px-3 py-1.5 font-mono text-xs text-gold-deep">
                  {formatPrice(artwork.price, artwork.currency)}
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
