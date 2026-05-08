import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { nextNumero } from "@/lib/numbering";
import { sendMail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn("[webhook] Stripe non configuré — requête ignorée");
    return NextResponse.json({ received: true });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("[webhook] Signature invalide:", err.message);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const devisId = session.metadata?.devisId;
    if (!devisId) return NextResponse.json({ error: "Pas de devisId dans metadata" }, { status: 400 });

    const devis = await db.devis.findUnique({ where: { id: devisId } });
    if (!devis) return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
    if (devis.acomptePaid) return NextResponse.json({ received: true, info: "Déjà payé" });

    // Transaction: update devis + create facture + create contrat
    await db.$transaction(async (tx) => {
      await tx.devis.update({
        where: { id: devisId },
        data: { acomptePaid: true, status: "PAYE", stripeSession: session.id }
      });

      // Create Facture
      const fNum = await nextNumero("FACTURE", tx);
      await tx.facture.create({
        data: {
          numero: `FA-${fNum.numero}`,
          devisId,
          userId: devis.userId,
          status: "PAYEE",
          pdfUrl: null
        }
      });

      // Create Contrat
      const cNum = await nextNumero("CONTRAT", tx);
      await tx.contrat.create({
        data: {
          numero: `CT-${cNum.numero}`,
          annee: cNum.annee,
          sequence: cNum.sequence,
          devisId,
          userId: devis.userId,
          status: "A_VENIR",
          pdfUrl: null
        }
      });
    });

    // Send confirmation email
    await sendMail({
      to: devis.emailContact,
      subject: `Deepframe — Paiement confirmé · Devis n°${devis.numero}`,
      html: `
        <div style="font-family:system-ui;color:#0A0A23;max-width:600px">
          <h2 style="color:#1901AD">Paiement reçu ✓</h2>
          <p>Bonjour ${devis.nomContact},</p>
          <p>Votre acompte de <strong>${devis.acompteAmount} €</strong> pour le devis <strong>n°${devis.numero}</strong> a bien été réglé.</p>
          <p>Votre contrat est créé et votre prestation va être planifiée.</p>
          <p style="margin-top:20px">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/profil/devis/${devisId}" style="background:#FFBD59;color:#1901AD;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Voir mon espace</a>
          </p>
          <p style="font-size:12px;color:#777;margin-top:30px">Deepframe · contact@deepframe.cc</p>
        </div>`
    });
  }

  return NextResponse.json({ received: true });
}
