import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
  initiatePayment,
  isFlutterwaveConfigured,
} from "@/lib/flutterwave";

// Creates a pending order (server-side, trusted pricing) and returns a
// Flutterwave hosted-checkout link. Amounts are ALWAYS read from the DB —
// never trusted from the client.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const {
    type, // 'artwork_digital' | 'artwork_print' | 'course'
    itemId,
    buyer,
    shipping,
  } = body ?? {};

  if (!type || !itemId || !buyer?.email || !buyer?.name) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const service = createServiceClient();
  if (!service || !isFlutterwaveConfigured) {
    // Demo / not-yet-configured: tell the UI to show a friendly notice.
    return NextResponse.json(
      { simulated: true, message: "Payments aren't configured yet (add Supabase + Flutterwave keys)." },
      { status: 200 }
    );
  }

  // Resolve trusted amount + title from the DB.
  let amount = 0;
  let currency = "UGX";
  let title = "";

  if (type === "artwork_digital" || type === "artwork_print") {
    const { data: art } = await service
      .from("artworks")
      .select("title, currency, digital_price, print_price, allow_digital, allow_print, status")
      .eq("id", itemId)
      .single();
    if (!art) return NextResponse.json({ error: "Artwork not found." }, { status: 404 });
    if (art.status === "sold" || art.status === "hidden") {
      return NextResponse.json({ error: "This piece is no longer available." }, { status: 409 });
    }
    currency = art.currency ?? "UGX";
    if (type === "artwork_digital") {
      if (!art.allow_digital || art.digital_price == null)
        return NextResponse.json({ error: "Digital option unavailable." }, { status: 409 });
      amount = Number(art.digital_price);
      title = `${art.title} — Digital copy`;
    } else {
      if (!art.allow_print || art.print_price == null)
        return NextResponse.json({ error: "Print option unavailable." }, { status: 409 });
      if (!shipping?.address || !shipping?.name)
        return NextResponse.json({ error: "Shipping details are required for prints." }, { status: 400 });
      amount = Number(art.print_price);
      title = `${art.title} — Printed copy`;
    }
  } else if (type === "course") {
    const { data: course } = await service
      .from("courses")
      .select("title, currency, price, status")
      .eq("id", itemId)
      .single();
    if (!course) return NextResponse.json({ error: "Course not found." }, { status: 404 });
    if (course.status !== "published")
      return NextResponse.json({ error: "Course unavailable." }, { status: 409 });
    if (course.price == null)
      return NextResponse.json({ error: "Course has no price." }, { status: 409 });
    currency = course.currency ?? "UGX";
    amount = Number(course.price);
    title = `${course.title} — Course`;
  } else {
    return NextResponse.json({ error: "Unknown purchase type." }, { status: 400 });
  }

  const reference = `NGB-${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`;

  const { error: orderErr } = await service.from("orders").insert({
    reference,
    item_type: type,
    item_id: itemId,
    item_title: title,
    buyer_name: buyer.name,
    buyer_email: buyer.email,
    buyer_phone: buyer.phone ?? null,
    amount,
    currency,
    status: "pending",
    shipping_name: shipping?.name ?? null,
    shipping_address: shipping?.address ?? null,
    shipping_city: shipping?.city ?? null,
    shipping_country: shipping?.country ?? null,
    shipping_phone: shipping?.phone ?? null,
  });
  if (orderErr) {
    return NextResponse.json({ error: orderErr.message }, { status: 500 });
  }

  const origin =
    process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;

  try {
    const link = await initiatePayment({
      tx_ref: reference,
      amount,
      currency,
      redirect_url: `${origin}/api/payment/callback`,
      customer: { email: buyer.email, name: buyer.name, phonenumber: buyer.phone },
      title,
      meta: { reference, item_type: type, item_id: itemId },
    });
    return NextResponse.json({ link });
  } catch (e) {
    await service.from("orders").update({ status: "failed" }).eq("reference", reference);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Payment init failed." },
      { status: 502 }
    );
  }
}
