import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { MENTIONS_LEGALES, FOUNDER_LABEL } from "@/lib/pricing";
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
  euro,
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

  /* ── Fetch devis ─────────────────────────────────────────────────── */
  let devis;
  try {
    devis = await db.devis.findUnique({
      where: { id },
      include: { user: true },
    });
  } catch (err) {
    console.error("[devis-pdf] DB error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  if (!devis || (devis.userId !== userId && !isAdmin)) {
    return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
  }

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
    console.error("[devis-pdf] Failed to parse lines JSON:", err);
    lines = [];
  }

  /* ── Generate PDF ────────────────────────────────────────────────── */
  try {
    const { pdf, fonts, page } = await createPdfContext();
    let currentPage = page;

    /* ── Header ──────────────────────────────────────────────────── */
    drawHeader(currentPage, fonts, "DEVIS");

    /* ── Info block (date, numero) ───────────────────────────────── */
    const dateStr = devis.createdAt.toLocaleDateString("fr-FR");
    const echeanceDate = new Date(devis.createdAt);
    echeanceDate.setDate(echeanceDate.getDate() + 30);
    const echeanceStr = echeanceDate.toLocaleDateString("fr-FR");

    drawInfoBlock(currentPage, fonts, {
      date: dateStr,
      echeance: echeanceStr,
      numero: safe(devis.numero),
      docType: "DEVIS",
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
      devis.lieuTournage ? `Lieu d'exécution : ${devis.lieuTournage}` : "",
      devis.dateTournage ? `date du tournage: ${devis.dateTournage.toLocaleDateString("fr-FR")}` : "",
      devis.remarques ? `Remarques specifiques: ${devis.remarques}` : "",
    ].filter(Boolean) as string[];

    const afterParties = drawPartiesBlock(
      currentPage, fonts,
      {
        entreprise: `Girault Louisia (${chefLabel})`,
        adresse: "84 Boulevard Alexandre Martin, 45000 Orléans",
        email: "contact.splicestudio@gmail.com",
        siret: "10461962200012",
      },
      destinataireLines,
    );

    /* ── Table ───────────────────────────────────────────────────── */
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
      "DEVIS",
      "Délais d'exécution : sous 14 jours après signature",
    );

    /* ── Mentions legales ────────────────────────────────────────── */
    const mentionsY = Math.min(afterReglement + 8, 720);
    drawMentionsLegales(currentPage, fonts, MENTIONS_LEGALES, mentionsY);

    /* ── Serialize ───────────────────────────────────────────────── */
    const pdfBytes = await pdf.save();

    return new NextResponse(pdfBytes.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="devis-${devis.numero}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[devis-pdf] Unexpected error:", err);
    return NextResponse.json(
      { error: "PDF generation failed" },
      { status: 500 },
    );
  }
}
