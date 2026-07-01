"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Input, Label, Textarea } from "./ui/Field";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        artwork_id: null,
        buyer_name: f.get("name"),
        buyer_email: f.get("email"),
        message: `[${f.get("subject")}] ${f.get("message")}`,
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
        <h3 className="mt-5 font-display text-2xl text-ivory">Message sent</h3>
        <p className="mt-2 text-ivory-muted">Thanks for reaching out — I&apos;ll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" required>Name</Label>
          <Input id="name" name="name" required placeholder="Your name" />
        </div>
        <div>
          <Label htmlFor="email" required>Email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@example.com" />
        </div>
      </div>
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" placeholder="Collaboration, licensing, press…" />
      </div>
      <div>
        <Label htmlFor="message" required>Message</Label>
        <Textarea id="message" name="message" required placeholder="How can I help?" />
      </div>
      {status === "error" && <p className="text-sm text-rose-300">{error}</p>}
      <button type="submit" disabled={status === "sending"} className="btn-gold w-full">
        {status === "sending" ? (
          <><Loader2 size={16} className="animate-spin" /> Sending…</>
        ) : (
          "Send message"
        )}
      </button>
    </form>
  );
}
