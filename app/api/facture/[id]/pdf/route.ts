import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { MENTIONS_LEGALES, FOUNDER_LABEL, resolvePackLabel } from "@/lib/pricing";
import {
  createPdfDoc,
  drawHeader,
  drawInfoBlock,
  drawPartiesBlock,
  drawTableHeader,
  drawTableRow,
  drawTotalsBlock,
  drawReglementBlock,
  drawMentionsLegales,
  sanitize,
  safe,
  euro,
  PDF_COLORS,
} from "@/lib/pdf";

export const runtime = "nodejs";
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
    return NextResponse.json(
      { error: "Facture introuvable" },
      { status: 404 },
    );
  }

  const devis = facture.devis;

  /* ── Parse lines safely ──────────────────────────────────────────── */
  let lines: { label: string; qty?: number; unit?: number; total: number }[] =
    [];
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
    const { doc, fonts, chunks } = createPdfDoc();

    const s = (text: string) => sanitize(text, fonts.useCustom);
    const e = (amount: number | null | undefined) =>
      euro(amount, fonts.useCustom);

    const PDF_TIMEOUT_MS = 20_000;

    const generation = new Promise<NextResponse>((resolve) => {
      doc.on("error", (err) => {
        console.error("[facture-pdf] PDFKit stream error:", err);
        resolve(
          NextResponse.json(
            { error: "PDF generation failed" },
            { status: 500 },
          ),
        );
      });

      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(
          new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `inline; filename="facture-${facture.numero}.pdf"`,
              "Cache-Control": "no-store",
            },
          }),
        );
      });

      /* ── Header ──────────────────────────────────────────────────── */
      drawHeader(doc, fonts, s, "FACTURE");

      /* ── Info block (date, numero) ───────────────────────────────── */
      const dateStr = facture.createdAt.toLocaleDateString("fr-FR");
      const echeanceDate = new Date(facture.createdAt);
      echeanceDate.setDate(echeanceDate.getDate() + 30);
      const echeanceStr = echeanceDate.toLocaleDateString("fr-FR");

      drawInfoBlock(doc, fonts, s, {
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
        doc, fonts, s,
        {
          entreprise: s(`Prenom Nom (${chefLabel})`),
          adresse: "adresse:",
          email: "contact@splice.cc",
          siret: s("En cours d'immatriculation"),
        },
        destinataireLines,
      );

      /* ── Table ───────────────────────────────────────────────────── */
      const tableTop = Math.max(afterParties, 220);
      drawTableHeader(doc, fonts, s, tableTop);

      let y = tableTop + 28;
      for (const line of lines) {
        y = drawTableRow(doc, fonts, s, e, line, y);
        if (y > 680) {
          doc.addPage();
          y = 50;
        }
      }

      /* ── Totals ──────────────────────────────────────────────────── */
      const afterTotals = drawTotalsBlock(doc, fonts, s, e, {
        totalHT: devis.totalHT,
        acompteRate: devis.acompteRate,
        acompteAmount: devis.acompteAmount,
        solde: devis.totalHT - devis.acompteAmount,
      }, y + 8);

      /* ── Reglement ───────────────────────────────────────────────── */
      const livraisonInfo = s("Livre le :");
      const afterReglement = drawReglementBlock(
        doc, fonts, s, afterTotals + 8,
        livraisonInfo,
      );

      /* ── Mentions legales ────────────────────────────────────────── */
      const factureMentions = [
        "TVA non applicable, art. 293 B du CGI.",
        "Les fichiers sont livres apres reception du solde.",
      ];
      const mentionsY = Math.min(afterReglement + 8, 720);
      drawMentionsLegales(doc, fonts, s, factureMentions, mentionsY);

      doc.end();
    });

    const timeout = new Promise<NextResponse>((resolve) => {
      setTimeout(() => {
        console.error("[facture-pdf] PDF generation timed out after", PDF_TIMEOUT_MS, "ms");
        try {
          doc.removeAllListeners();
        } catch {
          /* ignore */
        }
        resolve(
          NextResponse.json(
            { error: "PDF generation timeout" },
            { status: 504 },
          ),
        );
      }, PDF_TIMEOUT_MS);
    });

    return Promise.race([generation, timeout]);
  } catch (err) {
    console.error("[facture-pdf] Unexpected error:", err);
    return NextResponse.json(
      { error: "PDF generation failed" },
      { status: 500 },
    );
  }
}
