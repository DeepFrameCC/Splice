import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo";

export interface Crumb {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
  className?: string;
  /**
   * Emit the BreadcrumbList JSON-LD. Set to `false` on pages that already
   * include a BreadcrumbList node in their own @graph, to avoid duplicates.
   */
  jsonLd?: boolean;
}

export default function Breadcrumbs({ items, className, jsonLd = true }: BreadcrumbsProps) {
  return (
    <>
      {jsonLd && (
        <JsonLd data={buildBreadcrumbJsonLd(items.map((i) => ({ name: i.name, url: i.href })))} />
      )}
      <nav aria-label="Fil d'Ariane" className={className ?? "text-sm text-white/50"}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-white/70">{item.name}</span>
                ) : (
                  <Link href={item.href} className="transition hover:text-white">{item.name}</Link>
                )}
                {!last && <span aria-hidden className="text-white/30">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
