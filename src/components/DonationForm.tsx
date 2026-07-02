"use client";

import { useState } from "react";
import { Heart, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Input, Label, Textarea } from "./ui/Field";

// STUB: collects intent but does not charge yet. When Flutterwave donations
// are switched on later, this posts to /api/checkout with type "donation".
const presets = [20000, 50000, 100000, 250000];

export default function DonationForm() {
  const [amount, setAmount] = useState<number>(50000);
  const [custom, setCustom] = useState("");
  const [done, setDone] = useState(false);

  const chosen = custom ? Number(custom) || 0 : amount;

  if (done) {
    return (
      <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-600">
          <Check size={26} />
        </div>
        <h3 className="mt-5 font-display text-2xl text-ivory">Thank you 🧡</h3>
        <p className="mx-auto mt-2 max-w-sm text-ivory-muted">
          Your support means the world. Online giving is switching on soon — I&apos;ve noted
          your interest and will reach out with a way to contribute.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
      className="space-y-5"
    >
      <div>
        <Label>Choose an amount</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {presets.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => { setAmount(p); setCustom(""); }}
              className={`rounded-xl border-2 px-3 py-3 font-mono text-sm transition-all ${
                !custom && amount === p
                  ? "border-gold bg-gold/5 text-gold-deep"
                  : "border-black/[0.08] text-ivory hover:border-black/20"
              }`}
            >
              {formatPrice(p, "UGX")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="custom">Custom amount (UGX)</Label>
          <Input
            id="custom"
            inputMode="numeric"
            value={custom}
            onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="e.g. 75000"
          />
        </div>
        <div>
          <Label htmlFor="don_name">Name (optional)</Label>
          <Input id="don_name" name="don_name" placeholder="Your name" />
        </div>
      </div>

      <div>
        <Label htmlFor="don_email">Email (optional)</Label>
        <Input id="don_email" name="don_email" type="email" placeholder="you@example.com" />
      </div>
      <div>
        <Label htmlFor="don_message">A note (optional)</Label>
        <Textarea id="don_message" name="don_message" className="min-h-[80px]" placeholder="Say hello…" />
      </div>

      <button type="submit" className="btn-gold w-full">
        <Heart size={16} /> Support with {formatPrice(chosen || 0, "UGX")}
      </button>
      <p className="text-center text-xs text-ivory-dim">
        Online payments for donations are coming soon — this registers your interest.
      </p>
    </form>
  );
}
