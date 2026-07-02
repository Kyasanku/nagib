import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { verifyTransaction } from "@/lib/flutterwave";
import { fulfillOrder } from "@/lib/orders";

// Flutterwave redirects the buyer here after payment. We verify server-side,
// fulfil the order, then bounce to a friendly status page. (The webhook is the
// authoritative fallback in case the buyer closes the tab.)
export async function GET(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const txRef = url.searchParams.get("tx_ref") ?? "";
  const transactionId = url.searchParams.get("transaction_id") ?? "";
  const origin = process.env.NEXT_PUBLIC_BASE_URL || url.origin;

  const fail = (ref: string) =>
    NextResponse.redirect(`${origin}/checkout/status?state=failed&ref=${ref}`);

  const service = createServiceClient();
  if (!service) return fail(txRef);

  if (status === "cancelled" || !transactionId) return fail(txRef);

  try {
    const verified = await verifyTransaction(transactionId);
    const result = await fulfillOrder(service, verified.tx_ref || txRef, verified);
    if (!result.ok) return fail(txRef);

    const params = new URLSearchParams({ state: "success", ref: verified.tx_ref || txRef });
    if (result.enrollmentId) params.set("e", result.enrollmentId);
    if (result.slug) params.set("course", result.slug);
    return NextResponse.redirect(`${origin}/checkout/status?${params.toString()}`);
  } catch {
    return fail(txRef);
  }
}
