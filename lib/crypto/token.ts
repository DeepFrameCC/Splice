/**
 * One-way hashing for single-use security tokens (password reset, email
 * verification) before they are stored in the database.
 *
 * The token sent in the email stays the only secret; the DB holds only its
 * SHA-256 digest, so a read-only DB leak no longer lets an attacker redeem
 * pending tokens. Tokens are 256-bit random, single-use and short-lived, so a
 * plain (unsalted) SHA-256 is sufficient and keeps lookups by exact match.
 *
 * WebCrypto only — no Node `crypto` — to stay compatible with the Cloudflare
 * Workers runtime.
 */
export async function hashToken(token: string): Promise<string> {
  const data = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
