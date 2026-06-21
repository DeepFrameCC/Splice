import Link from "next/link";
import Image from "next/image";
import type { BlogPostListItem } from "@/lib/blog/types";
import BlogAuthorRow from "./BlogAuthorRow";

interface BlogFeaturedCardProps {
  post: BlogPostListItem;
}

export default function BlogFeaturedCard({ post }: BlogFeaturedCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid overflow-hidden rounded-2xl bg-df-surface ring-1 ring-white/[0.08] transition hover:ring-white/20 md:grid-cols-[1fr_380px]"
    >
      {/* Content */}
      <div className="flex flex-col justify-between p-7 md:p-10">
        <div>
          {post.categories[0] && (
            <span className="mb-5 inline-block rounded-full border border-df-gold px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-df-gold">
              {post.categories[0].name}
            </span>
          )}

          <h2 className="font-display text-2xl font-semibold text-white transition-colors group-hover:text-df-gold md:text-3xl leading-[1.1]">
            {post.title}
          </h2>

          <p className="mt-4 text-white/60 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        <div className="mt-7 flex items-center gap-4">
          <BlogAuthorRow
            author={post.author}
            publishedAt={post.publishedAt}
            readingTimeMin={post.readingTimeMin}
          />
          <span className="ml-auto shrink-0 text-sm font-bold text-df-gold group-hover:underline">
            Lire l&apos;article →
          </span>
        </div>
      </div>

      {/* Cover image */}
      <div className="relative aspect-video overflow-hidden border-t border-white/[0.08] bg-df-surface-alt md:aspect-auto md:min-h-[300px] md:border-l md:border-t-0">
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.coverImageAlt || post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 380px"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-display text-5xl font-extrabold text-white/15">SS</span>
          </div>
        )}
      </div>
    </Link>
  );
}
