import { DureeTournage, DelaiLivraison, VilleDepart, Founder } from "@prisma/client";

// ─── Plan IDs ─────────────────────────────────────────────────────

export type PlanId = "STANDARD" | "PRO" | "PREMIUM_ABO";
export type BillingCycle = "MENSUEL" | "ANNUEL";
export type DevisMode = "ABONNEMENT" | "PACK_PARTICULIER" | "FORMULE_BIENVENUE";

// ─── Subscription Plans ───────────────────────────────────────────

export interface SubscriptionPlan {
  id: PlanId;
  label: string;
  tagline: string;
  recommended?: boolean;
  videosPerMonth: number;
  // Launch prices (10 spots per plan)
  launchMonthly: number;
  launchAnnualMonthly: number;
  launchAnnualTotal: number;
  launchAnnualSaving: number;
  // Standard prices (after launch)
  stdMonthly: number;
  stdAnnualMonthly: number;
  stdAnnualTotal: number;
  features: string[];
  excludedFeatures: string[];
}

export const SUBSCRIPTION_PLANS: Record<PlanId, SubscriptionPlan> = {
  STANDARD: {
    id: "STANDARD",
    label: "Standard",
    tagline: "Pour démarrer sans gros budget",
    videosPerMonth: 2,
    launchMonthly: 49,
    launchAnnualMonthly: 45,
    launchAnnualTotal: 540,
    launchAnnualSaving: 48,
    stdMonthly: 79,
    stdAnnualMonthly: 69,
    stdAnnualTotal: 828,
    features: [
      "2 vidéos sources / mois",
      "Recyclage multi-réseaux",
      "Formats 9:16 + 16:9",
      "Option photo (+5 photos max / 1 pack)",
      "Options à la carte disponibles",
    ],
    excludedFeatures: [
      "Création de podcasts courts",
    ],
  },
  PRO: {
    id: "PRO",
    label: "Pro",
    tagline: "Pour publier toutes les semaines",
    recommended: true,
    videosPerMonth: 5,
    launchMonthly: 99,
    launchAnnualMonthly: 89,
    launchAnnualTotal: 1068,
    launchAnnualSaving: 120,
    stdMonthly: 149,
    stdAnnualMonthly: 129,
    stdAnnualTotal: 1548,
    features: [
      "5 vidéos sources / mois",
      "Recyclage multi-réseaux",
      "Podcasts courts (limité à 2 / mois)",
      "Option photo (+15 photos max / 3 packs)",
      "Options à la carte disponibles",
    ],
    excludedFeatures: [
      "Création de podcasts jusqu'à 4 / mois",
    ],
  },
  PREMIUM_ABO: {
    id: "PREMIUM_ABO",
    label: "Premium",
    tagline: "Pour une présence quasi quotidienne",
    videosPerMonth: 8,
    launchMonthly: 189,
    launchAnnualMonthly: 169,
    launchAnnualTotal: 2028,
    launchAnnualSaving: 240,
    stdMonthly: 279,
    stdAnnualMonthly: 249,
    stdAnnualTotal: 2988,
    features: [
      "8 vidéos sources / mois",
      "Recyclage multi-réseaux",
      "Podcasts courts (limité à 4 / mois)",
      "Option photo (disponible sans limite)",
      "Options à la carte disponibles",
    ],
    excludedFeatures: [],
  },
};

export const PLAN_IDS: PlanId[] = ["STANDARD", "PRO", "PREMIUM_ABO"];

// ─── Status des Offres de Lancement (10 places max) ─────────────────
export const PLAN_LAUNCH_STATUS: Record<PlanId, { complete: boolean; spotsLeft: number }> = {
  STANDARD: { complete: false, spotsLeft: 10 },
  PRO: { complete: false, spotsLeft: 10 },
  PREMIUM_ABO: { complete: false, spotsLeft: 10 },
};

// ─── Formule Bienvenue (gratuite, nouveaux clients) ──────────────

export const FORMULE_BIENVENUE = {
  label: "Formule Bienvenue",
  tagline: "Réservée aux nouveaux clients",
  price: 0,
  features: [
    "2 stories offertes",
    "5 photos offertes",
    "Découverte de notre univers",
    "Sans engagement",
  ],
  excludedFeatures: [
    "Vidéos sources récurrentes",
    "Recyclage multi-réseaux",
    "Création de podcasts",
    "Options à la carte",
  ],
} as const;

