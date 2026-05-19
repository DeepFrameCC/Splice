import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

/* ── Couleurs DeepFrame ─────────────────────────────────────────────── */
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

/* ── Polices ─────────────────────────────────────────────────────────── */
const FONTS_DIR = path.join(process.cwd(), "public", "fonts");
const INTER_REGULAR = path.join(FONTS_DIR, "Inter-Regular.ttf");
const INTER_BOLD = path.join(FONTS_DIR, "Inter-Bold.ttf");

let _fontsAvailable: boolean | null = null;
let _regularBuf: Buffer | null = null;
let _boldBuf: Buffer | null = null;

function fontsAvailable(): boolean {
  if (_fontsAvailable === null) {
    try {
      _fontsAvailable =
        fs.existsSync(INTER_REGULAR) && fs.existsSync(INTER_BOLD);
    } catch {
      _fontsAvailable = false;
    }
  }
  return _fontsAvailable;
}

/** Load font files into Buffers (cached, one-time read) */
function loadFontBuffers(): { regular: Buffer; bold: Buffer } {
  if (!_regularBuf) {
    _regularBuf = fs.readFileSync(INTER_REGULAR);
    _boldBuf = fs.readFileSync(INTER_BOLD);
  }
  return { regular: _regularBuf, bold: _boldBuf! };
}

/* ── Remplacement caracteres speciaux (fallback sans police custom) ── */
const CHAR_MAP: Record<string, string> = {
  "\u00e9": "e",  // e accent aigu
  "\u00e8": "e",  // e accent grave
  "\u00ea": "e",  // e accent circo
  "\u00eb": "e",  // e trema
  "\u00e0": "a",  // a accent grave
  "\u00e2": "a",  // a accent circo
  "\u00f4": "o",  // o accent circo
  "\u00f9": "u",  // u accent grave
  "\u00fb": "u",  // u accent circo
  "\u00fc": "u",  // u trema
  "\u00e7": "c",  // c cedille
  "\u00ee": "i",  // i accent circo
  "\u00ef": "i",  // i trema
  "\u00c9": "E",  // E accent aigu
  "\u00c8": "E",  // E accent grave
  "\u00ca": "E",  // E accent circo
  "\u00c0": "A",  // A accent grave
  "\u00d4": "O",  // O accent circo
  "\u00d9": "U",  // U accent grave
  "\u00c7": "C",  // C cedille
  "\u2019": "'",  // right single quote
  "\u2018": "'",  // left single quote
  "\u201c": '"',  // left double quote
  "\u201d": '"',  // right double quote
  "\u2013": "-",  // en-dash
  "\u2014": "-",  // em-dash
  "\u00ab": '"',  // guillemet ouvrant
  "\u00bb": '"',  // guillemet fermant
  "\u00b0": "o",  // degree symbol -> N degrees
  "\u0153": "oe", // ligature oe
  "\u00e6": "ae", // ligature ae
};

/**
 * Sanitize text for Helvetica (built-in PDFKit fonts that lack full Latin-1 support).
 * If custom fonts are registered, return text as-is since they support UTF-8.
 */
export function sanitize(text: string, useCustom: boolean): string {
  if (useCustom) return text;
  let result = "";
  for (const ch of text) {
    result += CHAR_MAP[ch] ?? ch;
  }
  // Replace euro sign last (multi-char replacement)
  result = result.replace(/\u20ac/g, "EUR");
  return result;
}

/** Safe string: ensures we never print "undefined" or "null" */
export function safe(val: unknown, fallback = ""): string {
  if (val === null || val === undefined) return fallback;
  return String(val);
}

/** Format euro amount for PDF */
export function euro(amount: number | null | undefined, useCustom: boolean): string {
  const val = amount ?? 0;
  const symbol = useCustom ? "\u20ac" : "EUR";
  return `${val}${symbol}`;
}

/**
 * Create a PDFDocument with error handling and font registration.
 * Returns the doc + font info + a promise that resolves when the PDF is finished.
 */
export function createPdfDoc(): {
  doc: PDFKit.PDFDocument;
  fonts: { main: string; bold: string; useCustom: boolean };
  chunks: Buffer[];
} {
  // Load font buffers to avoid PDFKit trying to resolve file paths
  // (which fails under Next.js webpack bundling)
  const hasCustom = fontsAvailable();

  let doc: PDFKit.PDFDocument;
  let fonts: { main: string; bold: string; useCustom: boolean };

  if (hasCustom) {
    const bufs = loadFontBuffers();
    doc = new PDFDocument({ size: "A4", margin: 0, font: bufs.regular as any });
    doc.registerFont("main", bufs.regular);
    doc.registerFont("bold", bufs.bold);
    fonts = { main: "main", bold: "bold", useCustom: true };
  } else {
    doc = new PDFDocument({ size: "A4", margin: 0 });
    fonts = { main: "Helvetica", bold: "Helvetica-Bold", useCustom: false };
  }

  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  return { doc, fonts, chunks };
}

