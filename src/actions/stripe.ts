"use server";

import {
  getHealthEntity,
  updateHealthEntity,
} from "@/server/database/healthEntityRepository";

import { Stripe } from "stripe";
import { currentUser } from "@clerk/nextjs/server";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { getPrimaryEmailAddress } from "@/server/utils/user";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(healthEntityId: string) {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not logged in");
    }

    const customer = await getOrCreateCustomer(healthEntityId);

    return stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: "price_1PKeM8EyWIqtLjTW9xZKZURt",
          quantity: 1,
        },
      ],
      success_url: `${getBaseUrl()}/health-entity/manage`,
      metadata: {
        healthEntityId,
      },
      customer: customer.id,
    });
  } catch (error) {
    console.error(
      "Failed to create checkout session: ",
      error instanceof Error ? error.message : "Unknown error",
    );

    throw error;
  }
}

async function getOrCreateCustomer(healthEntityId: string) {
  const healthEntity = await getHealthEntity(healthEntityId);

  if (healthEntity?.stripeCustomerId) {
    return stripe.customers.retrieve(healthEntity?.stripeCustomerId);
  }

  const user = await currentUser();
  if (!user) {
    throw new Error("Unable to retrieve user data");
  }

  const customer = await stripe.customers.create({
    metadata: {
      healthEntityId,
    },
    email: getPrimaryEmailAddress(user)?.emailAddress,
    name: healthEntity?.name,
    phone: healthEntity?.phoneNumber ?? undefined,
    address: {
      line1: healthEntity?.address ?? undefined,
    },
  });

  await updateHealthEntity({
    id: healthEntityId,
    stripeCustomerId: customer.id,
  });

  return customer;
}
