// One-off: génère les posters WebP (9:16) de l'étude de cas CK Clean Auto.
// Usage: node scripts/gen-ck-thumbs.mjs [--upload]
// Sans --upload : écrit seulement dans .tmp-thumbs/ pour inspection.
import sharp from "sharp";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, ".tmp-thumbs");

const W = 1080;
const H = 1920;
const NIGHT = "#0E0E22";
const ORANGE = "#F36B1F";
const GREEN = "#6B8779";

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function poster({ kicker, title, subtitle }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="78%" cy="22%" r="70%">
      <stop offset="0%" stop-color="${ORANGE}" stop-opacity="0.34"/>
      <stop offset="55%" stop-color="${ORANGE}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="12%" cy="92%" r="60%">
      <stop offset="0%" stop-color="${GREEN}" stop-opacity="0.30"/>
      <stop offset="60%" stop-color="${GREEN}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${NIGHT}"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>
  <rect x="0" y="0" width="14" height="${H}" fill="${ORANGE}"/>
  <text x="96" y="180" fill="${ORANGE}" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" letter-spacing="8">${esc(kicker)}</text>
  <text x="92" y="900" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="150" font-weight="800" letter-spacing="-4">CK CLEAN</text>
  <text x="92" y="1050" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="150" font-weight="800" letter-spacing="-4">AUTO</text>
  <rect x="96" y="1110" width="120" height="10" fill="${ORANGE}"/>
  <text x="96" y="1230" fill="rgba(255,255,255,0.82)" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="600">${esc(title)}</text>
  <text x="96" y="1300" fill="rgba(255,255,255,0.55)" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="400">${esc(subtitle)}</text>
  <text x="96" y="1820" fill="rgba(255,255,255,0.65)" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="700" letter-spacing="3">SPLICE STUDIO · ORLÉANS</text>
</svg>`;
}

const POSTERS = [
  {
    file: "ck-clean-auto-ppf.webp",
    kicker: "ÉTUDE DE CAS · DETAILING AUTO",
    title: "Présentation : pose de film PPF",
    subtitle: "Porsche Cayman S · Saran (45)",
  },
  {
    file: "ck-clean-auto-interview.webp",
    kicker: "ÉTUDE DE CAS · DETAILING AUTO",
    title: "Interview du propriétaire",
    subtitle: "Parcours & expertise · Saran (45)",
  },
];

async function main() {
  await mkdir(OUT, { recursive: true });
  const built = [];
  for (const p of POSTERS) {
    const webp = await sharp(Buffer.from(poster(p)))
      .webp({ quality: 82 })
      .toBuffer();
    const dest = path.join(OUT, p.file);
    await writeFile(dest, webp);
    built.push({ ...p, dest, bytes: webp.length });
    console.log(`built ${p.file} (${webp.length} bytes)`);
  }

  if (!process.argv.includes("--upload")) {
    console.log("\nInspection only. Re-run with --upload to push to R2.");
    return;
  }

  // Parse .dev.vars for R2 S3 credentials.
  const env = {};
  const raw = await readFile(path.join(ROOT, ".dev.vars"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }

  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });

  for (const b of built) {
    const key = `realisations/ck-clean-auto/${b.file}`;
    const body = await readFile(b.dest);
    await s3.send(
      new PutObjectCommand({
        Bucket: "galerie",
        Key: key,
        Body: body,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
    console.log(`uploaded https://media.splicestudio.fr/${key}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
