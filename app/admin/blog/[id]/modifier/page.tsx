import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import BlogPostForm from "@/components/blog/admin/BlogPostForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminBlogEditPage({ params }: Props) {
  const { id } = await params;

  const [post, categories, services, authors] = await Promise.all([
    db.blogPost.findUnique({
      where: { id },
      include: { categories: { select: { id: true } } },
    }),
    db.blogCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, slug: true, color: true } }),
    db.service.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.user.findMany({
      where: { role: { in: ["ADMIN", "TEAM"] } },
      select: { id: true, pseudo: true },
    }),
  ]);

  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold italic text-df-blue">
        Modifier l&apos;article
      </h1>
      <BlogPostForm
        mode="edit"
        initialData={{
          id: post.id,
          status: post.status,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImageUrl: post.coverImageUrl ?? "",
          coverImageAlt: post.coverImageAlt ?? "",
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDescription ?? "",
          tags: post.tags,
          parentServiceId: post.parentServiceId ?? "",
          authorId: post.authorId ?? "",
          categoryIds: post.categories.map((c) => c.id),
        }}
        categories={categories}
        services={services}
        authors={authors}
      />
    </div>
  );
}
