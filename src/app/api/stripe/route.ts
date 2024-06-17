import { NextRequest, NextResponse } from "next/server";

import Stripe from "stripe";
import { db } from "@/server/database/connection";
import { eq } from "drizzle-orm";
import { healthEntities } from "@/server/database/schema";

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
      process.env.STRIPE_WEBHOOK_SECRET!
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
      { status: 400 }
    );
  }

  if (event.type === "customer.subscription.created") {
    console.log("Subscription created");
    console.log("Metadata", event.data.object.metadata);
    const eventData = event.data.object;

    await db
      .update(healthEntities)
      .set({ subscriptionStatus: "active" })
      .where(eq(healthEntities.stripeCustomerId, eventData.customer as string));

    console.log(
      "Activated subscription for health entity ",
      eventData.customer
    );
  }

  if (event.type === "customer.subscription.deleted") {
    const eventData = event.data.object;

    await db
      .update(healthEntities)
      .set({ subscriptionStatus: "inactive" })
      .where(eq(healthEntities.stripeCustomerId, eventData.customer as string));

    console.log("Deleted subscription for health entity ", eventData.customer);
  }

  return NextResponse.json({
    message: "Event processed successfully",
  });
}
