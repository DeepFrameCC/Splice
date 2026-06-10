"use server";
import { z } from "zod";
import { auth, isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendMail, MAIL_CONTACT, MAIL_FOUNDERS, type MailAttachment } from "@/lib/mailer";
import { buildDevisPdfBytes, bytesToBase64 } from "@/lib/pdf-documents";
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

/** Échappe le HTML d'un texte libre avant injection dans un e-mail. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

  // Formule gratuite (totalHT = 0, ex. Formule Bienvenue) : rien à encaisser.
  // La facture est émise directement « PAYEE » et le devis passe en « PAYE »,
  // soit l'état final identique à celui atteint après paiement Stripe pour un
  // devis payant. L'acceptation reste manuelle : c'est l'admin qui décide ici.
  const isFree = result.totalHT === 0;

  // Créer la facture (idempotent : devisId est unique). Pas de facture pour
  // un abonnement : chaque prélèvement Stripe génère la sienne via le webhook
  // invoice.paid — en créer une ici la laisserait « EMISE » à jamais.
  if (result.devisType !== "ABONNEMENT") {
    const existingFacture = await db.facture.findUnique({ where: { devisId } });
    if (!existingFacture) {
      const factNum = await nextNumero("FACTURE");
      await db.facture.create({
        data: {
          numero: `F-${factNum.numero}`,
          devisId: result.id,
          userId: result.userId,
          status: isFree ? "PAYEE" : "EMISE",
        },
      });
    }
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
  await db.devis.update({ where: { id: devisId }, data: { status: isFree ? "PAYE" : "VALIDE" } });

  // PDF du devis joint à l'e-mail de validation, avec copie à Splice Studio
  // (best-effort : l'e-mail part sans pièce jointe si la génération échoue).
  let attachments: MailAttachment[] | undefined;
  try {
    const pdfBytes = await buildDevisPdfBytes(result);
    attachments = [{ filename: `devis-${result.numero}.pdf`, content: bytesToBase64(pdfBytes) }];
  } catch (e) {
    console.error(`[validerDevis] PDF generation failed for devis ${result.numero}:`, e);
  }
  const bccSplice = MAIL_FOUNDERS.length ? MAIL_FOUNDERS : [MAIL_CONTACT];
  const isAbo = result.devisType === "ABONNEMENT";

  if (isFree) {
    await sendMail({
      to: result.emailContact,
      bcc: bccSplice,
      attachments,
      subject: `Splice Studio — Votre ${result.pack} n°${result.numero} est confirmée`,
      html: `
      <div style="font-family:system-ui;color:#0E0E22;max-width:600px">
        <h2 style="color:#F36B1F">C'est confirmé !</h2>
        <p>Bonjour ${escapeHtml(result.nomContact)},</p>
        <p>Votre <strong>${result.pack}</strong> (devis n°${result.numero}) vient d'être validée par notre équipe. Comme cette prestation est offerte, il n'y a rien à régler.</p>
        <p>Nous revenons vers vous très vite pour caler les détails et la date de votre prestation.</p>
        <p style="margin-top:20px">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/profil/devis/${devisId}" style="background:#F36B1F;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Voir mon espace</a>
        </p>
        <p style="font-size:12px;color:#777;margin-top:30px">Splice Studio · ${MAIL_CONTACT}</p>
      </div>`
    });
  } else {
    await sendMail({
      to: result.emailContact,
      bcc: bccSplice,
      attachments,
      subject: `Splice Studio — Votre devis n°${result.numero} est validé`,
      html: `
      <div style="font-family:system-ui;color:#0E0E22;max-width:600px">
        <h2 style="color:#F36B1F">Devis validé !</h2>
        <p>Bonjour ${escapeHtml(result.nomContact)},</p>
        <p>Votre devis <strong>n°${result.numero}</strong> d'un montant de <strong>${result.totalHT} €</strong> vient d'être validé par notre équipe. Vous le trouverez en pièce jointe de cet e-mail.</p>
        ${isAbo
          ? `<p>Votre contrat a été généré automatiquement. Vous pouvez maintenant activer votre abonnement : le prélèvement ${result.billingCycle === "ANNUEL" ? "annuel" : "mensuel"} démarre dès l'activation.</p>`
          : `<p>Une facture et un contrat ont été générés automatiquement. Vous pouvez maintenant régler l'acompte de <strong>${result.acompteAmount} €</strong> pour confirmer votre prestation.</p>`
        }
        <p style="margin-top:20px">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/profil/devis/${devisId}/payer" style="background:#F36B1F;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">${isAbo ? "Activer mon abonnement" : "Payer l'acompte"}</a>
        </p>
        <p style="font-size:12px;color:#777;margin-top:30px">Splice Studio · ${MAIL_CONTACT}</p>
      </div>`
    });
  }

  await audit({ action: "DEVIS_UPDATED", userId: adminId, target: devisId, metadata: { status: isFree ? "PAYE" : "VALIDE", free: isFree } });

  if (result.userId) {
    await notify({
      userId: result.userId,
      type: "DEVIS_STATUS",
      title: isFree ? `${result.pack} n°${result.numero} confirmée` : `Devis n°${result.numero} validé`,
      message: isFree
        ? `Votre ${result.pack} est validée. Rien à régler, on vous recontacte pour organiser la prestation.`
        : `Votre devis de ${result.totalHT} € a été validé. Vous pouvez maintenant régler l'acompte.`,
      href: isFree ? `/profil/devis/${devisId}` : `/profil/devis/${devisId}/payer`,
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
    subject: `Splice Studio — Devis n°${devis.numero} non retenu`,
    html: `
      <div style="font-family:system-ui;color:#0E0E22;max-width:600px">
        <h2 style="color:#F36B1F">Devis non retenu</h2>
        <p>Bonjour ${escapeHtml(devis.nomContact)},</p>
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

const propositionDateSchema = z
  .string()
  .trim()
  .min(5, "Le message doit contenir au moins 5 caractères.")
  .max(2000, "Le message ne peut pas dépasser 2000 caractères.");

/**
 * Propose une autre date au client (quand l'équipe n'est pas disponible) sans
 * refuser ni valider le devis : il reste en ATTENTE. Le client reçoit le
 * message libre par e-mail + notification in-app. Aucun changement de statut.
 */
