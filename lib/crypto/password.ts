// OWASP 2023 recommends ≥ 600 000 iterations for PBKDF2-HMAC-SHA256.
// The stored hash encodes its own iteration count, so existing 100k hashes keep
// verifying; `needsRehash()` lets the login flow transparently upgrade them.
const ITERATIONS = 600000;
const HASH_NAME = "SHA-256";

// Pure JS helpers to avoid global Node Buffer dependencies
const toHex = (arr: Uint8Array): string =>
  Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

const fromHex = (hex: string): Uint8Array => {
  const matches = hex.match(/.{1,2}/g) || [];
  return new Uint8Array(matches.map((byte) => parseInt(byte, 16)));
};

export async function hashPassword(plain: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const baseKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(plain),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as any,
      iterations: ITERATIONS,
      hash: HASH_NAME,
    },
    baseKey,
    256 // 32 bytes (256 bits)
  );

  const saltHex = toHex(salt);
  const hashHex = toHex(new Uint8Array(derivedBits));
  return `pbkdf2$${ITERATIONS}$${saltHex}$${hashHex}`;
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  if (!hash.startsWith("pbkdf2$")) {
    // Graceful fallback for old format hashes if any exist
    return false;
  }
  
  const parts = hash.split("$");
  const iter = parseInt(parts[1] || "0", 10);
  const saltHex = parts[2] || "";
  const hashHex = parts[3] || "";
  
  if (!iter || !saltHex || !hashHex) return false;

  const salt = fromHex(saltHex);
  const baseKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(plain),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as any,
      iterations: iter,
      hash: HASH_NAME,
    },
    baseKey,
    256
  );

  const currentHashHex = toHex(new Uint8Array(derivedBits));
  return timingSafeEqualHex(currentHashHex, hashHex);
}

/**
 * Returns true when a stored hash uses fewer iterations than the current
 * target (or an unknown format) and should be re-hashed at the next login,
 * while the user's plaintext password is briefly available.
 */
export function needsRehash(hash: string): boolean {
  if (!hash.startsWith("pbkdf2$")) return true;
  const iter = parseInt(hash.split("$")[1] || "0", 10);
  return !iter || iter < ITERATIONS;
}

/** Constant-time hex string comparison (avoids a content-based timing oracle). */
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
