import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";
import { buildFacturePdfBytes } from "@/lib/pdf-documents";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  /* ── Auth ────────────────────────────────────────────────────────── */
  const session = await auth();
  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === "ADMIN";
  if (!userId) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  /* ── Fetch facture + devis ───────────────────────────────────────── */
  let facture;
  try {
    facture = await db.facture.findUnique({
      where: { id },
      include: {
        devis: { include: { user: { include: { profile: true } } } },
        abonnement: { include: { devis: { include: { user: { include: { profile: true } } } } } },
        user: { include: { profile: true } },
      },
    });
  } catch (err) {
    console.error("[facture-pdf] DB error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  if (!facture || (facture.userId !== userId && !isAdmin)) {
    return NextResponse.json({ error: "Facture introuvable" }, { status: 404 });
  }

  // Devis source : ponctuel (facture.devis) ou devis d'origine de l'abonnement.
  const devis = facture.devis ?? facture.abonnement?.devis ?? null;
  if (!devis) {
    return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
  }

  /* ── Payment method via Stripe API ───────────────────────────────── */
  let paymentMethodLabel: string | null = null;
  const stripe = getStripe();
  if (stripe) {
    try {
      if (facture.stripeInvoiceId) {
        const inv = await stripe.invoices.retrieve(facture.stripeInvoiceId, {
          expand: ["payment_intent.payment_method"],
        });
        const pi = inv.payment_intent as Stripe.PaymentIntent | null;
        const pm = pi?.payment_method as Stripe.PaymentMethod | null;
        if (pm?.type === "card" && pm.card) {
          const brand = pm.card.brand.charAt(0).toUpperCase() + pm.card.brand.slice(1);
          paymentMethodLabel = `Carte bancaire ${brand} se terminant par ${pm.card.last4}`;
        } else if (pm) {
          paymentMethodLabel = "Paye via Stripe";
        }
      } else if (devis.stripeSession && devis.stripeSession !== "dev-simulated") {
        const cs = await stripe.checkout.sessions.retrieve(devis.stripeSession, {
          expand: ["payment_intent.payment_method"],
        });
        const pi = cs.payment_intent as Stripe.PaymentIntent | null;
        const pm = pi?.payment_method as Stripe.PaymentMethod | null;
        if (pm?.type === "card" && pm.card) {
          const brand = pm.card.brand.charAt(0).toUpperCase() + pm.card.brand.slice(1);
          paymentMethodLabel = `Carte bancaire ${brand} se terminant par ${pm.card.last4}`;
        } else if (pm) {
          paymentMethodLabel = "Paye via Stripe";
        }
      }
    } catch (e) {
      console.error("[facture-pdf] Failed to fetch payment method from Stripe:", e);
    }
  }

  /* ── Generate PDF ────────────────────────────────────────────────── */
  try {
    const pdfBytes = await buildFacturePdfBytes({
      facture,
      devis,
      profile: facture.user?.profile ?? null,
      paymentMethodLabel,
    });

    return new NextResponse(pdfBytes.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="facture-${facture.numero}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[facture-pdf] Unexpected error:", err);
    return NextResponse.json(
      { error: "PDF generation failed" },
      { status: 500 },
    );
  }
}
