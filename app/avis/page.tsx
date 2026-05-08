import { db } from "@/lib/db";
import { Star, AlertTriangle } from "lucide-react";
import AvisForm from "@/components/gallery/AvisForm";

export const dynamic = "force-dynamic";

export default async function AvisPage() {
  let avis: any[] = [];
  let dbError = false;

  try {
    avis = await db.avis.findMany({ where: { approuve: true }, orderBy: { createdAt: "desc" }, take: 24 });
  } catch (e) {
    console.error("[avis] DB error:", e);
    dbError = true;
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-10 text-center">
        <h1 className="font-display text-5xl italic text-df-blue md:text-6xl">Avis</h1>
        <p className="mt-3 text-df-blue/70">Ce que nos clients disent de Deepframe.</p>
      </header>

      {dbError ? (
        <div className="flex items-center justify-center gap-3 rounded-xl bg-amber-50 p-6 text-amber-800">
          <AlertTriangle className="h-6 w-6 shrink-0" />
          <div>
            <p className="font-bold">Service temporairement indisponible</p>
            <p className="text-sm">Merci de réessayer dans quelques instants.</p>
          </div>
        </div>
      ) : (
        <>
          {avis.length === 0 ? (
            <p className="rounded-xl bg-df-cream p-8 text-center text-df-blue/70">Soyez le premier à laisser un avis après votre prestation.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {avis.map((a) => (
                <article key={a.id} className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-df-blue/10 transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < a.note ? "fill-df-gold text-df-gold" : "text-df-blue/20"}`} />
                    ))}
                  </div>
                  <h3 className="mt-3 font-display text-2xl italic text-df-blue">{a.auteurNom}</h3>
                  <p className="mt-2 text-sm text-df-ink/80">« {a.contenu} »</p>
                </article>
              ))}
            </div>
          )}

          {/* Formulaire d'avis */}
          <div className="mt-16">
            <h2 className="mb-6 text-center font-display text-3xl italic text-df-blue">Laissez votre avis</h2>
            <AvisForm />
          </div>
        </>
      )}
    </section>
  );
}
