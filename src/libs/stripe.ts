import Stripe from "stripe";

// ── Stripe Singleton ─────────────────────────────────────────────────
// Never instantiate Stripe per-request; reuse a module-level instance.
let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("Missing STRIPE_SECRET_KEY env var");
    _stripe = new Stripe(key);
  }
  return _stripe;
}

// ── Types ────────────────────────────────────────────────────────────
interface User {
  customerId?: string;
  email?: string;
}

interface CreateCheckoutParams {
  priceId: string;
  mode: "payment" | "subscription";
  successUrl: string;
  cancelUrl: string;
  couponId?: string;
  clientReferenceId?: string;
  user?: User;
}

// This is used to create a Stripe Checkout for one-time payments. It's usually triggered with the <ButtonCheckout /> component. Webhooks are used to update the user's state in the database.
export const createCheckout = async ({
  priceId,
  mode,
  successUrl,
  cancelUrl,
  couponId,
  clientReferenceId,
  user,
}: CreateCheckoutParams): Promise<string | null> => {
  const stripe = getStripe();

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode,
    allow_promotion_codes: true,
    client_reference_id: clientReferenceId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    discounts: couponId ? [{ coupon: couponId }] : [],
    success_url: successUrl,
    cancel_url: cancelUrl,
  };

  if (user?.customerId) {
    sessionParams.customer = user.customerId;
  } else {
    if (mode === "payment") {
      sessionParams.customer_creation = "always";
      sessionParams.payment_intent_data = { setup_future_usage: "on_session" };
    }
    if (user?.email) {
      sessionParams.customer_email = user.email;
    }
    sessionParams.tax_id_collection = { enabled: true };
  }

  const stripeSession = await stripe.checkout.sessions.create(sessionParams);

  return stripeSession.url;
};

// This is used to create Customer Portal sessions, so users can manage their subscriptions (payment methods, cancel, etc..)
export const createCustomerPortal = async ({ customerId, returnUrl }: { customerId: string; returnUrl: string }): Promise<string | null> => {
  try {
    const stripe = getStripe();

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return portalSession.url;
  } catch (e: unknown) {
    console.error(e instanceof Error ? e.message : String(e));
    return null;
  }
};

export const findCheckoutSession = async (sessionId: string): Promise<Stripe.Checkout.Session | null> => {
  try {
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    return session;
  } catch (e: unknown) {
    console.error(e instanceof Error ? e.message : String(e));
    return null;
  }
};
