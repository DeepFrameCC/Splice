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
  const userId = (session?.user as any)?.id as string;
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const devis = await db.devis.findUnique({ where: { id }, include: { user: true } });
  if (!devis || (devis.userId !== userId && !isAdmin)) notFound();

  const lines = devis.lines as { label: string; qty?: number; unit?: number; total: number }[];

  return (
    <div>
      {sp.paye === "1" && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-800">
          <CheckCircle className="h-6 w-6" />
          <div>
            <p className="font-bold">Paiement confirmé !</p>
            <p className="text-sm">Votre acompte a été réglé avec succès. Votre prestation va être planifiée.</p>
          </div>
        </div>
      )}

      {sp.nouveau === "1" && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-df-cream p-4 text-df-blue">
          <CheckCircle className="h-6 w-6 text-df-gold" />
          <div>
            <p className="font-bold">Demande de devis envoyée !</p>
            <p className="text-sm">Notre équipe revient vers vous sous 48h.</p>
          </div>
        </div>
      )}

      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl italic text-df-blue">Devis n°{devis.numero}</h1>
          <p className="text-sm text-df-blue/70">Émis le {devis.createdAt.toLocaleDateString("fr-FR")}</p>
        </div>
        <StatusPill status={devis.status as any} />
      </header>

      <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-df-blue/10">
        <h2 className="font-bold text-df-blue">Détail de la prestation</h2>
        <table className="mt-3 w-full text-sm">
          <tbody>
            {lines.map((l, i) => (
              <tr key={i} className="border-b border-df-blue/5">
                <td className="py-2">{l.label}{l.qty ? ` (×${l.qty})` : ""}</td>
                <td className="py-2 text-right font-bold">{l.total} €</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td className="pt-4 font-bold">Total HT</td><td className="pt-4 text-right font-display text-2xl italic text-df-blue">{devis.totalHT} €</td></tr>
            <tr><td className="text-sm text-df-blue/70">Acompte ({devis.acompteRate}%)</td><td className="text-right text-df-blue/70">{devis.acompteAmount} €</td></tr>
            <tr><td className="text-sm text-df-blue/70">Solde à la livraison</td><td className="text-right text-df-blue/70">{devis.totalHT - devis.acompteAmount} €</td></tr>
          </tfoot>
        </table>
        <p className="mt-4 text-xs text-df-blue/60">TVA non applicable, art. 293 B du CGI.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {devis.status === "VALIDE" && !devis.acomptePaid && (
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
