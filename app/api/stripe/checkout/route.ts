import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiLimiter, checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const rl = await checkRateLimit(apiLimiter);
  if (!rl.success) {
    return NextResponse.json({ error: rl.error ?? "Trop de requêtes" }, { status: 429 });
  }

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { devisId } = (await req.json()) as { devisId: string };
  if (!devisId) return NextResponse.json({ error: "devisId manquant" }, { status: 400 });

  const devis = await db.devis.findUnique({ where: { id: devisId } });
  if (!devis || devis.userId !== userId) return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
  if (devis.status !== "VALIDE") return NextResponse.json({ error: "Le devis n'est pas encore validé par Deepframe" }, { status: 400 });
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
    return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_APP_URL}/profil/devis/${devisId}?paye=1` });
  }

  // Reuse an existing pending Stripe session when available to avoid orphan
  // sessions and reduce the surface for spam-driven session creation.
  if (devis.stripeSession && devis.stripeSession !== "dev-simulated") {
    try {
      const existing = await stripe.checkout.sessions.retrieve(devis.stripeSession);
      if (existing.status === "open" && existing.url) {
        return NextResponse.json({ url: existing.url });
      }
    } catch {
      // Old session unreachable — fall through and create a new one.
    }
  }

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
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/profil/devis/${devisId}?paye=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/profil/devis/${devisId}/payer?annule=1`,
  });

  await db.devis.update({ where: { id: devisId }, data: { stripeSession: checkoutSession.id } });

  return NextResponse.json({ url: checkoutSession.url });
}
