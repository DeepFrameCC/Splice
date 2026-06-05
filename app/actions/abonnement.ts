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
 * Résilie l'abonnement à la fin de la période payée (cancel_at_period_end).
 * Le client garde l'accès jusqu'au terme, sans remboursement. L'état définitif
 * (CANCELED) reviendra via le webhook customer.subscription.deleted au terme ;
 * ici on reflète immédiatement cancelAtPeriodEnd pour l'UI.
 */
export async function resilierAbonnement(abonnementId: string) {
  const { userId, abo, stripe } = await getOwnedAbonnement(abonnementId);

  if (abo.status === "CANCELED") throw new Error("Cet abonnement est déjà résilié.");

  const updated = await stripe.subscriptions.update(abo.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  await db.abonnement.update({
    where: { id: abo.id },
    data: {
      cancelAtPeriodEnd: true,
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

  await stripe.subscriptions.update(abo.stripeSubscriptionId, { cancel_at_period_end: false });

  await db.abonnement.update({ where: { id: abo.id }, data: { cancelAtPeriodEnd: false } });

  await notify({
    userId,
    type: "SYSTEM",
    title: "Abonnement réactivé",
    message: "Votre abonnement continue normalement, le renouvellement automatique est rétabli.",
    href: "/profil/abonnement",
  });

  revalidatePath("/profil/abonnement");
}
