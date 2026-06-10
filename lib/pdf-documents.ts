import type { Devis, Facture } from "@prisma/client";
import { FOUNDER_LABEL, MENTIONS_LEGALES } from "@/lib/pricing";
import {
  createPdfContext,
  drawHeader,
  drawInfoBlock,
  drawPartiesBlock,
  drawTableHeader,
  drawTableRow,
  drawTotalsBlock,
  drawReglementBlock,
  drawMentionsLegales,
  addPage,
  safe,
} from "@/lib/pdf";

/**
 * Générateurs de documents PDF partagés entre les routes (téléchargement) et
 * le mailer (pièces jointes). Toute la logique de dessin vit ici pour que le
 * client et Splice Studio reçoivent exactement le même document.
 */

export const PRESTATAIRE_PDF = {
  entreprise: "Girault Louisia",
  adresse: "84 Boulevard Alexandre Martin, 45000 Orléans",
  email: "contact.splicestudio@gmail.com",
  siret: "10461962200012",
} as const;

export type PdfLine = { label: string; qty?: number; unit?: number; total: number };

/** Parse défensif du champ JSON `lines` d'un devis. */
export function parseDevisLines(raw: unknown): PdfLine[] {
  try {
    if (Array.isArray(raw)) return raw as PdfLine[];
    if (typeof raw === "string") return JSON.parse(raw) as PdfLine[];
  } catch (err) {
    console.error("[pdf-documents] Failed to parse lines JSON:", err);
  }
  return [];
}

/** Encode des bytes PDF en base64 (compatible Workers, sans Buffer). */
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function chefLabelOf(devis: Devis): string {
  return devis.chefDeProjet && FOUNDER_LABEL[devis.chefDeProjet]
    ? FOUNDER_LABEL[devis.chefDeProjet]
    : safe(devis.chefDeProjet, "Non assigne");
}

function prestataireBlock(devis: Devis) {
  return {
    entreprise: `${PRESTATAIRE_PDF.entreprise} (${chefLabelOf(devis)})`,
    adresse: PRESTATAIRE_PDF.adresse,
    email: PRESTATAIRE_PDF.email,
    siret: PRESTATAIRE_PDF.siret,
  };
}

/* ── Devis ───────────────────────────────────────────────────────── */

export async function buildDevisPdfBytes(devis: Devis): Promise<Uint8Array> {
  const lines = parseDevisLines(devis.lines);
  const { pdf, fonts, page } = await createPdfContext();
  let currentPage = page;

  drawHeader(currentPage, fonts, "DEVIS");

  const dateStr = devis.createdAt.toLocaleDateString("fr-FR");
  const echeanceDate = new Date(devis.createdAt);
  echeanceDate.setDate(echeanceDate.getDate() + 30);

  drawInfoBlock(currentPage, fonts, {
    date: dateStr,
    echeance: echeanceDate.toLocaleDateString("fr-FR"),
    numero: safe(devis.numero),
    docType: "DEVIS",
  });

  const destinataireLines = [
    devis.nomEntreprise || "",
    devis.nomContact,
    devis.telContact,
    devis.emailContact,
    devis.lieuTournage ? `Lieu d'exécution : ${devis.lieuTournage}` : "",
    devis.dateTournage ? `date du tournage: ${devis.dateTournage.toLocaleDateString("fr-FR")}` : "",
    devis.remarques ? `Remarques specifiques: ${devis.remarques}` : "",
  ].filter(Boolean) as string[];

  const afterParties = drawPartiesBlock(currentPage, fonts, prestataireBlock(devis), destinataireLines);

  const tableTop = Math.max(afterParties, 210);
  drawTableHeader(currentPage, fonts, tableTop);

  let y = tableTop + 28;
  for (const line of lines) {
    y = drawTableRow(currentPage, fonts, line, y);
    if (y > 680) {
      currentPage = addPage(pdf);
      y = 50;
    }
  }

  const afterTotals = drawTotalsBlock(currentPage, fonts, {
    totalHT: devis.totalHT,
    acompteRate: devis.acompteRate,
    acompteAmount: devis.acompteAmount,
    solde: devis.totalHT - devis.acompteAmount,
  }, y + 8);

  const afterReglement = drawReglementBlock(
    currentPage, fonts, afterTotals + 8,
    "DEVIS",
    "Délais d'exécution : sous 14 jours après signature",
  );

  const mentionsY = Math.min(afterReglement + 8, 720);
  drawMentionsLegales(currentPage, fonts, MENTIONS_LEGALES, mentionsY);

  return pdf.save();
}

