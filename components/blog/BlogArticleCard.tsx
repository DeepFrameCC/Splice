import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import type { BlogPostListItem } from "@/lib/blog/types";

interface BlogArticleCardProps {
  post: BlogPostListItem;
}

export default function BlogArticleCard({ post }: BlogArticleCardProps) {
  const date = new Date(post.publishedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-df-surface ring-1 ring-white/[0.08] transition hover:ring-white/20"
    >
      {/* Cover */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-white/[0.08] bg-df-surface-alt">
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.coverImageAlt || post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-display text-4xl font-extrabold text-white/10">SS</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        {post.categories[0] && (
          <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-df-gold">
            {post.categories[0].name}
          </span>
        )}

        <h3 className="font-display text-xl font-semibold text-white transition-colors group-hover:text-df-gold line-clamp-2 leading-[1.25]">
          {post.title}
        </h3>

        <p className="flex-1 text-sm text-white/55 line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="mt-2 flex items-center gap-2 border-t border-white/[0.06] pt-3 text-xs font-medium text-white/45">
          <time dateTime={new Date(post.publishedAt).toISOString()}>{date}</time>
          <span className="text-white/25">·</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTimeMin} min
          </span>
        </div>
      </div>
    </Link>
  );
}
