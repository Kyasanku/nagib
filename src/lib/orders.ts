import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { VerifiedTx } from "./flutterwave";

// Marks an order paid and performs fulfilment. Idempotent: safe to call from
// both the redirect callback and the webhook. Returns the enrollment id when
// the order was for a course (so the buyer can be sent to the watch link).
export async function fulfillOrder(
  service: SupabaseClient,
  reference: string,
  verified: VerifiedTx
): Promise<{ ok: boolean; enrollmentId?: string; itemType?: string; slug?: string }> {
  const { data: order } = await service
    .from("orders")
    .select("*")
    .eq("reference", reference)
    .single();

  if (!order) return { ok: false };

  // Guard: the verified transaction must match what we charged.
  const amountOk = Number(verified.amount) >= Number(order.amount);
  const currencyOk = verified.currency === order.currency;
  const paid = verified.status === "successful" && amountOk && currencyOk;

  if (!paid) {
    if (order.status === "pending") {
      await service.from("orders").update({ status: "failed" }).eq("id", order.id);
    }
    return { ok: false, itemType: order.item_type };
  }

  // Already fulfilled — return existing enrollment if any.
  if (order.status === "paid" || order.status === "shipped") {
    if (order.item_type === "course" && order.item_id) {
      const { data: existing } = await service
        .from("course_enrollments")
        .select("id, course:courses(slug)")
        .eq("order_id", order.id)
        .maybeSingle();
      return {
        ok: true,
        itemType: order.item_type,
        enrollmentId: existing?.id,
        slug: (existing as { course?: { slug?: string } } | null)?.course?.slug,
      };
    }
    return { ok: true, itemType: order.item_type };
  }

  await service
    .from("orders")
    .update({ status: "paid", flw_transaction_id: String(verified.id) })
    .eq("id", order.id);

  // Fulfilment per type.
  if (order.item_type === "course" && order.item_id) {
    const { data: enrollment } = await service
      .from("course_enrollments")
      .insert({
        course_id: order.item_id,
        order_id: order.id,
        buyer_email: order.buyer_email,
      })
      .select("id, course:courses(slug)")
      .single();
    return {
      ok: true,
      itemType: order.item_type,
      enrollmentId: enrollment?.id,
      slug: (enrollment as { course?: { slug?: string } } | null)?.course?.slug,
    };
  }

  if (order.item_type === "artwork_print" && order.item_id) {
    // Reserve the physical piece once a print/original sells.
    await service.from("artworks").update({ status: "sold" }).eq("id", order.item_id);
  }

  return { ok: true, itemType: order.item_type };
}
