import { NextRequest, NextResponse } from "next/server";
import {
  markWebhookEventProcessed,
  setUserPremiumStatus,
} from "@/lib/server-db";
import { verifyStripeWebhookSignature } from "@/lib/server-security";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test_secret";

  if (!verifyStripeWebhookSignature(rawBody, signature, secret)) {
    return NextResponse.json(
      { error: "Invalid stripe-signature header" },
      { status: 400 }
    );
  }

  try {
    const event = JSON.parse(rawBody) as {
      id?: string;
      type?: string;
      data?: { object?: { client_reference_id?: string; status?: string } };
    };

    if (!event.id || !event.type) {
      return NextResponse.json({ error: "Malformed event payload" }, { status: 400 });
    }

    // Idempotency check: Stripe retries webhooks; never process the same event.id twice
    const firstTime = markWebhookEventProcessed(event.id);
    if (!firstTime) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    const userId = event.data?.object?.client_reference_id || "user_demo_1";

    switch (event.type) {
      case "checkout.session.completed":
      case "customer.subscription.updated":
        setUserPremiumStatus(userId, true);
        break;
      case "customer.subscription.deleted":
      case "invoice.payment_failed":
        setUserPremiumStatus(userId, false);
        break;
      default:
        break;
    }

    return NextResponse.json({ received: true, duplicate: false });
  } catch {
    return NextResponse.json({ error: "Invalid webhook JSON" }, { status: 400 });
  }
}