export async function proposerAutreDate(devisId: string, message: string) {
  const adminId = await requireAdmin();
  const texte = propositionDateSchema.parse(message);

  const result = await db.devis.findUniqueOrThrow({ where: { id: devisId } });
  if (result.status !== "ATTENTE") {
    throw new Error("Une autre date ne peut être proposée que pour un devis en attente.");
  }

  // Le message vient d'un champ libre admin : on échappe le HTML. white-space:pre-wrap
  // préserve les retours à la ligne saisis.
  const safe = escapeHtml(texte);

  await sendMail({
    to: result.emailContact,
    subject: `Splice Studio — Proposition de date pour votre devis n°${result.numero}`,
    html: `
      <div style="font-family:system-ui;color:#0E0E22;max-width:600px">
        <h2 style="color:#F36B1F">Une proposition de date</h2>
        <p>Bonjour ${escapeHtml(result.nomContact)},</p>
        <p>Au sujet de votre devis <strong>n°${result.numero}</strong> :</p>
        <div style="background:#f6f6f8;border-radius:8px;padding:16px;margin:16px 0;white-space:pre-wrap;line-height:1.6">${safe}</div>
        <p>Un doute sur nos disponibilités ? Écrivez-nous à <a href="mailto:${MAIL_CONTACT}" style="color:#F36B1F">${MAIL_CONTACT}</a>, on vous répond rapidement.</p>
        <p style="margin-top:20px">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/profil/devis/${devisId}" style="background:#F36B1F;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Voir mon devis</a>
        </p>
        <p style="font-size:12px;color:#777;margin-top:30px">Splice Studio · ${MAIL_CONTACT}</p>
      </div>`,
  });

  await audit({
    action: "DEVIS_UPDATED",
    userId: adminId,
    target: devisId,
    metadata: { type: "date_proposee" },
  });

  if (result.userId) {
    await notify({
      userId: result.userId,
      type: "DEVIS_STATUS",
      title: `Proposition de date — devis n°${result.numero}`,
      message: texte.length > 140 ? `${texte.slice(0, 139)}…` : texte,
      href: `/profil/devis/${devisId}`,
    });
  }

  revalidatePath("/admin/devis");
  revalidatePath(`/profil/devis/${devisId}`);
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
