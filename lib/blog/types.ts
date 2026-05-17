import { z } from "zod";

// ─── List item (for cards) ──────────────────────────────────────────

export interface BlogPostListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  readingTimeMin: number;
  publishedAt: Date;
  status: string;
  author: { pseudo: string; id: string } | null;
  parentService: { name: string; slug: string } | null;
  categories: { id: string; slug: string; name: string; color: string | null }[];
}

// ─── Full post (for article page) ───────────────────────────────────

export interface BlogPostFull extends BlogPostListItem {
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Category ───────────────────────────────────────────────────────

export interface BlogCategoryItem {
  id: string;
  slug: string;
  name: string;
  color: string | null;
  _count: { posts: number };
}

// ─── Form data (Zod) ───────────────────────────────────────────────

export const blogPostFormSchema = z.object({
  title: z.string().min(3, "Le titre doit faire au moins 3 caractères"),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug invalide (lettres minuscules, chiffres, tirets)"),
  excerpt: z.string().min(10, "L'extrait doit faire au moins 10 caractères"),
  content: z.string(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  coverImageAlt: z.string().optional(),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
  parentServiceId: z.string().optional().or(z.literal("")),
  authorId: z.string().optional().or(z.literal("")),
  categoryIds: z.array(z.string()).optional(),
});

export type BlogPostFormData = z.infer<typeof blogPostFormSchema>;
