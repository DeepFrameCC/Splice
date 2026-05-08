import { Pack, DureeTournage, UsageType, DelaiLivraison, VilleDepart, Founder } from "@prisma/client";

export type PackInfo = { code: Pack; label: string; price: number; videos: number; description: string };

export const PACKS: Record<Pack, PackInfo> = {
  BASIQUE:        { code: "BASIQUE",        label: "Pack Basique",        price: 140, videos: 1, description: "1 vidéo courte + 5 photos" },
  VISIBILITE:     { code: "VISIBILITE",     label: "Pack Visibilité",     price: 340, videos: 4, description: "4 réels (économie pack -20€)" },
  VISIBILITE_MIX: { code: "VISIBILITE_MIX", label: "Pack Visibilité Mix", price: 460, videos: 4, description: "4 réels + 10 photos (économie pack -40€)" },
  PREMIUM:        { code: "PREMIUM",        label: "Pack Premium",        price: 850, videos: 8, description: "8 vidéos courtes + 20 photos" },
  INTRO_ANIMEE:   { code: "INTRO_ANIMEE",   label: "Création intro animée", price: 250, videos: 1, description: "5 à 20s — devis sur mesure 100-400€" },
  SUR_MESURE:     { code: "SUR_MESURE",     label: "Sur-mesure",          price: 0,   videos: 0, description: "Sur demande" }
};

export const DUREE_SUPPLEMENT: Record<DureeTournage, { label: string; price: number }> = {
  DEMI_JOURNEE:   { label: "4h (demi-journée)", price: 0 },
  JOURNEE:        { label: "Journée entière",   price: 60 },
  DEUX_JOURNEES:  { label: "2 journées entières", price: 120 }
};

export const USAGE_PRICE_PER_VIDEO: Record<UsageType, { label: string; perVideo: number }> = {
  ORGANIQUE:   { label: "Réseaux sociaux organique", perVideo: 0 },
  ADS_SOCIAL:  { label: "Ads Réseaux Sociaux (Insta/TikTok/FB)", perVideo: 60 },
  ADS_GOOGLE:  { label: "Google Ads / YouTube Ads", perVideo: 80 }
};

export const DELAI: Record<DelaiLivraison, { label: string; price: number }> = {
  STANDARD:    { label: "Standard (7 à 10 jours ouvrés)", price: 0 },
  ETENDU:      { label: "Jusqu'à 15 jours ouvrés (4 à 8 vidéos)", price: 0 },
  EXPRESS_48H: { label: "Express 48h", price: 50 }
};

export const PRIX_KM = 0.5;
export const ACOMPTE_RATE = 30;

export const VILLE_DEPART_LABEL: Record<VilleDepart, string> = { TOURS: "Tours", ORLEANS: "Orléans" };

export const FOUNDER_LABEL: Record<Founder, string> = {
  PAPI:    "@papiforcex",
  LOUISIA: "@by.louisia",
  TY:      "@t.y97one"
};

export type QuoteInput = {
  pack: Pack;
  duree: DureeTournage;
  usage: UsageType;
  delai: DelaiLivraison;
  villeDepart: VilleDepart;
  distanceKm: number;
  videosSupp: number;
  videos3D: number;
  motionDesign: boolean;
  montageExpress: boolean;
  introAnimeeSec?: number | null;
};

export type QuoteLine = { label: string; qty?: number; unit?: number; total: number };
export type Quote = { lines: QuoteLine[]; totalHT: number; acompte: number; solde: number };

export class PricingError extends Error {}

export function validateQuote(input: QuoteInput) {
  if (input.montageExpress && (input.pack === "PREMIUM" || input.videos3D > 0)) {
    throw new PricingError("Le montage express 48h n'est pas cumulable avec le Pack Premium ou les options 3D.");
  }
  if (input.distanceKm < 0) throw new PricingError("Distance invalide.");
  if (input.videosSupp < 0 || input.videos3D < 0) throw new PricingError("Quantités invalides.");
}

export function computeQuote(input: QuoteInput): Quote {
  validateQuote(input);

  const lines: QuoteLine[] = [];
  const pack = PACKS[input.pack];
  lines.push({ label: pack.label + " — " + pack.description, total: pack.price });

  const duree = DUREE_SUPPLEMENT[input.duree];
  if (duree.price > 0) lines.push({ label: "Durée : " + duree.label, total: duree.price });

  if (input.distanceKm > 0) {
    const km = Math.round(input.distanceKm);
    const kmTotal = Math.round(km * PRIX_KM);
    lines.push({ label: `Frais de déplacement (${km} km A/R depuis ${VILLE_DEPART_LABEL[input.villeDepart]})`, qty: km, unit: PRIX_KM, total: kmTotal });
  }

  const totalVideosForUsage = pack.videos + input.videosSupp + input.videos3D;
  const usage = USAGE_PRICE_PER_VIDEO[input.usage];
  if (usage.perVideo > 0 && totalVideosForUsage > 0) {
    lines.push({ label: `Usage : ${usage.label}`, qty: totalVideosForUsage, unit: usage.perVideo, total: usage.perVideo * totalVideosForUsage });
  }

  if (input.videosSupp > 0)   lines.push({ label: "Vidéo supplémentaire", qty: input.videosSupp, unit: 90,  total: 90  * input.videosSupp });
  if (input.videos3D > 0)     lines.push({ label: "Option 3D",            qty: input.videos3D,   unit: 110, total: 110 * input.videos3D });
  if (input.motionDesign)     lines.push({ label: "Motion Design",        total: 40 });
  if (input.montageExpress)   lines.push({ label: "Montage express (48h)", total: 55 });

  const delai = DELAI[input.delai];
  if (delai.price > 0) lines.push({ label: "Délai : " + delai.label, total: delai.price });

  if (input.pack === "INTRO_ANIMEE" && input.introAnimeeSec) {
    lines.push({ label: `Durée intro : ${input.introAnimeeSec}s`, total: 0 });
  }

  const totalHT = lines.reduce((s, l) => s + l.total, 0);
  const acompte = Math.round((totalHT * ACOMPTE_RATE) / 100);
  const solde = totalHT - acompte;

  return { lines, totalHT, acompte, solde };
}

export const MENTIONS_LEGALES = [
  "TVA non applicable, art. 293 B du CGI.",
  "Devis valable 30 jours à compter de sa date d'émission.",
  "Un acompte de 30 % est demandé à la validation du devis.",
  "Le tarif inclut deux allers-retours de modifications mineures sur le montage final. Toute modification supplémentaire sera facturée au tarif horaire de 50€/h.",
  "Les fichiers sont livrés après réception du solde. En cas d'annulation après validation, l'acompte reste acquis.",
  "Les droits d'auteur sur les images restent la propriété du chef de projet jusqu'au paiement intégral."
];