/* ── Constants for layout ──────────────────────────────────────────── */
const PAGE_W = 595.28; // A4 width
const PAGE_H = 841.89; // A4 height
const MARGIN_L = 50;
const MARGIN_R = 545;
const CONTENT_W = MARGIN_R - MARGIN_L;

/* ── Decorative elements ───────────────────────────────────────────── */

/** Draw the top gradient bar (orange → gold) */
function drawTopGradient(doc: PDFKit.PDFDocument) {
  const grad = (doc as any).linearGradient(0, 0, PAGE_W, 0);
  grad.stop(0, PDF_COLORS.orange).stop(1, PDF_COLORS.gold);
  doc.rect(0, 0, PAGE_W, 12).fill(grad);
}

/** Draw the bottom gradient bar (orange → gold) */
function drawBottomGradient(doc: PDFKit.PDFDocument) {
  const grad = (doc as any).linearGradient(0, 0, PAGE_W, 0);
  grad.stop(0, PDF_COLORS.orange).stop(1, PDF_COLORS.gold);
  doc.rect(0, PAGE_H - 12, PAGE_W, 12).fill(grad);
}

/** Draw the right teal vertical accent (top-right) */
function drawRightTealAccent(doc: PDFKit.PDFDocument) {
  doc.rect(PAGE_W - 18, 12, 18, 100).fill(PDF_COLORS.teal);
}

/** Draw the left teal vertical accent (bottom-left) */
function drawLeftTealAccent(doc: PDFKit.PDFDocument) {
  doc.rect(0, PAGE_H - 112, 18, 100).fill(PDF_COLORS.teal);
}

/** Draw all page decorations */
function drawPageDecorations(doc: PDFKit.PDFDocument) {
  drawTopGradient(doc);
  drawBottomGradient(doc);
  drawRightTealAccent(doc);
  drawLeftTealAccent(doc);
}

/* ── Logo loading ──────────────────────────────────────────────────── */
let _logoPngBuf: Buffer | null = null;
let _nomPngBuf: Buffer | null = null;

function loadLogoPng(): Buffer | null {
  if (_logoPngBuf) return _logoPngBuf;
  try {
    const logoPath = path.join(process.cwd(), "public", "LogoNoir.png");
    if (fs.existsSync(logoPath)) {
      _logoPngBuf = fs.readFileSync(logoPath);
      return _logoPngBuf;
    }
  } catch { /* ignore */ }
  return null;
}

function loadNomPng(): Buffer | null {
  if (_nomPngBuf) return _nomPngBuf;
  try {
    const nomPath = path.join(process.cwd(), "public", "NomNoir.png");
    if (fs.existsSync(nomPath)) {
      _nomPngBuf = fs.readFileSync(nomPath);
      return _nomPngBuf;
    }
  } catch { /* ignore */ }
  return null;
}

/** Draw the DeepFrame header block with logo + document title */
export function drawHeader(
  doc: PDFKit.PDFDocument,
  fonts: { main: string; bold: string; useCustom: boolean },
  s: (text: string) => string,
  docType: "DEVIS" | "FACTURE",
) {
  // Page decorations
  drawPageDecorations(doc);

  // Logo
  const logoBuf = loadLogoPng();
  const nomBuf = loadNomPng();

  if (logoBuf && nomBuf) {
    doc.image(logoBuf, MARGIN_L, 28, { width: 32, height: 32 });
    doc.image(nomBuf, MARGIN_L + 38, 32, { width: 110, height: 24 });
  } else {
    // Fallback text
    doc.font(fonts.bold).fontSize(22).fillColor(PDF_COLORS.orange).text("DEEPFRAME", MARGIN_L, 32);
  }

  // Document type title (DEVIS or FACTURE) on the right
  doc.font(fonts.bold).fontSize(32).fillColor(PDF_COLORS.ink).text(docType, 350, 30, {
    width: MARGIN_R - 350,
    align: "right",
  });
}

