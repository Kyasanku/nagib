import type { Metadata } from "next";
import { PenTool, Users, Film, ImageIcon } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CommissionForm from "@/components/CommissionForm";

export const metadata: Metadata = {
  title: "Commissions",
  description: "Request a custom drawing, portrait, character design or short animation.",
};

const offerings = [
  { icon: ImageIcon, title: "Portraits", text: "People, pets, places — painted with warmth." },
  { icon: Users, title: "Character Design", text: "Original characters, sheets & turnarounds." },
  { icon: PenTool, title: "Illustration", text: "Editorial, book covers, key art." },
  { icon: Film, title: "Short Animation", text: "Loops, logo stings, motion tests." },
];

const steps = [
  { n: "01", title: "You share the vision", text: "Fill in the form with as much detail as you like." },
  { n: "02", title: "We shape it together", text: "I reply with availability, a quote and a timeline." },
  { n: "03", title: "Sketch & approval", text: "You sign off on thumbnails before I go to final." },
  { n: "04", title: "Delivery", text: "High-res files, and originals shipped if applicable." },
];

export default function CommissionsPage() {
  return (
    <div className="px-5 pb-24 pt-32 md:px-10">
      <PageHeader
        eyebrow="Limited slots each season"
        title="Commission a piece"
        subtitle="Tell me what you're dreaming of. From a single portrait to an animated sequence — let's make something that only exists because you asked for it."
      />

      {/* Offerings */}
      <div className="mx-auto mt-12 grid max-w-4xl gap-4 grid-cols-2 lg:grid-cols-4">
        {offerings.map((o) => (
          <div key={o.title} className="rounded-2xl border border-black/[0.06] bg-ink-800 p-5 shadow-soft transition-all hover:-translate-y-1 hover:border-gold/25">
            <o.icon size={22} className="text-gold" />
            <p className="mt-3 font-medium text-ivory">{o.title}</p>
            <p className="mt-1 text-sm text-ivory-dim">{o.text}</p>
          </div>
        ))}
      </div>

      {/* Horizontal split: centered content on the left, form on the right */}
      <div className="mx-auto mt-16 grid max-w-[1200px] items-center gap-12 lg:grid-cols-2">
        {/* Left — centered content */}
        <div className="flex flex-col items-center text-center">
          <p className="eyebrow">The process</p>
          <h2 className="mt-2 font-display text-3xl text-ivory md:text-4xl">How it works</h2>
          <p className="mt-3 max-w-md text-ivory-muted">
            Four simple steps from first spark to finished piece.
          </p>

          <ol className="mt-8 w-full max-w-sm space-y-6">
            {steps.map((s) => (
              <li key={s.n} className="flex flex-col items-center gap-1 text-center">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/30 bg-gold/10 font-mono text-sm text-gold-deep">
                  {s.n}
                </span>
                <p className="mt-1 font-medium text-ivory">{s.title}</p>
                <p className="max-w-xs text-sm text-ivory-muted">{s.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-8 max-w-sm rounded-2xl border border-gold/20 bg-gold/5 p-5 text-sm text-ivory-muted">
            A 50% deposit secures your slot. Timelines vary by scope — animations
            typically take longer than stills.
          </div>
        </div>

        {/* Right — the form */}
        <div className="rounded-[2rem] border border-black/[0.06] bg-ink-800 p-6 shadow-cinematic md:p-8">
          <h2 className="font-display text-2xl text-ivory">Start your request</h2>
          <p className="mb-6 mt-1 text-sm text-ivory-dim">
            Fields marked <span className="text-gold">*</span> are required.
          </p>
          <CommissionForm />
        </div>
      </div>
    </div>
  );
}
