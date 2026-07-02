import type { Metadata } from "next";
import { Heart, Sparkles, Palette } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DonationForm from "@/components/DonationForm";

export const metadata: Metadata = {
  title: "Support the studio",
  description: "Support Nagibu's practice — help fund new work, animations and free lessons.",
};

const reasons = [
  { icon: Palette, title: "New work", text: "Materials, prints and studio time for the next series." },
  { icon: Sparkles, title: "Animation", text: "Teaching the drawings to move takes time — lots of frames." },
  { icon: Heart, title: "Free lessons", text: "Keeping some tutorials free for young artists in Kampala." },
];

export default function SupportPage() {
  return (
    <div className="px-5 pb-24 pt-32 md:px-10">
      <PageHeader
        eyebrow="Coming soon · patrons"
        title="Support the studio"
        subtitle="If the work has meant something to you, you can help fund what comes next. Online giving is being switched on soon."
      />

      <div className="mx-auto mt-14 grid max-w-[1100px] gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          {reasons.map((r) => (
            <div key={r.title} className="flex items-start gap-4 rounded-2xl border border-black/[0.06] bg-ink-800 p-5 shadow-soft">
              <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-gold/10 text-gold">
                <r.icon size={18} />
              </span>
              <div>
                <p className="font-medium text-ivory">{r.title}</p>
                <p className="mt-1 text-sm text-ivory-muted">{r.text}</p>
              </div>
            </div>
          ))}
          <div className="rounded-2xl border border-gold/20 bg-gold/5 p-5 text-sm text-ivory-muted">
            <span className="font-medium text-ivory">Heads up:</span> this is a preview.
            Donations aren&apos;t charged yet — the button simply registers your interest so
            we can reach out when giving goes live.
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/[0.06] bg-ink-800 p-6 shadow-cinematic md:p-8">
          <DonationForm />
        </div>
      </div>
    </div>
  );
}
