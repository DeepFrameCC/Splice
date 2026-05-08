import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { PACKS } from "@/lib/pricing";
import PayerClient from "@/components/devis/PayerClient";

export default async function PayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const userId = (session?.user as any)?.id as string;

  const devis = await db.devis.findUnique({ where: { id } });
  if (!devis || devis.userId !== userId) notFound();
  if (devis.status !== "VALIDE") redirect(`/profil/devis/${id}`);
  if (devis.acomptePaid) redirect(`/profil/devis/${id}?paye=1`);

  return (
    <PayerClient
      devisId={devis.id}
      numero={devis.numero}
      nomContact={devis.nomContact}
      nomEntreprise={devis.nomEntreprise}
      totalHT={devis.totalHT}
      acompteRate={devis.acompteRate}
      acompteAmount={devis.acompteAmount}
      pack={PACKS[devis.pack]?.label ?? devis.pack}
    />
  );
}
