import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

/**
 * Create a Prisma client bound to the Neon HTTP driver.
 * Uses the Edge runtime of Prisma Client (no fs.readFileSync).
 * On Cloudflare Workers each request creates its own client — by design.
 * Neon HTTP has no persistent connections so there is zero overhead.
 */
export function getDb(databaseUrl: string = process.env.DATABASE_URL!): PrismaClient {
  if (!databaseUrl) {
    throw new Error("[db] DATABASE_URL is not defined in environment variables");
  }
  const cleanUrl = databaseUrl.trim().replace(/^["']|["']$/g, "");
  const adapter = new PrismaNeonHttp(cleanUrl, { fullResults: false });
  return new PrismaClient({ adapter });
}

/**
 * Legacy alias — keeps all `import { db } from "@/lib/db"` working unchanged.
 * Each property access creates a fresh client (Workers-safe, stateless).
 */
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return getDb()[prop as keyof PrismaClient];
  },
});
