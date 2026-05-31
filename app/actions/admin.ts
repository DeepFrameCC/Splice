"use server";
import { auth, isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import { nextNumero } from "@/lib/numbering";
import { revalidatePath } from "next/cache";
import { audit } from "@/lib/audit";
import { notify } from "@/lib/notifications";
import type { Role } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role;
  if (!isAdmin(role)) throw new Error("FORBIDDEN");
  return session?.user?.id;
}

export async function validerDevis(devisId: string) {
  const adminId = await requireAdmin();

  // ⚠️ Pas de $transaction interactive : sur Cloudflare Workers + Neon, la connexion
  // est recyclée entre deux requêtes → "Transaction not found". On fait des écritures
  // séquentielles et idempotentes, le statut VALIDE étant écrit en dernier (si une étape
  // échoue avant, le devis reste ATTENTE et l'admin peut relancer la validation).
  const result = await db.devis.findUniqueOrThrow({ where: { id: devisId } });
  if (result.status !== "ATTENTE") throw new Error("Seul un devis en attente peut être validé.");
  if (!result.userId) throw new Error("Impossible de valider un devis sans client associé.");

  // Créer la facture (idempotent : devisId est unique)
  const existingFacture = await db.facture.findUnique({ where: { devisId } });
  if (!existingFacture) {
    const factNum = await nextNumero("FACTURE");
    await db.facture.create({
      data: {
        numero: `F-${factNum.numero}`,
        devisId: result.id,
        userId: result.userId,
        status: "EMISE",
      },
    });
  }

  // Créer le contrat (idempotent : devisId est unique)
  const existingContrat = await db.contrat.findUnique({ where: { devisId } });
  if (!existingContrat) {
    const contratNum = await nextNumero("CONTRAT");
    await db.contrat.create({
      data: {
        numero: `C-${contratNum.numero}`,
        annee: contratNum.annee,
        sequence: contratNum.sequence,
        devisId: result.id,
        userId: result.userId,
        status: "A_VENIR",
      },
    });
  }

  // Statut en dernier.
  await db.devis.update({ where: { id: devisId }, data: { status: "VALIDE" } });

  await sendMail({
    to: result.emailContact,
    subject: `Splice — Votre devis n°${result.numero} est validé`,
    html: `
      <div style="font-family:system-ui;color:#0E0E22;max-width:600px">
        <h2 style="color:#F36B1F">Devis validé !</h2>
        <p>Bonjour ${result.nomContact},</p>
        <p>Votre devis <strong>n°${result.numero}</strong> d'un montant de <strong>${result.totalHT} €</strong> vient d'être validé par notre équipe.</p>
        <p>Une facture et un contrat ont été générés automatiquement. Vous pouvez maintenant régler l'acompte de <strong>${result.acompteAmount} €</strong> pour confirmer votre prestation.</p>
        <p style="margin-top:20px">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/profil/devis/${devisId}/payer" style="background:#F36B1F;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Payer l'acompte</a>
        </p>
        <p style="font-size:12px;color:#777;margin-top:30px">Splice · contact.splicestudio@gmail.com</p>
      </div>`
  });

  await audit({ action: "DEVIS_UPDATED", userId: adminId, target: devisId, metadata: { status: "VALIDE" } });

  if (result.userId) {
    await notify({
      userId: result.userId,
      type: "DEVIS_STATUS",
      title: `Devis n°${result.numero} validé`,
      message: `Votre devis de ${result.totalHT} € a été validé. Vous pouvez maintenant régler l'acompte.`,
      href: `/profil/devis/${devisId}/payer`,
    });
  }

  revalidatePath("/admin/devis");
  revalidatePath("/admin/factures");
  revalidatePath("/admin/contrats");
  revalidatePath(`/profil/devis/${devisId}`);
}

export async function refuserDevis(devisId: string) {
  const adminId = await requireAdmin();
  const existing = await db.devis.findUniqueOrThrow({ where: { id: devisId } });
  if (existing.status !== "ATTENTE") throw new Error("Seul un devis en attente peut être refusé.");
  const devis = await db.devis.update({ where: { id: devisId }, data: { status: "REFUSE" } });

  await sendMail({
    to: devis.emailContact,
    subject: `Splice — Devis n°${devis.numero} non retenu`,
    html: `
      <div style="font-family:system-ui;color:#0E0E22;max-width:600px">
        <h2 style="color:#F36B1F">Devis non retenu</h2>
        <p>Bonjour ${devis.nomContact},</p>
        <p>Après examen, votre devis <strong>n°${devis.numero}</strong> n'a malheureusement pas été retenu.</p>
        <p>N'hésitez pas à nous contacter pour en discuter ou faire une nouvelle demande.</p>
        <p style="font-size:12px;color:#777;margin-top:30px">Splice · contact.splicestudio@gmail.com</p>
      </div>`
  });

  await audit({ action: "DEVIS_UPDATED", userId: adminId, target: devisId, metadata: { status: "REFUSE" } });

  if (devis.userId) {
    await notify({
      userId: devis.userId,
      type: "DEVIS_STATUS",
      title: `Devis n°${devis.numero} non retenu`,
      message: "Votre devis n'a pas été retenu. Contactez-nous pour en discuter.",
      href: `/profil/devis`,
    });
  }

  revalidatePath("/admin/devis");
}

const CONTRAT_TRANSITIONS: Record<string, string[]> = {
  A_VENIR: ["EN_COURS"],
  EN_COURS: ["FINI"],
  FINI: [],
};

export async function changerStatutContrat(contratId: string, status: "A_VENIR" | "EN_COURS" | "FINI") {
  const adminId = await requireAdmin();
  const contrat = await db.contrat.findUniqueOrThrow({ where: { id: contratId } });
  const allowed = CONTRAT_TRANSITIONS[contrat.status] ?? [];
  if (!allowed.includes(status)) {
    throw new Error(`Transition ${contrat.status} → ${status} non autorisée.`);
  }
  await db.contrat.update({ where: { id: contratId }, data: { status } });
  await audit({ action: "CONTRAT_UPDATED", userId: adminId, target: contratId, metadata: { status } });
  revalidatePath("/admin/contrats");
}

export async function changerStatutFacture(factureId: string, status: "EMISE" | "PAYEE" | "ANNULEE") {
  const adminId = await requireAdmin();
  await db.facture.update({ where: { id: factureId }, data: { status } });
  await audit({ action: "ADMIN_ACTION", userId: adminId, target: factureId, metadata: { type: "facture_status", status } });
  revalidatePath("/admin/factures");
  revalidatePath("/profil/factures");
}

export async function changerRoleUtilisateur(userId: string, role: Role) {
  const adminId = await requireAdmin();
  if (userId === adminId) throw new Error("Impossible de modifier votre propre rôle.");
  const target = await db.user.findUniqueOrThrow({ where: { id: userId } });
  if (target.role === "ADMIN") throw new Error("Impossible de modifier le rôle d'un autre administrateur.");

  await db.user.update({ where: { id: userId }, data: { role } });
  await audit({ action: "ADMIN_ACTION", userId: adminId, target: userId, metadata: { type: "role_change", role } });
  revalidatePath("/admin/utilisateurs");
}