/* ── Facture ─────────────────────────────────────────────────────── */

export interface FacturePdfParams {
  facture: Facture;
  devis: Devis;
  profile?: { adresse?: string | null; codePostal?: string | null; ville?: string | null } | null;
  paymentMethodLabel?: string | null;
}

export async function buildFacturePdfBytes({
  facture,
  devis,
  profile,
  paymentMethodLabel,
}: FacturePdfParams): Promise<Uint8Array> {
  const isAbo = facture.abonnementId != null;
  const montant = facture.montant ?? devis.totalHT;
  const lines = parseDevisLines(devis.lines);

  const { pdf, fonts, page } = await createPdfContext();
  let currentPage = page;

  drawHeader(currentPage, fonts, "FACTURE");

  const dateStr = facture.createdAt.toLocaleDateString("fr-FR");
  const echeanceDate = new Date(facture.createdAt);
  echeanceDate.setDate(echeanceDate.getDate() + 30);

  drawInfoBlock(currentPage, fonts, {
    date: dateStr,
    echeance: echeanceDate.toLocaleDateString("fr-FR"),
    numero: safe(facture.numero),
    docType: "FACTURE",
  });

  const destinataireLines = [
    devis.nomEntreprise || "",
    devis.nomContact,
    devis.telContact,
    devis.emailContact,
    profile?.adresse,
    [profile?.codePostal, profile?.ville].filter(Boolean).join(" "),
    devis.dateTournage ? `date du tournage: ${devis.dateTournage.toLocaleDateString("fr-FR")}` : "",
    devis.remarques ? `Remarques specifiques: ${devis.remarques}` : "",
  ].filter(Boolean) as string[];

  const afterParties = drawPartiesBlock(currentPage, fonts, prestataireBlock(devis), destinataireLines);

  const tableTop = Math.max(afterParties, 220);
  drawTableHeader(currentPage, fonts, tableTop);

  let y = tableTop + 28;
  for (const line of lines) {
    y = drawTableRow(currentPage, fonts, line, y);
    if (y > 680) {
      currentPage = addPage(pdf);
      y = 50;
    }
  }

  const afterTotals = drawTotalsBlock(currentPage, fonts, {
    totalHT: montant,
    acompteRate: isAbo ? 0 : devis.acompteRate,
    acompteAmount: isAbo ? montant : devis.acompteAmount,
    solde: isAbo ? 0 : devis.totalHT - devis.acompteAmount,
  }, y + 8);

  const afterReglement = drawReglementBlock(
    currentPage, fonts, afterTotals + 8,
    "FACTURE",
    "Règlement : à réception",
    paymentMethodLabel ?? null,
  );

  const factureMentions = [
    "TVA non applicable, art. 293 B du CGI.",
    "Paiement à réception. Pas d'escompte consenti pour paiement anticipé.",
    "Pénalités de retard : 3 fois le taux d'intérêt légal exigibles le jour suivant la date d'échéance.",
    "Indemnité forfaitaire de 40 € pour frais de recouvrement en cas de retard de paiement (professionnels).",
    "Les fichiers numériques restent la propriété exclusive de l'auteur jusqu'au paiement intégral du solde.",
  ];
  const mentionsY = Math.min(afterReglement + 8, 720);
  drawMentionsLegales(currentPage, fonts, factureMentions, mentionsY);

  return pdf.save();
}
