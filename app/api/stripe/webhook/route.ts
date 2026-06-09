import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { nextNumero } from "@/lib/numbering";
import { sendMail, MAIL_CONTACT, MAIL_FOUNDERS } from "@/lib/mailer";
import { audit } from "@/lib/audit";
import { notify } from "@/lib/notifications";
import type { AbonnementStatus } from "@prisma/client";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

function mapSubStatus(status: Stripe.Subscription.Status): AbonnementStatus {
  switch (status) {
    case "active":
    case "trialing":
      return "ACTIVE";
    case "past_due":
    case "unpaid":
      return "PAST_DUE";
    case "canceled":
    case "incomplete_expired":
      return "CANCELED";
    default:
      return "INCOMPLETE";
  }
}

/** Extrait l'id d'abonnement d'un objet Stripe quel que soit le typage du SDK. */
function subscriptionIdOf(obj: unknown): string | null {
  const sub = (obj as { subscription?: string | { id: string } | null }).subscription;
  if (!sub) return null;
  return typeof sub === "string" ? sub : sub.id;
}

function customerIdOf(obj: { customer?: string | { id: string } | null }): string {
  const c = obj.customer;
  if (!c) return "";
  return typeof c === "string" ? c : c.id;
}

/**
 * Garantit l'existence de l'Abonnement local pour une souscription Stripe.
 * Idempotent et résistant à l'ordre d'arrivée des events (checkout.session.completed
 * vs invoice.paid) : crée l'Abonnement au premier event qui le rencontre, passe le
 * devis en ABONNE, rattache le customer et crée le contrat si absent.
 */
