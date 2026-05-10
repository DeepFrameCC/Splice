import { cache } from "react";
import { db } from "@/lib/db";

export const getServiceBySlug = cache(async (slug: string) => {
  return db.service.findUnique({ where: { slug } });
});

export const getAllServiceSlugs = cache(async () => {
  return db.service.findMany({ select: { slug: true } });
});

export const getRelatedArticles = cache(async (serviceSlug: string, limit = 3) => {
  return db.blogPost.findMany({
    where: { parentService: { slug: serviceSlug } },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: { slug: true, title: true, excerpt: true },
  });
});
