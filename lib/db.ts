import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

/**
 * Create a Prisma client bound to the Neon HTTP driver.
 * On Cloudflare Workers each request creates its own client — by design.
 * Neon HTTP has no persistent connections so there is zero overhead.
 */
export function getDb(databaseUrl: string = process.env.DATABASE_URL!): PrismaClient {
  const adapter = new PrismaNeonHttp(databaseUrl, { fullResults: false });
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
