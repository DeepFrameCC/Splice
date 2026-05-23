import { z } from "zod";

/**
 * Runtime environment validation.
 * Imported at startup — fails fast with clear error messages.
 */

const isProduction = process.env.NODE_ENV === "production";

const serverSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  DIRECT_URL: z.string().url().optional(),

  // Auth
  AUTH_SECRET: z.string().min(16, "AUTH_SECRET must be at least 16 characters"),

  // Encryption
  ENCRYPTION_KEY: isProduction
    ? z.string().length(64, "ENCRYPTION_KEY must be 64 hex chars (32 bytes)")
    : z.string().length(64).optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith("sk_", "STRIPE_SECRET_KEY must start with sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_", "STRIPE_WEBHOOK_SECRET must start with whsec_"),

  // Email
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  MAIL_FROM: z.string().email("MAIL_FROM must be a valid email"),
  MAIL_FOUNDERS: z.string().min(1, "MAIL_FOUNDERS is required"),

  // Rate limiting (required in production)
  UPSTASH_REDIS_REST_URL: isProduction
    ? z.string().url("UPSTASH_REDIS_REST_URL is required in production")
    : z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: isProduction
    ? z.string().min(1, "UPSTASH_REDIS_REST_TOKEN is required in production")
    : z.string().optional(),

  // reCAPTCHA
  RECAPTCHA_SECRET_KEY: z.string().optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().optional(),
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(),
});

function validateEnv() {
  const serverResult = serverSchema.safeParse(process.env);
  const clientResult = clientSchema.safeParse(process.env);

  const errors: string[] = [];

  if (!serverResult.success) {
    for (const issue of serverResult.error.issues) {
      errors.push(`  ${issue.path.join(".")}: ${issue.message}`);
    }
  }

  if (!clientResult.success) {
    for (const issue of clientResult.error.issues) {
      errors.push(`  ${issue.path.join(".")}: ${issue.message}`);
    }
  }

  if (errors.length > 0) {
    const msg = `[env] Missing or invalid environment variables:\n${errors.join("\n")}`;
    if (isProduction) {
      throw new Error(msg);
    }
    console.warn(msg);
  }

  return {
    server: serverResult.success ? serverResult.data : (process.env as unknown as z.infer<typeof serverSchema>),
    client: clientResult.success ? clientResult.data : (process.env as unknown as z.infer<typeof clientSchema>),
  };
}

export const env = validateEnv();
