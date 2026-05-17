import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  searchParams?: Record<string, string | undefined>;
}

function buildHref(
  basePath: string,
  page: number,
  searchParams: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (v && k !== "page") params.set(k, v);
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export default function BlogPagination({
  currentPage,
  totalPages,
  basePath = "/blog",
  searchParams = {},
}: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link
          href={buildHref(basePath, currentPage - 1, searchParams)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] text-df-blue/60 transition hover:bg-df-blue/5 hover:text-df-blue"
          aria-label="Page précédente"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.06] text-df-blue/20">
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={buildHref(basePath, page, searchParams)}
          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition ${
            page === currentPage
              ? "bg-df-blue text-white"
              : "border border-white/[0.08] text-df-blue/60 hover:bg-df-blue/5 hover:text-df-blue"
          }`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages ? (
        <Link
          href={buildHref(basePath, currentPage + 1, searchParams)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] text-df-blue/60 transition hover:bg-df-blue/5 hover:text-df-blue"
          aria-label="Page suivante"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.06] text-df-blue/20">
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
