"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Search, X } from "lucide-react";

export default function BlogSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }
      const qs = params.toString();
      router.push(qs ? `/blog?${qs}` : "/blog");
    }, 400);

    return () => clearTimeout(timer);
  }, [query, router, searchParams]);

  const handleClear = useCallback(() => {
    setQuery("");
  }, []);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher un article..."
        className="w-full rounded-full border border-white/[0.08] bg-white/[0.06] py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/[0.08]"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
          aria-label="Effacer la recherche"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
