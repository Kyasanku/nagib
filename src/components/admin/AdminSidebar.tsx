"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ImageIcon,
  Film,
  GraduationCap,
  ShoppingBag,
  FolderTree,
  Layers,
  Inbox,
  Star,
  UserCog,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const nav = [
  { href: "/studio", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/studio/artworks", label: "Artworks", icon: ImageIcon },
  { href: "/studio/animations", label: "Animations", icon: Film },
  { href: "/studio/courses", label: "Courses", icon: GraduationCap },
  { href: "/studio/orders", label: "Orders", icon: ShoppingBag },
  { href: "/studio/categories", label: "Categories", icon: FolderTree },
  { href: "/studio/collections", label: "Collections", icon: Layers },
  { href: "/studio/commissions", label: "Commissions", icon: Inbox },
  { href: "/studio/featured", label: "Homepage", icon: Star },
  { href: "/studio/profile", label: "Profile", icon: UserCog },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/studio/login");
  }

  return (
    <aside className="sticky top-0 flex h-screen w-16 flex-col border-r border-black/[0.05] bg-ink-800/60 py-5 md:w-60">
      <Link href="/studio" className="mb-8 flex items-center gap-3 px-3 md:px-5">
        <span className="grid h-9 w-9 flex-none place-items-center rounded-full border border-gold/40 bg-gold/10 font-display text-lg text-gold">
          N
        </span>
        <span className="hidden font-display text-lg text-ivory md:block">Studio</span>
      </Link>

      <nav className="flex-1 space-y-1 px-2 md:px-3">
        {nav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-gold/15 text-gold"
                  : "text-ivory-muted hover:bg-black/[0.05] hover:text-ivory"
              )}
            >
              <item.icon size={18} className="flex-none" />
              <span className="hidden md:block">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-black/[0.05] px-2 pt-3 md:px-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ivory-muted transition-colors hover:bg-black/[0.05] hover:text-ivory"
        >
          <ExternalLink size={18} className="flex-none" />
          <span className="hidden md:block">View site</span>
        </Link>
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ivory-muted transition-colors hover:bg-black/[0.05] hover:text-rose-300"
        >
          <LogOut size={18} className="flex-none" />
          <span className="hidden md:block">Sign out</span>
        </button>
      </div>
    </aside>
  );
}
