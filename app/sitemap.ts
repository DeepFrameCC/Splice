import { MetadataRoute } from "next";
import { db } from "@/lib/db";

const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://deepframe.cc";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                  lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/galerie`,     lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/videos`,      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/photos`,      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/equipe`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/avis`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`,     lastModified: new Date(), changeFrequency: "yearly",  priority: 0.5 },
    { url: `${base}/devis`,       lastModified: new Date(), changeFrequency: "yearly",  priority: 0.8 },
  ];

  let dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const [videos, services] = await Promise.all([
      db.media.findMany({
        where: { type: "VIDEO" },
        select: { id: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 200,
      }),
      db.service.findMany({
        select: { slug: true, updatedAt: true },
        orderBy: { publishedAt: "asc" },
      }),
    ]);

    dynamicPages = [
      // Services hub
      ...(services.length > 0
        ? [{ url: `${base}/services`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 }]
        : []),
      // Individual service pages
      ...services.map((s) => ({
        url: `${base}/services/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      // Video pages
      ...videos.map((v) => ({
        url: `${base}/videos/${v.id}`,
        lastModified: v.createdAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    // DB unavailable at build time — skip dynamic pages
  }

  return [...staticPages, ...dynamicPages];
}
