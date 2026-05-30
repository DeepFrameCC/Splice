/**
 * Scenes data for the homepage SceneSelector signature component.
 * Each scene = one project showcased in the cinematic stage.
 * Order matters: scene 0 is the default focus on page load.
 *
 * Videos and thumbnails are served from Cloudflare R2 (bucket: galerie)
 * via the CDN domain media.splicestudio.fr.
 */

export type SceneRatio = "16/9" | "9/16" | "4/3";
export type SceneType = "video" | "photo";

export interface Scene {
  slug: string;
  tag: string;
  title: string;
  credit: string;
  tc: string;
  ratio: SceneRatio;
  src: string;
  poster: string;
  format: string;
  /** "video" (default) or "photo" — controls playback behaviour in SceneSelector */
  type?: SceneType;
}

const CDN = "https://media.splicestudio.fr";

export const scenes: Scene[] = [
  {
    slug: "luxury-edit",
    tag: "Automobile",
    title: "Luxury Edit",
    credit: "ty",
    tc: "02:00",
    ratio: "16/9",
    src: `${CDN}/videos/${encodeURIComponent("Luxury Edit (Par Tracy).mp4")}`,
    poster: `${CDN}/thumb/thumb-luxury-edit.jpg`,
    format: "4K · 24fps",
  },
  {
    slug: "shooting-porsche-loire",
    tag: "Shooting auto",
    title: "Porsche 911 — Loire Edition",
    credit: "ty",
    tc: "—",
    ratio: "16/9",
    type: "photo",
    src: `${CDN}/photos/porsche-911-loire.jpg`,
    poster: `${CDN}/photos/porsche-911-loire.jpg`,
    format: "Photo · 61 MP",
  },
  {
    slug: "ckcleanauto45-interview",
    tag: "Interview",
    title: "CKCLEANAUTO45",
    credit: "by.louisia",
    tc: "00:50",
    ratio: "4/3",
    src: `${CDN}/videos/${encodeURIComponent("Interview cklean auto.mp4")}`,
    poster: `${CDN}/thumb/thumb-interview-cklean-auto.jpg`,
    format: "4K · 24fps",
  },
  {
    slug: "bijoux-capsule-ete",
    tag: "Produit & lifestyle",
    title: "Bijoux — capsule été",
    credit: "by.louisia",
    tc: "—",
    ratio: "4/3",
    type: "photo",
    src: `${CDN}/photos/bijoux-capsule-ete.jpg`,
    poster: `${CDN}/photos/bijoux-capsule-ete.jpg`,
    format: "Photo · Studio",
  },
  {
    slug: "presentation-louisia",
    tag: "Présentation",
    title: "Présentation - Par Louisia",
    credit: "by.louisia",
    tc: "01:30",
    ratio: "9/16",
    src: `${CDN}/videos/${encodeURIComponent("Présentation (Par Louisia).mp4")}`,
    poster: `${CDN}/thumb/thumb-presentation-louisia.jpg`,
    format: "4K · 24fps",
  },
  {
    slug: "cafe-naya-torrefaction",
    tag: "Brand content",
    title: "Café Naya — torréfaction",
    credit: "by.louisia",
    tc: "—",
    ratio: "16/9",
    type: "photo",
    src: `${CDN}/photos/cafe-naya-torrefaction.jpg`,
    poster: `${CDN}/photos/cafe-naya-torrefaction.jpg`,
    format: "Photo · Reportage",
  },
  {
    slug: "fetes-johanniques-orleans",
    tag: "Événementiel",
    title: "Fêtes Johanniques d'Orléans",
    credit: "ty",
    tc: "03:00",
    ratio: "16/9",
    src: `${CDN}/videos/${encodeURIComponent("Jeanne d'arc .mp4")}`,
    poster: `${CDN}/thumb/thumb-jeanne-darc.jpg`,
    format: "4K · 24fps",
  },
];

