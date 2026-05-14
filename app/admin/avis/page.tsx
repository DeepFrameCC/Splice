import { db } from "@/lib/db";
import { Star, MessageSquare, CheckCircle, Clock } from "lucide-react";
import { ApprouverBtn, RejeterBtn, FeaturedToggle } from "@/components/dashboard/AvisActions";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminAvisPage() {
  const [avisEnAttente, avisApprouves] = await Promise.all([
    db.avis.findMany({ where: { approuve: false }, orderBy: { createdAt: "desc" } }),
    db.avis.findMany({ where: { approuve: true }, orderBy: { createdAt: "desc" }, take: 50 }),
  ]);

  const totalAvis = avisEnAttente.length + avisApprouves.length;
  const noteMoyenne = avisApprouves.length > 0
    ? (avisApprouves.reduce((sum, a) => sum + a.note, 0) / avisApprouves.length).toFixed(1)
    : "—";

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-df-ink lg:text-4xl">
          Avis clients
        </h1>
        <p className="mt-1 text-sm text-df-ink/50">
          {totalAvis} avis au total · {avisEnAttente.length} en attente · Note moyenne : {noteMoyenne}/5
        </p>
      </header>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "En attente", value: avisEnAttente.length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Approuvés", value: avisApprouves.length, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total", value: totalAvis, icon: MessageSquare, color: "text-df-blue", bg: "bg-df-blue/5" },
          { label: "Note moyenne", value: noteMoyenne, icon: Star, color: "text-df-gold", bg: "bg-df-gold/10" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-df-blue/10">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.bg}`}>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-df-ink">{s.value}</p>
            <p className="text-xs text-df-ink/50">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pending reviews */}
      {avisEnAttente.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-df-ink">
            <Clock className="h-5 w-5 text-amber-500" />
            En attente de modération ({avisEnAttente.length})
          </h2>
          <div className="space-y-3">
            {avisEnAttente.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-amber-200/50"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-df-ink">{a.auteurNom}</p>
                      <Badge variant="gold">En attente</Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < a.note ? "fill-df-gold text-df-gold" : "text-df-ink/15"}`}
                        />
                      ))}
                      <span className="ml-1.5 text-xs text-df-ink/40">{a.note}/5</span>
                    </div>
                  </div>
                  <span className="text-xs text-df-ink/30">
                    {a.createdAt.toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <p className="mt-3 text-sm text-df-ink/70">« {a.contenu} »</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ApprouverBtn avisId={a.id} />
                  <RejeterBtn avisId={a.id} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Approved reviews */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-df-ink">
          <CheckCircle className="h-5 w-5 text-emerald-500" />
          Avis publiés ({avisApprouves.length})
        </h2>
        {avisApprouves.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-df-blue/10">
            <MessageSquare className="mx-auto h-10 w-10 text-df-blue/20" />
            <p className="mt-4 text-sm text-df-ink/40">Aucun avis publié pour le moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-df-blue/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-df-blue/10 text-left">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-df-ink/40">Auteur</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-df-ink/40">Note</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-df-ink/40">Contenu</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-df-ink/40">Date</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-df-ink/40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {avisApprouves.map((a, i) => (
                  <tr
                    key={a.id}
                    className={`border-b border-df-blue/5 transition hover:bg-df-cream/30 ${
                      i % 2 === 0 ? "bg-white" : "bg-df-cream/10"
                    }`}
                  >
                    <td className="px-5 py-4 font-bold text-df-ink">{a.auteurNom}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            className={`h-3 w-3 ${j < a.note ? "fill-df-gold text-df-gold" : "text-df-ink/15"}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="max-w-xs px-5 py-4 text-xs text-df-ink/60">
                      <p className="line-clamp-2">{a.contenu}</p>
                    </td>
                    <td className="px-5 py-4 text-xs text-df-ink/40">
                      {a.createdAt.toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <FeaturedToggle avisId={a.id} featured={a.featured} />
                        <RejeterBtn avisId={a.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
