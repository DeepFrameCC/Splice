import { db } from "@/lib/db";
import { Star, AlertTriangle, MessageSquare, Quote } from "lucide-react";
import AvisForm from "@/components/gallery/AvisForm";
import { buildAvisJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://splicestudio.fr";

export const metadata: Metadata = {
  title: "Avis clients",
  description: "Découvrez les avis de nos clients sur les prestations audiovisuelles Splice.",
  openGraph: {
    title: "Avis clients — Splice",
    description: "Les retours de nos clients sur nos prestations audiovisuelles.",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${BASE_URL}/avis` },
};

export default async function AvisPage() {
  let avis: { id: string; auteurNom: string; contenu: string; note: number; featured: boolean; createdAt: Date }[] = [];
  let dbError = false;

  try {
    avis = await db.avis.findMany({
      where: { approuve: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 24,
    });
  } catch (e) {
    console.error("[avis] DB error:", e);
    dbError = true;
  }

  const noteMoyenne = avis.length > 0
    ? (avis.reduce((sum, a) => sum + a.note, 0) / avis.length).toFixed(1)
    : null;

  return (
    <>
    <JsonLd data={buildAvisJsonLd(
      noteMoyenne ? parseFloat(noteMoyenne) : null,
      avis.length,
    )} />
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-12 text-center">
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Avis clients
        </h1>
        <p className="mt-3 text-sm text-white/60">
          Ce que nos clients disent de Splice.
          {noteMoyenne && (
            <span className="ml-2 inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-df-gold text-df-gold" />
              <span className="font-bold text-df-gold">{noteMoyenne}/5</span>
              <span className="text-white/55">({avis.length} avis)</span>
            </span>
          )}
        </p>
      </header>

      {dbError ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl bg-amber-500/10 p-6 text-amber-800 ring-1 ring-amber-200">
          <AlertTriangle className="h-6 w-6 shrink-0" />
          <div>
            <p className="font-bold">Service temporairement indisponible</p>
            <p className="text-sm">Merci de réessayer dans quelques instants.</p>
          </div>
        </div>
      ) : (
        <>
          {avis.length === 0 ? (
            <div className="rounded-2xl bg-df-surface p-12 text-center shadow-sm ring-1 ring-white/[0.08]">
              <MessageSquare className="mx-auto h-10 w-10 text-white/20" />
              <p className="mt-4 text-sm text-white/60">
                Soyez le premier à laisser un avis après votre prestation.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {avis.map((a) => (
                <article
                  key={a.id}
                  className={`group relative overflow-hidden rounded-2xl bg-df-surface p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                    a.featured
                      ? "ring-2 ring-df-gold/40"
                      : "ring-1 ring-white/[0.08]"
                  }`}
                >
                  {a.featured && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-df-gold/10 px-2 py-0.5 text-[10px] font-bold text-df-gold">
                      <Star className="h-2.5 w-2.5 fill-df-gold" /> En avant
                    </span>
                  )}
                  <Quote className="absolute -right-2 -top-2 h-16 w-16 rotate-12 text-white/[0.04]" />
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < a.note ? "fill-df-gold text-df-gold" : "text-df-ink/15"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-white/70">
                    «&nbsp;{a.contenu}&nbsp;»
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <p className="font-display text-sm font-bold text-white">{a.auteurNom}</p>
                    <p className="text-[10px] text-white/55">
                      {a.createdAt.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Form */}
          <div className="mt-16">
            <h2 className="mb-6 text-center font-display text-2xl font-bold text-white">
              Laissez votre avis
            </h2>
            <AvisForm />
          </div>
        </>
      )}
    </section>
    </>
  );
}
