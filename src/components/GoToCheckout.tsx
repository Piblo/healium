"use client";

import { Button } from "./ui/button";
import { createCheckoutSession } from "@/actions/stripe";
import { getSelectedHealthEntityId } from "@/utils/healthEntity";
import { getStripe } from "@/utils/stripe";
import { useMutation } from "@tanstack/react-query";

export const GoToCheckout = () => {
  const healthEntityId = getSelectedHealthEntityId();
  const mutation = useMutation({
    mutationKey: ["checkout-session"],
    mutationFn: createCheckoutSession,
  });

  async function onClick() {
    const session = await mutation.mutateAsync(healthEntityId!);
    const stripe = await getStripe();

    await stripe?.redirectToCheckout({
      sessionId: session.id,
    });
  }

  return <Button onClick={onClick}>Start checkout</Button>;
};
