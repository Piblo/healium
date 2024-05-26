"use server"

import { Stripe } from "stripe";
import { getBaseUrl } from "@/utils/getBaseUrl";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function createCheckoutSession() {
    return stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{
            price: "price_1PKeM8EyWIqtLjTW9xZKZURt",
            quantity: 1,
        }],
        success_url: `${getBaseUrl()}/health-entity/manage`
    })
}