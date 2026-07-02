// Thin server-side wrapper over the Flutterwave v3 API.
// Docs: https://developer.flutterwave.com/docs/collecting-payments/standard/
//
// We use the "Standard" flow: create a payment link server-side, redirect the
// customer to Flutterwave's hosted checkout, then verify the transaction on
// the redirect callback AND via webhook (webhook is authoritative).

const FLW_BASE = "https://api.flutterwave.com/v3";

export const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY ?? "";
export const FLW_WEBHOOK_HASH = process.env.FLW_WEBHOOK_HASH ?? "";
export const isFlutterwaveConfigured = FLW_SECRET_KEY.length > 0;

export interface InitiateArgs {
  tx_ref: string;
  amount: number;
  currency: string;
  redirect_url: string;
  customer: { email: string; name?: string; phonenumber?: string };
  title?: string;
  description?: string;
  meta?: Record<string, unknown>;
}

// Returns the hosted-checkout URL to redirect the buyer to.
export async function initiatePayment(args: InitiateArgs): Promise<string> {
  const res = await fetch(`${FLW_BASE}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${FLW_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: args.tx_ref,
      amount: args.amount,
      currency: args.currency,
      redirect_url: args.redirect_url,
      customer: args.customer,
      meta: args.meta,
      customizations: {
        title: args.title ?? "Nagibu Semwanga",
        description: args.description ?? "Secure checkout",
      },
    }),
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok || json.status !== "success" || !json.data?.link) {
    throw new Error(json.message ?? "Failed to create payment link");
  }
  return json.data.link as string;
}

export interface VerifiedTx {
  status: string; // "successful" when paid
  amount: number;
  currency: string;
  tx_ref: string;
  id: number;
  customer_email?: string;
}

// Verifies a transaction by its Flutterwave id (returned on the callback /
// webhook). Callers must additionally check amount + currency + tx_ref match
// the pending order before fulfilling.
export async function verifyTransaction(transactionId: string | number): Promise<VerifiedTx> {
  const res = await fetch(`${FLW_BASE}/transactions/${transactionId}/verify`, {
    headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` },
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok || json.status !== "success") {
    throw new Error(json.message ?? "Verification failed");
  }
  const d = json.data;
  return {
    status: d.status,
    amount: d.amount,
    currency: d.currency,
    tx_ref: d.tx_ref,
    id: d.id,
    customer_email: d.customer?.email,
  };
}
