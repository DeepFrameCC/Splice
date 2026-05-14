import { PrismaClient } from "@prisma/client";

const g = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  g.prisma ??
  new PrismaClient({
    // Surface slow-query / connection issues in prod logs without flooding
    // them with successful queries. Dev gets the same baseline; bump locally
    // by setting PRISMA_LOG_QUERIES=1 to add "query".
    log: process.env.PRISMA_LOG_QUERIES === "1"
      ? ["query", "warn", "error"]
      : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") g.prisma = db;