// ─── Multi-network distribution volumes ───────────────────────────

export interface NetworkVolume {
  network: string;
  standard: string;
  pro: string;
  premium: string;
}

export const NETWORK_VOLUMES: NetworkVolume[] = [
  { network: "Instagram – Reels", standard: "2 Reels", pro: "5 Reels", premium: "8 Reels" },
  { network: "Instagram – Stories", standard: "4–6 stories", pro: "10–15 stories", premium: "20–25 stories" },
  { network: "Instagram – Carrousels", standard: "1 carrousel", pro: "3 carrousels", premium: "4–6 carrousels" },
  { network: "TikTok", standard: "2 TikToks", pro: "5 TikToks", premium: "8 TikToks" },
  { network: "YouTube Shorts", standard: "2 Shorts", pro: "5 Shorts", premium: "8 Shorts" },
  { network: "Facebook (posts/Reels)", standard: "2 posts", pro: "5 posts", premium: "8 posts" },
  { network: "Pinterest (pins)", standard: "4 pins", pro: "10 pins", premium: "16 pins" },
  { network: "Google – posts", standard: "2–4 posts", pro: "5–8 posts", premium: "10–12 posts" },
  { network: "Google – photos", standard: "5–8 photos", pro: "10–15 photos", premium: "20 photos" },
];

// ─── Pack Particulier ─────────────────────────────────────────────

export interface PackVideoOption {
  qty: number;
  label: string;
  price: number;
  popular?: boolean;
}

export interface PackPhotoOption {
  qty: number | null; // null = sur mesure
  label: string;
  price: number | null; // null = devis
  popular?: boolean;
}

export const PACK_PARTICULIER_VIDEOS: PackVideoOption[] = [
  { qty: 1, label: "Base solo", price: 29 },
  { qty: 2, label: "Pack Duo", price: 55 },
  { qty: 3, label: "Pack Trio", price: 79 },
  { qty: 4, label: "Pack Complet", price: 99, popular: true },
];

export const PACK_PARTICULIER_PHOTOS: PackPhotoOption[] = [
  { qty: 5, label: "Pack Essentiel", price: 15 },
  { qty: 10, label: "Pack Standard", price: 28, popular: true },
  { qty: 20, label: "Pack Pro", price: 50 },
  { qty: null, label: "Pack Custom", price: null },
];

// ─── Options à la carte ───────────────────────────────────────────

export type OptionKey =
  | "voixOff"
  | "sousTitres"
  | "retourSupp"
  | "creationBanniere"
  | "montageExpress"
  | "musiqueSurMesure"
  | "adsReseaux"
  | "podcast"
  | "videoSupp"
  | "photoSupp"
  | "photoRetouche"
  | "banniere";

export interface OptionALaCarte {
  key: OptionKey;
  label: string;
  price: number;
  unit: string;
}

export const OPTIONS_A_LA_CARTE: OptionALaCarte[] = [
  { key: "voixOff", label: "Voix off", price: 12, unit: "/ vidéo" },
  { key: "sousTitres", label: "Sous-titres", price: 12, unit: "/ vidéo" },
  { key: "retourSupp", label: "Retour supplémentaire", price: 7, unit: "/ vidéo" },
  { key: "creationBanniere", label: "Création de bannière", price: 20, unit: "/ bannière" },
  { key: "montageExpress", label: "Montage express", price: 25, unit: "/ vidéo" },
  { key: "musiqueSurMesure", label: "Musique sur mesure", price: 25, unit: "/ vidéo" },
  { key: "adsReseaux", label: "Ads réseaux sociaux", price: 20, unit: "/ vidéo" },
  { key: "podcast", label: "Podcasts courts", price: 29, unit: "/ épisode" },
  { key: "videoSupp", label: "Vidéo supplémentaire", price: 29, unit: "/ vidéo" },
  { key: "photoSupp", label: "Option photo (5 photos)", price: 15, unit: "/ pack" },
  { key: "photoRetouche", label: "Retouche photo avancée", price: 10, unit: "/ photo" },
  { key: "banniere", label: "Bannière Deepframe", price: 15, unit: "/ mois" },
];

// ─── Bannière Splice ───────────────────────────────────────────

export type BanniereSize = "PETITE" | "MOYENNE" | "GRANDE";

