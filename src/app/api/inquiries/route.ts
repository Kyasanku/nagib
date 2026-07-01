import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { artwork_id, buyer_name, buyer_email, message } = body ?? {};

  if (!buyer_name || !buyer_email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 }
    );
  }

  const supabase = await createServerSupabase();
  if (supabase) {
    const { error } = await supabase.from("purchase_inquiries").insert({
      artwork_id: artwork_id ?? null,
      buyer_name,
      buyer_email,
      message: message ?? null,
      status: "new",
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // When Supabase is not configured we simply acknowledge — the demo still works.
  return NextResponse.json({ ok: true, simulated: !supabase });
}
