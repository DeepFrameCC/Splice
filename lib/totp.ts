import { TOTP, Secret } from "otpauth";
import * as QRCode from "qrcode";

const ISSUER = "DeepFrame";
const DIGITS = 6;
const PERIOD = 30;
const ALGORITHM = "SHA1";

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

/** Verify a TOTP code against a secret (allows 1 period drift) */
export function verifyTOTP(token: string, secret: string): boolean {
  const totp = new TOTP({
    issuer: ISSUER,
    algorithm: ALGORITHM,
    digits: DIGITS,
    period: PERIOD,
    secret: Secret.fromBase32(secret),
  });

  const delta = totp.validate({ token, window: 1 });
  return delta !== null;
}

/** Generate a QR code data URL from a TOTP URI */
export async function generateQRCodeDataURL(uri: string): Promise<string> {
  return QRCode.toDataURL(uri, {
    width: 256,
    margin: 2,
    color: { dark: "#1901AD", light: "#FFFFFF" },
  });
}
