"use client";

import { Button } from "./ui/button";
import { createCheckoutSession } from "@/app/job-offer/list/actions";
import getStripe from "@/utils/stripe";
import { useMutation } from "@tanstack/react-query";

export const GoToCheckout = () => {
  const mutation = useMutation({
    mutationKey: ["checkout-session"],
    mutationFn: createCheckoutSession,
  });

  async function onClick() {
    const session = await mutation.mutateAsync();
    const stripe = await getStripe();

    await stripe?.redirectToCheckout({
      sessionId: session.id,
    });
  }

  return <Button onClick={onClick}>Start checkout</Button>;
};
