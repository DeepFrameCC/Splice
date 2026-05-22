import { db } from "@/lib/db";
import BlogPostForm from "@/components/blog/admin/BlogPostForm";

export default async function AdminBlogNewPage() {
  const [categories, services, authors] = await Promise.all([
    db.blogCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, slug: true, color: true } }),
    db.service.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.user.findMany({
      where: { role: { in: ["ADMIN", "TEAM"] } },
      select: { id: true, pseudo: true },
    }),
  ]);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl uppercase tracking-tight text-white">
        Nouvel article
      </h1>
      <BlogPostForm
        mode="create"
        categories={categories}
        services={services}
        authors={authors}
      />
    </div>
  );
}
