import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildContratPdfBytes } from "@/lib/contrat-pdf";

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

  /* ── Fetch contrat + devis ───────────────────────────────────────── */
  let contrat;
  try {
    contrat = await db.contrat.findUnique({
      where: { id },
      include: { devis: true },
    });
  } catch (err) {
    console.error("[contrat-pdf] DB error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  if (!contrat || (contrat.userId !== userId && !isAdmin)) {
    return NextResponse.json({ error: "Contrat introuvable" }, { status: 404 });
  }

  /* ── Generate PDF ────────────────────────────────────────────────── */
  try {
    const pdfBytes = await buildContratPdfBytes(contrat, contrat.devis);

    return new NextResponse(pdfBytes.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="contrat-${contrat.numero}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[contrat-pdf] Unexpected error:", err);
    return NextResponse.json(
      { error: "PDF generation failed" },
      { status: 500 },
    );
  }
}
