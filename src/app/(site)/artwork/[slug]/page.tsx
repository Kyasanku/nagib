import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getArtworkBySlug, getArtworks } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import InquiryForm from "@/components/InquiryForm";
import ArtworkCard from "@/components/ArtworkCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const art = await getArtworkBySlug(slug);
  if (!art) return { title: "Artwork not found" };
  return {
    title: art.title,
    description: art.description ?? undefined,
    openGraph: { images: [art.featured_image_url] },
  };
}

export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const art = await getArtworkBySlug(slug);
  if (!art) notFound();

  const all = await getArtworks();
  const related = all
    .filter((a) => a.id !== art.id && a.category_id === art.category_id)
    .slice(0, 5);

  const gallery = [
    art.featured_image_url,
    ...(art.images?.map((i) => i.image_url) ?? []),
  ];

  const canBuy = art.status === "available" || art.status === "reserved";

  return (
    <div className="px-5 pb-24 pt-28 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <Link
          href="/gallery"
          className="mb-8 inline-flex items-center gap-2 text-sm text-ivory-dim transition-colors hover:text-ivory"
        >
          <ArrowLeft size={16} /> Back to gallery
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-black/[0.05] bg-ink-800 shadow-cinematic">
              <Image
                src={gallery[0]}
                alt={art.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {gallery.slice(1).map((src, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-black/[0.05]">
                    <Image src={src} alt={`${art.title} ${i + 2}`} fill sizes="20vw" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex items-center gap-3">
              <StatusBadge status={art.status} />
              {art.category && (
                <span className="text-xs uppercase tracking-[0.2em] text-gold-soft">
                  {art.category.name}
                </span>
              )}
            </div>
            <h1 className="mt-4 font-display text-4xl leading-tight text-ivory md:text-5xl">
              {art.title}
            </h1>
            <p className="mt-3 text-2xl text-gold">
              {formatPrice(art.price, art.currency)}
            </p>

            <p className="mt-6 leading-relaxed text-ivory-muted">{art.description}</p>

            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-black/[0.05] bg-black/[0.05] text-sm">
              <Meta label="Medium" value={art.medium} />
              <Meta label="Dimensions" value={art.dimensions} />
              <Meta label="Year" value={art.year_created?.toString()} />
              <Meta label="Availability" value={art.status} capitalize />
            </dl>

            <div className="mt-8">
              {canBuy ? (
                <div className="rounded-3xl border border-black/[0.05] bg-ink-800/50 p-6">
                  <h2 className="font-display text-xl text-ivory">
                    {art.status === "reserved" ? "Join the waitlist" : "Acquire this piece"}
                  </h2>
                  <p className="mb-5 mt-1 text-sm text-ivory-dim">
                    {art.status === "reserved"
                      ? "This piece is currently reserved. Leave your details and I'll reach out if it becomes available."
                      : "Start a private inquiry to purchase the original or a fine-art print."}
                  </p>
                  <InquiryForm artworkId={art.id} artworkTitle={art.title} />
                </div>
              ) : (
                <div className="rounded-3xl border border-black/[0.05] bg-ink-800/50 p-6 text-center">
                  <p className="font-display text-xl text-ivory">This piece has found its home</p>
                  <p className="mt-1 text-sm text-ivory-dim">
                    Prints may still be available, or commission something similar.
                  </p>
                  <Link href="/commissions" className="btn-ghost mt-5">
                    Commission a related piece
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-6 font-display text-2xl text-ivory md:text-3xl">
              More like this
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {related.map((a) => (
                <ArtworkCard key={a.id} artwork={a} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Meta({
  label,
  value,
  capitalize,
}: {
  label: string;
  value?: string | null;
  capitalize?: boolean;
}) {
  return (
    <div className="bg-ink-800 p-4">
      <dt className="text-xs uppercase tracking-[0.15em] text-ivory-dim">{label}</dt>
      <dd className={`mt-1 text-ivory ${capitalize ? "capitalize" : ""}`}>
        {value ?? "—"}
      </dd>
    </div>
  );
}
