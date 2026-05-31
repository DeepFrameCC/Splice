import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import { cache } from "react";

// ⚠️ Cloudflare Workers : router les requêtes simples via HTTP fetch (stateless)
// plutôt que via une session WebSocket persistante. Sur Workers, l'isolat est gelé
// entre deux requêtes → la session WebSocket Neon est fermée et toute requête
// suivante (même un findUnique) échoue avec « Transaction not found / closed ».
// Le mode fetch est sans état et résout définitivement ce problème.
neonConfig.poolQueryViaFetch = true;

// Singleton PrismaClient mapping to preserve connections and support transactions
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const getDb = cache((): PrismaClient => {
  if (process.env.NODE_ENV !== "production" && globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("[db] DATABASE_URL is not defined in environment variables");
  }
  const cleanUrl = url.trim().replace(/^["']|["']$/g, "").split("?")[0];

  // Dynamically set WebSocket constructor for Node.js CLI/server contexts
  if (typeof WebSocket === "undefined") {
    const ws = require("ws");
    neonConfig.webSocketConstructor = ws;
  }

  const adapter = new PrismaNeon({ connectionString: cleanUrl });
  const prisma = new PrismaClient({ adapter });

  // Store in global singleton ONLY for hot reload safety in development.
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }

  return prisma;
});

/**
 * Proxy object pointing to the singleton PrismaClient.
 * Keeps all standard imports like `import { db } from "@/lib/db"` working perfectly.
 */
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return getDb()[prop as keyof PrismaClient];
  },
});
