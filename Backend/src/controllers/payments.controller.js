import { query } from "../config/db.js";
import { stripe } from "../config/stripe.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { upsertSubscriptionForUser } from "../services/subscription.service.js";

export const createSubscriptionCheckoutSession = asyncHandler(
  async (req, res) => {
    if (!stripe) {
      throw new ApiError(
        503,
        "Stripe is not configured. Set STRIPE_SECRET_KEY in .env",
      );
    }

    const { plan_type = "pro", price = 499 } = req.body;
    const amountCents = Math.round(Number(price) * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "zar",
            product_data: { name: `Mechanic Subscription - ${plan_type}` },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: env.stripeSuccessUrl,
      cancel_url: env.stripeCancelUrl,
      metadata: {
        user_id: String(req.user.id),
        plan_type,
        amount: String(price),
      },
    });

    return res.json({ url: session.url, session_id: session.id });
  },
);

export async function stripeWebhook(req, res) {
  if (!stripe || !env.stripeWebhookSecret) {
    return res.status(503).send("Stripe webhook is not configured");
  }

  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      env.stripeWebhookSecret,
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = Number(session.metadata?.user_id);
    const planType = session.metadata?.plan_type || "pro";
    const price = Number(session.metadata?.amount || 0);
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + 1);

    await upsertSubscriptionForUser({
      userId,
      planType,
      price,
      status: "active",
      renewalDate,
    });

    await query(
      "UPDATE mechanics SET subscription_plan = ?, subscription_status = 'active' WHERE user_id = ?",
      [planType, userId],
    );
  }

  return res.json({ received: true });
}
