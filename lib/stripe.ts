import Stripe from "stripe";

let _stripe: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  if (_stripe !== undefined) return _stripe;
  _stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;
  return _stripe;
}

/** @deprecated Use getStripe() for Workers-safe lazy init */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const s = getStripe();
    if (!s) throw new Error("STRIPE_SECRET_KEY is not configured");
    return (s as any)[prop];
  },
});
