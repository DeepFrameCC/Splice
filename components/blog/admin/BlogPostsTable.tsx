"use client";

import Link from "next/link";
import { Pencil, Trash2, Eye, MoreHorizontal } from "lucide-react";
import BlogStatusBadge from "./BlogStatusBadge";
import { deleteBlogPost, publishBlogPost, unpublishBlogPost, archiveBlogPost } from "@/app/actions/admin-blog";
import { useState, useTransition } from "react";
import type { BlogPostListItem } from "@/lib/blog/types";

interface BlogPostsTableProps {
  posts: BlogPostListItem[];
}

export default function BlogPostsTable({ posts }: BlogPostsTableProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAction = (action: () => Promise<void>) => {
    setOpenMenu(null);
    startTransition(async () => {
      await action();
    });
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-df-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.08] bg-white/[0.04]">
            <th className="px-4 py-3 text-left font-bold text-white/50">Titre</th>
            <th className="hidden px-4 py-3 text-left font-bold text-white/50 md:table-cell">Statut</th>
            <th className="hidden px-4 py-3 text-left font-bold text-white/50 lg:table-cell">Auteur</th>
            <th className="hidden px-4 py-3 text-left font-bold text-white/50 md:table-cell">Date</th>
            <th className="px-4 py-3 text-right font-bold text-white/50">Actions</th>
          </tr>
        </thead>
        <tbody className={isPending ? "opacity-50" : ""}>
          {posts.map((post) => (
            <tr key={post.id} className="border-b border-white/[0.06] last:border-0 hover:bg-df-cream/20 transition">
              <td className="px-4 py-3">
                <div>
                  <p className="font-bold text-white line-clamp-1">{post.title}</p>
                  <p className="text-xs text-white/40 line-clamp-1">/blog/{post.slug}</p>
                  <div className="mt-1 md:hidden">
                    <BlogStatusBadge status={post.status} />
                  </div>
                </div>
              </td>
              <td className="hidden px-4 py-3 md:table-cell">
                <BlogStatusBadge status={post.status} />
              </td>
              <td className="hidden px-4 py-3 text-white/60 lg:table-cell">
                {post.author?.pseudo || "—"}
              </td>
              <td className="hidden px-4 py-3 text-white/60 md:table-cell">
                {new Date(post.publishedAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3">
                <div className="relative flex items-center justify-end gap-1">
                  {post.status === "PUBLISHED" && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="rounded-lg p-2 text-white/40 hover:bg-white/[0.06] hover:text-white transition"
                      title="Voir"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  )}
                  <Link
                    href={`/admin/blog/${post.id}/modifier`}
                    className="rounded-lg p-2 text-white/40 hover:bg-white/[0.06] hover:text-white transition"
                    title="Modifier"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>

                  {/* Dropdown */}
                  <button
                    onClick={() => setOpenMenu(openMenu === post.id ? null : post.id)}
                    className="rounded-lg p-2 text-white/40 hover:bg-white/[0.06] hover:text-white transition"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  {openMenu === post.id && (
                    <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-white/[0.08] bg-df-surface p-1 shadow-lg">
                      {post.status !== "PUBLISHED" && (
                        <button
                          onClick={() => handleAction(() => publishBlogPost(post.id))}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-green-700 hover:bg-green-50 transition"
                        >
                          Publier
                        </button>
                      )}
                      {post.status === "PUBLISHED" && (
                        <button
                          onClick={() => handleAction(() => unpublishBlogPost(post.id))}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-amber-700 hover:bg-amber-500/10 transition"
                        >
                          Dépublier
                        </button>
                      )}
                      {post.status !== "ARCHIVED" && (
                        <button
                          onClick={() => handleAction(() => archiveBlogPost(post.id))}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-white/60 hover:bg-white/[0.06] transition"
                        >
                          Archiver
                        </button>
                      )}
                      <div className="my-1 border-t border-white/[0.08]" />
                      <button
                        onClick={() => {
                          if (window.confirm("Supprimer définitivement cet article ?")) {
                            handleAction(() => deleteBlogPost(post.id));
                          } else {
                            setOpenMenu(null);
                          }
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-500/10 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {posts.length === 0 && (
        <div className="p-12 text-center text-white/40">
          Aucun article trouvé.
        </div>
      )}
    </div>
  );
}
