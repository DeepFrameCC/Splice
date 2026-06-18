/**
 * Sync blog article HTML to the database.
 *
 * Single source of truth = prisma/blog-content.ts. Run this after editing that
 * file to push the updated `content` to every matching blogPost, WITHOUT
 * re-running the full seed (which also recreates users/services/categories).
 *
 *   npm run sync:blog        # = tsx scripts/update-blog-content.js
 *
 * Requires DATABASE_URL in the environment (same as `npm run db:seed`).
 * Previously this script carried a hand-pasted copy of 5 articles, which
 * drifted from the canonical content (stale text + em dashes). It now imports
 * the canonical source so the two can never diverge again.
 */
import { PrismaClient } from "@prisma/client";
import { blogContent } from "../prisma/blog-content";

const db = new PrismaClient();

async function main() {
  let updated = 0;
  let missing = 0;
  for (const [slug, content] of Object.entries(blogContent)) {
    const res = await db.blogPost.updateMany({ where: { slug }, data: { content } });
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
