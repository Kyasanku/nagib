import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProfile, getArtworks } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description: "The artist behind the work.",
};

export default async function AboutPage() {
  const [profile, artworks] = await Promise.all([getProfile(), getArtworks()]);
  const strip = artworks.slice(0, 4);
  const paragraphs = (profile.bio ?? "").split("\n").filter(Boolean);

  return (
    <div className="pt-28">
      {/* Intro */}
      <section className="px-5 md:px-10">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border border-black/[0.05] shadow-cinematic">
            {profile.avatar_url && (
              <Image
                src={profile.avatar_url}
                alt={profile.display_name}
                fill
                sizes="(max-width: 768px) 90vw, 40vw"
                className="object-cover"
              />
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-soft">
              About the artist
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-ivory md:text-6xl">
              {profile.display_name}
            </h1>
            <p className="mt-4 font-display text-xl italic text-ivory-muted">
              {profile.tagline}
            </p>
            <div className="mt-6 space-y-4 leading-relaxed text-ivory-muted">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/commissions" className="btn-gold">Commission a piece</Link>
              <Link href="/gallery" className="btn-ghost">Explore the gallery</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Facts */}
      <section className="px-5 py-16 md:px-10">
        <div className="mx-auto grid max-w-[1200px] gap-px overflow-hidden rounded-3xl border border-black/[0.05] bg-black/[0.05] sm:grid-cols-3">
          {[
            { label: "Based in", value: profile.location ?? "—" },
            { label: "Working in", value: "Graphite · Digital · Motion" },
            { label: "Commissions", value: "Open · limited slots" },
          ].map((f) => (
            <div key={f.label} className="bg-ink-800 p-8 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-ivory-dim">{f.label}</p>
              <p className="mt-2 font-display text-xl text-ivory">{f.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Work strip */}
      <section className="px-5 pb-24 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl text-ivory md:text-3xl">Selected work</h2>
            <Link href="/gallery" className="text-sm text-ivory-dim hover:text-gold">
              See everything →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {strip.map((a) => (
              <Link
                key={a.id}
                href={`/artwork/${a.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-black/[0.05]"
              >
                <Image
                  src={a.featured_image_url}
                  alt={a.title}
                  fill
                  sizes="(max-width: 768px) 45vw, 22vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                <p className="absolute bottom-4 left-4 font-display text-lg text-ivory">
                  {a.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
