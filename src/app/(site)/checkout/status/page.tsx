import Link from "next/link";
import { Check, Download, Play, Package, XCircle } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/service";

export const metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; ref?: string; e?: string; course?: string }>;
}) {
  const { state, ref, e, course } = await searchParams;
  const success = state === "success";

  // Resolve the order so we can show the right fulfilment action.
  let order:
    | { id: string; item_type: string; item_title: string; status: string }
    | null = null;
  const service = createServiceClient();
  if (service && ref) {
    const { data } = await service
      .from("orders")
      .select("id, item_type, item_title, status")
      .eq("reference", ref)
      .single();
    order = data ?? null;
  }

  return (
    <div className="grid min-h-[70vh] place-items-center px-5 pt-28">
      <div className="w-full max-w-md rounded-[2rem] border border-black/[0.06] bg-ink-800 p-8 text-center shadow-cinematic">
        {success ? (
          <>
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-600">
              <Check size={28} />
            </div>
            <h1 className="mt-5 font-display text-3xl text-ivory">Payment received</h1>
            <p className="mt-2 text-ivory-muted">
              {order?.item_title
                ? <>Thank you — your purchase of <em>{order.item_title}</em> is confirmed.</>
                : "Thank you — your purchase is confirmed."}
            </p>

            <div className="mt-7 space-y-3">
              {order?.item_type === "artwork_digital" && (
                <a href={`/api/deliverables/${order.id}`} className="btn-gold w-full">
                  <Download size={16} /> Download your file
                </a>
              )}
              {order?.item_type === "course" && course && (
                <Link
                  href={`/courses/${course}${e ? `?e=${e}` : ""}`}
                  className="btn-gold w-full"
                >
                  <Play size={16} fill="currentColor" /> Start watching
                </Link>
              )}
              {order?.item_type === "artwork_print" && (
                <p className="flex items-center justify-center gap-2 rounded-xl border border-black/[0.06] bg-ink px-4 py-3 text-sm text-ivory-muted">
                  <Package size={16} className="text-gold" /> Your print is being prepared for shipping.
                </p>
              )}
              <Link href="/gallery" className="btn-ghost w-full">Keep browsing</Link>
            </div>

            <p className="mt-5 text-xs text-ivory-dim">
              A receipt reference: <span className="font-mono">{ref}</span>
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-rose-500/15 text-rose-600">
              <XCircle size={28} />
            </div>
            <h1 className="mt-5 font-display text-3xl text-ivory">Payment not completed</h1>
            <p className="mt-2 text-ivory-muted">
              No charge was made, or the payment was cancelled. You can try again anytime.
            </p>
            <div className="mt-7 space-y-3">
              <Link href="/marketplace" className="btn-gold w-full">Back to the marketplace</Link>
              <Link href="/contact" className="btn-ghost w-full">Need help? Contact the studio</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
