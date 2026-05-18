"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Pencil, Eye, EyeOff, Trash2, Loader2 } from "lucide-react";
import { publishBlogPost, unpublishBlogPost, deleteBlogPost } from "@/app/actions/admin-blog";
import { useRouter } from "next/navigation";
import BlogStatusBadge from "./admin/BlogStatusBadge";

interface BlogAdminBarProps {
  postId: string;
  status: string;
  editUrl: string;
}

export default function BlogAdminBar({ postId, status, editUrl }: BlogAdminBarProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handlePublish = () => {
    startTransition(async () => {
      await publishBlogPost(postId);
    });
  };

  const handleUnpublish = () => {
    startTransition(async () => {
      await unpublishBlogPost(postId);
    });
  };

  const handleDelete = () => {
    if (!window.confirm("Supprimer définitivement cet article ?")) return;
    startTransition(async () => {
      await deleteBlogPost(postId);
      router.push("/blog");
    });
  };

  return (
    <div className="mx-auto mb-6 max-w-4xl px-6">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/[0.08] bg-df-surface px-4 py-3">
        <BlogStatusBadge status={status} />

        <div className="flex flex-1 items-center justify-end gap-2">
          <Link
            href={editUrl}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-df-surface px-3 py-1.5 text-xs font-bold text-df-gold transition hover:bg-white/5"
          >
            <Pencil className="h-3.5 w-3.5" />
            Modifier
          </Link>

          {status !== "PUBLISHED" ? (
            <button
              onClick={handlePublish}
              disabled={isPending}
              className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
              Publier
            </button>
          ) : (
            <button
              onClick={handleUnpublish}
              disabled={isPending}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-amber-600 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <EyeOff className="h-3.5 w-3.5" />}
              Dépublier
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-lg border border-red-500/20 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-500/10 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
