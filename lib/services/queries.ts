import { cache } from "react";
import { db } from "@/lib/db";

export const getServiceBySlug = cache(async (slug: string) => {
  try {
    return await db.service.findUnique({ where: { slug } });
  } catch (err) {
    console.warn("[services] getServiceBySlug: DB unreachable", err);
    return null;
  }
});

export const getAllServiceSlugs = cache(async () => {
  try {
    return await db.service.findMany({ select: { slug: true } });
  } catch (err) {
    console.warn("[services] getAllServiceSlugs: DB unreachable, returning empty list", err);
    return [] as { slug: string }[];
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
