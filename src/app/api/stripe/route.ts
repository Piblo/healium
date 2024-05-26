import { NextRequest, NextResponse } from "next/server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
    const sig = req.headers.get('stripe-signature')
    if(!sig) {
        throw new Error('stripe-signature header not found in request')
    }

    let event: Stripe.Event

    try {
        const body = await req.arrayBuffer()
        event = stripe.webhooks.constructEvent(Buffer.from(body), sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      console.error(`Error message: ${err instanceof Error ? err.message : 'Unknown error'}`)
      return NextResponse.json({
        message: `Failed to process webhook: ${err instanceof Error ? err.message : 'Unknown error'}`,
      }, {status: 400});
    }

    if(event.type === 'customer.subscription.created') {
        console.log('customer.subscription.created handler')
    }

    return NextResponse.json({
      message: "Event processed successfully"
    })
}