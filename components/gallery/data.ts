import { ReactNode } from "react";

export interface ProjectMedia {
  id: string;
  type: "video" | "photo";
  url: string;
  thumbnailUrl: string | null;
  caption: string;
  g?: number;
  duration?: string;
  tc?: string;
}

export interface Project {
  id: string;
  cat: string;
  title: string;
  client: string;
  year: number;
  tag: string;
  feat?: boolean;
  medias: ProjectMedia[];
}

/** True when the URL points to a video file (used to pick a poster vs the file). */
export function isVideoUrl(url: string | null | undefined): boolean {
  return /\.(mp4|webm|mov|avi)$/i.test(url || "");
}

/**
 * Resolves the image source to display for a media: its thumbnail if present,
 * otherwise the media URL itself for photos (videos without a thumbnail fall
 * back to a gradient placeholder, hence `null`).
 */
export function getThumbSrc(
  media: Pick<ProjectMedia, "url" | "thumbnailUrl">,
): string | null {
  return media.thumbnailUrl || (!isVideoUrl(media.url) ? media.url : null);
}

export interface Category {
  id: string;
  label: string;
  eyebrow: string;
  title: string | ReactNode;
  sub: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "auto",
    label: "Shootings auto",
    eyebrow: "01 — Automobile",
    title: "Shootings automobile",
    sub: "Studios fermés, sunset rolls, road shoots — pour concessions, importateurs et marques premium qui veulent une mise en image au niveau du produit.",
  },
  {
    id: "brand",
    label: "Films de marque",
    eyebrow: "02 — Brand content",
    title: "Films de marque",
    sub: "Récits longs et signature. On filme la fabrique d'un produit, le geste d'un artisan, l'idée derrière une maison.",
  },
  {
    id: "social",
    label: "Pubs & social",
    eyebrow: "03 — Pubs réseaux sociaux",
    title: "Pubs réseaux sociaux",
    sub: "Reels, formats verticaux, séries courtes. Calibrés pour scroller bien, performer mieux.",
  },
  {
    id: "produit",
    label: "Produit & lifestyle",
    eyebrow: "04 — Photo",
    title: "Photo produit & lifestyle",
    sub: "Packshots éditoriaux, séries en lumière naturelle, mises en scène contextuelles. Pour catalogue, e-commerce, presse.",
  },
  {
    id: "event",
    label: "Événementiel",
    eyebrow: "05 — Aftermovies",
    title: "Aftermovies & événements",
    sub: "Captation multi-angles, montage rapide, livraison J+5. Festivals, lancements, salons, soirées d'entreprise.",
  },
  {
    id: "podcast",
    label: "Podcasts",
    eyebrow: "06 — Interviews",
    title: "Podcasts & interviews",
    sub: "Captation studio 2 ou 3 caméras, son professionnel, montage et habillage. Pour marques, médias, équipes internes.",
  },
];

