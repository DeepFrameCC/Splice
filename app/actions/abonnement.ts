"use server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { audit } from "@/lib/audit";
import { notify } from "@/lib/notifications";
import { revalidatePath } from "next/cache";

/** Charge l'abonnement en vérifiant qu'il appartient à l'utilisateur connecté. */
async function getOwnedAbonnement(abonnementId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Vous devez être connecté.");

  const abo = await db.abonnement.findUnique({ where: { id: abonnementId } });
  if (!abo || abo.userId !== userId) throw new Error("Abonnement introuvable.");

  const stripe = getStripe();
  if (!stripe) throw new Error("Service de paiement temporairement indisponible.");

  return { userId, abo, stripe };
}

/**
 * Résilie l'abonnement sans remboursement, le client gardant l'accès jusqu'au
 * terme. Deux cas :
 *  - cycle MENSUEL encore dans la période d'engagement (now < engagementEndsAt) :
 *    on programme la fin via Stripe `cancel_at` = terme de l'engagement. Le client
 *    reste facturé jusqu'à la fin des 3 mois fermes, puis l'abonnement s'arrête.
 *  - sinon (engagement écoulé, ANNUEL prépayé, SANS_ENGAGEMENT) : fin à la période
 *    courante via `cancel_at_period_end`.
 * L'état définitif (CANCELED) reviendra via le webhook customer.subscription.deleted
 * au terme ; ici on reflète immédiatement cancelAtPeriodEnd pour l'UI.
 */
export async function resilierAbonnement(abonnementId: string) {
  const { userId, abo, stripe } = await getOwnedAbonnement(abonnementId);

  if (abo.status === "CANCELED") throw new Error("Cet abonnement est déjà résilié.");

  const now = new Date();
  const dansEngagement =
    abo.billingCycle === "MENSUEL" &&
    abo.engagementEndsAt != null &&
    now < abo.engagementEndsAt;

  if (dansEngagement) {
    const cancelAtSec = Math.floor(abo.engagementEndsAt!.getTime() / 1000);
    await stripe.subscriptions.update(abo.stripeSubscriptionId, { cancel_at: cancelAtSec });

    await db.abonnement.update({
      where: { id: abo.id },
      data: { cancelAtPeriodEnd: true, cancelAt: abo.engagementEndsAt },
    });

    await audit({
      action: "SUBSCRIPTION_CANCELED",
      userId,
      target: abo.id,
      metadata: {
        stripeSubscriptionId: abo.stripeSubscriptionId,
        atEngagementEnd: true,
        engagementEndsAt: abo.engagementEndsAt!.toISOString(),
      },
    });

    const finLabel = abo.engagementEndsAt!.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    await notify({
      userId,
      type: "SYSTEM",
      title: "Résiliation programmée",
      message: `Vous êtes engagé jusqu'au ${finLabel}. Votre abonnement reste actif et facturé jusqu'à cette date, puis prendra fin sans renouvellement.`,
      href: "/profil/abonnement",
    });

    revalidatePath("/profil/abonnement");
    return;
  }

  const updated = await stripe.subscriptions.update(abo.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  await db.abonnement.update({
    where: { id: abo.id },
    data: {
      cancelAtPeriodEnd: true,
      cancelAt: null,
      ...(updated.current_period_end && !isNaN(updated.current_period_end)
        ? { currentPeriodEnd: new Date(updated.current_period_end * 1000) }
        : {}),
    },
  });

  await audit({
    action: "SUBSCRIPTION_CANCELED",
    userId,
    target: abo.id,
    metadata: { stripeSubscriptionId: abo.stripeSubscriptionId, atPeriodEnd: true },
  });

  await notify({
    userId,
    type: "SYSTEM",
    title: "Résiliation programmée",
    message:
      "Votre abonnement prendra fin à votre prochaine échéance. Vous gardez l'accès jusque-là.",
    href: "/profil/abonnement",
  });

  revalidatePath("/profil/abonnement");
}

/**
 * Annule une résiliation programmée tant que la période courante n'est pas
 * terminée : rétablit le renouvellement automatique.
 */
export async function reactiverAbonnement(abonnementId: string) {
  const { userId, abo, stripe } = await getOwnedAbonnement(abonnementId);

  if (abo.status !== "ACTIVE") throw new Error("Réactivation impossible pour cet abonnement.");
  if (!abo.cancelAtPeriodEnd) throw new Error("Cet abonnement n'est pas en cours de résiliation.");

  // Efface les deux mécanismes de fin : période courante ET date ferme d'engagement.
  await stripe.subscriptions.update(abo.stripeSubscriptionId, {
    cancel_at_period_end: false,
    cancel_at: null,
  });

  await db.abonnement.update({
    where: { id: abo.id },
    data: { cancelAtPeriodEnd: false, cancelAt: null },
  });

  await notify({
    userId,
    type: "SYSTEM",
    title: "Abonnement réactivé",
    message: "Votre abonnement continue normalement, le renouvellement automatique est rétabli.",
    href: "/profil/abonnement",
  });

  revalidatePath("/profil/abonnement");
}
