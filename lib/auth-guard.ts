import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { DELETED_EMAIL_DOMAIN } from "@/lib/account";

/**
 * Resolve the session AND confirm the user still exists in the database.
 *
 * JWT sessions are stateless: a deleted or anonymised account keeps a valid
 * token until it expires (up to 7 days here). Without this check a user whose
 * row was removed could keep browsing their dashboard from a cached token.
 *
 * This runs in the Node runtime (layouts/pages), not the Edge middleware,
 * because the existence check needs Prisma — and `lib/auth.config.ts` must stay
 * Prisma-free so the middleware keeps running on the Edge. Protected layouts are
 * the correct, cheap choke point: every /profil and /admin request flows
 * through one.
 *
 * If the user is gone (hard delete) or anonymised (sentinel email), we redirect
 * to the cookie-purging route handler → forced logout, immediately.
 */
export async function requireActiveUser(): Promise<Session> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const dbUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, passwordChangedAt: true },
  });

  if (!dbUser || dbUser.email.endsWith(`@${DELETED_EMAIL_DOMAIN}`)) {
    redirect("/api/auth/force-logout");
  }

  // Invalide les sessions émises avant le dernier changement de mot de passe.
  // Le JWT est stateless : sans ce contrôle, un token volé resterait valable
  // jusqu'à 7 j même après un reset. Comparaison en ms (tolérance 1 s pour les
  // écarts d'horloge entre l'émission du token et l'écriture DB).
  if (dbUser.passwordChangedAt) {
    const tokenIssuedFor = session.user.passwordChangedAt ?? 0;
    if (dbUser.passwordChangedAt.getTime() > tokenIssuedFor + 1000) {
      redirect("/api/auth/force-logout");
    }
  }

  return session;
}
