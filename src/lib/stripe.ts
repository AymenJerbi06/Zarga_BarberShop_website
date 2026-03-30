import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;

  if (!stripeInstance) {
    stripeInstance = new Stripe(key, {
      apiVersion: "2024-06-20",
    });
  }

  return stripeInstance;
}

// Client-side Stripe
import { loadStripe, type Stripe as StripeClient } from "@stripe/stripe-js";

let stripeClientInstance: Promise<StripeClient | null> | null = null;

export function getStripeClient(): Promise<StripeClient | null> {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) return Promise.resolve(null);

  if (!stripeClientInstance) {
    stripeClientInstance = loadStripe(key);
  }

  return stripeClientInstance;
}
