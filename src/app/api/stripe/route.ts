import { NextRequest, NextResponse } from "next/server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    throw new Error("stripe-signature header not found in request");
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const errorMessage = `Error while processing webhook event: ${
      err instanceof Error ? err.message : "Unknown error"
    }`;

    console.error(errorMessage);
    return NextResponse.json(
      {
        message: errorMessage,
      },
      { status: 400 },
    );
  }

  if (event.type === "customer.subscription.created") {
    console.log("Subscription created");
    console.log("Metadata", event.data.object.metadata);
  }

  return NextResponse.json({
    message: "Event processed successfully",
  });
}