export const BANNIERE_SPLICE: Record<BanniereSize, { label: string; pricePerMonth: number }> = {
  PETITE: { label: "Bannière petite", pricePerMonth: 15 },
  MOYENNE: { label: "Bannière moyenne", pricePerMonth: 20 },
  GRANDE: { label: "Bannière grande", pricePerMonth: 30 },
};

// ─── Extra options ────────────────────────────────────────────────

export const PRIX_VIDEO_SUPP = 29;
export const PRIX_PODCAST_COURT = 29;
export const PRIX_OPTION_PHOTO_5 = 15;

// ─── Preserved constants ──────────────────────────────────────────

export const DUREE_SUPPLEMENT: Record<DureeTournage, { label: string; price: number }> = {
  DEMI_JOURNEE: { label: "4h (demi-journée)", price: 0 },
  JOURNEE: { label: "Journée entière", price: 30 },
  DEUX_JOURNEES: { label: "2 journées entières", price: 70 },
};

export const DELAI: Record<DelaiLivraison, { label: string; price: number }> = {
  STANDARD: { label: "Standard (7 à 10 jours ouvrés)", price: 0 },
  ETENDU: { label: "Jusqu'à 15 jours ouvrés (4 à 8 vidéos)", price: 0 },
  EXPRESS_48H: { label: "Express 48h", price: 50 },
};

export const PRIX_KM = 0.5;
export const ACOMPTE_RATE = 30;

export const VILLE_DEPART_LABEL: Record<VilleDepart, string> = {
  TOURS: "Tours",
  ORLEANS: "Orléans",
};

export const FOUNDER_LABEL: Record<Founder, string> = {
  LOUISIA: "@by.louisia",
  TY: "@t.y97one",
};

// ─── Quote types ──────────────────────────────────────────────────

export type QuoteLine = { label: string; qty?: number; unit?: number; total: number };
export type Quote = { lines: QuoteLine[]; totalHT: number; acompte: number; solde: number };

export class PricingError extends Error {}

// ─── Pack Particulier quote ───────────────────────────────────────

export interface PackParticulierInput {
  nbVideos: number | null;
  nbPhotos: number | null;
  options: Partial<Record<OptionKey, boolean | number>>;
  banniere: BanniereSize | null;
  villeDepart: VilleDepart;
  distanceKm: number;
  delai: DelaiLivraison;
}

export function computePackParticulierQuote(input: PackParticulierInput): Quote {
  if (input.distanceKm < 0) throw new PricingError("Distance invalide.");

  const lines: QuoteLine[] = [];

  // Videos
  if (input.nbVideos && input.nbVideos > 0) {
    const videoOption = PACK_PARTICULIER_VIDEOS.find((v) => v.qty === input.nbVideos);
    if (videoOption) {
      lines.push({
        label: `${videoOption.qty} vidéo${videoOption.qty > 1 ? "s" : ""} — ${videoOption.label}`,
        total: videoOption.price,
      });
    }
  }

  // Photos
  if (input.nbPhotos && input.nbPhotos > 0) {
    const photoOption = PACK_PARTICULIER_PHOTOS.find((p) => p.qty === input.nbPhotos);
    if (photoOption && photoOption.price !== null) {
      lines.push({
        label: `${photoOption.qty} photos — ${photoOption.label}`,
        total: photoOption.price,
      });
    }
  }

  // Options à la carte
  const videoCount = input.nbVideos ?? 0;
  for (const opt of OPTIONS_A_LA_CARTE) {
    const val = input.options[opt.key];
    if (val) {
      let qty = typeof val === "number" ? val : (opt.key === "creationBanniere" ? 1 : videoCount);
      if (opt.key !== "creationBanniere") {
        qty = Math.min(qty, videoCount);
      }
      if (qty > 0) {
        lines.push({
          label: opt.label,
          qty,
          unit: opt.price,
          total: opt.price * qty,
        });
      }
    }
  }

  // Bannière
  if (input.banniere) {
    const ban = BANNIERE_SPLICE[input.banniere];
    lines.push({ label: ban.label, total: ban.pricePerMonth });
  }

  // Travel
  if (input.distanceKm > 0) {
    const km = Math.round(input.distanceKm);
    const kmTotal = Math.round(km * PRIX_KM);
    lines.push({
      label: `Frais de déplacement (${km} km A/R depuis ${VILLE_DEPART_LABEL[input.villeDepart]})`,
      qty: km,
      unit: PRIX_KM,
      total: kmTotal,
    });
  }

  // Delivery delay
  const delai = DELAI[input.delai];
  if (delai.price > 0) {
    lines.push({ label: "Délai : " + delai.label, total: delai.price });
  }

  const totalHT = lines.reduce((s, l) => s + l.total, 0);
  const acompte = Math.round((totalHT * ACOMPTE_RATE) / 100);
  const solde = totalHT - acompte;

  return { lines, totalHT, acompte, solde };
}

