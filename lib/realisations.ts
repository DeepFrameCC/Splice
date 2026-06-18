/**
 * Data layer for individual réalisation pages (`/realisations/[slug]`).
 *
 * Backed by published VIDEO `Media` records — each video gets its own crawlable
 * URL with a complete Schema.org `VideoObject` (cf. `buildRealisationJsonLd`),
 * the mechanism that surfaces the site in Google's Video SERP. No dedicated
 * `slug` column exists, so the slug is derived from the title (titles are unique
 * in practice; on collision the most recent video wins, later ones get an id suffix).
 */

import { cache } from "react";
import { db } from "@/lib/db";

export interface Realisation {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  /** R2 mp4 URL — used as VideoObject.contentUrl and the <video> source. */
  url: string;
  thumbnailUrl: string | null;
  category: string | null;
  client: string | null;
  /** Stored as "MM:SS" / "HH:MM:SS". */
  duration: string | null;
  createdAt: string;
  materiel: string[];
}

/** URL-safe slug: strip accents, lowercase, collapse non-alphanumerics to `-`. */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * All published videos as réalisations, newest first. Cached per request.
 * Returns `[]` if the DB is unreachable (build time) — callers rely on ISR.
 */
export const getAllRealisations = cache(async (): Promise<Realisation[]> => {
  try {
    const videos = await db.media.findMany({
      where: { published: true, type: "VIDEO" },
      select: {
        id: true,
        title: true,
        description: true,
        url: true,
        thumbnailUrl: true,
        category: true,
        client: true,
        duration: true,
        createdAt: true,
        materiel: true,
      },
      orderBy: [{ createdAt: "desc" }],
    });

    const seen = new Set<string>();
    const out: Realisation[] = [];
    for (const v of videos) {
      const base = slugify(v.title);
      if (!base) continue; // title with no usable characters — skip
      // Deterministic de-dupe: keep first (newest), suffix later collisions.
      const slug = seen.has(base) ? `${base}-${v.id.slice(-6)}` : base;
      seen.add(slug);
      out.push({
        id: v.id,
        slug,
        title: v.title,
        description: v.description,
        url: v.url,
        thumbnailUrl: v.thumbnailUrl,
        category: v.category,
        client: v.client,
        duration: v.duration,
        createdAt: v.createdAt.toISOString(),
        materiel: v.materiel,
      });
    }
    return out;
  } catch {
    return [];
  }
});

export async function getRealisationBySlug(slug: string): Promise<Realisation | null> {
  const all = await getAllRealisations();
  return all.find((r) => r.slug === slug) ?? null;
}
