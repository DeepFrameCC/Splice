import NavWrapper from "@/components/layout/NavWrapper";
import EquipeAnimations from "@/components/equipe/EquipeAnimations";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Équipe",
  description:
    "Découvrez les portfolios de Fayad, Louisia et Tracy — les trois fondateurs de DeepFrame.",
};

/* ── SVG icons ────────────────────────────────────────────────────────── */

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2c2.7 0 3 0 4.1.1 1 0 1.7.2 2.3.4.6.2 1.1.5 1.6 1 .5.5.8 1 1 1.6.2.6.4 1.3.4 2.3.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c0 1-.2 1.7-.4 2.3-.2.6-.5 1.1-1 1.6-.5.5-1 .8-1.6 1-.6.2-1.3.4-2.3.4-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-1 0-1.7-.2-2.3-.4-.6-.2-1.1-.5-1.6-1-.5-.5-.8-1-1-1.6-.2-.6-.4-1.3-.4-2.3C2 15 2 14.7 2 12s0-3 .1-4.1c0-1 .2-1.7.4-2.3.2-.6.5-1.1 1-1.6.5-.5 1-.8 1.6-1 .6-.2 1.3-.4 2.3-.4C8.9 2 9.2 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm5.5-3a1.2 1.2 0 1 0 0 2.5 1.2 1.2 0 0 0 0-2.5z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.5 6.5a5.5 5.5 0 0 1-3.5-1.2v9.4a6 6 0 1 1-6-6c.4 0 .7 0 1 .1v3a3 3 0 1 0 2 2.9V2h3a4 4 0 0 0 3.5 3.5v1z" />
    </svg>
  );
}

/* ── Noise texture SVG data URI ──────────────────────────────────────── */

const NOISE_SVG = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .35 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;

/* ── Founders data ───────────────────────────────────────────────────── */

interface FounderTag {
  label: string;
  variant: "primary" | "accent" | "neutral";
}

interface FounderData {
  key: string;
  name: string;
  role: string;
  tag: string;
  initial: string;
  photoGradient: string;
  bioOpener: string;
  bioBody: string;
  tags: FounderTag[];
  setup: string;
  soft: string;
  instagram: string;
  tiktok: string;
  linktree: string;
}

const FOUNDERS: FounderData[] = [
  {
    key: "PAPI",
    name: "Fayad",
    role: "Réalisateur · monteur",
    tag: "FONDATEUR · 01",
    initial: "F",
    photoGradient:
      "radial-gradient(ellipse at 30% 20%, rgba(255,189,89,.45), transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(243,107,31,.55), transparent 65%), linear-gradient(160deg, #3A1B0A 0%, #0E0E22 100%)",
    bioOpener: "Œil de réal, main de monteur.",
    bioBody:
      "Fayad capte la matière brute sur le terrain puis lui donne du rythme : montages After Effects dynamiques, motion intégré, coupes qui claquent. Le tempo des films, c\u2019est lui.",
    tags: [
      { label: "Prise de vue", variant: "primary" },
      { label: "Montage", variant: "primary" },
      { label: "After Effects", variant: "accent" },
      { label: "Direction", variant: "neutral" },
      { label: "Cadrage", variant: "neutral" },
    ],
    setup: "Insta360 · 24-70 GM",
    soft: "Premiere · After Effects",
    instagram: "https://instagram.com/papiforcex",
    tiktok: "https://tiktok.com/@papiforcex",
    linktree: "https://linktr.ee/papiforcex",
  },
  {
    key: "LOUISIA",
    name: "Louisia",
    role: "Photographe · voix-off",
    tag: "FONDATRICE · 02",
    initial: "L",
    photoGradient:
      "radial-gradient(ellipse at 70% 25%, rgba(255,189,89,.50), transparent 55%), radial-gradient(ellipse at 20% 100%, rgba(184,100,50,.45), transparent 65%), linear-gradient(160deg, #F2A93B 0%, #B86432 60%, #3D1F0F 100%)",
    bioOpener: "L\u2019\u0153il et la voix.",
    bioBody:
      "Sony ZV1 en main, Louisia signe des images léchées et retouchées au cordeau. Elle pilote aussi les montages courts façon vitrine de magasin et pose sa voix-off pour donner du nerf à l\u2019ensemble.",
    tags: [
      { label: "Photographie", variant: "primary" },
      { label: "Retouche", variant: "primary" },
      { label: "Voix-off", variant: "accent" },
      { label: "Montage présentation", variant: "neutral" },
      { label: "Direction artistique", variant: "neutral" },
    ],
    setup: "Sony ZV1 · 20mm f/2",
    soft: "Lightroom · CapCut Pro",
    instagram: "https://instagram.com/by.louisia",
    tiktok: "https://tiktok.com/@by.louisia",
    linktree: "https://linktr.ee/by.louisia",
  },
  {
    key: "TY",
    name: "Tracy",
    role: "Monteur · développeur",
    tag: "FONDATEUR · 03",
    initial: "T",
    photoGradient:
      "radial-gradient(ellipse at 30% 30%, rgba(255,189,89,.35), transparent 55%), radial-gradient(ellipse at 80% 90%, rgba(243,107,31,.65), transparent 65%), linear-gradient(180deg, #7A3B1A 0%, #F36B1F 60%, #0E0E22 100%)",
    bioOpener: "Le développeur, et monteur vidéo.",
    bioBody:
      "Tracy maîtrise DaVinci Resolve sur le bout des doigts — étalonnage cinéma, motion design propre, sound design soigné. C\u2019est lui qui transforme un bon montage en montage percutant.",
    tags: [
      { label: "Motion Design", variant: "primary" },
      { label: "Montage", variant: "primary" },
      { label: "DaVinci Resolve", variant: "accent" },
      { label: "Étalonnage", variant: "neutral" },
      { label: "Sound design", variant: "neutral" },
    ],
    setup: "Station Resolve · X-Touch",
    soft: "DaVinci · Fusion",
    instagram: "https://instagram.com/t.y97one",
    tiktok: "https://tiktok.com/@itsty97one1",
    linktree: "https://linktr.ee/itsty97one",
  },
];

