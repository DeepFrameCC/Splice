/**
 * Sync blog article HTML to the database.
 *
 * Single source of truth = prisma/blog-content.ts. Run this after editing that
 * file to push the updated `content` to every matching blogPost, WITHOUT
 * re-running the full seed (which also recreates users/services/categories).
 *
 *   npm run sync:blog        # = tsx scripts/update-blog-content.js
 *
 * Loads DATABASE_URL from .env and connects through the Neon driver adapter,
 * exactly like prisma/seed.ts (the generated client requires an adapter).
 *
 * Previously this script carried a hand-pasted copy of 5 articles, which
 * drifted from the canonical content (stale text + em dashes). It now imports
 * the canonical source so the two can never diverge again.
 */
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";
import ws from "ws";
import { blogContent, blogMetaTitles } from "../prisma/blog-content";

// Minimal .env loader (tsx does not auto-populate env outside the Prisma CLI).
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    for (const rawLine of fs.readFileSync(envPath, "utf-8").split("\n")) {
      const line = rawLine.replace(/\r/g, "").trim();
      if (!line || line.startsWith("#")) continue;
      const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let value = match[2] || "";
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        process.env[match[1]] = value.trim();
      }
    }
  }
} catch (e) {
  console.error("Failed to load .env", e);
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not defined");
  process.exit(1);
}
const cleanUrl = databaseUrl.split("?")[0];
Pool.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: cleanUrl });
const db = new PrismaClient({ adapter });

async function main() {
  let updated = 0;
  let missing = 0;
  for (const [slug, content] of Object.entries(blogContent)) {
    const data = { content };
    if (blogMetaTitles[slug]) data.metaTitle = blogMetaTitles[slug];
    const res = await db.blogPost.updateMany({ where: { slug }, data });
    if (res.count > 0) {
      updated += res.count;
      console.log("updated:", slug);
    } else {
      missing += 1;
      console.warn("no post found for slug:", slug);
    }
  }
  console.log(`Done. ${updated} article(s) synced, ${missing} slug(s) without a post.`);
  await db.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await db.$disconnect();
  process.exit(1);
});
