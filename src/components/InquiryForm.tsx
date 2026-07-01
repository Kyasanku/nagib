"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Input, Label, Textarea } from "./ui/Field";

export default function InquiryForm({
  artworkId,
  artworkTitle,
}: {
  artworkId: string;
  artworkTitle: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        artwork_id: artworkId,
        buyer_name: form.get("buyer_name"),
        buyer_email: form.get("buyer_email"),
        message: form.get("message"),
      }),
    });
    if (res.ok) {
      setStatus("sent");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
          <Check size={22} />
        </div>
        <p className="mt-4 font-display text-xl text-ivory">Inquiry sent</p>
        <p className="mt-1 text-sm text-ivory-muted">
          Thank you for your interest in <em>{artworkTitle}</em>. You&apos;ll hear back shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="buyer_name" required>Your name</Label>
        <Input id="buyer_name" name="buyer_name" required placeholder="Jane Collector" />
      </div>
      <div>
        <Label htmlFor="buyer_email" required>Email</Label>
        <Input id="buyer_email" name="buyer_email" type="email" required placeholder="you@example.com" />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" placeholder={`I'd love to know more about "${artworkTitle}"…`} />
      </div>
      {status === "error" && <p className="text-sm text-rose-300">{error}</p>}
      <button type="submit" disabled={status === "sending"} className="btn-gold w-full">
        {status === "sending" ? (
          <><Loader2 size={16} className="animate-spin" /> Sending…</>
        ) : (
          "Send purchase inquiry"
        )}
      </button>
      <p className="text-center text-xs text-ivory-dim">
        No payment is taken now — this starts a conversation with the artist.
      </p>
    </form>
  );
}
