import Link from "next/link";
import { Plus } from "lucide-react";
import { getPostsForAdmin } from "@/lib/blog/queries";
import BlogPostsTable from "@/components/blog/admin/BlogPostsTable";

interface Props {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}

const tabs = [
  { label: "Tous", value: "ALL" },
  { label: "Publiés", value: "PUBLISHED" },
  { label: "Brouillons", value: "DRAFT" },
  { label: "Archivés", value: "ARCHIVED" },
];

export default async function AdminBlogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const status = sp.status || "ALL";
  const search = sp.q;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const { posts, total } = await getPostsForAdmin({ status, search, page, limit: 20 });
  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold italic text-df-blue">Articles</h1>
          <p className="text-sm text-df-blue/50">{total} article{total !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/blog/nouveau"
          className="flex items-center gap-2 rounded-full bg-df-gold px-5 py-2.5 text-sm font-bold text-white transition hover:bg-df-gold/90 hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          Nouvel article
        </Link>
      </div>

      {/* Tabs + search */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-1 rounded-xl bg-white/[0.04] p-1">
          {tabs.map((tab) => (
            <Link
              key={tab.value}
              href={`/admin/blog${tab.value !== "ALL" ? `?status=${tab.value}` : ""}`}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                status === tab.value
                  ? "bg-df-surface text-df-blue shadow-sm"
                  : "text-df-blue/50 hover:text-df-blue"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <form action="/admin/blog" className="relative">
          <input type="hidden" name="status" value={status} />
          <input
            name="q"
            defaultValue={search}
            placeholder="Rechercher..."
            className="w-full rounded-full border border-white/[0.08] bg-df-surface py-2 pl-4 pr-10 text-sm text-df-blue placeholder:text-df-blue/40 outline-none focus:border-df-blue/30 md:w-64"
          />
        </form>
      </div>

      {/* Table */}
      <BlogPostsTable posts={posts} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2 text-sm">
          {page > 1 && (
            <Link
              href={`/admin/blog?status=${status}&page=${page - 1}${search ? `&q=${search}` : ""}`}
              className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-df-blue/60 hover:bg-df-blue/5 transition"
            >
              ← Précédent
            </Link>
          )}
          <span className="text-df-blue/50">
            Page {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/admin/blog?status=${status}&page=${page + 1}${search ? `&q=${search}` : ""}`}
              className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-df-blue/60 hover:bg-df-blue/5 transition"
            >
              Suivant →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
