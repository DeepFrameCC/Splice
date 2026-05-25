import { cache } from "react";
import { db } from "@/lib/db";

export const getServiceBySlug = cache(async (slug: string) => {
  try {
    return await db.service.findUnique({
      where: { slug, isPublished: true },
    });
  } catch (err) {
    console.warn("[services] getServiceBySlug: DB unreachable", err);
    return null;
  }
});

export const getAllServiceSlugs = cache(async () => {
  try {
    return await db.service.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });
  } catch (err) {
    console.warn("[services] getAllServiceSlugs: DB unreachable, returning empty list", err);
    return [] as { slug: string }[];
  }
});

export const getAllServices = cache(async () => {
  try {
    return await db.service.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      select: {
        slug: true,
        shortName: true,
        name: true,
        metaDescription: true,
        coverImageUrl: true,
        coverImageAlt: true,
        category: true,
        sortOrder: true,
        iconName: true,
        serviceType: true,
        priceRange: true,
      },
    });
  } catch (err) {
    console.error("[services] getAllServices: DB unreachable. Error details:", err instanceof Error ? { message: err.message, stack: err.stack, name: err.name } : err);
    return [];
  }
});

export const getRelatedServices = cache(async (slugs: string[]) => {
  if (slugs.length === 0) return [];

  try {
    return await db.service.findMany({
      where: { slug: { in: slugs }, isPublished: true },
      orderBy: { sortOrder: "asc" },
      select: {
        slug: true,
        shortName: true,
        name: true,
        metaDescription: true,
        coverImageUrl: true,
        coverImageAlt: true,
        category: true,
        iconName: true,
      },
    });
  } catch (err) {
    console.warn("[services] getRelatedServices: DB unreachable, returning empty list", err);
    return [];
  }
});

export const getRelatedArticles = cache(async (serviceSlug: string, limit = 3) => {
  return db.blogPost.findMany({
    where: { parentService: { slug: serviceSlug } },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: { slug: true, title: true, excerpt: true },
  });
});
