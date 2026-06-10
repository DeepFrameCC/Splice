"use server";

import { auth, isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { audit } from "@/lib/audit";
import { blogPostFormSchema } from "@/lib/blog/types";
import { ensureUniqueSlug } from "@/lib/blog/slug";
import { calculateReadingTime } from "@/lib/blog/reading-time";
import { sanitizeRichHtml } from "@/lib/sanitize/html";
import { z } from "zod";

async function requireAdmin(): Promise<string> {
  const session = await auth();
  const role = session?.user?.role;
  if (!isAdmin(role)) throw new Error("FORBIDDEN");
  const id = session?.user?.id;
  if (!id) throw new Error("FORBIDDEN");
  return id;
}

// ─── Blog posts ────────────────────────────────────────────────────

export async function createBlogPost(formData: z.infer<typeof blogPostFormSchema>) {
  const adminId = await requireAdmin();
  const data = blogPostFormSchema.parse(formData);

  const slug = await ensureUniqueSlug(data.slug);
  const content = data.content ? sanitizeRichHtml(data.content) : data.content;
  const readingTimeMin = content ? calculateReadingTime(content) : 1;

  const post = await db.blogPost.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content,
      coverImageUrl: data.coverImageUrl || null,
      coverImageAlt: data.coverImageAlt || null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      tags: data.tags ?? [],
      readingTimeMin,
      status: "DRAFT",
      publishedAt: new Date(),
      ...(data.authorId ? { author: { connect: { id: data.authorId } } } : {}),
      ...(data.parentServiceId ? { parentService: { connect: { id: data.parentServiceId } } } : {}),
      ...(data.categoryIds?.length
        ? { categories: { connect: data.categoryIds.map((id) => ({ id })) } }
        : {}),
    },
  });

  await audit({
    action: "ADMIN_ACTION",
    userId: adminId,
    target: post.id,
    metadata: { type: "blog_post_created", title: post.title },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");

  return { id: post.id, slug: post.slug };
}

export async function updateBlogPost(
  postId: string,
  formData: z.infer<typeof blogPostFormSchema>,
) {
  const adminId = await requireAdmin();
  const data = blogPostFormSchema.parse(formData);

  const slug = await ensureUniqueSlug(data.slug, postId);
  const content = data.content ? sanitizeRichHtml(data.content) : data.content;
  const readingTimeMin = content ? calculateReadingTime(content) : 1;

  const post = await db.blogPost.update({
    where: { id: postId },
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content,
      coverImageUrl: data.coverImageUrl || null,
      coverImageAlt: data.coverImageAlt || null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      tags: data.tags ?? [],
      readingTimeMin,
      ...(data.authorId
        ? { author: { connect: { id: data.authorId } } }
        : { author: { disconnect: true } }),
      ...(data.parentServiceId
        ? { parentService: { connect: { id: data.parentServiceId } } }
        : { parentService: { disconnect: true } }),
      categories: {
        set: (data.categoryIds ?? []).map((id) => ({ id })),
      },
    },
  });

  await audit({
    action: "ADMIN_ACTION",
    userId: adminId,
    target: post.id,
    metadata: { type: "blog_post_updated", title: post.title },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/admin/blog");

  return { id: post.id, slug: post.slug };
}

export async function publishBlogPost(postId: string) {
  const adminId = await requireAdmin();

  const post = await db.blogPost.update({
    where: { id: postId },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });

  await audit({
    action: "ADMIN_ACTION",
    userId: adminId,
    target: postId,
    metadata: { type: "blog_post_published", title: post.title },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/admin/blog");
}

export async function unpublishBlogPost(postId: string) {
  const adminId = await requireAdmin();

  const post = await db.blogPost.update({
    where: { id: postId },
    data: { status: "DRAFT" },
  });

  await audit({
    action: "ADMIN_ACTION",
    userId: adminId,
    target: postId,
    metadata: { type: "blog_post_unpublished", title: post.title },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/admin/blog");
}

export async function archiveBlogPost(postId: string) {
  const adminId = await requireAdmin();

  const post = await db.blogPost.update({
    where: { id: postId },
    data: { status: "ARCHIVED" },
  });

  await audit({
    action: "ADMIN_ACTION",
    userId: adminId,
    target: postId,
    metadata: { type: "blog_post_archived", title: post.title },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/admin/blog");
}

export async function deleteBlogPost(postId: string) {
  const adminId = await requireAdmin();

  const post = await db.blogPost.delete({ where: { id: postId } });

  await audit({
    action: "ADMIN_ACTION",
    userId: adminId,
    target: postId,
    metadata: { type: "blog_post_deleted", title: post.title },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

// ─── Blog categories ───────────────────────────────────────────────

const categorySchema = z.object({
  name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug invalide"),
  color: z.string().optional(),
});

export async function createBlogCategory(
  formData: z.infer<typeof categorySchema>,
) {
  const adminId = await requireAdmin();
  const data = categorySchema.parse(formData);

  const category = await db.blogCategory.create({
    data: {
      name: data.name,
      slug: data.slug,
      color: data.color || null,
    },
  });

  await audit({
    action: "ADMIN_ACTION",
    userId: adminId,
    target: category.id,
    metadata: { type: "blog_category_created", name: category.name },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");

  return { id: category.id };
}

export async function deleteBlogCategory(categoryId: string) {
  const adminId = await requireAdmin();

  const category = await db.blogCategory.delete({
    where: { id: categoryId },
  });

  await audit({
    action: "ADMIN_ACTION",
    userId: adminId,
    target: categoryId,
    metadata: { type: "blog_category_deleted", name: category.name },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}
