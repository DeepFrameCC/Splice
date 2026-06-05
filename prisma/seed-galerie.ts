/**
 * Seed script for the galerie page.
 * Populates the Media table with ~60 assets from the R2 bucket `galerie`.
 *
 * Usage: pnpm seed:galerie
 * Idempotent: uses upsert by URL, safe to re-run.
 */
import fs from "fs";
import path from "path";
import { PrismaClient, MediaType, Founder } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";
import ws from "ws";

// Load .env manually (same approach as seed.ts)
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf-8");
    for (const rawLine of envConfig.split("\n")) {
      const line = rawLine.replace(/\r/g, "").trim();
      if (!line || line.startsWith("#")) continue;
      const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        process.env[key] = value.trim();
      }
    }
  }
} catch (e) {
  console.error("Failed to load .env in seed-galerie script", e);
}

const databaseUrl = process.env.DATABASE_URL!;
const cleanUrl = databaseUrl.split("?")[0];
Pool.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: cleanUrl });
const prisma = new PrismaClient({ adapter });

const CDN =
  process.env.NEXT_PUBLIC_CDN_GALERIE_URL || "https://media.splicestudio.fr";

interface MediaSeed {
  type: MediaType;
  filename: string;
  folder: "videos" | "photos";
  thumbnailFilename?: string;
  title: string;
  description?: string;
  category: "automobile" | "evenement" | "portrait" | "urbain";
  owner: Founder;
  prixEstime: number;
  materiel: string[];
  client?: string;
  duration?: string;
}

