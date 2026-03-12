import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { connectMongo } from "@/libs/db";
import User from "@/models/User";
import { findCheckoutSession } from "@/libs/stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Singleton — avoid creating a new instance per request
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
  await connectMongo();

  let stripe;
  try {
    stripe = getStripe();
  } catch (err) {
    console.error(err?.message || String(err));
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const body = await req.text();

  // Next.js 15+: headers() is async and must be awaited
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  let data;
  let eventType;
  let event;

  // Verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed. ${err?.message || String(err)}`);
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  data = event.data;
  eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        const session = await findCheckoutSession(data.object.id);

        const customerId = session?.customer;
        const priceId = session?.line_items?.data[0]?.price?.id;
        const userId = data.object.client_reference_id;

        // Skip if we couldn't resolve a priceId
        if (!priceId) {
          console.warn("checkout.session.completed: no priceId found, skipping.");
          break;
        }

        const customer = await stripe.customers.retrieve(customerId);

        let user;

        // Get or create the user. userId is normally passed in the checkout session
        // (clientReferenceID) to identify the user when we get the webhook event
        if (userId) {
          user = await User.findById(userId);
        } else if (customer.email) {
          user = await User.findOne({ email: customer.email });

          if (!user) {
            user = await User.create({
              email: customer.email,
              name: customer.name,
            });

            await user.save();
          }
        } else {
          console.error("No user found");
          throw new Error("No user found");
        }

        // Update user data + Grant user access to your product
        user.priceId = priceId;
        user.customerId = customerId;
        user.hasAccess = true;
        await user.save();

        // Extra: send email with user link, product page, etc...
        // try {
        //   await sendEmail({to: ...});
        // } catch (e) {
        //   console.error("Email issue:" + e?.message);
        // }

        break;
      }

      case "checkout.session.expired": {
        // User didn't complete the transaction
        break;
      }

      case "customer.subscription.updated": {
        // The customer might have changed the plan (higher or lower plan, cancel soon etc...)
        // Stripe will let us know when cancelled for good in "customer.subscription.deleted"
        break;
      }

      case "customer.subscription.deleted": {
        // The customer subscription stopped — revoke access
        const subscription = await stripe.subscriptions.retrieve(
          data.object.id
        );
        const user = await User.findOne({ customerId: subscription.customer });

        if (user) {
          user.hasAccess = false;
          await user.save();
        }

        break;
      }

      case "invoice.paid": {
        // Customer just paid an invoice (e.g. recurring subscription payment)
        const priceId = data.object.lines?.data?.[0]?.price?.id;
        const customerId = data.object.customer;

        const user = await User.findOne({ customerId });

        // Make sure the invoice is for the same plan the user subscribed to
        if (!user || user.priceId !== priceId) break;

        user.hasAccess = true;
        await user.save();

        break;
      }

      case "invoice.payment_failed":
        // A payment failed — Stripe Smart Retries will handle automatic emails.
        // We'll revoke access in "customer.subscription.deleted" if retries fail.
        break;

      default:
      // Unhandled event type
    }
  } catch (e) {
    console.error(
      "stripe error: " + (e?.message || String(e)) + " | EVENT TYPE: " + eventType
    );
  }

  return NextResponse.json({});
}
