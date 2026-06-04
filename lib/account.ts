/**
 * Shared account constants. Kept out of the `"use server"` action file because
 * a server-action module may only export async functions.
 */

/** Sentinel domain stamped on anonymised accounts so the auth guard can detect
 *  and force-logout a token that still points to an erased user. */
export const DELETED_EMAIL_DOMAIN = "deleted.invalid";