const MEDIAS: MediaSeed[] = [
  // ═══ VIDEOS ═══════════════════════════════════════════════════════════
  {
    type: MediaType.VIDEO,
    filename: "Interview cklean auto.mp4",
    folder: "videos",
    thumbnailFilename: "thumb-interview-cklean-auto.jpg",
    title: "Interview Cklean Auto",
    description: "Interview client Cklean Auto — detailing premium.",
    category: "automobile",
    owner: Founder.TY,
    prixEstime: 800,
    materiel: ["iPhone 14", "Sony ZV1"],
    client: "Cklean Auto",
    duration: "02:30",
  },
  {
    type: MediaType.VIDEO,
    filename: "BTS_DeepFrame.mp4",
    folder: "videos",
    title: "Backstage Splice Studio",
    description: "Coulisses de l'equipe Splice Studio.",
    category: "automobile",
    owner: Founder.TY,
    prixEstime: 0,
    materiel: ["iPhone 14", "Sony ZV1"],
    duration: "00:30",
  },
  {
    type: MediaType.VIDEO,
    filename: "Luxury Edit (Par Tracy).mp4",
    folder: "videos",
    thumbnailFilename: "thumb_porsche_orléans.png",
    title: "Luxury Edit",
    description: "Montage premium signe Tracy.",
    category: "automobile",
    owner: Founder.TY,
    prixEstime: 1800,
    materiel: ["iPhone 14", "Sony ZV1"],
    duration: "02:00",
  },
  {
    type: MediaType.VIDEO,
    filename: "Présentation (Par Louisia).mp4",
    folder: "videos",
    thumbnailFilename: "thumb-presentation-louisia.jpg",
    title: "Presentation Louisia",
    description: "Montage signe Louisia.",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 1000,
    materiel: ["iPhone 14", "Sony ZV1"],
    duration: "01:30",
  },
  {
    type: MediaType.VIDEO,
    filename: "Jeanne d'arc .mp4",
    folder: "videos",
    thumbnailFilename: "thumb-jeanne-darc.jpg",
    title: "Fetes Johanniques d'Orleans",
    description: "Couverture des Fetes Johanniques d'Orleans.",
    category: "evenement",
    owner: Founder.TY,
    prixEstime: 2000,
    materiel: ["iPhone 14", "Sony ZV1"],
    client: "Ville d'Orleans",
    duration: "03:00",
  },

  // ═══ PHOTOS — AUTOMOBILE ══════════════════════════════════════════════
  {
    type: MediaType.PHOTO,
    filename: "porche côté.webp",
    folder: "photos",
    title: "Porsche profile",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 250,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "travail 4 porche.webp",
    folder: "photos",
    title: "Porsche en travail #4",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 250,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "mustang2.webp",
    folder: "photos",
    title: "Mustang #2",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 200,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "mustang3.webp",
    folder: "photos",
    title: "Mustang #3",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 200,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "mustang4.webp",
    folder: "photos",
    title: "Mustang #4",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 200,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "mustang5.webp",
    folder: "photos",
    title: "Mustang #5",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 200,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "Low rider 1.webp",
    folder: "photos",
    title: "Low Rider #1",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 200,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "Low rider 2.webp",
    folder: "photos",
    title: "Low Rider #2",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 200,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "low rider 3.webp",
    folder: "photos",
    title: "Low Rider #3",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 200,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "low rider 6.webp",
    folder: "photos",
    title: "Low Rider #6",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 200,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "low rider 7.webp",
    folder: "photos",
    title: "Low Rider #7",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 200,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "Low rider après 3.webp",
    folder: "photos",
    title: "Low Rider apres #3",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 200,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "low rider après 26.webp",
    folder: "photos",
    title: "Low Rider apres #26",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 200,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "mooto 1.webp",
    folder: "photos",
    title: "Moto #1",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 180,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "mooto 222222.webp",
    folder: "photos",
    title: "Moto #2",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 180,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "mooto 2222222.webp",
    folder: "photos",
    title: "Moto #3",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 180,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "moto 4.webp",
    folder: "photos",
    title: "Moto #4",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 180,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "Nissan.webp",
    folder: "photos",
    title: "Nissan GTR",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 250,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "Nissan2.webp",
    folder: "photos",
    title: "Nissan GTR #2",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 250,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "NissanR32Orange1.webp",
    folder: "photos",
    title: "Nissan R32 Orange",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 250,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "PorscheBleu.webp",
    folder: "photos",
    title: "Porsche Bleue",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 250,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "PorscheBleu2.webp",
    folder: "photos",
    title: "Porsche Bleue #2",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 250,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "mclaren_-_01.webp",
    folder: "photos",
    title: "McLaren #1",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 250,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "mclaren_2_-_01.webp",
    folder: "photos",
    title: "McLaren #2",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 250,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "mclaren_3_-_01.webp",
    folder: "photos",
    title: "McLaren #3",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 250,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "mclaren_4_-_01.webp",
    folder: "photos",
    title: "McLaren #4",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 250,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "mclaren_5_-_01.webp",
    folder: "photos",
    title: "McLaren #5",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 250,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "mclaren_6_-_01.webp",
    folder: "photos",
    title: "McLaren #6",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 250,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "mustantnoir1.webp",
    folder: "photos",
    title: "Mustang Noire",
    category: "automobile",
    owner: Founder.LOUISIA,
    prixEstime: 250,
    materiel: ["Sony ZV1"],
  },

  // ═══ PHOTOS — EVENEMENT (Fetes Johanniques) ═══════════════════════════
  {
    type: MediaType.PHOTO,
    filename: "jeanne d_arc avant .webp",
    folder: "photos",
    title: "Jeanne d'Arc — avant representation",
    category: "evenement",
    owner: Founder.LOUISIA,
    prixEstime: 150,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "chevaier après .webp",
    folder: "photos",
    title: "Chevalier apres combat",
    category: "evenement",
    owner: Founder.LOUISIA,
    prixEstime: 150,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "cheval blanc après.webp",
    folder: "photos",
    title: "Cheval blanc — apres",
    category: "evenement",
    owner: Founder.LOUISIA,
    prixEstime: 150,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "cheval chapeau.webp",
    folder: "photos",
    title: "Cheval chapeaute",
    category: "evenement",
    owner: Founder.LOUISIA,
    prixEstime: 150,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "cheval chapeau 2.webp",
    folder: "photos",
    title: "Cheval chapeaute #2",
    category: "evenement",
    owner: Founder.LOUISIA,
    prixEstime: 150,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "charre armée.webp",
    folder: "photos",
    title: "Charrette armee",
    category: "evenement",
    owner: Founder.LOUISIA,
    prixEstime: 150,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "charre armée 2.webp",
    folder: "photos",
    title: "Charrette armee #2",
    category: "evenement",
    owner: Founder.LOUISIA,
    prixEstime: 150,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "drapeau fr.webp",
    folder: "photos",
    title: "Drapeau francais",
    category: "evenement",
    owner: Founder.LOUISIA,
    prixEstime: 120,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "pompier.webp",
    folder: "photos",
    title: "Pompier en service",
    category: "evenement",
    owner: Founder.LOUISIA,
    prixEstime: 150,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "jeune sapeur pompier .webp",
    folder: "photos",
    title: "Jeune sapeur-pompier",
    category: "evenement",
    owner: Founder.LOUISIA,
    prixEstime: 150,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "paroisse d_orl.webp",
    folder: "photos",
    title: "Paroisse d'Orleans",
    category: "evenement",
    owner: Founder.LOUISIA,
    prixEstime: 150,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "cathédrale.webp",
    folder: "photos",
    title: "Cathedrale d'Orleans",
    category: "evenement",
    owner: Founder.LOUISIA,
    prixEstime: 180,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "monument 1.webp",
    folder: "photos",
    title: "Monument johannique",
    category: "evenement",
    owner: Founder.LOUISIA,
    prixEstime: 150,
    materiel: ["Sony ZV1"],
  },

  // ═══ PHOTOS — PORTRAIT ════════════════════════════════════════════════
  {
    type: MediaType.PHOTO,
    filename: "Amoureux 2.webp",
    folder: "photos",
    title: "Amoureux #2",
    category: "portrait",
    owner: Founder.LOUISIA,
    prixEstime: 250,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "fille avec fleur.webp",
    folder: "photos",
    title: "Portrait fleuri",
    category: "portrait",
    owner: Founder.LOUISIA,
    prixEstime: 250,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "fille porte.webp",
    folder: "photos",
    title: "Portrait a la porte",
    category: "portrait",
    owner: Founder.LOUISIA,
    prixEstime: 250,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "marché dames flou.webp",
    folder: "photos",
    title: "Marche en mouvement",
    category: "portrait",
    owner: Founder.LOUISIA,
    prixEstime: 180,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "vase bleu.webp",
    folder: "photos",
    title: "Vase bleu",
    category: "portrait",
    owner: Founder.LOUISIA,
    prixEstime: 150,
    materiel: ["Sony ZV1"],
  },

  // ═══ PHOTOS — URBAIN ══════════════════════════════════════════════════
  {
    type: MediaType.PHOTO,
    filename: "fleur 7.webp",
    folder: "photos",
    title: "Fleur #7",
    category: "urbain",
    owner: Founder.LOUISIA,
    prixEstime: 120,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "fleur 8.webp",
    folder: "photos",
    title: "Fleur #8",
    category: "urbain",
    owner: Founder.LOUISIA,
    prixEstime: 120,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "cartes jaunes.webp",
    folder: "photos",
    title: "Cartes jaunes",
    category: "urbain",
    owner: Founder.LOUISIA,
    prixEstime: 150,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "paradis du fruit v2.webp",
    folder: "photos",
    title: "Paradis du fruit",
    category: "urbain",
    owner: Founder.LOUISIA,
    prixEstime: 180,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "miroir 1.webp",
    folder: "photos",
    title: "Reflet #1",
    category: "urbain",
    owner: Founder.LOUISIA,
    prixEstime: 150,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "miroir 2.webp",
    folder: "photos",
    title: "Reflet #2",
    category: "urbain",
    owner: Founder.LOUISIA,
    prixEstime: 150,
    materiel: ["Sony ZV1"],
  },
  {
    type: MediaType.PHOTO,
    filename: "police vélo.webp",
    folder: "photos",
    title: "Police a velo",
    category: "urbain",
    owner: Founder.LOUISIA,
    prixEstime: 180,
    materiel: ["Sony ZV1"],
  },
];

