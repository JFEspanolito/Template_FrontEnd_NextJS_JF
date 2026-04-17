import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import { getSupabaseAdmin } from "@/libs/supabase/admin";
import { createCheckout } from "@/libs/stripe";

export async function POST(req) {
  const body = await req.json();

  if (!body.priceId) {
    return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
  } else if (!body.successUrl || !body.cancelUrl) {
    return NextResponse.json({ error: "Success and cancel URLs are required" }, { status: 400 });
  } else if (!body.mode) {
    return NextResponse.json(
      { error: "Mode is required (either 'payment' for one-time payments or 'subscription' for recurring subscription)" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let profile = null;
    if (user) {
      const { data } = await getSupabaseAdmin()
        .from("profiles")
        .select("customer_id, name")
        .eq("id", user.id)
        .single();
      profile = data;
    }

    const { priceId, mode, successUrl, cancelUrl } = body;

    const stripeSessionURL = await createCheckout({
      priceId,
      mode,
      successUrl,
      cancelUrl,
      clientReferenceId: user?.id,
      user: user
        ? { email: user.email, name: profile?.name, customerId: profile?.customer_id }
        : undefined,
    });

    return NextResponse.json({ url: stripeSessionURL });
  } catch (e) {
    console.error(e?.message || String(e));
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