/** Draw the date/number info block */
export function drawInfoBlock(
  doc: PDFKit.PDFDocument,
  fonts: { main: string; bold: string; useCustom: boolean },
  s: (text: string) => string,
  info: {
    date: string;
    echeance?: string;
    numero: string;
    docType: "DEVIS" | "FACTURE";
  },
) {
  const y = 75;
  doc.font(fonts.main).fontSize(8).fillColor(PDF_COLORS.text);

  // Left: dates
  doc.text(s(`DATE : ${info.date}`), MARGIN_L, y);
  if (info.echeance) {
    doc.text(s(`ECHEANCE : ${info.echeance}`), MARGIN_L, y + 12);
  }

  // Right: document number in an orange-bordered box
  const numText = `${info.docType} N° : ${info.numero}`;
  const numW = 140;
  const numX = MARGIN_R - numW;
  doc.roundedRect(numX, y - 2, numW, 18, 3).strokeColor(PDF_COLORS.orange).lineWidth(1).stroke();
  doc.font(fonts.bold).fontSize(8).fillColor(PDF_COLORS.orange).text(numText, numX, y + 2, {
    width: numW,
    align: "center",
  });
}

/** Draw the prestataire / destinataire info columns */
export function drawPartiesBlock(
  doc: PDFKit.PDFDocument,
  fonts: { main: string; bold: string; useCustom: boolean },
  s: (text: string) => string,
  prestataire: { entreprise: string; adresse?: string; email: string; siret: string },
  destinataire: string[],
) {
  const y = 108;
  const colW = CONTENT_W / 2;

  // Left: Prestataire
  doc.font(fonts.bold).fontSize(9).fillColor(PDF_COLORS.ink).text("PRESTATAIRE", MARGIN_L, y);
  doc.font(fonts.main).fontSize(8).fillColor(PDF_COLORS.text);
  let py = y + 16;
  doc.text(s(`entreprise: ${prestataire.entreprise}`), MARGIN_L, py); py += 12;
  if (prestataire.adresse) {
    doc.text(s(`adresse: ${prestataire.adresse}`), MARGIN_L, py); py += 12;
  }
  doc.text(s(prestataire.email), MARGIN_L, py); py += 12;
  doc.text(s(`Siret: ${prestataire.siret}`), MARGIN_L, py);

  // Right: Destinataire
  const rightX = MARGIN_L + colW + 10;
  doc.font(fonts.bold).fontSize(9).fillColor(PDF_COLORS.ink).text("DESTINATAIRE", rightX, y, {
    width: colW - 10,
    align: "right",
  });
  doc.font(fonts.main).fontSize(8).fillColor(PDF_COLORS.text);
  let dy = y + 16;
  for (const line of destinataire) {
    doc.text(s(safe(line)), rightX, dy, { width: colW - 10, align: "right" });
    dy += 12;
  }

  return Math.max(py, dy) + 12;
}

/** Draw table header row */
export function drawTableHeader(
  doc: PDFKit.PDFDocument,
  fonts: { main: string; bold: string; useCustom: boolean },
  s: (text: string) => string,
  tableTop: number,
) {
  // Thin border line
  doc.moveTo(MARGIN_L, tableTop).lineTo(MARGIN_R, tableTop).strokeColor(PDF_COLORS.border).lineWidth(0.5).stroke();

  doc.font(fonts.bold).fontSize(8).fillColor(PDF_COLORS.ink);
  doc.text(s("Description :"), MARGIN_L, tableTop + 6);
  doc.text(s("Prix Unitaire :"), 310, tableTop + 6, { width: 80, align: "center" });
  doc.text(s("Quantite :"), 390, tableTop + 6, { width: 70, align: "center" });
  doc.text("Total :", 460, tableTop + 6, { width: 85, align: "right" });

  doc.moveTo(MARGIN_L, tableTop + 22).lineTo(MARGIN_R, tableTop + 22).strokeColor(PDF_COLORS.border).lineWidth(0.5).stroke();
}

/** Draw a single table row and return new Y position */
export function drawTableRow(
  doc: PDFKit.PDFDocument,
  fonts: { main: string; bold: string; useCustom: boolean },
  s: (text: string) => string,
  e: (amount: number | null | undefined) => string,
  line: { label: string; qty?: number; unit?: number; total: number },
  y: number,
): number {
  // Light separator
  doc.moveTo(MARGIN_L, y).lineTo(MARGIN_R, y).strokeColor(PDF_COLORS.border).lineWidth(0.3).stroke();

  doc.font(fonts.main).fontSize(8).fillColor(PDF_COLORS.text);
  doc.text(s(safe(line.label, "-")), MARGIN_L + 4, y + 6, { width: 250 });
  doc.text(line.unit ? `+${e(line.unit)}` : "-", 310, y + 6, { width: 80, align: "center" });
  doc.text(line.qty ? String(line.qty) : "-", 390, y + 6, { width: 70, align: "center" });
  doc.text(e(line.total), 460, y + 6, { width: 85, align: "right" });
  return y + 24;
}