function buildUrl(folder: string, filename: string): string {
  return `${CDN}/${folder}/${encodeURIComponent(filename)}`;
}

async function main() {
  console.log(`Seed galerie: ${MEDIAS.length} medias to upsert`);

  // Clean up any duplicate local media entries starting with /videos/ or /photos/
  const deletedLocal = await prisma.media.deleteMany({
    where: {
      OR: [
        { url: { startsWith: "/videos/" } },
        { url: { startsWith: "/photos/" } }
      ]
    }
  });
  if (deletedLocal.count > 0) {
    console.log(`[seed-galerie] Cleaned up ${deletedLocal.count} legacy local media entries to prevent duplicates.`);
  }

  // Clean up any old .jpg or .jpeg R2 photo entries to prevent broken images
  const deletedOldPhotos = await prisma.media.deleteMany({
    where: {
      type: MediaType.PHOTO,
      OR: [
        { url: { endsWith: ".jpg" } },
        { url: { endsWith: ".jpeg" } }
      ]
    }
  });
  if (deletedOldPhotos.count > 0) {
    console.log(`[seed-galerie] Cleaned up ${deletedOldPhotos.count} legacy R2 .jpg photo entries.`);
  }

  // Clean up any orphan seeded media entries from the database (those not in the current keepUrls)
  const keepUrls = MEDIAS.map(m => buildUrl(m.folder, m.filename));
  const deletedOrphans = await prisma.media.deleteMany({
    where: {
      url: {
        startsWith: CDN,
        notIn: keepUrls
      }
    }
  });
  if (deletedOrphans.count > 0) {
    console.log(`[seed-galerie] Cleaned up ${deletedOrphans.count} orphan seeded media entries.`);
  }

  let inserted = 0;
  let updated = 0;

  for (const m of MEDIAS) {
    const url = buildUrl(m.folder, m.filename);
    const thumbnailUrl = m.thumbnailFilename
      ? buildUrl("thumb", m.thumbnailFilename)
      : null;

    const data = {
      type: m.type,
      thumbnailUrl,
      title: m.title,
      description: m.description ?? null,
      materiel: m.materiel,
      prixEstime: m.prixEstime,
      owner: m.owner,
      category: m.category,
      client: m.client ?? null,
      duration: m.duration ?? null,
      published: true,
    };

    const existing = await prisma.media.findFirst({ where: { url } });

    if (existing) {
      await prisma.media.update({ where: { id: existing.id }, data });
      updated++;
    } else {
      await prisma.media.create({ data: { ...data, url } });
      inserted++;
    }
  }

  console.log(`Seed done: ${inserted} inserted, ${updated} updated.`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