/* ── Social icon resolver ────────────────────────────────────────────── */

function LinktreeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M7.95 2.71l3.47 3.47-3.47 3.47 1.41 1.42L12.83 7.6l3.47 3.47 1.42-1.42-3.48-3.47 3.48-3.47L16.3 1.29 12.83 4.76 9.36 1.29zM4.83 10.59l3.47 3.47H2v2h6.3l-3.47 3.47 1.42 1.41L12.83 14.36l6.58 6.58 1.42-1.41-3.48-3.47H24v-2h-6.3l3.48-3.47-1.42-1.42-6.93 6.93zM11.83 17v5h2v-5z" />
    </svg>
  );
}

/* ── Tag variant styles ──────────────────────────────────────────────── */

const TAG_STYLES: Record<FounderTag["variant"], string> = {
  primary:
    "bg-[rgba(243,107,31,0.08)] border-[rgba(243,107,31,0.20)] text-df-blue font-semibold",
  accent:
    "bg-[rgba(243,107,31,0.15)] border-[rgba(243,107,31,0.40)] text-df-gold font-semibold",
  neutral:
    "bg-[#1A1A2E] border-[rgba(255,255,255,0.08)] text-white font-medium",
};

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function EquipePage() {
  return (
    <>
      <NavWrapper />
      <EquipeAnimations />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        data-anim="hero"
        className="mx-auto grid max-w-[1320px] items-end gap-8 px-6 pb-10 pt-20 md:px-10 lg:grid-cols-[1fr_auto]"
        style={{ paddingTop: "calc(80px + 5rem)" }}
      >
        <div>
          <span
            className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-df-blue"
            data-anim="eyebrow"
          >
            <span className="inline-block h-px w-[22px] bg-current" />
            L&apos;équipe · 3 fondateurs
          </span>
          <h1
            data-anim="hero-title"
            className="mt-4 text-white"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(56px, 8vw, 120px)",
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
            }}
          >
            Trois <em className="italic font-extrabold text-df-gold">artisans</em>
            <br />
            de l&apos;image.
          </h1>
        </div>
        <div
          data-anim="hero-meta"
          className="text-right lg:text-right"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "11px",
            letterSpacing: "0.14em",
            color: "rgba(255,255,255,.5)",
            lineHeight: 1.7,
          }}
        >
          <b className="block text-[13px] text-df-blue">Studio · Orléans · Tours</b>
          Réalisation · Photo · Vidéo · Montage Vidéo · Retouche Photo
          <br />
          Depuis 2026
        </div>
      </section>

      {/* ── Team Grid ────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-[1320px] px-6 pb-20 pt-12 md:px-10">
        <div className="grid gap-[18px] lg:grid-cols-3">
          {FOUNDERS.map((founder) => (
            <article
              key={founder.key}
              data-anim="member"
              className="flex flex-col overflow-hidden rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-df-surface transition-[transform,box-shadow] duration-[350ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:-translate-y-1 hover:shadow-[0_32px_60px_-28px_rgba(10,10,35,0.22)]"
            >
              {/* Photo area */}
              <div
                className="relative isolate overflow-hidden"
                style={{ aspectRatio: "4/5", background: founder.photoGradient }}
              >
                {/* Noise overlay */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage: NOISE_SVG,
                    mixBlendMode: "overlay",
                    opacity: 0.25,
                  }}
                />

                {/* Giant initial */}
                <div
                  className="absolute inset-0 grid select-none place-items-center"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "220px",
                    letterSpacing: "-0.05em",
                    color: "rgba(255,255,255,.18)",
                    mixBlendMode: "overlay",
                  }}
                >
                  {founder.initial}
                </div>

                {/* Corner brackets */}
                <div aria-hidden="true">
                  <i className="absolute left-3.5 top-3.5 h-3.5 w-3.5 border-l border-t border-white/50" />
                  <i className="absolute right-3.5 top-3.5 h-3.5 w-3.5 border-r border-t border-white/50" />
                  <i className="absolute bottom-3.5 left-3.5 h-3.5 w-3.5 border-b border-l border-white/50" />
                  <i className="absolute bottom-3.5 right-3.5 h-3.5 w-3.5 border-b border-r border-white/50" />
                </div>

                {/* Founder tag */}
                <h2
                  className="absolute left-3.5 top-3.5 z-[2] rounded border border-white/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-lg backdrop-blur-md"
                  style={{
                    fontFamily: "var(--font-sans)",
                    background: "rgba(0,0,0,.65)",
                  }}
                >
                  {founder.tag}
                </h2>

                {/* Bottom role + name overlay */}
                <div className="absolute inset-x-0 bottom-0 z-[1] px-[22px] pb-[18px] pt-[30px] text-white" style={{ background: "linear-gradient(0deg, rgba(0,0,0,.78), transparent)" }}>
                  <span
                    className="text-[10.5px] uppercase tracking-[0.14em] text-df-gold"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {founder.role}
                  </span>
                  <b
                    className="block text-[26px] font-extrabold"
                    style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
                  >
                    {founder.name}
                  </b>
                </div>
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col gap-[18px] p-[26px] pb-6">
                {/* Bio */}
                <p className="m-0 text-[14.5px] leading-[1.55] text-white/70" style={{ textWrap: "pretty" }}>
                  <em className="not-italic font-semibold text-white">{founder.bioOpener}</em>{" "}
                  {founder.bioBody}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {founder.tags.map((tag) => (
                    <h2
                      key={tag.label}
                      className={`rounded-full border px-3 py-1.5 text-xs tracking-[0.01em] shadow-sm ${TAG_STYLES[tag.variant]}`}
                    >
                      {tag.label}
                    </h2>
                  ))}
                </div>

                {/* Toolkit */}
                <div className="flex flex-wrap gap-x-[22px] gap-y-3.5 border-y border-[rgba(255,255,255,0.08)] py-3.5">
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50"
                    >
                      Setup
                    </span>
                    <b className="text-[13px] font-semibold text-white">{founder.setup}</b>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50"
                    >
                      Soft
                    </span>
                    <b className="text-[13px] font-semibold text-white">{founder.soft}</b>
                  </div>
                </div>

                {/* Social buttons */}
                <div className="mt-auto flex gap-2">
                  <a
                    href={founder.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Instagram ${founder.name}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[#1A1A2E] px-3 py-[11px] text-xs font-semibold text-white transition-colors duration-200 hover:border-df-ink hover:bg-white/10 hover:text-white"
                  >
                    <InstagramIcon className="h-3.5 w-3.5" />
                    Instagram
                  </a>
                  <a
                    href={founder.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`TikTok ${founder.name}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[#1A1A2E] px-3 py-[11px] text-xs font-semibold text-white transition-colors duration-200 hover:border-df-ink hover:bg-white/10 hover:text-white"
                  >
                    <TikTokIcon className="h-3.5 w-3.5" />
                    TikTok
                  </a>
                  <a
                    href={founder.linktree}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Linktree ${founder.name}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[#1A1A2E] px-3 py-[11px] text-xs font-semibold text-white transition-colors duration-200 hover:border-df-ink hover:bg-white/10 hover:text-white"
                  >
                    <LinktreeIcon className="h-3.5 w-3.5" />
                    Linktree
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* ── CTA Band ─────────────────────────────────────────────────── */}
      <section
        data-anim="band"
        className="mt-10 bg-df-ink px-6 py-14 text-white md:px-10"
      >
        <div className="mx-auto grid max-w-[1320px] items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2
              className="m-0 text-white"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(28px, 3.4vw, 44px)",
                letterSpacing: "-0.02em",
              }}
            >
              Une idée, un brief, une <em className="italic font-extrabold text-df-gold">envie</em>&nbsp;?
            </h2>
            <p className="mt-2.5 text-[15px] leading-[1.55] text-white/65">
              On répond en moins de 24&nbsp;h. Pré-devis gratuit, sans engagement.
            </p>
          </div>
          <div className="flex justify-start lg:justify-end">
            <Link
              href="/devis"
              className="inline-flex items-center gap-2 rounded-full bg-df-gold px-5 py-2.5 text-[12.5px] font-bold text-[#1A1408] shadow-[0_8px_22px_-8px_rgba(255,189,89,0.7)] transition hover:scale-105 hover:shadow-lg active:scale-95"
            >
              Demander un devis →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
