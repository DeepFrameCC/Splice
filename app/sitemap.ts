import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { VILLES, SERVICES_LOCAL_SLUGS } from "@/lib/services/local-seo";
import { getAllRealisations } from "@/lib/realisations";
import { BASE_URL as base } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                             lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/services`,               lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/galerie`,                lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/photos`,                 lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/equipe`,                 lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    // contact: monthly (pas yearly) — la page est mise à jour régulièrement (horaires, email)
    { url: `${base}/contact`,                lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/tarifs`,                 lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/partenaires`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/partenaires/pixel-404`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/realisations/ck-clean-auto`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/agence-communication-orleans`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/photographe-evenementiel`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/production-video-orleans`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/production-video-tours`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/videaste-orleans`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/photographe-orleans`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/devis`,                  lastModified: new Date(), changeFrequency: "yearly",  priority: 0.8 },
    { url: `${base}/blog`,                   lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/faq`,                    lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/mentions-legales`,       lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/confidentialite`,        lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/cookies`,                lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];

  // Geo-local service pages (static, no DB dependency)
  const localPages: MetadataRoute.Sitemap = SERVICES_LOCAL_SLUGS.flatMap((slug) =>
    VILLES.map((v) => ({
      url: `${base}/services/${slug}/${v.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }))
  );

  let dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const [services, blogPosts, realisations] = await Promise.all([
      db.service.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
        orderBy: { sortOrder: "asc" },
      }),
      db.blogPost.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
        orderBy: { publishedAt: "desc" },
      }),
      getAllRealisations(),
    ]);

    dynamicPages = [
      ...services.map((s) => ({
        url: `${base}/services/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...blogPosts.map((p) => ({
        url: `${base}/blog/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...realisations.map((r) => ({
        url: `${base}/realisations/${r.slug}`,
        lastModified: new Date(r.createdAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    // DB unavailable at build time — skip dynamic pages
  }

  return [...staticPages, ...dynamicPages, ...localPages];
}