export const PROJECTS: Project[] = [
  // ───────── Automobile ─────────
  {
    id: "auto-porsche-911",
    cat: "auto",
    title: "Porsche 911 — Loire Edition",
    client: "Concession privée · Tours",
    year: 2026,
    tag: "Film + photo",
    feat: true,
    medias: [
      { id: "p1", type: "video", url: "", thumbnailUrl: null, g: 0, tc: "00:01:23:11", duration: "1:23", caption: "Reel principal" },
      { id: "p2", type: "photo", url: "", thumbnailUrl: null, g: 4, caption: "Trois-quart avant — golden hour" },
      { id: "p3", type: "photo", url: "", thumbnailUrl: null, g: 0, caption: "Détail jante BBS" },
      { id: "p4", type: "photo", url: "", thumbnailUrl: null, g: 2, caption: "Intérieur — cuir cognac" },
      { id: "p5", type: "photo", url: "", thumbnailUrl: null, g: 7, caption: "Profil — vignoble Sancerrois" },
    ],
  },
  {
    id: "auto-bmw-m2",
    cat: "auto",
    title: "BMW M2 — Sunset Roll",
    client: "Importateur · Blois",
    year: 2025,
    tag: "Film",
    medias: [
      { id: "b1", type: "video", url: "", thumbnailUrl: null, g: 4, tc: "00:01:55:04", duration: "1:55", caption: "Road shoot — D952" },
      { id: "b2", type: "photo", url: "", thumbnailUrl: null, g: 4, caption: "Vue arrière" },
      { id: "b3", type: "photo", url: "", thumbnailUrl: null, g: 7, caption: "Détail badge M" },
    ],
  },
  {
    id: "auto-mercedes-g",
    cat: "auto",
    title: "Mercedes-Benz G — Tournage hiver",
    client: "Importateur · Tours",
    year: 2024,
    tag: "Photo",
    medias: [
      { id: "m1", type: "photo", url: "", thumbnailUrl: null, g: 2, caption: "Studio neige" },
      { id: "m2", type: "photo", url: "", thumbnailUrl: null, g: 7, caption: "Calandre + projecteurs" },
      { id: "m3", type: "photo", url: "", thumbnailUrl: null, g: 4, caption: "Habitacle" },
      { id: "m4", type: "photo", url: "", thumbnailUrl: null, g: 0, caption: "Sortie de neige" },
    ],
  },
  {
    id: "auto-julien-portrait",
    cat: "auto",
    title: "Julien — concessionnaire",
    client: "Concession Verneuil",
    year: 2024,
    tag: "Portrait",
    medias: [
      { id: "j1", type: "photo", url: "", thumbnailUrl: null, g: 0, caption: "Portrait en showroom" },
    ],
  },

  // ───────── Brand content ─────────
  {
    id: "brand-maison-lalou",
    cat: "brand",
    title: "Maison Lalou — La première gorgée",
    client: "Vignoble · Sancerre",
    year: 2026,
    tag: "Brand film",
    feat: true,
    medias: [
      { id: "lal1", type: "video", url: "", thumbnailUrl: null, g: 1, tc: "00:02:14:08", duration: "2:14", caption: "Film principal — 2'14" },
      { id: "lal2", type: "photo", url: "", thumbnailUrl: null, g: 1, caption: "Camille — directrice marketing" },
      { id: "lal3", type: "photo", url: "", thumbnailUrl: null, g: 5, caption: "Cave — fermentation" },
      { id: "lal4", type: "photo", url: "", thumbnailUrl: null, g: 3, caption: "Bouteille — packshot" },
    ],
  },
  {
    id: "brand-cafe-naya",
    cat: "brand",
    title: "Café Naya — Paloma",
    client: "Marque · Orléans",
    year: 2024,
    tag: "Brand film",
    medias: [
      { id: "nay1", type: "video", url: "", thumbnailUrl: null, g: 3, tc: "00:01:48:09", duration: "1:48", caption: "Film de marque" },
      { id: "nay2", type: "photo", url: "", thumbnailUrl: null, g: 3, caption: "Coffee shop — comptoir" },
      { id: "nay3", type: "photo", url: "", thumbnailUrl: null, g: 5, caption: "Torréfaction" },
    ],
  },
  {
    id: "brand-vignerons-loire",
    cat: "brand",
    title: "Vignerons de la Loire",
    client: "Confédération · Vouvray",
    year: 2024,
    tag: "Documentaire",
    medias: [
      { id: "vig1", type: "video", url: "", thumbnailUrl: null, g: 5, tc: "00:06:22:14", duration: "6:22", caption: "Documentaire — 6'22" },
      { id: "vig2", type: "photo", url: "", thumbnailUrl: null, g: 5, caption: "Vignes au lever du jour" },
      { id: "vig3", type: "photo", url: "", thumbnailUrl: null, g: 1, caption: "Portrait — vigneron" },
    ],
  },

  // ───────── Pubs réseaux sociaux ─────────
  {
    id: "social-popup-cafe",
    cat: "social",
    title: "Saison 2 — Pop-up café",
    client: "Roastery · Orléans",
    year: 2025,
    tag: "Reel · vertical 9:16",
    feat: true,
    medias: [
      { id: "pop1", type: "video", url: "", thumbnailUrl: null, g: 2, tc: "00:00:42:22", duration: "0:42", caption: "Reel Instagram" },
      { id: "pop2", type: "photo", url: "", thumbnailUrl: null, g: 2, caption: "Latte art" },
      { id: "pop3", type: "photo", url: "", thumbnailUrl: null, g: 3, caption: "Devanture" },
      { id: "pop4", type: "photo", url: "", thumbnailUrl: null, g: 5, caption: "Barista — geste" },
    ],
  },
  {
    id: "social-atelier-joaillier",
    cat: "social",
    title: "L'Atelier joaillier — capsule été",
    client: "E-commerce · Tours",
    year: 2025,
    tag: "Pub sociale",
    medias: [
      { id: "joa1", type: "video", url: "", thumbnailUrl: null, g: 1, tc: "00:00:30:17", duration: "0:30", caption: "Spot 30s" },
      { id: "joa2", type: "photo", url: "", thumbnailUrl: null, g: 3, caption: "Bague solitaire" },
      { id: "joa3", type: "photo", url: "", thumbnailUrl: null, g: 1, caption: "Pendentif — détail" },
    ],
  },
  {
    id: "social-lana-clip",
    cat: "social",
    title: "Lana — Brouillard d'avril",
    client: "Indie label · Tours",
    year: 2024,
    tag: "Clip musical",
    medias: [
      { id: "lan1", type: "video", url: "", thumbnailUrl: null, g: 2, tc: "00:03:41:00", duration: "3:41", caption: "Clip officiel" },
    ],
  },

  // ───────── Photo produit & lifestyle ─────────
  {
    id: "produit-bijoux-capsule",
    cat: "produit",
    title: "Bijoux — capsule été",
    client: "Atelier joaillier · Tours",
    year: 2026,
    tag: "Produit",
    feat: true,
    medias: [
      { id: "bij1", type: "photo", url: "", thumbnailUrl: null, g: 3, caption: "Bague — packshot studio" },
      { id: "bij2", type: "photo", url: "", thumbnailUrl: null, g: 1, caption: "Collier — lifestyle main" },
      { id: "bij3", type: "photo", url: "", thumbnailUrl: null, g: 3, caption: "Pendentif — détail" },
      { id: "bij4", type: "photo", url: "", thumbnailUrl: null, g: 5, caption: "Bracelet — texture cuir" },
    ],
  },
  {
    id: "produit-vins-loire",
    cat: "produit",
    title: "Vins de la Loire",
    client: "Coopérative · Vouvray",
    year: 2025,
    tag: "Produit",
    medias: [
      { id: "vin1", type: "photo", url: "", thumbnailUrl: null, g: 1, caption: "Bouteille blanche — fond pierre" },
      { id: "vin2", type: "photo", url: "", thumbnailUrl: null, g: 5, caption: "Bouteille rouge — table" },
      { id: "vin3", type: "photo", url: "", thumbnailUrl: null, g: 3, caption: "Étiquette — détail" },
    ],
  },
  {
    id: "produit-cafe-packaging",
    cat: "produit",
    title: "Café de spécialité — packaging",
    client: "Roastery · Orléans",
    year: 2024,
    tag: "Produit",
    medias: [
      { id: "cafp1", type: "photo", url: "", thumbnailUrl: null, g: 3, caption: "Pack 250g — face" },
    ],
  },
  {
    id: "produit-atelier-velo",
    cat: "produit",
    title: "Atelier vélo — collection",
    client: "Cycles Orléans",
    year: 2024,
    tag: "Lifestyle",
    medias: [
      { id: "vel1", type: "photo", url: "", thumbnailUrl: null, g: 5, caption: "Atelier — ambiance" },
      { id: "vel2", type: "photo", url: "", thumbnailUrl: null, g: 1, caption: "Cadre cuivré — détail" },
      { id: "vel3", type: "photo", url: "", thumbnailUrl: null, g: 3, caption: "Selle Brooks" },
    ],
  },

  // ───────── Événementiel ─────────
  {
    id: "event-festival-ete",
    cat: "event",
    title: "Festival d'été 2025",
    client: "Métropole d'Orléans",
    year: 2025,
    tag: "Aftermovie",
    feat: true,
    medias: [
      { id: "fest1", type: "video", url: "", thumbnailUrl: null, g: 4, tc: "00:03:08:00", duration: "3:08", caption: "Aftermovie 3'08" },
      { id: "fest2", type: "photo", url: "", thumbnailUrl: null, g: 5, caption: "Mainstage — plan large" },
      { id: "fest3", type: "photo", url: "", thumbnailUrl: null, g: 4, caption: "Foule — lumière" },
      { id: "fest4", type: "photo", url: "", thumbnailUrl: null, g: 2, caption: "Backstage" },
    ],
  },
  {
    id: "event-salon-auto",
    cat: "event",
    title: "Salon de l'auto régional",
    client: "Parc Expo · Orléans",
    year: 2024,
    tag: "Aftermovie",
    medias: [
      { id: "sal1", type: "video", url: "", thumbnailUrl: null, g: 4, tc: "00:02:55:11", duration: "2:55", caption: "Aftermovie" },
      { id: "sal2", type: "photo", url: "", thumbnailUrl: null, g: 4, caption: "Stand BMW — public" },
      { id: "sal3", type: "photo", url: "", thumbnailUrl: null, g: 0, caption: "Conférence presse" },
    ],
  },
  {
    id: "event-lancement-boutique",
    cat: "event",
    title: "Lancement boutique",
    client: "Atelier joaillier · Tours",
    year: 2024,
    tag: "Aftermovie · Photo",
    medias: [
      { id: "lanc1", type: "photo", url: "", thumbnailUrl: null, g: 2, caption: "Cocktail — ambiance" },
      { id: "lanc2", type: "photo", url: "", thumbnailUrl: null, g: 1, caption: "Discours fondatrice" },
      { id: "lanc3", type: "video", url: "", thumbnailUrl: null, g: 1, tc: "00:01:12:00", duration: "1:12", caption: "Capsule 1'12" },
    ],
  },

  // ───────── Podcasts ─────────
  {
    id: "podcast-roastery",
    cat: "podcast",
    title: "« Filière » — Roastery #4",
    client: "Roastery · Orléans",
    year: 2025,
    tag: "Podcast vidéo",
    feat: true,
    medias: [
      { id: "podr1", type: "video", url: "", thumbnailUrl: null, g: 6, tc: "00:42:18:00", duration: "42:18", caption: "Épisode 4 — sourcing" },
      { id: "podr2", type: "photo", url: "", thumbnailUrl: null, g: 6, caption: "Plateau — 3 caméras" },
      { id: "podr3", type: "photo", url: "", thumbnailUrl: null, g: 3, caption: "Détail — café en grain" },
    ],
  },
  {
    id: "podcast-tech",
    cat: "podcast",
    title: "Tech Orléans — Saison 1",
    client: "Métropole d'Orléans",
    year: 2024,
    tag: "Série podcast",
    medias: [
      { id: "podt1", type: "video", url: "", thumbnailUrl: null, g: 7, tc: "00:28:44:00", duration: "28:44", caption: "Épisode pilote" },
      { id: "podt2", type: "photo", url: "", thumbnailUrl: null, g: 7, caption: "Plateau" },
    ],
  },
];