async function ensureAbonnement(params: {
  stripe: Stripe;
  subscriptionId: string;
  customerId: string;
  devisId: string | null;
}): Promise<{ id: string; userId: string; devisId: string } | null> {
  const existing = await db.abonnement.findUnique({ where: { stripeSubscriptionId: params.subscriptionId } });
  if (existing) return { id: existing.id, userId: existing.userId, devisId: existing.devisId };

  const sub = await params.stripe.subscriptions.retrieve(params.subscriptionId);
  const devisId = params.devisId ?? sub.metadata?.devisId ?? null;
  if (!devisId) return null;

  const devis = await db.devis.findUnique({ where: { id: devisId } });
  if (!devis || !devis.userId) return null;
  const customerId = params.customerId || (typeof sub.customer === "string" ? sub.customer : sub.customer.id);

  let aboId: string;
  try {
    const abo = await db.abonnement.create({
      data: {
        devisId: devis.id,
        userId: devis.userId,
        stripeSubscriptionId: params.subscriptionId,
        stripeCustomerId: customerId,
        plan: devis.planAbonnement ?? "STANDARD",
        billingCycle: devis.billingCycle ?? "MENSUEL",
        status: mapSubStatus(sub.status),
        currentPeriodEnd: (sub.current_period_end && !isNaN(sub.current_period_end)) ? new Date(sub.current_period_end * 1000) : null,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
      },
    });
    aboId = abo.id;
  } catch {
    // Course concurrente entre deux events : l'autre a créé l'abonnement.
    const raced = await db.abonnement.findUnique({ where: { stripeSubscriptionId: params.subscriptionId } });
    if (raced) return { id: raced.id, userId: raced.userId, devisId: raced.devisId };
    return null;
  }

  await db.devis.update({ where: { id: devis.id }, data: { status: "ABONNE" } });
  if (customerId) {
    await db.user.update({ where: { id: devis.userId }, data: { stripeCustomerId: customerId } }).catch(() => {});
  }

  const existingContrat = await db.contrat.findUnique({ where: { devisId: devis.id } });
  if (!existingContrat) {
    const cNum = await nextNumero("CONTRAT");
    await db.contrat.create({
      data: {
        numero: `C-${cNum.numero}`,
        annee: cNum.annee,
        sequence: cNum.sequence,
        devisId: devis.id,
        userId: devis.userId,
        status: "A_VENIR",
      },
    });
  }

  await audit({
    action: "SUBSCRIPTION_CREATED",
    userId: devis.userId,
    target: devis.id,
    metadata: { stripeSubscriptionId: params.subscriptionId, plan: devis.planAbonnement, cycle: devis.billingCycle },
  });
  await notify({
    userId: devis.userId,
    type: "DEVIS_STATUS",
    title: `Abonnement ${devis.pack} activé`,
    message: "Votre abonnement est actif. Vos factures seront disponibles dans votre espace à chaque échéance.",
    href: `/profil/devis/${devis.id}`,
  });

  return { id: aboId, userId: devis.userId, devisId: devis.id };
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("[webhook] Stripe non configuré — webhook rejeté (503)");
    return NextResponse.json({ error: "Stripe non configuré sur ce serveur" }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    // constructEventAsync + SubtleCrypto : la variante synchrone n'est pas
    // utilisable dans le runtime Cloudflare Workers.
    event = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
      undefined,
      Stripe.createSubtleCryptoProvider()
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error("[webhook] Signature invalide:", message);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  // ─── Checkout terminé ─────────────────────────────────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Abonnement : on ne crée PAS la facture ici (elle vient de invoice.paid),
    // seulement l'Abonnement + le passage du devis en ABONNE.
    if (session.mode === "subscription") {
      const subscriptionId = subscriptionIdOf(session);
      if (subscriptionId) {
        await ensureAbonnement({
          stripe,
          subscriptionId,
          customerId: customerIdOf(session),
          devisId: session.metadata?.devisId ?? null,
        });
      }
      return NextResponse.json({ received: true });
    }

    // Paiement ponctuel : acompte 30 % (flux historique, inchangé).
    const devisId = session.metadata?.devisId;
    if (!devisId) return NextResponse.json({ error: "Pas de devisId dans metadata" }, { status: 400 });

    const devis = await db.devis.findUnique({ where: { id: devisId } });
    if (!devis) return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
    if (devis.acomptePaid) return NextResponse.json({ received: true, info: "Déjà payé" });
    if (!devis.userId) return NextResponse.json({ error: "Devis sans client associé" }, { status: 400 });

    const userId = devis.userId;
    await db.devis.update({
      where: { id: devisId },
      data: { acomptePaid: true, status: "PAYE", stripeSession: session.id },
    });

    const existingFacture = await db.facture.findUnique({ where: { devisId } });
    if (existingFacture) {
      if (existingFacture.status !== "PAYEE") {
        await db.facture.update({ where: { id: existingFacture.id }, data: { status: "PAYEE" } });
      }
    } else {
      const fNum = await nextNumero("FACTURE");
      await db.facture.create({
        data: { numero: `F-${fNum.numero}`, devisId, userId, status: "PAYEE", pdfUrl: null },
      });
    }

    const existingContrat = await db.contrat.findUnique({ where: { devisId } });
    if (!existingContrat) {
      const cNum = await nextNumero("CONTRAT");
      await db.contrat.create({
        data: { numero: `C-${cNum.numero}`, annee: cNum.annee, sequence: cNum.sequence, devisId, userId, status: "A_VENIR", pdfUrl: null },
      });
    }

    await audit({ action: "PAYMENT_SUCCESS", userId, target: devisId, metadata: { stripeSession: session.id, amount: devis.acompteAmount } });
    await notify({
      userId,
      type: "PAYMENT_CONFIRM",
      title: "Paiement confirmé",
      message: `Votre acompte de ${devis.acompteAmount} € pour le devis n°${devis.numero} a bien été reçu.`,
      href: `/profil/devis/${devisId}`,
    });

    try {
      await sendMail({
        to: devis.emailContact,
        subject: `Splice Studio — Paiement confirmé · Devis n°${devis.numero}`,
        html: `
          <div style="font-family:system-ui;color:#0E0E22;max-width:600px">
            <h2 style="color:#F36B1F">Paiement reçu ✓</h2>
            <p>Bonjour ${devis.nomContact},</p>
            <p>Votre acompte de <strong>${devis.acompteAmount} €</strong> pour le devis <strong>n°${devis.numero}</strong> a bien été réglé.</p>
            <p>Votre contrat est créé et votre prestation va être planifiée.</p>
            <p style="margin-top:20px">
              <a href="${APP_URL}/profil/devis/${devisId}" style="background:#F36B1F;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Voir mon espace</a>
            </p>
            <p style="font-size:12px;color:#777;margin-top:30px">Splice Studio · ${MAIL_CONTACT}</p>
          </div>`,
      });
    } catch (e) {
      console.error("[webhook] email reçu acompte échoué:", e);
    }

    return NextResponse.json({ received: true });
  }

  // ─── Prélèvement d'abonnement réussi (1er cycle + renouvellements) ─────────
  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = subscriptionIdOf(invoice);
    if (!subscriptionId || !invoice.id) {
      return NextResponse.json({ received: true, info: "Facture hors abonnement ignorée" });
    }

    // Idempotence : une facture par invoice Stripe.
    const already = await db.facture.findUnique({ where: { stripeInvoiceId: invoice.id } });
    if (already) return NextResponse.json({ received: true, info: "Facture déjà enregistrée" });

    const abo = await ensureAbonnement({ stripe, subscriptionId, customerId: customerIdOf(invoice), devisId: null });
    if (!abo) return NextResponse.json({ error: "Abonnement introuvable pour cette facture" }, { status: 404 });

    const montant = Math.round((invoice.amount_paid ?? 0) / 100);
    const debutDate = invoice.period_start ? new Date(invoice.period_start * 1000) : null;
    const finDate = invoice.period_end ? new Date(invoice.period_end * 1000) : null;
    const periodeDebut = (debutDate && !isNaN(debutDate.getTime())) ? debutDate : null;
    const periodeFin = (finDate && !isNaN(finDate.getTime())) ? finDate : null;

    const fNum = await nextNumero("FACTURE");
    const factureNumero = `F-${fNum.numero}`;
    await db.facture.create({
      data: {
        numero: factureNumero,
        abonnementId: abo.id,
        userId: abo.userId,
        status: "PAYEE",
        montant,
        periodeDebut,
        periodeFin,
        stripeInvoiceId: invoice.id,
      },
    });

    await db.abonnement.update({
      where: { id: abo.id },
      data: { status: "ACTIVE", ...(periodeFin ? { currentPeriodEnd: periodeFin } : {}) },
    });

    await audit({ action: "PAYMENT_SUCCESS", userId: abo.userId, target: abo.id, metadata: { stripeInvoiceId: invoice.id, montant } });
    await notify({
      userId: abo.userId,
      type: "PAYMENT_CONFIRM",
      title: "Paiement d'abonnement reçu",
      message: `Prélèvement de ${montant} € confirmé. Votre facture ${factureNumero} est disponible.`,
      href: "/profil/factures",
    });

    if (invoice.customer_email) {
      try {
        await sendMail({
          to: invoice.customer_email,
          subject: `Splice Studio — Facture ${factureNumero} (abonnement)`,
          html: `
            <div style="font-family:system-ui;color:#0E0E22;max-width:600px">
              <h2 style="color:#F36B1F">Paiement reçu ✓</h2>
              <p>Le prélèvement de votre abonnement (<strong>${montant} €</strong>) a bien été effectué.</p>
              <p>Votre facture <strong>${factureNumero}</strong> est disponible dans votre espace.</p>
              <p style="margin-top:20px">
                <a href="${APP_URL}/profil/factures" style="background:#F36B1F;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Voir mes factures</a>
              </p>
              <p style="font-size:12px;color:#777;margin-top:30px">Splice Studio · ${MAIL_CONTACT}</p>
            </div>`,
        });
      } catch (e) {
        console.error("[webhook] email facture abonnement échoué:", e);
      }
    }

    return NextResponse.json({ received: true });
  }

  // ─── Échec de prélèvement ─────────────────────────────────────────────────
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = subscriptionIdOf(invoice);
    if (subscriptionId) {
      const abo = await db.abonnement.findUnique({ where: { stripeSubscriptionId: subscriptionId } });
      if (abo) {
        await db.abonnement.update({ where: { id: abo.id }, data: { status: "PAST_DUE" } });
        await audit({ action: "PAYMENT_FAILED", userId: abo.userId, target: abo.id, metadata: { stripeInvoiceId: invoice.id } });
        await notify({
          userId: abo.userId,
          type: "SYSTEM",
          title: "Échec de prélèvement",
          message: "Le prélèvement de votre abonnement a échoué. Merci de mettre à jour votre moyen de paiement.",
          href: "/profil",
        });
        try {
          const targets = [invoice.customer_email, ...MAIL_FOUNDERS].filter(Boolean) as string[];
          if (targets.length) {
            await sendMail({
              to: targets,
              subject: `Splice Studio — Échec de prélèvement d'abonnement`,
              html: `
                <div style="font-family:system-ui;color:#0E0E22;max-width:600px">
                  <h2 style="color:#F36B1F">Prélèvement échoué</h2>
                  <p>Le prélèvement d'un abonnement Splice Studio a échoué. Le client est invité à mettre à jour son moyen de paiement depuis son espace.</p>
                  <p style="font-size:12px;color:#777;margin-top:30px">Splice Studio · ${MAIL_CONTACT}</p>
                </div>`,
            });
          }
        } catch (e) {
          console.error("[webhook] email échec prélèvement échoué:", e);
        }
      }
    }
    return NextResponse.json({ received: true });
  }

  // ─── Mise à jour d'abonnement (statut, résiliation programmée, période) ────
  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    const abo = await db.abonnement.findUnique({ where: { stripeSubscriptionId: sub.id } });
    if (abo) {
      const periodEnd = sub.current_period_end ? new Date(sub.current_period_end * 1000) : null;
      const safePeriodEnd = (periodEnd && !isNaN(periodEnd.getTime())) ? periodEnd : undefined;
      await db.abonnement.update({
        where: { id: abo.id },
        data: {
          status: mapSubStatus(sub.status),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          currentPeriodEnd: safePeriodEnd,
        },
      });
    }
    return NextResponse.json({ received: true });
  }

  // ─── Abonnement résilié / terminé ─────────────────────────────────────────
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const abo = await db.abonnement.findUnique({ where: { stripeSubscriptionId: sub.id } });
    if (abo) {
      await db.abonnement.update({ where: { id: abo.id }, data: { status: "CANCELED", cancelAtPeriodEnd: true } });
      const contrat = await db.contrat.findUnique({ where: { devisId: abo.devisId } });
      if (contrat && contrat.status !== "FINI") {
        await db.contrat.update({ where: { id: contrat.id }, data: { status: "FINI" } });
      }
      await audit({ action: "SUBSCRIPTION_CANCELED", userId: abo.userId, target: abo.id, metadata: { stripeSubscriptionId: sub.id } });
      await notify({
        userId: abo.userId,
        type: "SYSTEM",
        title: "Abonnement résilié",
        message: "Votre abonnement a pris fin. Merci de votre confiance, à très vite !",
        href: "/profil",
      });
    }
    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
