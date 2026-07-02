"use client";

import { useState } from "react";
import { Loader2, Download, Package, Info } from "lucide-react";
import type { Artwork } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Input, Label } from "./ui/Field";

type Format = "artwork_digital" | "artwork_print";

export default function BuyBox({ artwork }: { artwork: Artwork }) {
  const canDigital = artwork.allow_digital && artwork.digital_price != null;
  const canPrint = artwork.allow_print && artwork.print_price != null;

  const [format, setFormat] = useState<Format>(
    canDigital ? "artwork_digital" : "artwork_print"
  );
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const price = format === "artwork_digital" ? artwork.digital_price : artwork.print_price;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    const f = new FormData(e.currentTarget);

    const payload = {
      type: format,
      itemId: artwork.id,
      buyer: {
        name: f.get("name"),
        email: f.get("email"),
        phone: f.get("phone"),
      },
      shipping:
        format === "artwork_print"
          ? {
              name: f.get("ship_name") || f.get("name"),
              address: f.get("ship_address"),
              city: f.get("ship_city"),
              country: f.get("ship_country"),
              phone: f.get("phone"),
            }
          : undefined,
    };

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (data.link) {
      window.location.href = data.link; // → Flutterwave hosted checkout
      return;
    }
    if (data.simulated) {
      setNotice(data.message ?? "Payments aren't live yet in this preview.");
      return;
    }
    setError(data.error ?? "Something went wrong. Please try again.");
  }

  if (!canDigital && !canPrint) {
    return (
      <p className="text-sm text-ivory-dim">
        This piece isn&apos;t currently for sale. Reach out via the contact page for details.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Format selector */}
      <div className="grid grid-cols-2 gap-3">
        {canDigital && (
          <FormatCard
            active={format === "artwork_digital"}
            onClick={() => setFormat("artwork_digital")}
            icon={<Download size={16} />}
            label="Digital copy"
            sub="Instant download"
            price={formatPrice(artwork.digital_price, artwork.currency)}
          />
        )}
        {canPrint && (
          <FormatCard
            active={format === "artwork_print"}
            onClick={() => setFormat("artwork_print")}
            icon={<Package size={16} />}
            label="Printed copy"
            sub="Shipped to you"
            price={formatPrice(artwork.print_price, artwork.currency)}
          />
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" required>Full name</Label>
          <Input id="name" name="name" required placeholder="Your name" />
        </div>
        <div>
          <Label htmlFor="email" required>Email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@example.com" />
        </div>
      </div>
      <div>
        <Label htmlFor="phone">Phone (for delivery updates)</Label>
        <Input id="phone" name="phone" placeholder="+256 7XX XXX XXX" />
      </div>

      {/* Shipping — print only */}
      {format === "artwork_print" && (
        <div className="space-y-4 rounded-2xl border border-black/[0.06] bg-ink p-4">
          <p className="flex items-center gap-2 text-sm font-medium text-ivory">
            <Package size={15} className="text-gold" /> Shipping address
          </p>
          <div>
            <Label htmlFor="ship_address" required>Address</Label>
            <Input id="ship_address" name="ship_address" required placeholder="Street, building, apartment" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="ship_city" required>City / Town</Label>
              <Input id="ship_city" name="ship_city" required placeholder="Kampala" />
            </div>
            <div>
              <Label htmlFor="ship_country" required>Country</Label>
              <Input id="ship_country" name="ship_country" required defaultValue="Uganda" />
            </div>
          </div>
        </div>
      )}

      {notice && (
        <p className="flex items-start gap-2 rounded-xl border border-gold/25 bg-gold/5 px-3 py-2 text-sm text-ivory-muted">
          <Info size={16} className="mt-0.5 flex-none text-gold" /> {notice}
        </p>
      )}
      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button type="submit" disabled={loading} className="btn-gold w-full">
        {loading ? (
          <><Loader2 size={16} className="animate-spin" /> Redirecting to checkout…</>
        ) : (
          <>Pay {formatPrice(price, artwork.currency)} · Flutterwave</>
        )}
      </button>
      <p className="text-center text-xs text-ivory-dim">
        Secure payment via Flutterwave — cards, mobile money & bank transfer.
      </p>
    </form>
  );
}

function FormatCard({
  active,
  onClick,
  icon,
  label,
  sub,
  price,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  sub: string;
  price: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border-2 p-4 text-left transition-all ${
        active ? "border-gold bg-gold/5" : "border-black/[0.08] hover:border-black/20"
      }`}
    >
      <span className={`flex items-center gap-2 text-sm font-medium ${active ? "text-gold-deep" : "text-ivory"}`}>
        {icon} {label}
      </span>
      <span className="mt-1 block text-xs text-ivory-dim">{sub}</span>
      <span className="mt-2 block font-mono text-sm text-ivory">{price}</span>
    </button>
  );
}
