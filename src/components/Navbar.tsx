"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/gallery", label: "Gallery" },
  { href: "/animations", label: "Animations" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/courses", label: "Courses" },
  { href: "/commissions", label: "Commissions" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-ink/80 backdrop-blur-xl border-b border-black/[0.05]"
          : "bg-gradient-to-b from-ink/80 to-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 md:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 bg-gold/10 font-display text-lg text-gold transition-colors group-hover:bg-gold/20">
            N
          </span>
          <span className="font-display text-lg tracking-tight text-ivory">
            Nagibu Semwanga
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "link-underline text-sm font-medium transition-colors",
                pathname.startsWith(l.href)
                  ? "text-ivory"
                  : "text-ivory-muted hover:text-ivory"
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/commissions" className="btn-gold !px-5 !py-2">
            Request a piece
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-full border border-black/10 text-ivory md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-black/[0.05] bg-ink/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col px-5 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="border-b border-black/[0.05] py-3 text-ivory-muted"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/commissions" className="btn-gold mt-4">
              Request a piece
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
