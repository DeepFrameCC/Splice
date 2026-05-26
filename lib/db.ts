import { PrismaClient } from "@prisma/client";
import { PrismaNeonHTTP } from "@prisma/adapter-neon";
import { cache } from "react";

/**
 * Request-scoped Prisma client via React cache().
 * 
 * - On Cloudflare Workers: one client per request (Workers-safe, stateless)
 * - On Node.js dev server: one client per render pass
 * - react/cache ensures we don't create multiple clients during a single request
 *   even if multiple components call getDb()
 */
export const getDb = cache((): PrismaClient => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("[db] DATABASE_URL is not defined in environment variables");
  }
  const cleanUrl = url.trim().replace(/^["']|["']$/g, "");
  const adapter = new PrismaNeonHTTP(cleanUrl, { fullResults: false });
  return new PrismaClient({ adapter }) as PrismaClient;
});

/**
 * Legacy alias — keeps all `import { db } from "@/lib/db"` working unchanged.
 * 
 * Uses a Proxy so that `db.service.findMany(...)` calls `getDb().service.findMany(...)`.
 * Unlike the old version, getDb() is now cached per-request via react/cache,
 * so `db.service` and `db.blogPost` within the same request share the same client.
 */
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return getDb()[prop as keyof PrismaClient];
  },
});

