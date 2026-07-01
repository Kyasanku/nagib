import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Package, Palette } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ArtworkCard from "@/components/ArtworkCard";
import { getArtworks } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Original artworks and prints available to acquire.",
};

export default async function MarketplacePage() {
  const artworks = await getArtworks();
  const forSale = artworks.filter(
    (a) => a.status === "available" || a.status === "reserved"
  );
  const available = forSale.filter((a) => a.status === "available");

  const prices = available.map((a) => a.price ?? 0).filter(Boolean);
  const from = prices.length ? Math.min(...prices) : null;

  return (
    <div className="px-5 pb-24 pt-32 md:px-10">
      <PageHeader
        eyebrow="Collect original work"
        title="Marketplace"
        subtitle={
          from
            ? `Original pieces and archival prints, from ${formatPrice(from)}. Every acquisition begins as a private conversation — no checkout, no pressure.`
            : "Original pieces and archival prints. Every acquisition begins as a private conversation."
        }
      />

      {/* Trust strip */}
      <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
        {[
          { icon: ShieldCheck, title: "Authenticity", text: "Signed certificate with every original." },
          { icon: Package, title: "Careful shipping", text: "Museum-grade packing, insured worldwide." },
          { icon: Palette, title: "Prints too", text: "Archival giclée prints on request." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-black/[0.05] bg-ink-800/40 p-5">
            <f.icon size={20} className="text-gold" />
            <p className="mt-3 font-medium text-ivory">{f.title}</p>
            <p className="mt-1 text-sm text-ivory-dim">{f.text}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-14 max-w-[1400px]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl text-ivory">Available now</h2>
          <span className="text-sm text-ivory-dim">{forSale.length} pieces</span>
        </div>

        {forSale.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border border-dashed border-black/10 py-24 text-center">
            <p className="font-display text-2xl text-ivory">Everything&apos;s currently spoken for</p>
            <p className="mt-2 text-sm text-ivory-dim">
              New work drops regularly — or commission something of your own.
            </p>
            <Link href="/commissions" className="btn-gold mt-6">Commission a piece</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {forSale.map((a) => (
              <ArtworkCard key={a.id} artwork={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
