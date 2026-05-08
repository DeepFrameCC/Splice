import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

/* ── Couleurs DeepFrame ─────────────────────────────────────────────── */
export const PDF_COLORS = {
  blue: "#1901AD",
  gold: "#FFBD59",
  ink: "#0A0A23",
  text: "#333333",
  muted: "#666666",
  light: "#999999",
  border: "#E5E5E5",
  green: "#16a34a",
  red: "#dc2626",
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
  return `${val} ${symbol}`;
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
    doc = new PDFDocument({ size: "A4", margin: 50, font: bufs.regular as any });
    doc.registerFont("main", bufs.regular);
    doc.registerFont("bold", bufs.bold);
    fonts = { main: "main", bold: "bold", useCustom: true };
  } else {
    doc = new PDFDocument({ size: "A4", margin: 50 });
    fonts = { main: "Helvetica", bold: "Helvetica-Bold", useCustom: false };
  }

  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  return { doc, fonts, chunks };
}

/** Draw the DeepFrame header block */
export function drawHeader(
  doc: PDFKit.PDFDocument,
  fonts: { main: string; bold: string; useCustom: boolean },
  s: (text: string) => string,
) {
  doc.font(fonts.bold).fontSize(24).fillColor(PDF_COLORS.blue).text("DEEPFRAME", 50, 50);
  doc.font(fonts.main).fontSize(10).fillColor(PDF_COLORS.muted).text(s("Boite de production audiovisuelle"), 50, 80);
  doc.text("contact@deepframe.cc", 50, 95);
}

/** Draw table header row */
export function drawTableHeader(
  doc: PDFKit.PDFDocument,
  fonts: { main: string; bold: string; useCustom: boolean },
  s: (text: string) => string,
  tableTop: number,
) {
  doc.moveTo(50, tableTop).lineTo(545, tableTop).strokeColor(PDF_COLORS.blue).lineWidth(1).stroke();
  doc.font(fonts.bold).fontSize(9).fillColor(PDF_COLORS.blue);
  doc.text(s("Designation"), 50, tableTop + 8);
  doc.text(s("Qte"), 360, tableTop + 8, { width: 50, align: "center" });
  doc.text("P.U.", 410, tableTop + 8, { width: 60, align: "center" });
  doc.text("Total", 470, tableTop + 8, { width: 75, align: "right" });
  doc.moveTo(50, tableTop + 24).lineTo(545, tableTop + 24).strokeColor(PDF_COLORS.border).lineWidth(0.5).stroke();
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
  doc.font(fonts.main).fontSize(9).fillColor(PDF_COLORS.text);
  doc.text(s(safe(line.label, "-")), 50, y, { width: 300 });
  doc.text(line.qty ? String(line.qty) : "-", 360, y, { width: 50, align: "center" });
  doc.text(line.unit ? e(line.unit) : "-", 410, y, { width: 60, align: "center" });
  doc.text(e(line.total), 470, y, { width: 75, align: "right" });
  return y + 18;
}
