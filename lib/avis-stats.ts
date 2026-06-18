/**
 * Cached aggregate of approved client reviews, for the sitewide LocalBusiness
 * `aggregateRating` (Reviews rich result + Local Pack signal).
 *
 * Wrapped in `unstable_cache` (TTL 1h, KV incremental cache) so the root layout
 * stays statically revalidated instead of becoming per-request dynamic — which
 * would multiply Neon hits on every page view and amplify the scale-to-zero 504
 * risk. Failures degrade gracefully to `null` (no rating emitted).
 */

import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";

export interface AvisAggregate {
  ratingValue: number;
  reviewCount: number;
}

export const getAvisAggregate = unstable_cache(
  async (): Promise<AvisAggregate | null> => {
    try {
      const res = await db.avis.aggregate({
        where: { approuve: true },
        _avg: { note: true },
        _count: { _all: true },
      });
      const count = res._count._all;
      const avg = res._avg.note;
      if (!count || avg == null) return null;
      return { ratingValue: Math.round(avg * 10) / 10, reviewCount: count };
    } catch {
      return null;
    }
  },
  ["avis-aggregate-v1"],
  { revalidate: 3600, tags: ["avis"] },
);
