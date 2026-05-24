import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { nextNumero } from "@/lib/numbering";
import { sendMail } from "@/lib/mailer";
import { audit } from "@/lib/audit";
import { notify } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("[webhook] Stripe non configuré — webhook rejeté (503)");
    return NextResponse.json(
      { error: "Stripe non configuré sur ce serveur" },
      { status: 503 },
    );
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
    if (!devis.userId) return NextResponse.json({ error: "Devis sans client associé" }, { status: 400 });

    // Idempotent: update devis + mark existing Facture as PAYEE (or create if missing).
    // Facture/Contrat are normally created by validerDevis (admin). The webhook only
    // creates them as a fallback to handle out-of-band payments. Facture.devisId is
    // @unique so a duplicate insert would crash — we check existence first.
    const userId = devis.userId;
    await db.$transaction(async (tx) => {
      await tx.devis.update({
        where: { id: devisId },
        data: { acomptePaid: true, status: "PAYE", stripeSession: session.id },
      });

      const existingFacture = await tx.facture.findUnique({ where: { devisId } });
      if (existingFacture) {
        if (existingFacture.status !== "PAYEE") {
          await tx.facture.update({
            where: { id: existingFacture.id },
            data: { status: "PAYEE" },
          });
        }
      } else {
        const fNum = await nextNumero("FACTURE", tx);
        await tx.facture.create({
          data: {
            numero: `F-${fNum.numero}`,
            devisId,
            userId,
            status: "PAYEE",
            pdfUrl: null,
          },
        });
      }

      const existingContrat = await tx.contrat.findUnique({ where: { devisId } });
      if (!existingContrat) {
        const cNum = await nextNumero("CONTRAT", tx);
        await tx.contrat.create({
          data: {
            numero: `C-${cNum.numero}`,
            annee: cNum.annee,
            sequence: cNum.sequence,
            devisId,
            userId,
            status: "A_VENIR",
            pdfUrl: null,
          },
        });
      }
    });

    await audit({ action: "PAYMENT_SUCCESS", userId, target: devisId, metadata: { stripeSession: session.id, amount: devis.acompteAmount } });

    await notify({
      userId,
      type: "PAYMENT_CONFIRM",
      title: "Paiement confirmé",
      message: `Votre acompte de ${devis.acompteAmount} € pour le devis n°${devis.numero} a bien été reçu.`,
      href: `/profil/devis/${devisId}`,
    });

    // Send confirmation email
    await sendMail({
      to: devis.emailContact,
      subject: `Splice — Paiement confirmé · Devis n°${devis.numero}`,
      html: `
        <div style="font-family:system-ui;color:#0E0E22;max-width:600px">
          <h2 style="color:#F36B1F">Paiement reçu ✓</h2>
          <p>Bonjour ${devis.nomContact},</p>
          <p>Votre acompte de <strong>${devis.acompteAmount} €</strong> pour le devis <strong>n°${devis.numero}</strong> a bien été réglé.</p>
          <p>Votre contrat est créé et votre prestation va être planifiée.</p>
          <p style="margin-top:20px">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/profil/devis/${devisId}" style="background:#F36B1F;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Voir mon espace</a>
          </p>
          <p style="font-size:12px;color:#777;margin-top:30px">Splice · contact.splicestudio@gmail.com</p>
        </div>`
    });
  }

  return NextResponse.json({ received: true });
}
