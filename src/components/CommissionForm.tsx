"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Input, Label, Select, Textarea } from "./ui/Field";

const types = [
  "Portrait",
  "Character Design",
  "Illustration",
  "Digital Painting",
  "Short Animation",
  "Other",
];

const budgets = [
  "Under $250",
  "$250 – $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000+",
];

export default function CommissionForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/commissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_name: f.get("client_name"),
        client_email: f.get("client_email"),
        phone_number: f.get("phone_number"),
        commission_type: f.get("commission_type"),
        budget: f.get("budget"),
        deadline: f.get("deadline"),
        description: f.get("description"),
        reference_images: (f.get("reference_images") as string)
          ?.split(/[\n,]/)
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    });
    if (res.ok) setStatus("sent");
    else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-10 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
          <Check size={26} />
        </div>
        <h3 className="mt-5 font-display text-2xl text-ivory">Request received</h3>
        <p className="mx-auto mt-2 max-w-md text-ivory-muted">
          Thank you — your commission request is in. I review each one personally and
          usually respond within a few days with availability and a quote.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="client_name" required>Full name</Label>
          <Input id="client_name" name="client_name" required placeholder="Your name" />
        </div>
        <div>
          <Label htmlFor="client_email" required>Email</Label>
          <Input id="client_email" name="client_email" type="email" required placeholder="you@example.com" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone_number">Phone (optional)</Label>
          <Input id="phone_number" name="phone_number" placeholder="+1 555 000 0000" />
        </div>
        <div>
          <Label htmlFor="commission_type" required>Type of commission</Label>
          <Select id="commission_type" name="commission_type" required defaultValue="">
            <option value="" disabled>Choose one…</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="budget">Budget range</Label>
          <Select id="budget" name="budget" defaultValue="">
            <option value="" disabled>Select a range…</option>
            {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
          </Select>
        </div>
        <div>
          <Label htmlFor="deadline">Ideal deadline</Label>
          <Input id="deadline" name="deadline" type="date" />
        </div>
      </div>

      <div>
        <Label htmlFor="description" required>Tell me about the piece</Label>
        <Textarea
          id="description"
          name="description"
          required
          placeholder="Subject, mood, size, where it will live, references you love…"
        />
      </div>

      <div>
        <Label htmlFor="reference_images">Reference image links (optional)</Label>
        <Textarea
          id="reference_images"
          name="reference_images"
          className="min-h-[80px]"
          placeholder="Paste image URLs, one per line."
        />
      </div>

      {status === "error" && <p className="text-sm text-rose-300">{error}</p>}

      <button type="submit" disabled={status === "sending"} className="btn-gold w-full">
        {status === "sending" ? (
          <><Loader2 size={16} className="animate-spin" /> Sending…</>
        ) : (
          "Submit commission request"
        )}
      </button>
    </form>
  );
}
