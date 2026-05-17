"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Category {
  id: string;
  slug: string;
  name: string;
  color: string | null;
  _count: { posts: number };
}

interface BlogCategoryFilterProps {
  categories: Category[];
  activeSlug?: string;
}

export default function BlogCategoryFilter({ categories, activeSlug }: BlogCategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = useCallback(
    (slug: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      if (slug) {
        params.set("cat", slug);
      } else {
        params.delete("cat");
      }
      const qs = params.toString();
      router.push(qs ? `/blog?${qs}` : "/blog");
    },
    [router, searchParams],
  );

  const visibleCategories = categories.filter((c) => c._count.posts > 0);
  if (visibleCategories.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => handleClick(null)}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
          !activeSlug
            ? "bg-df-gold text-white"
            : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
        }`}
      >
        Tous
      </button>
      {visibleCategories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleClick(cat.slug)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
            activeSlug === cat.slug
              ? "bg-df-gold text-white"
              : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
          }`}
        >
          {cat.name}
          <span className="ml-1.5 opacity-60">({cat._count.posts})</span>
        </button>
      ))}
    </div>
  );
}
