"use client";

import { useState } from "react";
import { Mail, Phone, Calendar, Wallet } from "lucide-react";
import { useAdmin } from "@/lib/adminStore";
import type { CommissionRequest } from "@/lib/types";
import { cn, statusMeta } from "@/lib/utils";
import DemoBanner from "@/components/admin/DemoBanner";
import PageTitle from "@/components/admin/PageTitle";
import Modal from "@/components/admin/Modal";

const statuses: CommissionRequest["status"][] = [
  "new", "reviewing", "accepted", "in_progress", "completed", "rejected",
];

export default function AdminCommissions() {
  const { commissions, setCommissionStatus } = useAdmin();
  const [filter, setFilter] = useState<string>("all");
  const [active, setActive] = useState<CommissionRequest | null>(null);

  const filtered = commissions.filter((c) => filter === "all" || c.status === filter);

  return (
    <div>
      <DemoBanner />
      <PageTitle title="Commission requests" subtitle="Review incoming requests and move them through your pipeline." />

      <div className="mb-6 flex flex-wrap gap-2">
        <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>All ({commissions.length})</FilterPill>
        {statuses.map((s) => {
          const n = commissions.filter((c) => c.status === s).length;
          return (
            <FilterPill key={s} active={filter === s} onClick={() => setFilter(s)}>
              {statusMeta[s].label} ({n})
            </FilterPill>
          );
        })}
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <div key={c.id} className="rounded-2xl border border-black/[0.05] bg-ink-800/40 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <button onClick={() => setActive(c)} className="text-left">
                <p className="font-display text-lg text-ivory hover:text-gold">{c.client_name}</p>
                <p className="text-sm text-gold-soft">{c.commission_type}</p>
                <p className="mt-2 line-clamp-2 max-w-xl text-sm text-ivory-muted">{c.description}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-ivory-dim">
                  <span className="flex items-center gap-1.5"><Wallet size={13} /> {c.budget ?? "—"}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={13} /> {c.deadline ?? "flexible"}</span>
                  <span className="flex items-center gap-1.5"><Mail size={13} /> {c.client_email}</span>
                </div>
              </button>
              <select
                value={c.status}
                onChange={(e) => setCommissionStatus(c.id, e.target.value as CommissionRequest["status"])}
                className={cn("chip cursor-pointer appearance-none rounded-full px-3 py-1.5 outline-none", statusMeta[c.status].className)}
              >
                {statuses.map((s) => <option key={s} value={s} className="bg-ink-800 text-ivory">{statusMeta[s].label}</option>)}
              </select>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-16 text-center text-sm text-ivory-dim">No requests in this status.</p>
        )}
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.client_name ?? ""}>
        {active && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => { setCommissionStatus(active.id, s); setActive({ ...active, status: s }); }}
                  className={cn("chip transition-all", active.status === s ? statusMeta[s].className : "border-black/10 text-ivory-dim hover:text-ivory")}
                >
                  {statusMeta[s].label}
                </button>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Detail icon={Mail} label="Email" value={active.client_email} href={`mailto:${active.client_email}`} />
              <Detail icon={Phone} label="Phone" value={active.phone_number ?? "—"} />
              <Detail icon={Wallet} label="Budget" value={active.budget ?? "—"} />
              <Detail icon={Calendar} label="Deadline" value={active.deadline ?? "Flexible"} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-ivory-dim">Type</p>
              <p className="mt-1 text-ivory">{active.commission_type}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-ivory-dim">Brief</p>
              <p className="mt-1 whitespace-pre-line leading-relaxed text-ivory-muted">{active.description}</p>
            </div>
            {active.reference_images && active.reference_images.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-ivory-dim">References</p>
                <ul className="mt-1 space-y-1 text-sm text-gold-soft">
                  {active.reference_images.map((r, i) => (
                    <li key={i}><a href={r} target="_blank" rel="noreferrer" className="hover:underline">{r}</a></li>
                  ))}
                </ul>
              </div>
            )}
            <a href={`mailto:${active.client_email}?subject=Your commission request`} className="btn-gold w-full">
              <Mail size={16} /> Reply by email
            </a>
          </div>
        )}
      </Modal>
    </div>
  );
}

function FilterPill({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all",
        active ? "border-gold bg-gold text-ink" : "border-black/10 text-ivory-muted hover:border-black/20 hover:text-ivory"
      )}
    >
      {children}
    </button>
  );
}

function Detail({ icon: Icon, label, value, href }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string; href?: string }) {
  const inner = (
    <div className="rounded-xl border border-black/[0.05] bg-ink p-3">
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-ivory-dim"><Icon size={12} /> {label}</p>
      <p className="mt-1 truncate text-sm text-ivory">{value}</p>
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}
