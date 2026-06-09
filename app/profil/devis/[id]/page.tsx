import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import StatusPill from "@/components/dashboard/StatusPill";
import { Download, CreditCard, CheckCircle } from "lucide-react";
import Link from "next/link";

export default async function DevisDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ paye?: string; nouveau?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const session = await auth();
  const userId = session?.user?.id!;
  const isAdmin = session?.user?.role === "ADMIN";

  const devis = await db.devis.findUnique({ where: { id }, include: { user: true } });
  if (!devis || (devis.userId !== userId && !isAdmin)) notFound();

  const lines = devis.lines as { label: string; qty?: number; unit?: number; total: number }[];

  return (
    <div>
      {sp.paye === "1" && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-500/10 p-4 text-emerald-400 ring-1 ring-emerald-500/20">
          <CheckCircle className="h-6 w-6" />
          <div>
            <p className="font-bold text-white">Paiement confirmé !</p>
            <p className="text-sm">Votre acompte a été réglé avec succès. Votre prestation va être planifiée.</p>
          </div>
        </div>
      )}

      {sp.nouveau === "1" && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-df-gold/10 p-4 text-white ring-1 ring-df-gold/20">
          <CheckCircle className="h-6 w-6 text-df-gold" />
          <div>
            <p className="font-bold">Demande de devis envoyée !</p>
            <p className="text-sm text-white/70">Notre équipe revient vers vous sous 48h.</p>
          </div>
        </div>
      )}

      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-df-gold">Devis n°{devis.numero}</h1>
          <p className="text-sm text-white/60">Émis le {devis.createdAt.toLocaleDateString("fr-FR")}</p>
        </div>
        <StatusPill status={devis.status as any} />
      </header>

      <div className="rounded-3xl bg-white/5 p-6 shadow ring-1 ring-white/10">
        <h2 className="font-bold text-white">Détail de la prestation</h2>
        <table className="mt-3 w-full text-sm">
          <tbody className="text-white/80">
            {lines.map((l, i) => (
              <tr key={i} className="border-b border-white/10">
                <td className="py-2">{l.label}{l.qty ? ` (×${l.qty})` : ""}</td>
                <td className="py-2 text-right font-bold text-white">{l.total} €</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td className="pt-4 font-bold text-white">Total HT</td><td className="pt-4 text-right font-sans text-xl font-bold text-df-gold">{devis.totalHT} €</td></tr>
            <tr><td className="text-sm text-white/70">Acompte ({devis.acompteRate}%)</td><td className="text-right text-white/70">{devis.acompteAmount} €</td></tr>
            <tr><td className="text-sm text-white/70">Solde à la livraison</td><td className="text-right text-white/70">{devis.totalHT - devis.acompteAmount} €</td></tr>
          </tfoot>
        </table>
        <p className="mt-4 text-xs text-white/40">TVA non applicable, art. 293 B du CGI.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {((devis.status === "VALIDE" || (devis.status === "ATTENTE" && devis.pack === "Test Production")) && !devis.acomptePaid && devis.acompteAmount > 0) && (
          <Link href={`/profil/devis/${devis.id}/payer`} className="btn-primary">
            <CreditCard className="h-5 w-5" /> Payer l&apos;acompte ({devis.acompteAmount} €)
          </Link>
        )}
        <a href={`/api/devis/${devis.id}/pdf`} target="_blank" rel="noopener noreferrer" className="btn-secondary">
          <Download className="h-5 w-5" /> Télécharger le PDF
        </a>
      </div>
    </div>
  );
}
