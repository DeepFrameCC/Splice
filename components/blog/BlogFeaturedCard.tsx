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
      className="group block overflow-hidden rounded-2xl bg-df-surface shadow-lg ring-1 ring-white/[0.08] transition hover:shadow-xl md:grid md:grid-cols-2"
    >
      {/* Cover image */}
      <div className="relative aspect-video overflow-hidden bg-df-surface md:aspect-auto md:min-h-[320px]">
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.coverImageAlt || post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-white/5">
            <span className="font-sans text-5xl font-extrabold text-white/20">DF</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-df-gold/20 px-3 py-1 text-xs font-bold text-df-gold">
            À la une
          </span>
          {post.categories.slice(0, 2).map((cat) => (
            <span
              key={cat.id}
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80"
            >
              {cat.name}
            </span>
          ))}
        </div>

        <h2 className="mt-4 font-sans text-xl font-bold text-white transition-colors group-hover:text-df-gold md:text-2xl leading-snug">
          {post.title}
        </h2>

        <p className="mt-3 text-white/60 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="mt-5">
          <BlogAuthorRow
            author={post.author}
            publishedAt={post.publishedAt}
            readingTimeMin={post.readingTimeMin}
          />
        </div>

        <span className="mt-4 inline-block text-sm font-bold text-df-gold group-hover:underline">
          Lire l&apos;article →
        </span>
      </div>
    </Link>
  );
}
