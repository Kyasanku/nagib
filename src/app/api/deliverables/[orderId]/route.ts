import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

// Serves the digital deliverable for a paid order. The order id (a uuid) acts
// as the access token for v1. Returns a redirect to the file — a short-lived
// signed URL when the file lives in the private `deliverables` bucket.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const service = createServiceClient();
  if (!service) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const { data: order } = await service
    .from("orders")
    .select("id, status, item_type, item_id")
    .eq("id", orderId)
    .single();

  if (!order || order.status !== "paid" || order.item_type !== "artwork_digital") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  const { data: art } = await service
    .from("artworks")
    .select("digital_file_url")
    .eq("id", order.item_id)
    .single();

  const fileRef = art?.digital_file_url;
  if (!fileRef) {
    return NextResponse.json({ error: "File not ready — contact the studio." }, { status: 404 });
  }

  // Full URL → redirect straight to it. Otherwise treat as a path in the
  // private `deliverables` bucket and sign it for 5 minutes.
  if (/^https?:\/\//.test(fileRef)) {
    return NextResponse.redirect(fileRef);
  }

  const { data: signed } = await service.storage
    .from("deliverables")
    .createSignedUrl(fileRef, 300);

  if (!signed?.signedUrl) {
    return NextResponse.json({ error: "Could not sign file." }, { status: 500 });
  }
  return NextResponse.redirect(signed.signedUrl);
}
