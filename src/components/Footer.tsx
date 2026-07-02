import Link from "next/link";
import { Instagram, Twitter, Mail } from "lucide-react";
import { getProfile } from "@/lib/data";

export default async function Footer() {
  const profile = await getProfile();

  return (
    <footer className="border-t border-black/[0.05] bg-ink-800/40">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-16 md:grid-cols-[1.5fr_1fr_1fr] md:px-10">
        <div>
          <h3 className="font-display text-2xl text-ivory">{profile.display_name}</h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ivory-muted">
            {profile.tagline}
          </p>
          <div className="mt-6 flex items-center gap-3">
            {profile.instagram && (
              <a
                href={`https://instagram.com/${profile.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full border border-black/10 text-ivory-muted transition-colors hover:border-gold/40 hover:text-gold"
              >
                <Instagram size={16} />
              </a>
            )}
            {profile.twitter && (
              <a
                href={`https://twitter.com/${profile.twitter}`}
                target="_blank"
                rel="noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full border border-black/10 text-ivory-muted transition-colors hover:border-gold/40 hover:text-gold"
              >
                <Twitter size={16} />
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="grid h-10 w-10 place-items-center rounded-full border border-black/10 text-ivory-muted transition-colors hover:border-gold/40 hover:text-gold"
              >
                <Mail size={16} />
              </a>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ivory-dim">Explore</p>
          <ul className="mt-4 space-y-3 text-sm text-ivory-muted">
            <li><Link href="/gallery" className="hover:text-ivory">Gallery</Link></li>
            <li><Link href="/animations" className="hover:text-ivory">Animations</Link></li>
            <li><Link href="/marketplace" className="hover:text-ivory">Marketplace</Link></li>
            <li><Link href="/courses" className="hover:text-ivory">Courses</Link></li>
            <li><Link href="/about" className="hover:text-ivory">About the artist</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ivory-dim">Work with me</p>
          <ul className="mt-4 space-y-3 text-sm text-ivory-muted">
            <li><Link href="/commissions" className="hover:text-ivory">Commission a piece</Link></li>
            <li><Link href="/support" className="hover:text-ivory">Support the studio</Link></li>
            <li><Link href="/contact" className="hover:text-ivory">Business inquiries</Link></li>
            <li><Link href="/studio" className="hover:text-ivory">Studio dashboard</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-black/[0.05]">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-ivory-dim md:flex-row md:px-10">
          <p>© {new Date().getFullYear()} {profile.display_name}. All works and rights reserved.</p>
          <p>{profile.location}</p>
        </div>
      </div>
    </footer>
  );
}
