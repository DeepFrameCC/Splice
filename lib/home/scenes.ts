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
    slug: "alpine-a110-lignes-bleues",
    tag: "Pub automobile",
    title: "Alpine A110 - Lignes Bleues",
    credit: "papi",
    tc: "00:33",
    ratio: "9/16",
    src: `${CDN}/videos/AlpineA110.mp4`,
    poster: `${CDN}/videos/thumb-AlpineA110.jpg`,
    format: "4K · 24fps",
  },
  {
    slug: "porsche-911-ppf",
    tag: "Pub automobile",
    title: "Porsche 911 - Pose PPF",
    credit: "papi",
    tc: "00:36",
    ratio: "16/9",
    src: `${CDN}/videos/${encodeURIComponent("Le saviez-vous Le PPF (Paint Protection Film).mp4")}`,
    poster: `${CDN}/videos/thumb-ppf-cklean-auto.jpg`,
    format: "4K · 24fps",
  },
  {
    slug: "west-side-vibe-urbaine",
    tag: "Clip",
    title: "West Side - Vibe Urbaine",
    credit: "ty",
    tc: "00:31",
    ratio: "9/16",
    src: `${CDN}/videos/${encodeURIComponent("West Side.mp4")}`,
    poster: `${CDN}/videos/thumb-West-Side.jpg`,
    format: "4K · 30fps",
  },
  {
    slug: "bistrot-croix-morin",
    tag: "Pub locale",
    title: "Bistrot de la Croix Morin",
    credit: "ty",
    tc: "00:22",
    ratio: "9/16",
    src: `${CDN}/videos/${encodeURIComponent("Bistrot de la Croix Morin .mp4")}`,
    poster: `${CDN}/videos/thumb-bistrot-orleans.jpg`,
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
    poster: `${CDN}/videos/thumb-interview-cklean-auto.jpg`,
    format: "4K · 24fps",
  },
  {
    slug: "time-fayad",
    tag: "Clip",
    title: "Time - Par Fayad",
    credit: "papi",
    tc: "00:23",
    ratio: "9/16",
    src: `${CDN}/videos/${encodeURIComponent("Time (Par Fayad).mp4")}`,
    poster: `${CDN}/videos/thumb-time-fayad.jpg`,
    format: "4K · 30fps",
  },
];
