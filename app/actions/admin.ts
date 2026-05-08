"use server";
import { auth, isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import { nextNumero } from "@/lib/numbering";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as any)?.role as string | undefined;
  if (!isAdmin(role)) throw new Error("FORBIDDEN");
  return session;
}

export async function validerDevis(devisId: string) {
  await requireAdmin();

  // Transaction : valider le devis + créer facture + créer contrat
  const result = await db.$transaction(async (tx) => {
    const devis = await tx.devis.update({ where: { id: devisId }, data: { status: "VALIDE" } });

    // Créer la facture
    const factNum = await nextNumero("FACTURE", tx);
    await tx.facture.create({
      data: {
        numero: `F-${factNum.numero}`,
        devisId: devis.id,
        userId: devis.userId,
        status: "EMISE",
      },
    });

    // Créer le contrat
    const contratNum = await nextNumero("CONTRAT", tx);
    await tx.contrat.create({
      data: {
        numero: `C-${contratNum.numero}`,
        annee: contratNum.annee,
        sequence: contratNum.sequence,
        devisId: devis.id,
        userId: devis.userId,
        status: "A_VENIR",
      },
    });

    return devis;
  });

  await sendMail({
    to: result.emailContact,
    subject: `Deepframe — Votre devis n°${result.numero} est validé`,
    html: `
      <div style="font-family:system-ui;color:#0A0A23;max-width:600px">
        <h2 style="color:#1901AD">Devis validé !</h2>
        <p>Bonjour ${result.nomContact},</p>
        <p>Votre devis <strong>n°${result.numero}</strong> d'un montant de <strong>${result.totalHT} €</strong> vient d'être validé par notre équipe.</p>
        <p>Une facture et un contrat ont été générés automatiquement. Vous pouvez maintenant régler l'acompte de <strong>${result.acompteAmount} €</strong> pour confirmer votre prestation.</p>
        <p style="margin-top:20px">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/profil/devis/${devisId}/payer" style="background:#FFBD59;color:#1901AD;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Payer l'acompte</a>
        </p>
        <p style="font-size:12px;color:#777;margin-top:30px">Deepframe · contact@deepframe.cc</p>
      </div>`
  });

  revalidatePath("/admin/devis");
  revalidatePath("/admin/factures");
  revalidatePath("/admin/contrats");
  revalidatePath(`/profil/devis/${devisId}`);
}

export async function refuserDevis(devisId: string) {
  await requireAdmin();
  const devis = await db.devis.update({ where: { id: devisId }, data: { status: "REFUSE" } });

  await sendMail({
    to: devis.emailContact,
    subject: `Deepframe — Devis n°${devis.numero} non retenu`,
    html: `
      <div style="font-family:system-ui;color:#0A0A23;max-width:600px">
        <h2 style="color:#1901AD">Devis non retenu</h2>
        <p>Bonjour ${devis.nomContact},</p>
        <p>Après examen, votre devis <strong>n°${devis.numero}</strong> n'a malheureusement pas été retenu.</p>
        <p>N'hésitez pas à nous contacter pour en discuter ou faire une nouvelle demande.</p>
        <p style="font-size:12px;color:#777;margin-top:30px">Deepframe · contact@deepframe.cc</p>
      </div>`
  });

  revalidatePath("/admin/devis");
}

export async function changerStatutContrat(contratId: string, status: "A_VENIR" | "EN_COURS" | "FINI") {
  await requireAdmin();
  await db.contrat.update({ where: { id: contratId }, data: { status } });
  revalidatePath("/admin/contrats");
}

export async function changerStatutFacture(factureId: string, status: "EMISE" | "PAYEE" | "ANNULEE") {
  await requireAdmin();
  await db.facture.update({ where: { id: factureId }, data: { status } });
  revalidatePath("/admin/factures");
  revalidatePath("/profil/factures");
}
