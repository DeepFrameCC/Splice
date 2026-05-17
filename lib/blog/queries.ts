import { cache } from "react";
import { db } from "@/lib/db";
import type { BlogPostListItem, BlogPostFull, BlogCategoryItem } from "./types";

// ─── Select fragments ───────────────────────────────────────────────

const listSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  coverImageUrl: true,
  coverImageAlt: true,
  readingTimeMin: true,
  publishedAt: true,
  status: true,
  author: { select: { pseudo: true, id: true } },
  parentService: { select: { name: true, slug: true } },
  categories: { select: { id: true, slug: true, name: true, color: true } },
} as const;

const fullSelect = {
  ...listSelect,
  content: true,
  metaTitle: true,
  metaDescription: true,
  tags: true,
  createdAt: true,
  updatedAt: true,
} as const;

// ─── Public queries ─────────────────────────────────────────────────

interface GetPublishedPostsOptions {
  categorySlug?: string;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const getPublishedPosts = cache(
  async (opts: GetPublishedPostsOptions = {}): Promise<{ posts: BlogPostListItem[]; total: number }> => {
    const { categorySlug, search, page = 1, limit = 9 } = opts;

    const where: Record<string, unknown> = { status: "PUBLISHED" };

    if (categorySlug) {
      where.categories = { some: { slug: categorySlug } };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const [posts, total] = await Promise.all([
      db.blogPost.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        select: listSelect,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.blogPost.count({ where }),
    ]);

    return { posts: posts as unknown as BlogPostListItem[], total };
  },
);

export const getPostBySlug = cache(async (slug: string): Promise<BlogPostFull | null> => {
  const post = await db.blogPost.findUnique({
    where: { slug },
    select: fullSelect,
  });
  return post as unknown as BlogPostFull | null;
});

export const getFeaturedPost = cache(async (): Promise<BlogPostListItem | null> => {
  const post = await db.blogPost.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: listSelect,
  });
  return post as unknown as BlogPostListItem | null;
});

export const getRelatedPosts = cache(
  async (postId: string, serviceSlug?: string | null, limit = 3): Promise<BlogPostListItem[]> => {
    const where: Record<string, unknown> = {
      status: "PUBLISHED",
      id: { not: postId },
    };

    if (serviceSlug) {
      where.parentService = { slug: serviceSlug };
    }

    let posts = await db.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: limit,
      select: listSelect,
    });

    // If not enough from same service, fill with recent posts
    if (posts.length < limit) {
      const moreIds = posts.map((p) => p.id);
      const more = await db.blogPost.findMany({
        where: {
          status: "PUBLISHED",
          id: { notIn: [postId, ...moreIds] },
        },
        orderBy: { publishedAt: "desc" },
        take: limit - posts.length,
        select: listSelect,
      });
      posts = [...posts, ...more];
    }

    return posts as unknown as BlogPostListItem[];
  },
);

export const getAllPublishedSlugs = cache(async () => {
  return db.blogPost.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
});

export const getAllCategories = cache(async (): Promise<BlogCategoryItem[]> => {
  const cats = await db.blogCategory.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { posts: { where: { status: "PUBLISHED" } } } },
    },
  });
  return cats as unknown as BlogCategoryItem[];
});

// ─── Admin queries ──────────────────────────────────────────────────

interface GetPostsForAdminOptions {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const getPostsForAdmin = cache(
  async (opts: GetPostsForAdminOptions = {}): Promise<{ posts: BlogPostListItem[]; total: number }> => {
    const { status, search, page = 1, limit = 20 } = opts;

    const where: Record<string, unknown> = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    const [posts, total] = await Promise.all([
      db.blogPost.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        select: listSelect,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.blogPost.count({ where }),
    ]);

    return { posts: posts as unknown as BlogPostListItem[], total };
  },
);
