import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    client_name,
    client_email,
    phone_number,
    commission_type,
    budget,
    deadline,
    description,
    reference_images,
  } = body ?? {};

  if (!client_name || !client_email || !commission_type || !description) {
    return NextResponse.json(
      { error: "Please fill in the required fields." },
      { status: 400 }
    );
  }

  const supabase = await createServerSupabase();
  if (supabase) {
    const { error } = await supabase.from("commission_requests").insert({
      client_name,
      client_email,
      phone_number: phone_number ?? null,
      commission_type,
      budget: budget ?? null,
      deadline: deadline || null,
      description,
      reference_images: reference_images ?? null,
      status: "new",
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, simulated: !supabase });
}
