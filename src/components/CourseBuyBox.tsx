"use client";

import { useState } from "react";
import { Loader2, Info } from "lucide-react";
import type { Course } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Input, Label } from "./ui/Field";

export default function CourseBuyBox({ course }: { course: Course }) {
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "course",
        itemId: course.id,
        buyer: { name: f.get("name"), email: f.get("email"), phone: f.get("phone") },
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (data.link) {
      window.location.href = data.link;
      return;
    }
    if (data.simulated) {
      setNotice(data.message ?? "Payments aren't live yet in this preview.");
      return;
    }
    setError(data.error ?? "Something went wrong. Please try again.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-ivory-muted">One-time purchase · lifetime access</span>
        <span className="font-display text-2xl text-gold">
          {formatPrice(course.price, course.currency)}
        </span>
      </div>
      <div>
        <Label htmlFor="name" required>Full name</Label>
        <Input id="name" name="name" required placeholder="Your name" />
      </div>
      <div>
        <Label htmlFor="email" required>Email</Label>
        <Input id="email" name="email" type="email" required placeholder="you@example.com" />
        <p className="mt-1 text-xs text-ivory-dim">Your access link is tied to this email.</p>
      </div>
      <div>
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" name="phone" placeholder="+256 7XX XXX XXX" />
      </div>

      {notice && (
        <p className="flex items-start gap-2 rounded-xl border border-gold/25 bg-gold/5 px-3 py-2 text-sm text-ivory-muted">
          <Info size={16} className="mt-0.5 flex-none text-gold" /> {notice}
        </p>
      )}
      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button type="submit" disabled={loading} className="btn-gold w-full">
        {loading ? (
          <><Loader2 size={16} className="animate-spin" /> Redirecting…</>
        ) : (
          <>Enrol · {formatPrice(course.price, course.currency)}</>
        )}
      </button>
      <p className="text-center text-xs text-ivory-dim">
        Secure payment via Flutterwave — cards, mobile money & bank transfer.
      </p>
    </form>
  );
}
