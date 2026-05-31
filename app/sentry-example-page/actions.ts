"use server";

/**
 * Dedicated server-side action to trigger Sentry test errors.
 * Complies with Next.js 15 compilation rules for Server Actions.
 */
export async function triggerServerActionError() {
  throw new Error("Sentry Example Server Action Error (Splice Test Page)");
}
