/**
 * Scenes data for the homepage SceneSelector signature component.
 * Each scene = one project showcased in the cinematic stage.
 * Order matters: scene 0 is the default focus on page load.
 *
 * Videos and thumbnails are served from Cloudflare R2 (bucket: galerie)
 * via the CDN domain media.splicestudio.fr.
 */

export type SceneRatio = "16/9" | "9/16" | "4/3";

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
}

const CDN = "https://media.splicestudio.fr";

export const scenes: Scene[] = [
  {
    slug: "bistrot-croix-morin",
    tag: "Pub locale",
    title: "Bistrot de la Croix Morin",
    credit: "ty",
    tc: "00:22",
    ratio: "9/16",
    src: `${CDN}/videos/${encodeURIComponent("Bistrot de la Croix Morin .mp4")}`,
    poster: `${CDN}/thumb/thumb-bistrot-orleans.jpg`,
    format: "4K · 24fps",
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
    slug: "fetes-johanniques-orleans",
    tag: "Événementiel",
    title: "Fêtes Johanniques d'Orléans",
    credit: "ty",
    tc: "03:00",
    ratio: "9/16",
    src: `${CDN}/videos/${encodeURIComponent("Jeanne d'arc .mp4")}`,
    poster: `${CDN}/thumb/thumb-jeanne-darc.jpg`,
    format: "4K · 24fps",
  },
];
