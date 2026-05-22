import Link from "next/link";
import { SERVICES_LOCAL_SLUGS } from "@/lib/services/local-seo";

const VILLES = [
  { slug: "orleans", label: "Orléans" },
  { slug: "tours", label: "Tours" },
  { slug: "centre-val-de-loire", label: "Centre-Val de Loire" },
] as const;

interface Props {
  serviceSlug: string;
}

export function ServiceLocalLinks({ serviceSlug }: Props) {
  // If the service doesn't have a configured local page, do not render links to prevent 404s
  const isEligible = (SERVICES_LOCAL_SLUGS as string[]).includes(serviceSlug);
  if (!isEligible) return null;

  return (
    <section className="mt-8 border-t border-white/[0.08] pt-8">
      <p className="text-sm text-white/40">Aussi disponible à :</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {VILLES.map((ville) => (
          <Link
            key={ville.slug}
            href={`/services/${serviceSlug}/${ville.slug}`}
            className="text-sm text-df-gold hover:underline"
          >
            {ville.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
