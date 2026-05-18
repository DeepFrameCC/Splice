import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllServices } from "@/lib/services/queries";

export const metadata: Metadata = {
  title: "Nos services audiovisuels — Orléans · Tours | DeepFrame",
  description:
    "Montage vidéo, production corporate, motion design, shooting auto, photographie professionnelle et plus. DeepFrame couvre toute la chaîne audiovisuelle à Orléans et Tours.",
  alternates: { canonical: "https://deepframe.cc/services" },
};

export const revalidate = 3600;

const CATEGORY_LABELS: Record<string, string> = {
  video: "Vidéo",
  photo: "Photo",
  motion: "Motion",
  audio: "Audio",
};

const CATEGORY_ORDER = ["video", "photo", "motion", "audio"];

export default async function ServicesHubPage() {
  const services = await getAllServices();

  // group by category
  const grouped = CATEGORY_ORDER.reduce<Record<string, typeof services>>((acc, cat) => {
    const items = services.filter((s) => s.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-20">
      {/* Hero */}
      <header className="mb-14">
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
          Nos services audiovisuels
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
          De la captation au livrable final, DeepFrame prend en charge chaque étape de votre projet vidéo à Orléans, Tours et dans tout le Centre-Val de Loire.
        </p>
      </header>

      {/* Grouped grid */}
      {Object.entries(grouped).map(([cat, items]) => (
        <section key={cat} className="mb-16">
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-df-gold">
            {CATEGORY_LABELS[cat] ?? cat}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((s) => {
              const isPublished = true; // all from getAllServices are isPublished:true
              return (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-df-surface shadow-sm transition hover:shadow-md hover:border-df-gold/25"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-df-surface">
                    <Image
                      src={s.coverImageUrl}
                      alt={s.coverImageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-white group-hover:text-df-gold transition">
                      {s.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/50 line-clamp-2">
                      {s.metaDescription}
                    </p>
                    <span className="mt-4 inline-block text-sm font-medium text-df-gold">
                      En savoir plus &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      {services.length === 0 && (
        <p className="mt-12 text-center text-white/40">Aucun service disponible pour le moment.</p>
      )}
    </main>
  );
}