/** Draw totals block with orange acompte/solde boxes */
export function drawTotalsBlock(
  doc: PDFKit.PDFDocument,
  fonts: { main: string; bold: string; useCustom: boolean },
  s: (text: string) => string,
  e: (amount: number | null | undefined) => string,
  totals: {
    totalHT: number;
    acompteRate: number;
    acompteAmount: number;
    solde: number;
  },
  y: number,
): number {
  // Total HT line
  doc.moveTo(350, y).lineTo(MARGIN_R, y).strokeColor(PDF_COLORS.border).lineWidth(0.5).stroke();

  doc.font(fonts.bold).fontSize(10).fillColor(PDF_COLORS.ink);
  doc.text("TOTAL HT :", 350, y + 8, { width: 110, align: "right" });
  doc.font(fonts.bold).fontSize(12).fillColor(PDF_COLORS.ink);
  doc.text(e(totals.totalHT), 470, y + 6, { width: 75, align: "right" });

  // Orange block: Acompte
  const orangeY = y + 30;
  const orangeW = 200;
  const orangeX = MARGIN_R - orangeW;

  const grad1 = (doc as any).linearGradient(orangeX, orangeY, orangeX + orangeW, orangeY);
  grad1.stop(0, PDF_COLORS.orange).stop(1, "#E05A10");
  doc.roundedRect(orangeX, orangeY, orangeW, 20, 2).fill(grad1);
  doc.font(fonts.bold).fontSize(8).fillColor(PDF_COLORS.white);
  doc.text(s(`ACOMPTE (${totals.acompteRate}%) :`), orangeX + 6, orangeY + 5, { width: 130 });
  doc.text(e(totals.acompteAmount), orangeX + 136, orangeY + 5, { width: 58, align: "right" });

  // Orange block: Solde
  const soldeY = orangeY + 22;
  const grad2 = (doc as any).linearGradient(orangeX, soldeY, orangeX + orangeW, soldeY);
  grad2.stop(0, "#E05A10").stop(1, PDF_COLORS.orangeDark);
  doc.roundedRect(orangeX, soldeY, orangeW, 20, 2).fill(grad2);
  doc.font(fonts.bold).fontSize(8).fillColor(PDF_COLORS.white);
  doc.text(s("SOLDE A LA LIVRAISON :"), orangeX + 6, soldeY + 5, { width: 130 });
  doc.text(e(totals.solde), orangeX + 136, soldeY + 5, { width: 58, align: "right" });

  return soldeY + 30;
}

/** Draw the "Reglement" (payment) section */
export function drawReglementBlock(
  doc: PDFKit.PDFDocument,
  fonts: { main: string; bold: string; useCustom: boolean },
  s: (text: string) => string,
  y: number,
  deliveryInfo?: string,
) {
  // Left side: Reglement
  doc.font(fonts.bold).fontSize(10).fillColor(PDF_COLORS.ink).text(s("REGLEMENT :"), MARGIN_L, y);

  if (deliveryInfo) {
    doc.font(fonts.main).fontSize(8).fillColor(PDF_COLORS.muted).text(deliveryInfo, 280, y + 2, { width: 265, align: "right" });
  }

  const payY = y + 18;
  doc.font(fonts.bold).fontSize(8).fillColor(PDF_COLORS.text).text("Par virement bancaire :", MARGIN_L, payY);
  doc.font(fonts.main).fontSize(8).fillColor(PDF_COLORS.text);
  doc.text(s("Titulaire du compte :"), MARGIN_L, payY + 14);
  doc.text("IBAN:", MARGIN_L, payY + 28);
  doc.text("BIC:", MARGIN_L, payY + 42);

  // Right side: Signature area
  const sigX = 340;
  doc.font(fonts.main).fontSize(8).fillColor(PDF_COLORS.text);
  doc.text(s('Signatures suivie de la'), sigX, payY + 8, { width: MARGIN_R - sigX, align: "center" });
  doc.text(s('mention "bon pour accord"'), sigX, payY + 20, { width: MARGIN_R - sigX, align: "center" });

  return payY + 60;
}

/** Draw mentions legales */
export function drawMentionsLegales(
  doc: PDFKit.PDFDocument,
  fonts: { main: string; bold: string; useCustom: boolean },
  s: (text: string) => string,
  mentions: string[],
  y: number,
) {
  doc.font(fonts.bold).fontSize(7).fillColor(PDF_COLORS.light).text("Mentions legales :", MARGIN_L, y);
  doc.font(fonts.main).fontSize(6).fillColor(PDF_COLORS.light);
  let my = y + 12;
  for (const mention of mentions) {
    doc.text(s(mention), MARGIN_L, my, { width: CONTENT_W });
    my += 9;
  }
}
