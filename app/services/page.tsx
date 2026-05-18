import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Services audiovisuels",
  description:
    "Montage video, production corporate, motion design. DeepFrame couvre l'ensemble de la chaine de production audiovisuelle a Orleans et Tours.",
  alternates: { canonical: "https://deepframe.cc/services" },
};

export const revalidate = 3600;

export default async function ServicesHubPage() {
  const services = await db.service.findMany({
    orderBy: { publishedAt: "asc" },
    select: {
      slug: true,
      shortName: true,
      name: true,
      metaDescription: true,
      coverImageUrl: true,
      coverImageAlt: true,
    },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
        Nos services audiovisuels
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
        De la captation au livrable final, DeepFrame prend en charge chaque etape de votre projet video.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-df-surface shadow-sm transition hover:shadow-md hover:border-df-gold/25"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-df-surface">
              <Image
                src={s.coverImageUrl}
                alt={s.coverImageAlt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h2 className="text-lg font-semibold text-white group-hover:text-df-gold transition">
                {s.name}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/50 line-clamp-3">
                {s.metaDescription}
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-df-gold">
                En savoir plus &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>

      {services.length === 0 && (
        <p className="mt-12 text-center text-white/40">Aucun service disponible pour le moment.</p>
      )}
    </main>
  );
}
