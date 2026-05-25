const ITERATIONS = 100000;
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
      salt,
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
  const iter = parseInt(parts[2] || "0", 10);
  const saltHex = parts[3] || "";
  const hashHex = parts[4] || "";
  
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
      salt,
      iterations: iter,
      hash: HASH_NAME,
    },
    baseKey,
    256
  );

  const currentHashHex = toHex(new Uint8Array(derivedBits));
  return currentHashHex === hashHex;
}
