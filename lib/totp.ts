import { TOTP, Secret } from "otpauth";
import * as QRCode from "qrcode";
import { encrypt, decrypt } from "./encryption";

const ISSUER = "Splice Studio";
const DIGITS = 6;
const PERIOD = 30;
const ALGORITHM = "SHA1";

/**
 * Encrypt a TOTP secret for at-rest storage in Postgres.
 * Returns the original value untouched when ENCRYPTION_KEY is missing
 * (dev-only fallback — production deployments MUST set ENCRYPTION_KEY).
 */
export function encryptTotpSecret(plain: string): string {
  if (!process.env.ENCRYPTION_KEY) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ENCRYPTION_KEY required to store 2FA secret in production");
    }
    return plain;
  }
  return encrypt(plain);
}

/**
 * Decrypt a TOTP secret read from Postgres. Tolerates legacy plain-text rows
 * (returns the input unchanged when it looks like raw Base32) so existing
 * accounts keep working through a soft migration.
 */
export function decryptTotpSecret(stored: string): string {
  if (!process.env.ENCRYPTION_KEY) return stored;
  // Legacy plain Base32 secrets (uppercase letters + digits, length ~32)
  if (/^[A-Z2-7]+=*$/.test(stored)) return stored;
  try {
    return decrypt(stored);
  } catch {
    // If decryption fails, fall back to the raw value (legacy or corrupted).
    return stored;
  }
}

/** Generate a new TOTP secret for a user */
export function generateTOTPSecret(email: string) {
  const secret = new Secret({ size: 20 });
  const totp = new TOTP({
    issuer: ISSUER,
    label: email,
    algorithm: ALGORITHM,
    digits: DIGITS,
    period: PERIOD,
    secret,
  });

  return {
    secret: secret.base32,
    uri: totp.toString(),
  };
}

/**
 * Verify a TOTP code against a stored secret (allows 1 period drift).
 * Accepts both encrypted (ciphertext) and legacy plain Base32 secrets.
 */
export function verifyTOTP(token: string, storedSecret: string): boolean {
  const base32 = decryptTotpSecret(storedSecret);
  try {
    const totp = new TOTP({
      issuer: ISSUER,
      algorithm: ALGORITHM,
      digits: DIGITS,
      period: PERIOD,
      secret: Secret.fromBase32(base32),
    });

    const delta = totp.validate({ token, window: 1 });
    return delta !== null;
  } catch {
    return false;
  }
}

/** Generate a QR code data URL from a TOTP URI */
export async function generateQRCodeDataURL(uri: string): Promise<string> {
  return QRCode.toDataURL(uri, {
    width: 256,
    margin: 2,
    color: { dark: "#F36B1F", light: "#FFFFFF" },
  });
}
