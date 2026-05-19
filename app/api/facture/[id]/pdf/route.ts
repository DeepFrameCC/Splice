import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { MENTIONS_LEGALES, FOUNDER_LABEL, resolvePackLabel } from "@/lib/pricing";
import {
  createPdfDoc,
  drawHeader,
  drawTableHeader,
  drawTableRow,
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
      drawHeader(doc, fonts, s);

      /* ── Facture info ────────────────────────────────────────────── */
      doc
        .font(fonts.bold)
        .fontSize(14)
        .fillColor(PDF_COLORS.blue)
        .text(
          s(
            `FACTURE N${fonts.useCustom ? "\u00b0" : "o"} ${facture.numero}`,
          ),
          350,
          50,
          { align: "right" },
        );

      doc.font(fonts.main).fontSize(9).fillColor(PDF_COLORS.text);
      doc.text(
        s(`Date : ${facture.createdAt.toLocaleDateString("fr-FR")}`),
        350,
        72,
        { align: "right" },
      );
      doc.text(s(`Devis associe : ${safe(devis.numero)}`), 350, 86, {
        align: "right",
      });

      const chefLabel =
        devis.chefDeProjet && FOUNDER_LABEL[devis.chefDeProjet]
          ? FOUNDER_LABEL[devis.chefDeProjet]
          : safe(devis.chefDeProjet, "Non assigne");
      doc.text(s(`Chef de projet : ${chefLabel}`), 350, 100, {
        align: "right",
      });

      /* ── Status badge ────────────────────────────────────────────── */
      const statusMap: Record<string, { label: string; color: string }> = {
        PAYEE: { label: "PAYEE", color: PDF_COLORS.green },
        ANNULEE: { label: "ANNULEE", color: PDF_COLORS.red },
        EMISE: { label: "EMISE", color: PDF_COLORS.gold },
      };
      const statusInfo = statusMap[facture.status] ?? {
        label: facture.status,
        color: PDF_COLORS.muted,
      };
      doc
        .font(fonts.bold)
        .fontSize(10)
        .fillColor(statusInfo.color)
        .text(s(`Statut : ${statusInfo.label}`), 350, 114, {
          align: "right",
        });

      /* ── Client info ─────────────────────────────────────────────── */
      doc
        .moveTo(50, 135)
        .lineTo(545, 135)
        .strokeColor(PDF_COLORS.border)
        .stroke();
      doc
        .font(fonts.bold)
        .fontSize(11)
        .fillColor(PDF_COLORS.blue)
        .text("CLIENT", 50, 150);

      doc.font(fonts.main).fontSize(9).fillColor(PDF_COLORS.text);
      const clientLines = [
        devis.nomEntreprise || "",
        devis.nomContact,
        devis.emailContact,
        devis.telContact,
        facture.user?.profile?.adresse,
        [facture.user?.profile?.codePostal, facture.user?.profile?.ville]
          .filter(Boolean)
          .join(" "),
      ].filter(Boolean);

      let cy = 167;
      for (const cl of clientLines) {
        doc.text(s(safe(cl)), 50, cy);
        cy += 14;
      }

      /* ── Prestation info ─────────────────────────────────────────── */
      doc
        .font(fonts.bold)
        .fontSize(11)
        .fillColor(PDF_COLORS.blue)
        .text("PRESTATION", 300, 150);

      doc.font(fonts.main).fontSize(9).fillColor(PDF_COLORS.text);
      const packLabel = devis.pack
          ? resolvePackLabel(devis.pack)
          : safe(devis.pack, "Pack");
      doc.text(s(`Pack : ${packLabel}`), 300, 167);

      if (devis.dateTournage) {
        doc.text(
          s(
            `Date de tournage : ${devis.dateTournage.toLocaleDateString("fr-FR")}`,
          ),
          300,
          181,
        );
      }

      /* ── Table ───────────────────────────────────────────────────── */
      const tableTop = Math.max(cy, 220) + 20;
      drawTableHeader(doc, fonts, s, tableTop);

      let y = tableTop + 32;
      for (const line of lines) {
        y = drawTableRow(doc, fonts, s, e, line, y);
        if (y > 720) {
          doc.addPage();
          y = 50;
        }
      }

      /* ── Total ───────────────────────────────────────────────────── */
      doc
        .moveTo(350, y + 5)
        .lineTo(545, y + 5)
        .strokeColor(PDF_COLORS.blue)
        .lineWidth(1)
        .stroke();

      doc
        .font(fonts.bold)
        .fontSize(12)
        .fillColor(PDF_COLORS.blue)
        .text("Total HT", 350, y + 14);
      doc
        .font(fonts.bold)
        .fontSize(14)
        .fillColor(PDF_COLORS.blue)
        .text(e(devis.totalHT), 470, y + 12, { width: 75, align: "right" });

      doc.font(fonts.main).fontSize(9).fillColor(PDF_COLORS.muted);
      const paidSuffix = devis.acomptePaid
        ? s(" (regle)")
        : s(" (a regler)");
      doc.text(
        s(`Acompte ${devis.acompteRate}% : ${e(devis.acompteAmount)}`) +
          paidSuffix,
        350,
        y + 34,
        { width: 195, align: "right" },
      );
      doc.text(
        s(
          `Solde a la livraison : ${e(devis.totalHT - devis.acompteAmount)}`,
        ),
        350,
        y + 48,
        { width: 195, align: "right" },
      );

      /* ── Mentions legales ────────────────────────────────────────── */
      const mlY = Math.min(y + 80, 680);
      doc.font(fonts.main).fontSize(7).fillColor(PDF_COLORS.light);
      doc.text("Conditions :", 50, mlY);
      for (let i = 0; i < MENTIONS_LEGALES.length; i++) {
        doc.text(
          s(`${i + 1}. ${MENTIONS_LEGALES[i]}`),
          50,
          mlY + 12 + i * 10,
          { width: 480 },
        );
      }

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
