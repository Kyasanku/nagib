import { type ClassValue, clsx } from "clsx";
import type { Artwork } from "./types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Lowest enabled purchase price for an artwork (digital vs print),
// falling back to the legacy `price` field.
export function artworkFromPrice(a: Artwork): number | null {
  const opts: number[] = [];
  if (a.allow_digital && a.digital_price != null) opts.push(a.digital_price);
  if (a.allow_print && a.print_price != null) opts.push(a.print_price);
  if (!opts.length && a.price != null) opts.push(a.price);
  return opts.length ? Math.min(...opts) : null;
}

// True when the artwork offers more than one purchase format (so UIs can
// show a "From" prefix).
export function artworkHasMultipleFormats(a: Artwork): boolean {
  return (
    !!(a.allow_digital && a.digital_price != null) &&
    !!(a.allow_print && a.print_price != null)
  );
}

export function formatPrice(price: number | null, currency = "UGX") {
  if (price === null || price === undefined) return "Price on request";
  try {
    return new Intl.NumberFormat(currency === "UGX" ? "en-UG" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currency} ${price.toLocaleString()}`;
  }
}

// Light-theme badge palettes: deep readable text on a soft tint.
export const statusMeta: Record<
  string,
  { label: string; className: string }
> = {
  available: { label: "Available", className: "text-emerald-700 border-emerald-600/20 bg-emerald-500/10" },
  sold: { label: "Sold", className: "text-ivory-muted border-black/10 bg-black/[0.04]" },
  reserved: { label: "Reserved", className: "text-gold-deep border-gold/30 bg-gold/10" },
  hidden: { label: "Hidden", className: "text-ivory-dim border-black/10 bg-black/[0.04]" },
  published: { label: "Published", className: "text-emerald-700 border-emerald-600/20 bg-emerald-500/10" },
  draft: { label: "Draft", className: "text-ivory-muted border-black/10 bg-black/[0.04]" },
  new: { label: "New", className: "text-sky-700 border-sky-600/20 bg-sky-500/10" },
  reviewing: { label: "Reviewing", className: "text-gold-deep border-gold/30 bg-gold/10" },
  accepted: { label: "Accepted", className: "text-emerald-700 border-emerald-600/20 bg-emerald-500/10" },
  in_progress: { label: "In Progress", className: "text-violet-700 border-violet-600/20 bg-violet-500/10" },
  completed: { label: "Completed", className: "text-emerald-700 border-emerald-600/20 bg-emerald-500/10" },
  rejected: { label: "Rejected", className: "text-rose-700 border-rose-600/20 bg-rose-500/10" },
};

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
