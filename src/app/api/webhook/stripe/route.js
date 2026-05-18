import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/libs/supabase/admin";
import { findCheckoutSession } from "@/libs/stripe";

// Requires a `profiles` table in Supabase:
// id uuid references auth.users(id), customer_id text, price_id text, has_access boolean

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

let _stripe;
function getStripe() {
  if (!_stripe) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(apiKey);
  }
  return _stripe;
}

export async function POST(req) {
  let stripe;
  try {
    stripe = getStripe();
  } catch (err) {
    console.error(err?.message || String(err));
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  let data;
  let eventType;
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed. ${err?.message || String(err)}`);
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  data = event.data;
  eventType = event.type;

  try {
    const admin = getSupabaseAdmin();

    switch (eventType) {
      case "checkout.session.completed": {
        const session = await findCheckoutSession(data.object.id);

        const customerId = session?.customer;
        const priceId = session?.line_items?.data[0]?.price?.id;
        const userId = data.object.client_reference_id;

        if (!priceId) {
          console.warn("checkout.session.completed: no priceId found, skipping.");
          break;
        }

        const customer = await stripe.customers.retrieve(customerId);

        let profileId;

        if (userId) {
          profileId = userId;
        } else if (customer.email) {
          const { data: existing } = await admin
            .from("profiles")
            .select("id")
            .eq("email", customer.email)
            .single();

          if (existing) {
            profileId = existing.id;
          } else {
            const { data: created, error } = await admin.auth.admin.createUser({
              email: customer.email,
              email_confirm: true,
              user_metadata: { name: customer.name },
            });
            if (error) throw error;
            profileId = created.user.id;

            await admin.from("profiles").insert({ id: profileId, name: customer.name });
          }
        } else {
          throw new Error("No user found");
        }

        await admin
          .from("profiles")
          .update({ price_id: priceId, customer_id: customerId, has_access: true })
          .eq("id", profileId);

        break;
      }

      case "checkout.session.expired":
        break;

      case "customer.subscription.updated":
        break;

      case "customer.subscription.deleted": {
        const subscription = await stripe.subscriptions.retrieve(data.object.id);

        await admin
          .from("profiles")
          .update({ has_access: false })
          .eq("customer_id", subscription.customer);

        break;
      }

      case "invoice.paid": {
        const priceId = data.object.lines?.data?.[0]?.price?.id;
        const customerId = data.object.customer;

        const { data: profile } = await admin
          .from("profiles")
          .select("id, price_id")
          .eq("customer_id", customerId)
          .single();

        if (!profile || profile.price_id !== priceId) break;

        await admin.from("profiles").update({ has_access: true }).eq("id", profile.id);

        break;
      }

      case "invoice.payment_failed":
        break;

      default:
    }
  } catch (e) {
    console.error("stripe error: " + (e?.message || String(e)) + " | EVENT TYPE: " + eventType);
  }

  return NextResponse.json({});
}
