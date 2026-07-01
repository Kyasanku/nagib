import type { Metadata } from "next";
import { Mail, MapPin, Instagram, Clock } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import { getProfile } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "For serious buyers, collaborations and business inquiries.",
};

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <div className="px-5 pb-24 pt-32 md:px-10">
      <PageHeader
        eyebrow="Let's talk"
        title="Contact"
        subtitle="For serious collectors, licensing, exhibitions, press and collaborations. For custom work, the commission form is the fastest route."
      />

      <div className="mx-auto mt-14 grid max-w-[1100px] gap-10 lg:grid-cols-[1fr_1.2fr]">
        {/* Info */}
        <div className="space-y-6">
          <InfoRow icon={Mail} label="Email" value={profile.email ?? "studio@example.com"} href={`mailto:${profile.email}`} />
          <InfoRow icon={MapPin} label="Studio" value={profile.location ?? "—"} />
          {profile.instagram && (
            <InfoRow
              icon={Instagram}
              label="Instagram"
              value={`@${profile.instagram}`}
              href={`https://instagram.com/${profile.instagram}`}
            />
          )}
          <InfoRow icon={Clock} label="Response time" value="Usually within 2–3 business days" />

          <div className="rounded-2xl border border-black/[0.05] bg-ink-800/40 p-6">
            <p className="font-display text-lg text-ivory">A note on originals</p>
            <p className="mt-2 text-sm leading-relaxed text-ivory-muted">
              Serious about a specific piece? Mention its title and I&apos;ll send
              condition details, framing options and shipping quotes.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-black/[0.05] bg-ink-800/40 p-6 md:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-4 rounded-2xl border border-black/[0.05] bg-ink-800/40 p-5 transition-colors hover:border-gold/25">
      <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-gold/10 text-gold">
        <Icon size={18} />
      </span>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-ivory-dim">{label}</p>
        <p className="mt-1 text-ivory">{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noreferrer">{content}</a> : content;
}
