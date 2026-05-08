import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { MENTIONS_LEGALES, FOUNDER_LABEL, PACKS } from "@/lib/pricing";
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
  const userId = (session?.user as any)?.id as string | undefined;
  const isAdmin = (session?.user as any)?.role === "ADMIN";
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
    const { doc, fonts, chunks } = createPdfDoc();

    // Shorthand helpers bound to this doc's font context
    const s = (text: string) => sanitize(text, fonts.useCustom);
    const e = (amount: number | null | undefined) => euro(amount, fonts.useCustom);

    return new Promise<NextResponse>((resolve) => {
      doc.on("error", (err) => {
        console.error("[devis-pdf] PDFKit stream error:", err);
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
              "Content-Disposition": `inline; filename="devis-${devis.numero}.pdf"`,
              "Cache-Control": "no-store",
            },
          }),
        );
      });

      /* ── Header ──────────────────────────────────────────────────── */
      drawHeader(doc, fonts, s);

      /* ── Devis info ──────────────────────────────────────────────── */
      doc
        .font(fonts.bold)
        .fontSize(14)
        .fillColor(PDF_COLORS.blue)
        .text(s(`DEVIS N${fonts.useCustom ? "\u00b0" : "o"} ${devis.numero}`), 350, 50, {
          align: "right",
        });

      doc.font(fonts.main).fontSize(9).fillColor(PDF_COLORS.text);
      doc.text(
        s(`Date : ${devis.createdAt.toLocaleDateString("fr-FR")}`),
        350,
        72,
        { align: "right" },
      );

      const chefLabel =
        devis.chefDeProjet && FOUNDER_LABEL[devis.chefDeProjet]
          ? FOUNDER_LABEL[devis.chefDeProjet]
          : safe(devis.chefDeProjet, "Non assigne");
      doc.text(s(`Chef de projet : ${chefLabel}`), 350, 86, {
        align: "right",
      });

      /* ── Client info ─────────────────────────────────────────────── */
      doc
        .moveTo(50, 120)
        .lineTo(545, 120)
        .strokeColor(PDF_COLORS.border)
        .stroke();
      doc
        .font(fonts.bold)
        .fontSize(11)
        .fillColor(PDF_COLORS.blue)
        .text("CLIENT", 50, 135);

      doc.font(fonts.main).fontSize(9).fillColor(PDF_COLORS.text);
      const clientLines = [
        devis.nomEntreprise || "",
        devis.nomContact,
        devis.emailContact,
        devis.telContact,
        devis.lieuTournage,
      ].filter(Boolean);

      let cy = 152;
      for (const cl of clientLines) {
        doc.text(s(safe(cl)), 50, cy);
        cy += 14;
      }

      /* ── Pack info ───────────────────────────────────────────────── */
      doc
        .font(fonts.bold)
        .fontSize(11)
        .fillColor(PDF_COLORS.blue)
        .text("PRESTATION", 300, 135);

      doc.font(fonts.main).fontSize(9).fillColor(PDF_COLORS.text);
      const packLabel =
        devis.pack && PACKS[devis.pack]
          ? PACKS[devis.pack].label
          : safe(devis.pack, "Pack");
      doc.text(s(`Pack : ${packLabel}`), 300, 152);

      if (devis.dateTournage) {
        doc.text(
          s(
            `Date de tournage : ${devis.dateTournage.toLocaleDateString("fr-FR")}`,
          ),
          300,
          166,
        );
      }

      /* ── Table ───────────────────────────────────────────────────── */
      const tableTop = Math.max(cy, 200) + 20;
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
      doc.text(
        s(`Acompte ${devis.acompteRate}% : ${e(devis.acompteAmount)}`),
        350,
        y + 34,
        { width: 195, align: "right" },
      );
      doc.text(
        s(`Solde a la livraison : ${e(devis.totalHT - devis.acompteAmount)}`),
        350,
        y + 48,
        { width: 195, align: "right" },
      );

      /* ── Remarques ───────────────────────────────────────────────── */
      if (devis.remarques) {
        const ry = y + 75;
        doc
          .font(fonts.bold)
          .fontSize(10)
          .fillColor(PDF_COLORS.blue)
          .text("Remarques", 50, ry);
        doc
          .font(fonts.main)
          .fontSize(8)
          .fillColor(PDF_COLORS.text)
          .text(s(devis.remarques), 50, ry + 16, { width: 300 });
      }

      /* ── Mentions legales ────────────────────────────────────────── */
      const mlY = Math.min(y + 120, 680);
      doc.font(fonts.main).fontSize(7).fillColor(PDF_COLORS.light);
      doc.text("Conditions :", 50, mlY);
      for (let i = 0; i < MENTIONS_LEGALES.length; i++) {
        doc.text(s(`${i + 1}. ${MENTIONS_LEGALES[i]}`), 50, mlY + 12 + i * 10, {
          width: 480,
        });
      }

      doc.end();
    });
  } catch (err) {
    console.error("[devis-pdf] Unexpected error:", err);
    return NextResponse.json(
      { error: "PDF generation failed" },
      { status: 500 },
    );
  }
}
