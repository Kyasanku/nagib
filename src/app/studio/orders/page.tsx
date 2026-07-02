"use client";

import { useState } from "react";
import { Package, Download, GraduationCap, Truck } from "lucide-react";
import { useAdmin } from "@/lib/adminStore";
import { cn, formatPrice, statusMeta } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";
import DemoBanner from "@/components/admin/DemoBanner";
import PageTitle from "@/components/admin/PageTitle";

const orderStatuses: OrderStatus[] = ["pending", "paid", "shipped", "failed", "refunded"];

const typeMeta: Record<string, { label: string; icon: typeof Package }> = {
  artwork_digital: { label: "Digital art", icon: Download },
  artwork_print: { label: "Print", icon: Package },
  course: { label: "Course", icon: GraduationCap },
  donation: { label: "Donation", icon: Package },
};

// Light-theme badges for order statuses (statusMeta covers most; add order-only).
const orderBadge: Record<string, string> = {
  pending: "text-amber-700 border-amber-600/20 bg-amber-500/10",
  paid: "text-emerald-700 border-emerald-600/20 bg-emerald-500/10",
  shipped: "text-sky-700 border-sky-600/20 bg-sky-500/10",
  failed: "text-rose-700 border-rose-600/20 bg-rose-500/10",
  refunded: "text-ivory-muted border-black/10 bg-black/[0.04]",
};

export default function AdminOrders() {
  const { orders, setOrderStatus } = useAdmin();
  const [filter, setFilter] = useState<string>("all");

  const filtered = orders.filter((o) => filter === "all" || o.status === filter);
  const revenue = orders
    .filter((o) => o.status === "paid" || o.status === "shipped")
    .reduce((s, o) => s + Number(o.amount), 0);

  return (
    <div>
      <DemoBanner />
      <PageTitle
        title="Orders"
        subtitle="Every purchase flows here. Mark prints as shipped once posted."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Total orders" value={orders.length.toString()} />
        <Stat label="Paid revenue" value={formatPrice(revenue, "UGX")} />
        <Stat label="Awaiting shipping" value={orders.filter((o) => o.item_type === "artwork_print" && o.status === "paid").length.toString()} />
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <Pill active={filter === "all"} onClick={() => setFilter("all")}>All ({orders.length})</Pill>
        {orderStatuses.map((s) => (
          <Pill key={s} active={filter === s} onClick={() => setFilter(s)}>
            {statusMeta[s]?.label ?? s} ({orders.filter((o) => o.status === s).length})
          </Pill>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-black/10 py-20 text-center">
          <p className="font-display text-xl text-ivory">No orders yet</p>
          <p className="mt-1 text-sm text-ivory-dim">
            Orders appear here once payments go live and a customer checks out.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <OrderRow key={o.id} order={o} onStatus={(s) => setOrderStatus(o.id, s)} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderRow({ order, onStatus }: { order: Order; onStatus: (s: OrderStatus) => void }) {
  const meta = typeMeta[order.item_type] ?? typeMeta.artwork_print;
  const Icon = meta.icon;
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-ink-800 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Icon size={15} className="text-gold" />
            <p className="font-medium text-ivory">{order.item_title || meta.label}</p>
            <span className={cn("chip", orderBadge[order.status])}>{order.status}</span>
          </div>
          <p className="mt-1 text-sm text-ivory-muted">
            {order.buyer_name} · {order.buyer_email}
          </p>
          {order.item_type === "artwork_print" && order.shipping_address && (
            <p className="mt-1 text-xs text-ivory-dim">
              Ship to: {order.shipping_name}, {order.shipping_address}, {order.shipping_city}, {order.shipping_country}
            </p>
          )}
          <p className="mt-1 font-mono text-xs text-ivory-dim">{order.reference}</p>
        </div>
        <div className="flex flex-none items-center gap-3">
          <span className="font-mono text-sm text-ivory">{formatPrice(Number(order.amount), order.currency)}</span>
          {order.item_type === "artwork_print" && order.status === "paid" && (
            <button onClick={() => onStatus("shipped")} className="btn-ghost !py-2 !text-xs">
              <Truck size={14} /> Mark shipped
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-ink-800 p-5">
      <p className="text-xs uppercase tracking-[0.15em] text-ivory-dim">{label}</p>
      <p className="mt-1 font-display text-2xl text-ivory">{value}</p>
    </div>
  );
}

function Pill({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all",
        active ? "border-gold bg-gold text-white" : "border-black/10 text-ivory-muted hover:border-black/20 hover:text-ivory"
      )}
    >
      {children}
    </button>
  );
}
