import Image from "next/image";
import Link from "next/link";

interface RelatedService {
  slug: string;
  shortName: string;
  coverImageUrl: string;
  coverImageAlt: string;
  metaDescription: string;
}

interface Props {
  services: RelatedService[];
}

export function ServiceRelated({ services }: Props) {
  if (services.length === 0) return null;

  return (
    <section
      id="services-complementaires"
      aria-labelledby="services-complementaires-h2"
      className="mt-16 scroll-mt-24"
    >
      <h2
        id="services-complementaires-h2"
        className="font-display text-2xl font-bold text-white"
      >
        Services complementaires
      </h2>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            className="group rounded-xl ring-1 ring-white/[0.08] transition hover:scale-[1.02] hover:ring-df-gold/30"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
              <Image
                src={s.coverImageUrl}
                alt={s.coverImageAlt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>

            <div className="p-4">
              <p className="font-display text-sm font-bold text-white">
                {s.shortName}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-white/50">
                {s.metaDescription}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
