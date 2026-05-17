import Link from "next/link";
import Image from "next/image";
import type { BlogPostListItem } from "@/lib/blog/types";
import BlogAuthorRow from "./BlogAuthorRow";

interface BlogArticleCardProps {
  post: BlogPostListItem;
}

export default function BlogArticleCard({ post }: BlogArticleCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08] transition hover:shadow-lg hover:ring-white/20"
    >
      {/* Cover */}
      <div className="relative aspect-video overflow-hidden bg-df-surface">
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.coverImageAlt || post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-white/5">
            <span className="font-display text-4xl italic text-white/10">DF</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Categories */}
        {post.categories.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {post.categories.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/80"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        <h3 className="font-display text-lg font-bold italic text-white transition-colors group-hover:text-white/80 line-clamp-2">
          {post.title}
        </h3>

        <p className="mt-2 flex-1 text-sm text-white/60 line-clamp-2">
          {post.excerpt}
        </p>

        <div className="mt-4 border-t border-white/[0.06] pt-3">
          <BlogAuthorRow
            author={post.author}
            publishedAt={post.publishedAt}
            readingTimeMin={post.readingTimeMin}
            compact
          />
        </div>
      </div>
    </Link>
  );
}
