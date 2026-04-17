import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import { getSupabaseAdmin } from "@/libs/supabase/admin";
import { createCustomerPortal } from "@/libs/stripe";

export async function POST(req) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.returnUrl) {
      return NextResponse.json({ error: "Return URL is required" }, { status: 400 });
    }

    const { data: profile } = await getSupabaseAdmin()
      .from("profiles")
      .select("customer_id")
      .eq("id", user.id)
      .single();

    if (!profile?.customer_id) {
      return NextResponse.json(
        { error: "You don't have a billing account yet. Make a purchase first." },
        { status: 400 }
      );
    }

    const stripePortalUrl = await createCustomerPortal({
      customerId: profile.customer_id,
      returnUrl: body.returnUrl,
    });

    return NextResponse.json({ url: stripePortalUrl });
  } catch (e) {
    console.error(e?.message || String(e));
    return NextResponse.json({ error: "Failed to create billing portal" }, { status: 500 });
  }
}
