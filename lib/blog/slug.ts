import { db } from "@/lib/db";

/**
 * Generate a URL-safe slug from a French title.
 * Strips accents, lowercases, replaces spaces/special chars with hyphens.
 */
export function generateSlug(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric
    .replace(/\s+/g, "-") // spaces to hyphens
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-|-$/g, ""); // trim leading/trailing hyphens
}

/**
 * Ensure the slug is unique in the database.
 * Appends -2, -3, etc. if a collision is found.
 */
export async function ensureUniqueSlug(
  slug: string,
  excludeId?: string,
): Promise<string> {
  let candidate = slug;
  let suffix = 1;

  while (true) {
    const existing = await db.blogPost.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) return candidate;

    suffix++;
    candidate = `${slug}-${suffix}`;
  }
}
