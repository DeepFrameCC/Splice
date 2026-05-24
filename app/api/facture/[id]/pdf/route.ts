import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { FOUNDER_LABEL } from "@/lib/pricing";
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

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  /* ── Auth ────────────────────────────────────────────────────────── */
  const session = await auth();
  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === "ADMIN";
  if (!userId) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  /* ── Fetch facture + devis ───────────────────────────────────────── */
  let facture;
  try {
    facture = await db.facture.findUnique({
      where: { id },
      include: { devis: { include: { user: { include: { profile: true } } } }, user: { include: { profile: true } } },
    });
  } catch (err) {
    console.error("[facture-pdf] DB error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  if (!facture || (facture.userId !== userId && !isAdmin)) {
    return NextResponse.json({ error: "Facture introuvable" }, { status: 404 });
  }

  const devis = facture.devis;

  /* ── Parse lines safely ──────────────────────────────────────────── */
  let lines: { label: string; qty?: number; unit?: number; total: number }[] = [];
  try {
    const raw = devis.lines;
    if (Array.isArray(raw)) {
      lines = raw as typeof lines;
    } else if (typeof raw === "string") {
      lines = JSON.parse(raw);
    }
  } catch (err) {
    console.error("[facture-pdf] Failed to parse lines JSON:", err);
    lines = [];
  }

  /* ── Generate PDF ────────────────────────────────────────────────── */
  try {
    const { pdf, fonts, page } = await createPdfContext();
    let currentPage = page;

    /* ── Header ──────────────────────────────────────────────────── */
    drawHeader(currentPage, fonts, "FACTURE");

    /* ── Info block (date, numero) ───────────────────────────────── */
    const dateStr = facture.createdAt.toLocaleDateString("fr-FR");
    const echeanceDate = new Date(facture.createdAt);
    echeanceDate.setDate(echeanceDate.getDate() + 30);
    const echeanceStr = echeanceDate.toLocaleDateString("fr-FR");

    drawInfoBlock(currentPage, fonts, {
      date: dateStr,
      echeance: echeanceStr,
      numero: safe(facture.numero),
      docType: "FACTURE",
    });

    /* ── Prestataire / Destinataire ──────────────────────────────── */
    const chefLabel =
      devis.chefDeProjet && FOUNDER_LABEL[devis.chefDeProjet]
        ? FOUNDER_LABEL[devis.chefDeProjet]
        : safe(devis.chefDeProjet, "Non assigne");

    const destinataireLines = [
      devis.nomEntreprise || "",
      devis.nomContact,
      devis.telContact,
      devis.emailContact,
      facture.user?.profile?.adresse,
      [facture.user?.profile?.codePostal, facture.user?.profile?.ville]
        .filter(Boolean)
        .join(" "),
      devis.dateTournage ? `date du tournage: ${devis.dateTournage.toLocaleDateString("fr-FR")}` : "",
      devis.remarques ? `Remarques specifiques: ${devis.remarques}` : "",
    ].filter(Boolean) as string[];

    const afterParties = drawPartiesBlock(
      currentPage, fonts,
      {
        entreprise: `Prenom Nom (${chefLabel})`,
        adresse: "adresse:",
        email: "contact.splicestudio@gmail.com",
        siret: "En cours d'immatriculation",
      },
      destinataireLines,
    );

    /* ── Table ───────────────────────────────────────────────────── */
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

    /* ── Totals ──────────────────────────────────────────────────── */
    const afterTotals = drawTotalsBlock(currentPage, fonts, {
      totalHT: devis.totalHT,
      acompteRate: devis.acompteRate,
      acompteAmount: devis.acompteAmount,
      solde: devis.totalHT - devis.acompteAmount,
    }, y + 8);

    /* ── Reglement ───────────────────────────────────────────────── */
    const afterReglement = drawReglementBlock(
      currentPage, fonts, afterTotals + 8,
      "Livre le :",
    );

    /* ── Mentions legales ────────────────────────────────────────── */
    const factureMentions = [
      "TVA non applicable, art. 293 B du CGI.",
      "Les fichiers sont livres apres reception du solde.",
    ];
    const mentionsY = Math.min(afterReglement + 8, 720);
    drawMentionsLegales(currentPage, fonts, factureMentions, mentionsY);

    /* ── Serialize ───────────────────────────────────────────────── */
    const pdfBytes = await pdf.save();

    return new NextResponse(pdfBytes.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="facture-${facture.numero}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[facture-pdf] Unexpected error:", err);
    return NextResponse.json(
      { error: "PDF generation failed" },
      { status: 500 },
    );
  }
}