// ─── Abonnement quote ─────────────────────────────────────────────

export interface AbonnementInput {
  planId: PlanId;
  billingCycle: BillingCycle;
  useLaunchPrice: boolean;
  options: Partial<Record<OptionKey, boolean | number>>;
}

export function computeAbonnementQuote(input: AbonnementInput): Quote {
  const plan = SUBSCRIPTION_PLANS[input.planId];
  const lines: QuoteLine[] = [];

  // Enforce plan restrictions & limits
  if (input.planId === "STANDARD") {
    if (typeof input.options.podcast === "number" && input.options.podcast > 0) {
      throw new PricingError("Les podcasts courts ne sont pas disponibles avec la formule Standard.");
    }
    if (typeof input.options.photoSupp === "number" && input.options.photoSupp > 1) {
      throw new PricingError("L'option photo est limitée à +5 photos max (1 pack) avec la formule Standard.");
    }
    if (typeof input.options.photoRetouche === "number" && input.options.photoRetouche > 5) {
      throw new PricingError("La retouche photo est limitée à 5 photos max avec la formule Standard.");
    }
    if (typeof input.options.montageExpress === "number" && input.options.montageExpress > 0) {
      throw new PricingError("L'option montage express n'est pas disponible avec la formule Standard.");
    }
    if (input.options.banniere && typeof input.options.banniere === "number" && input.options.banniere > 1) {
      throw new PricingError("L'option bannière est limitée à 1 avec la formule Standard.");
    }
  } else if (input.planId === "PRO") {
    if (typeof input.options.podcast === "number" && input.options.podcast > 2) {
      throw new PricingError("Les podcasts courts sont limités à 2 épisodes par mois avec la formule Pro.");
    }
    if (typeof input.options.photoSupp === "number" && input.options.photoSupp > 3) {
      throw new PricingError("L'option photo est limitée à +15 photos max (3 packs) avec la formule Pro.");
    }
    if (typeof input.options.photoRetouche === "number" && input.options.photoRetouche > 15) {
      throw new PricingError("La retouche photo est limitée à 15 photos max avec la formule Pro.");
    }
    if (typeof input.options.montageExpress === "number" && input.options.montageExpress > 2) {
      throw new PricingError("L'option montage express est limitée à 2 par mois avec la formule Pro.");
    }
    if (input.options.banniere && typeof input.options.banniere === "number" && input.options.banniere > 1) {
      throw new PricingError("L'option bannière est limitée à 1 avec la formule Pro.");
    }
  } else if (input.planId === "PREMIUM_ABO") {
    if (typeof input.options.podcast === "number" && input.options.podcast > 4) {
      throw new PricingError("Les podcasts courts sont limités à 4 épisodes par mois avec la formule Premium.");
    }
    if (typeof input.options.photoRetouche === "number" && input.options.photoRetouche > 30) {
      throw new PricingError("La retouche photo est limitée à 30 photos max avec la formule Premium.");
    }
    if (typeof input.options.montageExpress === "number" && input.options.montageExpress > 5) {
      throw new PricingError("L'option montage express est limitée à 5 par mois avec la formule Premium.");
    }
    if (input.options.banniere && typeof input.options.banniere === "number" && input.options.banniere > 1) {
      throw new PricingError("L'option bannière est limitée à 1 avec la formule Premium.");
    }
  }

  // Enforce photoRetouche cannot exceed 5 * photoSupp
  const nbPhotosJpg = 5 * (typeof input.options.photoSupp === "number" ? input.options.photoSupp : 0);
  const nbPhotosRetouche = typeof input.options.photoRetouche === "number" ? input.options.photoRetouche : 0;
  if (nbPhotosRetouche > nbPhotosJpg) {
    throw new PricingError("Le nombre de photos retouchées ne peut pas dépasser le nombre de photos JPG commandées.");
  }

  // Monthly price
  let monthlyPrice: number;
  let lineLabel: string;

  if (input.useLaunchPrice) {
    if (input.billingCycle === "ANNUEL") {
      monthlyPrice = plan.launchAnnualMonthly;
      lineLabel = `${plan.label} — Annuel (offre de lancement)`;
      lines.push({ label: lineLabel, total: plan.launchAnnualTotal });
      lines.push({ label: `Économie : ${plan.launchAnnualSaving} € / an`, total: 0 });
    } else {
      monthlyPrice = plan.launchMonthly;
      lineLabel = `${plan.label} — Mensuel (offre de lancement, engagement 3 mois)`;
      lines.push({ label: lineLabel, total: monthlyPrice });
    }
  } else {
    if (input.billingCycle === "ANNUEL") {
      monthlyPrice = plan.stdAnnualMonthly;
      lineLabel = `${plan.label} — Annuel`;
      lines.push({ label: lineLabel, total: plan.stdAnnualTotal });
    } else {
      monthlyPrice = plan.stdMonthly;
      lineLabel = `${plan.label} — Mensuel (engagement 3 mois)`;
      lines.push({ label: lineLabel, total: monthlyPrice });
    }
  }

  // Options à la carte
  const videoCount = plan.videosPerMonth;
  for (const opt of OPTIONS_A_LA_CARTE) {
    const val = input.options[opt.key];
    if (val) {
      let qty = typeof val === "number" ? val : (opt.key === "creationBanniere" ? 1 : videoCount);
      
      // For standard options, cap their quantity to the plan's videos count.
      // For photoSupp, videoSupp, podcast, creationBanniere, photoRetouche, and banniere, don't cap to videoCount.
      if (
        opt.key !== "creationBanniere" &&
        opt.key !== "videoSupp" &&
        opt.key !== "photoSupp" &&
        opt.key !== "podcast" &&
        opt.key !== "photoRetouche" &&
        opt.key !== "banniere"
      ) {
        qty = Math.min(qty, videoCount);
      }
      
      if (qty > 0) {
        let price = opt.price;
        let label = opt.label;

        if (opt.key === "banniere") {
          const banPrice = input.planId === "STANDARD" ? 15 : input.planId === "PRO" ? 20 : 30;
          const banSize = input.planId === "STANDARD" ? "petite" : input.planId === "PRO" ? "moyenne" : "grande";
          price = banPrice;
          label = `Bannière Deepframe ${banSize}`;
          qty = 1; // Always exactly 1 banner for subscription option
        }

        lines.push({
          label,
          qty,
          unit: price,
          total: price * qty,
        });
      }
    }
  }

  const totalHT = lines.reduce((s, l) => s + l.total, 0);
  const acompte = Math.round((totalHT * ACOMPTE_RATE) / 100);
  const solde = totalHT - acompte;

  return { lines, totalHT, acompte, solde };
}

