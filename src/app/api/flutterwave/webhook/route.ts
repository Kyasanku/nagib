import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
  FLW_WEBHOOK_HASH,
  verifyTransaction,
} from "@/lib/flutterwave";
import { fulfillOrder } from "@/lib/orders";

// Authoritative fulfilment. Configure the endpoint + "secret hash" in the
// Flutterwave dashboard (Settings → Webhooks). We re-verify every event
// against the API before granting anything.
export async function POST(request: Request) {
  const signature = request.headers.get("verif-hash");
  if (!FLW_WEBHOOK_HASH || signature !== FLW_WEBHOOK_HASH) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const service = createServiceClient();
  if (!service) return NextResponse.json({ ok: false }, { status: 200 });

  const event = await request.json().catch(() => null);
  const data = event?.data;
  const transactionId = data?.id;
  const txRef = data?.tx_ref;

  if (!transactionId || !txRef) {
    return NextResponse.json({ ok: true }); // ignore non-charge events
  }

  try {
    const verified = await verifyTransaction(transactionId);
    await fulfillOrder(service, txRef, verified);
  } catch {
    // Swallow — respond 200 so Flutterwave doesn't hammer retries forever;
    // the redirect callback provides a second chance.
  }

  return NextResponse.json({ ok: true });
}
