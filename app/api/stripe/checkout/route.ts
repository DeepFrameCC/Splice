import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiLimiter, checkRateLimit } from "@/lib/rate-limit";
import { quoteToStripeLineItems, type QuoteLine, type BillingCycle } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  try {
    console.log("[checkout] Starting checkout request");

    const rl = await checkRateLimit(apiLimiter);
    if (!rl.success) {
      console.warn("[checkout] Rate limited");
      return NextResponse.json({ error: rl.error ?? "Trop de requêtes" }, { status: 429 });
    }

    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      console.warn("[checkout] No auth session");
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { devisId } = (await req.json()) as { devisId: string };
    if (!devisId) return NextResponse.json({ error: "devisId manquant" }, { status: 400 });

    console.log("[checkout] Looking up devis:", devisId);
    const devis = await db.devis.findUnique({ where: { id: devisId } });
    if (!devis || devis.userId !== userId) return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
    if (devis.status !== "VALIDE" && devis.pack !== "Test Production") {
      return NextResponse.json({ error: "Le devis n'est pas encore validé par Splice Studio" }, { status: 400 });
    }

    console.log("[checkout] Devis found:", { pack: devis.pack, status: devis.status, amount: devis.acompteAmount, paid: devis.acomptePaid });

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    console.log("[checkout] Stripe configured:", !!stripe, "appUrl:", appUrl);

    // ─── Abonnement : Stripe Checkout en mode "subscription" (récurrent) ──────
    if (devis.devisType === "ABONNEMENT") {
      const existingAbo = await db.abonnement.findUnique({ where: { devisId } });
      if (existingAbo) {
        return NextResponse.json({ error: "Un abonnement existe déjà pour ce devis." }, { status: 400 });
      }

      if (!stripe) {
        return NextResponse.json({ error: "Paiement temporairement indisponible" }, { status: 503 });
      }

      const cycle: BillingCycle = devis.billingCycle === "ANNUEL" ? "ANNUEL" : "MENSUEL";
      const lineItems = quoteToStripeLineItems(
        { lines: (devis.lines as unknown as QuoteLine[]) ?? [], totalHT: devis.totalHT, acompte: 0, solde: 0 },
        cycle,
      );
      if (lineItems.length === 0) {
        return NextResponse.json({ error: "Aucune ligne facturable pour cet abonnement." }, { status: 400 });
      }

      // Customer Stripe réutilisable : rattache les factures récurrentes et permet
      // le portail de gestion. Le montant figé dans price_data assure le
      // grandfathering (un changement de tarif standard n'affecte pas l'existant).
      const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: devis.emailContact,
          name: devis.nomEntreprise || devis.nomContact,
          metadata: { userId },
        });
        customerId = customer.id;
        await db.user.update({ where: { id: userId }, data: { stripeCustomerId: customerId } });
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: lineItems,
        metadata: { devisId: devis.id, devisNumero: devis.numero },
        subscription_data: { metadata: { devisId: devis.id, devisNumero: devis.numero } },
        success_url: `${appUrl}/profil/devis/${devisId}?abonne=1`,
        cancel_url: `${appUrl}/profil/devis/${devisId}/payer?annule=1`,
      });

      await db.devis.update({ where: { id: devisId }, data: { stripeSession: checkoutSession.id } });
      console.log("[checkout] Subscription session created:", checkoutSession.id, "url:", checkoutSession.url);
      return NextResponse.json({ url: checkoutSession.url });
    }

    // ─── Pack / ponctuel : acompte 30 % en paiement unique ────────────────────
    if (devis.acomptePaid) return NextResponse.json({ error: "L'acompte a déjà été réglé" }, { status: 400 });

    if (!stripe) {
      // DEV mode: simulate payment. Hard fail in production to avoid bypass.
      if (process.env.NODE_ENV === "production") {
        console.error("[stripe] STRIPE_SECRET_KEY missing in production");
        return NextResponse.json({ error: "Paiement temporairement indisponible" }, { status: 503 });
      }
      console.warn("[stripe] Stripe non configuré — simulation du paiement");
      await db.devis.update({
        where: { id: devisId },
        data: { acomptePaid: true, status: "PAYE", stripeSession: "dev-simulated" },
      });
      return NextResponse.json({ url: `${appUrl}/profil/devis/${devisId}?paye=1` });
    }

    // Reuse an existing pending Stripe session when available to avoid orphan
    // sessions and reduce the surface for spam-driven session creation.
    if (devis.stripeSession && devis.stripeSession !== "dev-simulated") {
      try {
        console.log("[checkout] Checking existing session:", devis.stripeSession);
        const existing = await stripe.checkout.sessions.retrieve(devis.stripeSession);
        if (existing.status === "open" && existing.url) {
          console.log("[checkout] Reusing existing session:", existing.url);
          return NextResponse.json({ url: existing.url });
        }
        console.log("[checkout] Existing session status:", existing.status, "- creating new one");
      } catch (e) {
        console.warn("[checkout] Could not retrieve existing session:", e);
        // Old session unreachable — fall through and create a new one.
      }
    }

    console.log("[checkout] Creating new checkout session, unit_amount:", devis.acompteAmount * 100);
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: devis.emailContact,
      metadata: { devisId: devis.id, devisNumero: devis.numero },
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: devis.acompteAmount * 100,
            product_data: {
              name: `Acompte devis n°${devis.numero}`,
              description: `Acompte ${devis.acompteRate}% — ${devis.nomEntreprise || devis.nomContact}`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/profil/devis/${devisId}?paye=1`,
      cancel_url: `${appUrl}/profil/devis/${devisId}/payer?annule=1`,
    });

    await db.devis.update({ where: { id: devisId }, data: { stripeSession: checkoutSession.id } });

    console.log("[checkout] Session created:", checkoutSession.id, "url:", checkoutSession.url);
    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur interne du serveur";
    console.error("[checkout] Unhandled error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
