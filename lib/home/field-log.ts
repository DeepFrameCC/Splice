/**
 * Field Log data for the homepage proof section.
 * Format: production log (dates, clients, prestations) + one pivot quote.
 * Replaces the SaaS-style 3-card testimonials.
 */

export interface FieldLogEntry {
  date: string;
  client: string;
  type: string;
  location: string;
}

export interface FieldLogQuote {
  excerpt: string;
  highlight: string;
  author: string;
  org: string;
  location: string;
}

export interface FieldLogStat {
  value: string;
  label: string;
}

export const fieldLogEntries: FieldLogEntry[] = [
  { date: "2026-04", client: "CKCleanAuto45", type: "Pub automobile", location: "Saran" },
  { date: "2026-03", client: "Bistrot Croix Morin", type: "Pub locale", location: "Orléans" },
  { date: "2026-02", client: "Pixel 404", type: "Film de marque", location: "Orléans" },
  { date: "2026-01", client: "Alpine A110", type: "Pub automobile", location: "Loiret" },
  { date: "2025-12", client: "Fayad (Time)", type: "Clip musical", location: "Tours" },
];

export const fieldLogQuote: FieldLogQuote = {
  excerpt:
    "Un rendu pro, livré rapidement. Ils ont su capter l'univers de notre marque dès la première session.",
  highlight: "capter l'univers de notre marque",
  author: "Clément",
  org: "Pixel 404",
  location: "Orléans",
};

export const fieldLogStats: FieldLogStat[] = [
  { value: "30+", label: "projets" },
  { value: "4K", label: "rendu" },
  { value: "48h", label: "express" },
  { value: "0,50€/km", label: "déplacement" },
];