// ─── Formule Bienvenue quote ─────────────────────────────────────

export function computeFormuleBienvenueQuote(): Quote {
  const lines: QuoteLine[] = [
    { label: "2 stories offertes", total: 0 },
    { label: "5 photos offertes", total: 0 },
  ];
  return { lines, totalHT: 0, acompte: 0, solde: 0 };
}

// ─── Legacy backward compat ───────────────────────────────────────

export const LEGACY_PACK_LABELS: Record<string, string> = {
  BASIQUE: "Pack Basique",
  VISIBILITE: "Pack Visibilité",
  VISIBILITE_MIX: "Pack Visibilité Mix",
  PREMIUM: "Pack Premium",
  INTRO_ANIMEE: "Création intro animée",
  SUR_MESURE: "Sur-mesure",
};

export function resolvePackLabel(pack: string): string {
  return LEGACY_PACK_LABELS[pack] ?? pack;
}

// ─── Mentions légales ─────────────────────────────────────────────

export const MENTIONS_LEGALES = [
  "TVA non applicable, art. 293 B du CGI.",
  "Devis valable 30 jours à compter de sa date d'émission.",
  "Un acompte de 30 % est demandé à la validation du devis.",
  "Le tarif inclut deux allers-retours de modifications mineures sur le montage final. Toute modification supplémentaire sera facturée au tarif horaire de 50€/h.",
  "Les fichiers sont livrés après réception du solde. En cas d'annulation après validation, l'acompte reste acquis.",
  "Les droits d'auteur sur les images restent la propriété du chef de projet jusqu'au paiement intégral.",
];
