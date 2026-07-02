"use client";

import Link from "next/link";
import { ImageIcon, Film, Inbox, DollarSign, ArrowUpRight } from "lucide-react";
import { useAdmin } from "@/lib/adminStore";
import { formatPrice } from "@/lib/utils";
import DemoBanner from "@/components/admin/DemoBanner";
import PageTitle from "@/components/admin/PageTitle";
import StatusBadge from "@/components/StatusBadge";

export default function AdminOverview() {
  const { artworks, animations, commissions, profile } = useAdmin();

  const available = artworks.filter((a) => a.status === "available");
  const sold = artworks.filter((a) => a.status === "sold");
  const newCommissions = commissions.filter((c) => c.status === "new");
  const soldValue = sold.reduce((sum, a) => sum + (a.price ?? 0), 0);

  const stats = [
    { label: "Artworks", value: artworks.length, sub: `${available.length} available`, icon: ImageIcon, href: "/studio/artworks" },
    { label: "Animations", value: animations.length, sub: "published & drafts", icon: Film, href: "/studio/animations" },
    { label: "New requests", value: newCommissions.length, sub: `${commissions.length} total`, icon: Inbox, href: "/studio/commissions" },
    { label: "Sold value", value: formatPrice(soldValue), sub: `${sold.length} pieces`, icon: DollarSign, href: "/studio/artworks" },
  ];

  return (
    <div>
      <DemoBanner />
      <PageTitle
        title={`Welcome back, ${profile.display_name.split(" ")[0]}`}
        subtitle="Here's what's happening in the studio."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-2xl border border-black/[0.05] bg-ink-800/50 p-5 transition-colors hover:border-gold/25"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/10 text-gold">
                <s.icon size={18} />
              </span>
              <ArrowUpRight size={16} className="text-ivory-dim transition-colors group-hover:text-gold" />
            </div>
            <p className="mt-4 font-display text-3xl text-ivory">{s.value}</p>
            <p className="text-sm font-medium text-ivory-muted">{s.label}</p>
            <p className="text-xs text-ivory-dim">{s.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Recent commissions */}
        <div className="rounded-2xl border border-black/[0.05] bg-ink-800/50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl text-ivory">Recent commission requests</h2>
            <Link href="/studio/commissions" className="text-sm text-ivory-dim hover:text-gold">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {commissions.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-xl border border-black/[0.05] bg-ink p-4">
                <div>
                  <p className="font-medium text-ivory">{c.client_name}</p>
                  <p className="text-sm text-ivory-dim">{c.commission_type} · {c.budget ?? "—"}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
            {commissions.length === 0 && (
              <p className="py-8 text-center text-sm text-ivory-dim">No requests yet.</p>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl border border-black/[0.05] bg-ink-800/50 p-6">
          <h2 className="mb-4 font-display text-xl text-ivory">Quick actions</h2>
          <div className="space-y-2">
            <Link href="/studio/artworks" className="btn-ghost w-full justify-between">Upload new artwork <ArrowUpRight size={16} /></Link>
            <Link href="/studio/animations" className="btn-ghost w-full justify-between">Add an animation <ArrowUpRight size={16} /></Link>
            <Link href="/studio/collections" className="btn-ghost w-full justify-between">Create a collection <ArrowUpRight size={16} /></Link>
            <Link href="/studio/profile" className="btn-ghost w-full justify-between">Edit artist profile <ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
