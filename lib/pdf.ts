import type { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from "pdf-lib";

/* ── Couleurs Splice ─────────────────────────────────────────────── */
export const PDF_COLORS = {
  orange: "#F36B1F",
  orangeDark: "#C4550A",
  gold: "#FFB800",
  teal: "#1A2E35",
  ink: "#0E0E22",
  text: "#333333",
  muted: "#666666",
  light: "#999999",
  border: "#E0E0E0",
  green: "#16a34a",
  red: "#dc2626",
  white: "#FFFFFF",
  lightGray: "#F5F5F5",
} as const;

/* ── Lazily populated runtime cache to keep drawing helpers synchronous ── */
let _pdfLibCache: {
  rgb: typeof rgb;
  C: Record<keyof typeof PDF_COLORS, ReturnType<typeof rgb>>;
  StandardFonts: typeof StandardFonts;
} | null = null;

function getCache() {
  if (!_pdfLibCache) {
    throw new Error("PDF context must be created via createPdfContext() before drawing functions are called.");
  }
  return _pdfLibCache;
}

/* ── Constants for A4 layout ─────────────────────────────────────── */
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN_L = 50;
const MARGIN_R = 545;
const CONTENT_W = MARGIN_R - MARGIN_L;

/* ── Font loading ────────────────────────────────────────────────── */
let _fontCache: { regular: Uint8Array; bold: Uint8Array } | null = null;

async function loadFontBytes(): Promise<{ regular: Uint8Array; bold: Uint8Array } | null> {
  if (_fontCache) return _fontCache;
  try {
    // On Workers/Edge, fetch from origin; on Node, read from FS
    if (typeof globalThis.process !== "undefined" && typeof globalThis.process.cwd === "function") {
      const fs = await import("fs");
      const path = await import("path");
      const fontsDir = path.join(process.cwd(), "public", "fonts");
      const regularPath = path.join(fontsDir, "Poppins-Regular.ttf");
      const boldPath = path.join(fontsDir, "Poppins-Bold.ttf");
      if (fs.existsSync(regularPath) && fs.existsSync(boldPath)) {
        _fontCache = {
          regular: new Uint8Array(fs.readFileSync(regularPath)),
          bold: new Uint8Array(fs.readFileSync(boldPath)),
        };
        return _fontCache;
      }
    }
  } catch { /* fallback to standard fonts */ }
  return null;
}

/* ── PDF Document creation ───────────────────────────────────────── */
export interface PdfFonts {
  main: PDFFont;
  bold: PDFFont;
  useCustom: boolean;
}

export interface PdfContext {
  pdf: PDFDocument;
  fonts: PdfFonts;
  page: PDFPage;
}

export async function createPdfContext(): Promise<PdfContext> {
  // Dynamically load pdf-lib and fontkit at runtime
  const pdfLib = await import("pdf-lib");
  const fontkit = await import("@pdf-lib/fontkit");

  const { PDFDocument, rgb: rgbFn, StandardFonts } = pdfLib;

  // Initialize the runtime cache for colors and fonts
  const hexToRgb = (hex: string) => {
    const h = hex.replace("#", "");
    return rgbFn(
      parseInt(h.substring(0, 2), 16) / 255,
      parseInt(h.substring(2, 4), 16) / 255,
      parseInt(h.substring(4, 6), 16) / 255,
    );
  };

  _pdfLibCache = {
    rgb: rgbFn,
    StandardFonts,
    C: {
      orange: hexToRgb(PDF_COLORS.orange),
      orangeDark: hexToRgb(PDF_COLORS.orangeDark),
      gold: hexToRgb(PDF_COLORS.gold),
      teal: hexToRgb(PDF_COLORS.teal),
      ink: hexToRgb(PDF_COLORS.ink),
      text: hexToRgb(PDF_COLORS.text),
      muted: hexToRgb(PDF_COLORS.muted),
      light: hexToRgb(PDF_COLORS.light),
      border: hexToRgb(PDF_COLORS.border),
      green: hexToRgb(PDF_COLORS.green),
      red: hexToRgb(PDF_COLORS.red),
      white: hexToRgb(PDF_COLORS.white),
      lightGray: hexToRgb(PDF_COLORS.lightGray),
    },
  };

  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  pdf.setTitle("Splice Studio");
  pdf.setProducer("Splice Studio");

  let fonts: PdfFonts;
  const fontBytes = await loadFontBytes();
  if (fontBytes) {
    const mainFont = await pdf.embedFont(fontBytes.regular, { subset: true });
    const boldFont = await pdf.embedFont(fontBytes.bold, { subset: true });
    fonts = { main: mainFont, bold: boldFont, useCustom: true };
  } else {
    const mainFont = await pdf.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
    fonts = { main: mainFont, bold: boldFont, useCustom: false };
  }

  const page = pdf.addPage([PAGE_W, PAGE_H]);
  return { pdf, fonts, page };
}

/* ── Text utilities ──────────────────────────────────────────────── */

/** Safe string: ensures we never print "undefined" or "null" */
export function safe(val: unknown, fallback = ""): string {
  if (val === null || val === undefined) return fallback;
  return String(val);
}

/** Format euro amount for PDF */
export function euro(amount: number | null | undefined): string {
  const val = amount ?? 0;
  return `${val}\u20ac`;
}

/* pdf-lib uses bottom-left origin, so we convert top-down Y to pdf-lib Y */
function ty(topY: number): number {
  return PAGE_H - topY;
}

/* ── Drawing helpers ─────────────────────────────────────────────── */

function drawText(
  page: PDFPage,
  text: string,
  x: number,
  topY: number,
  font: PDFFont,
  size: number,
  color: ReturnType<typeof rgb>,
  options?: { maxWidth?: number; align?: "left" | "right" | "center" },
) {
  const textWidth = font.widthOfTextAtSize(text, size);
  let drawX = x;
  if (options?.align === "right" && options.maxWidth) {
    drawX = x + options.maxWidth - textWidth;
  } else if (options?.align === "center" && options.maxWidth) {
    drawX = x + (options.maxWidth - textWidth) / 2;
  }
  page.drawText(text, { x: drawX, y: ty(topY + size), font, size, color });
}

function drawRect(
  page: PDFPage,
  x: number,
  topY: number,
  w: number,
  h: number,
  color: ReturnType<typeof rgb>,
) {
  page.drawRectangle({ x, y: ty(topY + h), width: w, height: h, color });
}

function drawLine(
  page: PDFPage,
  x1: number,
  topY: number,
  x2: number,
  color: ReturnType<typeof rgb>,
  thickness = 0.5,
) {
  page.drawLine({
    start: { x: x1, y: ty(topY) },
    end: { x: x2, y: ty(topY) },
    color,
    thickness,
  });
}

function drawRectOutline(
  page: PDFPage,
  x: number,
  topY: number,
  w: number,
  h: number,
  color: ReturnType<typeof rgb>,
  thickness = 1,
) {
  page.drawRectangle({
    x, y: ty(topY + h), width: w, height: h,
    borderColor: color, borderWidth: thickness,
  });
}

/* ── Page decorations ────────────────────────────────────────────── */

function drawPageDecorations(page: PDFPage) {
  const C = getCache().C;
  // Top gradient bar (simplified as solid orange — pdf-lib has no gradients)
  drawRect(page, 0, 0, PAGE_W, 12, C.orange);
  // Bottom gradient bar
  drawRect(page, 0, PAGE_H - 12, PAGE_W, 12, C.orange);
  // Right teal accent
  drawRect(page, PAGE_W - 18, 12, 18, 100, C.teal);
  // Left teal accent
  drawRect(page, 0, PAGE_H - 112, 18, 100, C.teal);
}

/* ── Exported drawing functions ──────────────────────────────────── */

export function drawHeader(
  page: PDFPage,
  fonts: PdfFonts,
  docType: "DEVIS" | "FACTURE",
  logoBytes?: Uint8Array,
) {
  const C = getCache().C;
  drawPageDecorations(page);

  // Logo or fallback text
  if (logoBytes) {
    // Cannot easily embed PNG synchronously here — fallback to text
    drawText(page, "SPLICE", MARGIN_L, 32, fonts.bold, 22, C.orange);
  } else {
    drawText(page, "SPLICE", MARGIN_L, 32, fonts.bold, 22, C.orange);
  }

  // Document type title (right-aligned)
  drawText(page, docType, 350, 30, fonts.bold, 32, C.ink, {
    maxWidth: MARGIN_R - 350,
    align: "right",
  });
}

export function drawInfoBlock(
  page: PDFPage,
  fonts: PdfFonts,
  info: { date: string; echeance?: string; numero: string; docType: "DEVIS" | "FACTURE" },
) {
  const C = getCache().C;
  const y = 75;

  // Left: dates
  drawText(page, `DATE : ${info.date}`, MARGIN_L, y, fonts.main, 8, C.text);
  if (info.echeance) {
    drawText(page, `ECHEANCE : ${info.echeance}`, MARGIN_L, y + 12, fonts.main, 8, C.text);
  }

  // Right: document number in orange-bordered box
  const numText = `${info.docType} N\u00b0 : ${info.numero}`;
  const numW = 140;
  const numX = MARGIN_R - numW;
  drawRectOutline(page, numX, y - 2, numW, 18, C.orange, 1);
  drawText(page, numText, numX, y + 2, fonts.bold, 8, C.orange, {
    maxWidth: numW,
    align: "center",
  });
}

export function drawPartiesBlock(
  page: PDFPage,
  fonts: PdfFonts,
  prestataire: { entreprise: string; adresse?: string; email: string; siret: string },
  destinataire: string[],
): number {
  const C = getCache().C;
  const y = 108;
  const colW = CONTENT_W / 2;

  // Left: Prestataire
  drawText(page, "PRESTATAIRE", MARGIN_L, y, fonts.bold, 9, C.ink);
  let py = y + 16;
  drawText(page, `entreprise: ${prestataire.entreprise}`, MARGIN_L, py, fonts.main, 8, C.text);
  py += 12;
  if (prestataire.adresse) {
    drawText(page, `adresse: ${prestataire.adresse}`, MARGIN_L, py, fonts.main, 8, C.text);
    py += 12;
  }
  drawText(page, prestataire.email, MARGIN_L, py, fonts.main, 8, C.text);
  py += 12;
  drawText(page, `Siret: ${prestataire.siret}`, MARGIN_L, py, fonts.main, 8, C.text);

  // Right: Destinataire
  const rightX = MARGIN_L + colW + 10;
  drawText(page, "DESTINATAIRE", rightX, y, fonts.bold, 9, C.ink, {
    maxWidth: colW - 10,
    align: "right",
  });
  let dy = y + 16;
  for (const line of destinataire) {
    drawText(page, safe(line), rightX, dy, fonts.main, 8, C.text, {
      maxWidth: colW - 10,
      align: "right",
    });
    dy += 12;
  }

  return Math.max(py, dy) + 12;
}

export function drawTableHeader(page: PDFPage, fonts: PdfFonts, tableTop: number) {
  const C = getCache().C;
  drawLine(page, MARGIN_L, tableTop, MARGIN_R, C.border);
  drawText(page, "Description :", MARGIN_L, tableTop + 6, fonts.bold, 8, C.ink);
  drawText(page, "Prix Unitaire :", 310, tableTop + 6, fonts.bold, 8, C.ink, { maxWidth: 80, align: "center" });
  drawText(page, "Quantite :", 390, tableTop + 6, fonts.bold, 8, C.ink, { maxWidth: 70, align: "center" });
  drawText(page, "Total :", 460, tableTop + 6, fonts.bold, 8, C.ink, { maxWidth: 85, align: "right" });
  drawLine(page, MARGIN_L, tableTop + 22, MARGIN_R, C.border);
}

export function drawTableRow(
  page: PDFPage,
  fonts: PdfFonts,
  line: { label: string; qty?: number; unit?: number; total: number },
  y: number,
): number {
  const C = getCache().C;
  drawLine(page, MARGIN_L, y, MARGIN_R, C.border, 0.3);

  const label = safe(line.label, "-");
  // Truncate long labels to fit ~250px at 8pt
  const maxLabelChars = 45;
  const truncLabel = label.length > maxLabelChars ? label.substring(0, maxLabelChars) + "..." : label;

  drawText(page, truncLabel, MARGIN_L + 4, y + 6, fonts.main, 8, C.text);
  drawText(page, line.unit ? `+${euro(line.unit)}` : "-", 310, y + 6, fonts.main, 8, C.text, { maxWidth: 80, align: "center" });
  drawText(page, line.qty ? String(line.qty) : "-", 390, y + 6, fonts.main, 8, C.text, { maxWidth: 70, align: "center" });
  drawText(page, euro(line.total), 460, y + 6, fonts.main, 8, C.text, { maxWidth: 85, align: "right" });
  return y + 24;
}

export function drawTotalsBlock(
  page: PDFPage,
  fonts: PdfFonts,
  totals: { totalHT: number; acompteRate: number; acompteAmount: number; solde: number },
  y: number,
): number {
  const C = getCache().C;
  drawLine(page, 350, y, MARGIN_R, C.border);

  // Total HT
  drawText(page, "TOTAL HT :", 350, y + 8, fonts.bold, 10, C.ink, { maxWidth: 110, align: "right" });
  drawText(page, euro(totals.totalHT), 470, y + 6, fonts.bold, 12, C.ink, { maxWidth: 75, align: "right" });

  // Acompte box (orange)
  const orangeY = y + 30;
  const orangeW = 200;
  const orangeX = MARGIN_R - orangeW;
  drawRect(page, orangeX, orangeY, orangeW, 20, C.orange);
  drawText(page, `ACOMPTE (${totals.acompteRate}%) :`, orangeX + 6, orangeY + 5, fonts.bold, 8, C.white);
  drawText(page, euro(totals.acompteAmount), orangeX + 136, orangeY + 5, fonts.bold, 8, C.white, { maxWidth: 58, align: "right" });

  // Solde box (darker orange)
  const soldeY = orangeY + 22;
  drawRect(page, orangeX, soldeY, orangeW, 20, C.orangeDark);
  drawText(page, "SOLDE A LA LIVRAISON :", orangeX + 6, soldeY + 5, fonts.bold, 8, C.white);
  drawText(page, euro(totals.solde), orangeX + 136, soldeY + 5, fonts.bold, 8, C.white, { maxWidth: 58, align: "right" });

  return soldeY + 30;
}

export function drawReglementBlock(
  page: PDFPage,
  fonts: PdfFonts,
  y: number,
  deliveryInfo?: string,
): number {
  const C = getCache().C;
  drawText(page, "REGLEMENT :", MARGIN_L, y, fonts.bold, 10, C.ink);

  if (deliveryInfo) {
    drawText(page, deliveryInfo, 280, y + 2, fonts.main, 8, C.muted, { maxWidth: 265, align: "right" });
  }

  const payY = y + 18;
  drawText(page, "Par virement bancaire :", MARGIN_L, payY, fonts.bold, 8, C.text);
  drawText(page, "Titulaire du compte :", MARGIN_L, payY + 14, fonts.main, 8, C.text);
  drawText(page, "IBAN:", MARGIN_L, payY + 28, fonts.main, 8, C.text);
  drawText(page, "BIC:", MARGIN_L, payY + 42, fonts.main, 8, C.text);

  // Right side: Signature area
  const sigX = 340;
  drawText(page, "Signatures suivie de la", sigX, payY + 8, fonts.main, 8, C.text, { maxWidth: MARGIN_R - sigX, align: "center" });
  drawText(page, 'mention "bon pour accord"', sigX, payY + 20, fonts.main, 8, C.text, { maxWidth: MARGIN_R - sigX, align: "center" });

  return payY + 60;
}

export function drawMentionsLegales(
  page: PDFPage,
  fonts: PdfFonts,
  mentions: string[],
  y: number,
) {
  const C = getCache().C;
  drawText(page, "Mentions legales :", MARGIN_L, y, fonts.bold, 7, C.light);
  let my = y + 12;
  for (const mention of mentions) {
    drawText(page, mention, MARGIN_L, my, fonts.main, 6, C.light);
    my += 9;
  }
}

/** Add a new page and return it (for multi-page documents) */
export function addPage(pdf: PDFDocument): PDFPage {
  return pdf.addPage([PAGE_W, PAGE_H]);
}
