"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Video,
  Camera,
  CalendarDays,
  MapPin,
  ExternalLink,
  Cpu,
  Wrench,
  Flame,
  Gamepad2,
  Clock,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  Instagram,
  Facebook
} from "lucide-react";

const PIXEL_404 = {
  name: "Pixel 404",
  url: "https://www.pixel404.fr/",
  description:
    "Magasin informatique et gaming à Orléans : réparation consoles & PC, montage de PC sur mesure et cartes Pokémon TCG.",
  address: "84 Boulevard Alexandre Martin, 45000 Orléans",
  phone: "02 38 68 12 34",
  email: "contact@pixel404.fr",
  hours: [
    { day: "Lundi", time: "14:00 – 19:00" },
    { day: "Mardi au Vendredi", time: "10:00 – 19:00" },
    { day: "Samedi", time: "10:00 – 18:00" },
    { day: "Dimanche", time: "Fermé" }
  ],
  socials: [
    { label: "Instagram", url: "https://www.instagram.com/pixel404fr", icon: Instagram },
    { label: "Facebook", url: "https://www.facebook.com/pixel404fr", icon: Facebook },
    { label: "TikTok", url: "https://www.tiktok.com/@pixel404fr" }
  ]
};

const PILLARS = [
  {
    id: "pc",
    icon: Cpu,
    title: "PC Gaming sur-mesure",
    tagline: "Monté à la main, testé sous charge",
    desc: "Du petit setup streaming au watercooling custom, l'équipe assemble chaque machine à la main. Composants choisis avec vous, câble management soigné, tests de stabilité sous charge avant que la tour quitte l'atelier.",
    features: ["Composants choisis avec vous", "Câble management soigné", "Tests de stabilité sous charge", "Garantie matériel et suivi technique"]
  },
  {
    id: "rep",
    icon: Wrench,
    title: "Réparation consoles & PC",
    tagline: "Diagnostic précis, micro-soudure",
    desc: "L'équipe répare consoles (PS5, Xbox Series, Switch) et PC, y compris les pannes lourdes : port HDMI arraché, puce d'alimentation à remplacer, Joy-Con drift, oxydation.",
    features: ["Remplacement de port HDMI", "Nettoyage interne & métal liquide", "Réparation manettes PS4, PS5, Switch et Xbox"]
  },
  {
    id: "tcg",
    icon: Flame,
    title: "Pokémon & Pop Culture",
    tagline: "Cartes scellées, gradées, japonaises",
    desc: "Displays scellés, boosters, cartes gradées et accessoires de protection : sleeves, binders, classeurs rigides. Cartes Pokémon officielles, françaises et japonaises, et soirées d'ouverture entre joueurs.",
    features: ["Boosters & Displays Pokémon officiels", "Cartes TCG japonaises et françaises", "Accessoires Ultimate Guard & Ultra Pro", "Soirées d'échange et d'ouverture"]
  },
  {
    id: "room",
    icon: Gamepad2,
    title: "Gaming Room & Tests",
    tagline: "Essayez avant d'acheter",
    desc: "Testez les configs en conditions réelles avant d'acheter : claviers mécaniques, souris légères, casques, écrans haute fréquence. Vous comparez le matériel en main, vous tranchez.",
    features: ["Écrans 360Hz et dalles OLED", "Périphériques en test libre", "Essais sur les derniers jeux compétitifs", "Conseils ergonomiques en direct"]
  }
];

const COLLAB = [
  {
    icon: Video,
    title: "Contenu social & reels",
    desc: "On filme des vidéos verticales pour TikTok et Instagram : ASMR de montage PC, formats courts qui montrent le travail de l'atelier."
  },
  {
    icon: Camera,
    title: "Photo boutique & packshots",
    desc: "On photographie la boutique d'Orléans pour la fiche Google Business, et on shoote les configs assemblées en packshot pour la vitrine en ligne."
  },
  {
    icon: CalendarDays,
    title: "Aftermovies & captation d'événements",
    desc: "Unboxing de cartes Pokémon avec des créateurs, captation aux côtés de streamers, aftermovies des temps forts de la communauté pop culture d'Orléans."
  }
];

export default function Pixel404Interactive() {
  const [activePillar, setActivePillar] = useState("pc");
  const [pokemonCardFlipped, setPokemonCardFlipped] = useState(false);

  return (
    <>
      {/* Cyber Hero Banner */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-[#9500de]/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-[#F36B1F]/10 blur-[120px] pointer-events-none" />

        {/* Cyber grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: "24px 24px"
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center text-center">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#9500de]/40 bg-[#9500de]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#b969ff] shadow-[0_0_15px_rgba(149,0,222,0.15)] mb-6">
              <Sparkles className="h-3.5 w-3.5" /> Collaboration média officielle · Orléans
            </div>

            {/* H1 Title : chaque marque garde sa couleur pleine (Pixel blanc, Splice orange) */}
            <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-6xl md:text-8xl leading-none">
              <span className="text-[#F4F4F5]">Pixel 404</span>
              <span className="mx-3 font-light text-white/40">×</span>
              <span className="text-[#F36B1F]">Splice Studio</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-white/60 leading-relaxed">
              Pixel 404 assemble des PC sur-mesure, répare consoles et manettes, et vend les cartes Pokémon à Orléans. Splice Studio réalise leurs vidéos et leurs photos.
            </p>

            {/* Actions */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
              <a
                href="#pillars"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#9500de] hover:bg-[#a61cf2] px-8 py-4 font-bold text-white transition hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(149,0,222,0.3)]"
              >
                Explorer la boutique
              </a>
              <a
                href={PIXEL_404.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 px-8 py-4 font-bold text-white transition hover:scale-105 active:scale-95"
              >
                Visiter pixel404.fr <ExternalLink className="h-4 w-4 text-white/60" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Boutique Identity Card & Hours */}
      <section className="relative py-12 border-t border-white/[0.04] bg-gradient-to-b from-[#08080C] to-[#0D0D14]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-12 items-stretch">

            {/* Identity Card */}
            <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-white/[0.06] bg-[#111119]/80 p-8 backdrop-blur-md relative overflow-hidden group hover:border-[#9500de]/20 transition-all duration-300">
              <div className="absolute top-0 right-0 h-32 w-32 bg-[#9500de]/5 rounded-bl-full pointer-events-none transition-all duration-300 group-hover:bg-[#9500de]/10" />
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white mb-2">L&apos;adresse informatique et gaming d&apos;Orléans</h2>
                <p className="text-sm text-white/50 leading-relaxed mb-6">
                  Sur les boulevards d&apos;Orléans, Pixel 404 répare, assemble et vend tech gaming et cartes Pokémon. Joueurs du dimanche comme collectionneurs y trouvent leur compte.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] text-[#9500de]">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold text-white/55">Adresse boutique</p>
                      <a
                        href="https://maps.google.com/?q=84+Boulevard+Alexandre+Martin+45000+Orleans"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white hover:text-[#b969ff] transition-colors inline-flex items-center gap-1 mt-0.5"
                      >
                        {PIXEL_404.address} <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] text-[#9500de]">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold text-white/55">Contact direct</p>
                      <p className="text-sm text-white mt-0.5">{PIXEL_404.phone} <span className="text-white/20 mx-2">|</span> {PIXEL_404.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="mt-8 pt-6 border-t border-white/[0.05] flex flex-wrap gap-4 items-center">
                <span className="text-xs uppercase tracking-wider font-bold text-white/55">Suivre l&apos;atelier :</span>
                <div className="flex gap-3">
                  {PIXEL_404.socials.map((s) => {
                    const Icon = s.icon;
                    return Icon ? (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white/[0.03] hover:bg-[#9500de]/20 hover:text-white px-4 text-xs font-semibold text-white/60 transition-all border border-white/[0.05]"
                      >
                        <Icon className="h-3.5 w-3.5" /> {s.label}
                      </a>
                    ) : (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center rounded-full bg-white/[0.03] hover:bg-[#9500de]/20 hover:text-white px-4 text-xs font-semibold text-white/60 transition-all border border-white/[0.05]"
                      >
                        {s.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Hours Panel */}
            <div className="lg:col-span-5 rounded-3xl border border-white/[0.06] bg-[#111119]/80 p-8 backdrop-blur-md relative overflow-hidden group hover:border-[#F36B1F]/20 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="h-5 w-5 text-[#F36B1F]" />
                  <h3 className="text-lg font-bold text-white">Horaires d&apos;ouverture</h3>
                </div>

                <div className="divide-y divide-white/[0.04]">
                  {PIXEL_404.hours.map((h) => (
                    <div key={h.day} className="flex justify-between py-3 text-sm">
                      <span className="font-medium text-white/60">{h.day}</span>
                      <span className={`font-semibold ${h.time === "Fermé" ? "text-red-500" : "text-white"}`}>
                        {h.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-[#F36B1F]/5 border border-[#F36B1F]/15 p-4 text-center">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse mr-2" />
                <span className="text-xs font-bold text-[#f9a06a] uppercase tracking-wider">Atelier technique disponible en boutique</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pillars of Activity Section */}
      <section id="pillars" className="relative py-24 bg-[#08080C]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold sm:text-5xl tracking-tight">Leurs Spécialités</h2>
            <p className="mt-4 text-white/50 max-w-xl mx-auto text-sm sm:text-base">
              Quatre métiers sous le même toit, chacun tenu par des gens qui le pratiquent au quotidien.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Pillar Selector Buttons */}
            <div className="lg:col-span-4 space-y-3">
              {PILLARS.map((p) => {
                const Icon = p.icon;
                const isActive = activePillar === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePillar(p.id)}
                    className={`w-full flex items-center gap-4 rounded-2xl p-4 text-left border transition-all duration-300 ${isActive
                      ? "bg-[#9500de]/10 border-[#9500de]/50 text-white shadow-[0_0_20px_rgba(149,0,222,0.1)]"
                      : "bg-white/[0.01] border-white/[0.04] text-white/60 hover:bg-white/[0.03] hover:text-white"
                      }`}
                  >
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all ${isActive ? "bg-[#9500de] text-white" : "bg-white/[0.03] text-white/40"
                      }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base">{p.title}</h3>
                      <p className="text-xs opacity-60 mt-0.5">{p.tagline}</p>
                    </div>
                    <ChevronRight className={`ml-auto h-4 w-4 transition-transform duration-300 ${isActive ? "translate-x-1 text-[#b969ff]" : "text-white/20"
                      }`} />
                  </button>
                );
              })}
            </div>

            {/* Pillar Details Panel */}
            <div className="lg:col-span-8 rounded-3xl border border-white/[0.08] bg-[#12121B] p-8 relative overflow-hidden min-h-[360px] flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#9500de] to-[#F36B1F]" />

              {PILLARS.map((p) => {
                if (p.id !== activePillar) return null;
                const Icon = p.icon;
                return (
                  <div key={p.id} className="animate-fade-up">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className="h-6 w-6 text-[#b969ff]" />
                      <span className="text-xs uppercase tracking-widest font-extrabold text-[#b969ff]">{p.tagline}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">{p.title}</h3>
                    <p className="text-sm sm:text-base leading-relaxed text-white/70 mb-8">{p.desc}</p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {p.features.map((f, index) => (
                        <div key={index} className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#b969ff] mt-0.5" />
                          <span className="text-sm text-white/80 font-medium">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Pokémon Custom Card Interactive Module */}
      <section className="relative py-20 border-t border-white/[0.04] bg-gradient-to-b from-[#08080C] to-[#0D0D15]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 items-center">

            {/* Left Description Column */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F36B1F]/10 border border-[#F36B1F]/20 px-3.5 py-1 text-xs font-bold text-[#f9a06a] uppercase tracking-wider mb-4">
                <Sparkles className="h-3.5 w-3.5" /> Easter Egg Interactif
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">La Carte Collector : Splice Studio × Pixel 404</h2>
              <p className="mt-6 text-sm sm:text-base text-white/60 leading-relaxed">
                Pixel 404 connaît les cartes Pokémon, on réalise leurs contenus : voici la nôtre, une carte collector du duo. Retournez-la pour voir ses stats.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#9500de]/20 flex items-center justify-center text-[#b969ff] font-bold text-xs shrink-0 mt-0.5">1</div>
                  <p className="text-sm text-white/80">
                    <strong className="text-white">Cliquez sur la carte</strong> pour la retourner et voir ses statistiques.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#9500de]/20 flex items-center justify-center text-[#b969ff] font-bold text-xs shrink-0 mt-0.5">2</div>
                  <p className="text-sm text-white/80">
                    Un clin d&apos;œil aux cartes Holo rares, avec ses dégradés irisés.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Card Column */}
            <div className="lg:col-span-5 flex justify-center">
              {/* Pokémon Card Container */}
              <div
                role="button"
                tabIndex={0}
                aria-pressed={pokemonCardFlipped}
                aria-label="Carte collector Splice Studio × Pixel 404 : appuyez pour la retourner"
                className="w-[320px] h-[450px] relative cursor-pointer select-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#b969ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080C]"
                style={{ perspective: "1000px" }}
                onClick={() => setPokemonCardFlipped(!pokemonCardFlipped)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setPokemonCardFlipped((f) => !f);
                  }
                }}
              >
                {/* Inner Flip Box */}
                <div
                  className="w-full h-full relative transition-transform duration-700 ease-in-out motion-reduce:transition-none"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: pokemonCardFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                  }}
                >

                  {/* CARD FRONT */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl p-4 flex flex-col justify-between border-4 border-[#e4a817] bg-gradient-to-br from-[#1b0a2f] via-[#0b0c16] to-[#250d18] shadow-[0_0_30px_rgba(149,0,222,0.3)]"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs uppercase tracking-wider font-extrabold text-[#e4a817]">Pokémon Basique</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#e4a817]">PV 404</span>
                        <div className="h-5 w-5 rounded-full bg-[#9500de] border border-[#e4a817] flex items-center justify-center font-extrabold text-[10px] text-white">⚙️</div>
                      </div>
                    </div>

                    {/* Card Title */}
                    <div className="text-center my-2">
                      <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Splice × Pixel 404</h3>
                      <p className="text-[9px] uppercase tracking-widest text-[#b969ff] font-bold mt-0.5">Duo de Production & Tech</p>
                    </div>

                    {/* Illustration Area */}
                    <div className="relative flex-1 rounded-lg overflow-hidden border-2 border-[#e4a817] bg-[#0c0d16] flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#9500de]/20 via-transparent to-[#F36B1F]/20 pointer-events-none" />

                      {/* Stylized Abstract Graphics replacing images */}
                      <div className="text-center p-4">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#9500de] to-[#F36B1F] text-white shadow-[0_0_15px_rgba(243,107,31,0.4)] mb-3">
                          <Cpu className="h-8 w-8" />
                        </div>
                        <p className="text-xs font-extrabold text-white tracking-widest uppercase">Édition Spéciale</p>
                        <p className="text-[10px] text-white/50 mt-1">Orléans Pop Culture</p>
                      </div>
                    </div>

                    {/* Card Stats/Properties */}
                    <div className="my-2 py-1 px-2 rounded bg-white/[0.03] border border-white/5 text-center text-[10px] text-white/70">
                      N° 404 · Pokémon Tech · Taille : 84m · Poids : 45kg
                    </div>

                    {/* Attacks / Abilities */}
                    <div className="space-y-3 flex-1 flex flex-col justify-center">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-bold text-[#e4a817] mt-0.5">⚡</span>
                        <div className="text-left">
                          <h4 className="text-[11px] font-extrabold text-white">Micro-Soudure Cinématique</h4>
                          <p className="text-[9px] text-white/60">Répare les manettes PS5. Inflige +80 d&apos;impact visuel.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-bold text-[#e4a817] mt-0.5">🔥</span>
                        <div className="text-left">
                          <h4 className="text-[11px] font-extrabold text-white">Hype Pokémon Boost</h4>
                          <p className="text-[9px] text-white/60">Ouvre un display légendaire sous l&apos;œil des caméras. La popularité du site augmente de 150%.</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer / Copyright details */}
                    <div className="pt-2 border-t border-[#e4a817]/30 flex justify-between text-[8px] text-white/40">
                      <span>Faiblesse : Bugs ✕2</span>
                      <span>Résistance : Anti-lenteur -30</span>
                      <span>©2026 Splice Studio × Pixel 404</span>
                    </div>

                  </div>

                  {/* CARD BACK */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between border-4 border-[#3b5998] bg-[#1a2b4c] shadow-[0_0_30px_rgba(243,107,31,0.25)]"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)"
                    }}
                  >
                    <div className="absolute inset-2 border-2 border-dashed border-[#e4a817]/30 rounded-xl pointer-events-none" />

                    {/* Retro gaming style layout on back */}
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="h-24 w-24 rounded-full bg-gradient-to-r from-[#9500de] to-[#F36B1F] p-1 shadow-[0_0_20px_rgba(149,0,222,0.4)] mb-4">
                        <div className="h-full w-full rounded-full bg-[#0d1626] flex items-center justify-center">
                          <Sparkles className="h-10 w-10 text-[#e4a817]" />
                        </div>
                      </div>

                      <h4 className="text-lg font-bold text-white tracking-wide">STATISTIQUES DE COLLAB</h4>
                      <div className="mt-4 w-full space-y-2.5 px-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/60">Créativité média</span>
                          <span className="text-[#e4a817] font-bold">99/99</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-[#9500de] to-[#F36B1F] h-full w-[99%]" />
                        </div>

                        <div className="flex justify-between text-xs">
                          <span className="text-white/60">Rigueur technique</span>
                          <span className="text-[#e4a817] font-bold">100/100</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-[#9500de] to-[#F36B1F] h-full w-full" />
                        </div>

                        <div className="flex justify-between text-xs">
                          <span className="text-white/60">Synergie locale</span>
                          <span className="text-[#e4a817] font-bold">Max</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-[#9500de] to-[#F36B1F] h-full w-full" />
                        </div>
                      </div>

                      <p className="text-[10px] text-white/50 mt-8 italic">
                        Cliquez de nouveau pour retourner la carte
                      </p>
                    </div>

                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Collaboration Details "Dans l'œil de Splice" */}
      <section className="relative py-24 bg-[#08080C] border-t border-white/[0.04]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold sm:text-5xl tracking-tight">Dans l&apos;œil de Splice</h2>
            <p className="mt-4 text-white/50 max-w-2xl mx-auto text-sm sm:text-base">
              Ce que Splice Studio produit pour Pixel 404 : vidéos, photos et formats sociaux, du tournage en boutique au montage.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {COLLAB.map((c, idx) => {
              const Icon = c.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-white/[0.06] bg-[#111119]/60 p-8 hover:border-[#9500de]/20 transition-all duration-300 relative group flex flex-col justify-between overflow-hidden"
                >
                  <div className="absolute top-0 right-0 h-1 bg-gradient-to-r from-[#9500de]/40 to-[#F36B1F]/40 w-0 group-hover:w-full transition-all duration-500" />
                  <div>
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#9500de]/10 text-[#b969ff] border border-[#9500de]/20">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{c.title}</h3>
                    <p className="text-sm leading-relaxed text-white/60">{c.desc}</p>
                  </div>

                  <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-[#b969ff] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Savoir-faire Splice Studio <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partners Common Mission Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#08080C] to-[#12121A] border-t border-white/[0.04]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03] text-[#F36B1F] mb-6 border border-white/5">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-6">Pourquoi cette alliance locale ?</h2>
          <p className="text-base sm:text-lg leading-relaxed text-white/70">
            On travaille avec Pixel 404 parce qu&apos;on traite les clients de la même façon : être clair sur ce qu&apos;on fait, écouter, tenir ses délais. Deux entreprises d&apos;Orléans qui s&apos;envoient des clients et se recommandent.
          </p>
        </div>
      </section>

      {/* Call to Action with Exclusive Partner Deal */}
      <section className="relative py-16 px-6">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-[#9500de] to-[#F36B1F] p-8 sm:p-12 relative overflow-hidden shadow-[0_0_50px_rgba(149,0,222,0.2)]">
          {/* Animated decorative shapes */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-[300px] w-[300px] rounded-full bg-white/5 blur-3xl pointer-events-none" />

          <div className="relative grid gap-8 md:grid-cols-12 items-center">
            <div className="md:col-span-8">
              <span className="inline-block rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1 text-[11px] font-bold text-white uppercase tracking-wider mb-4">
                Offre partenaire
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Besoin d&apos;un diagnostic ou d&apos;une vidéo ?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-white/95 leading-relaxed max-w-xl">
                Dites que vous venez de la part de Splice Studio chez Pixel 404 : le <strong className="text-white">diagnostic de votre console ou PC est offert</strong>. Un projet vidéo ou photo en tête ? On en parle.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-4 items-stretch md:items-end justify-center">
              <Link
                href="/devis"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-white/90 px-6 py-3.5 text-sm font-bold text-[#08080C] transition hover:scale-105 active:scale-95 shadow-lg"
              >
                Demander un devis <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={PIXEL_404.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-6 py-3.5 text-sm font-bold text-white transition hover:scale-105 active:scale-95"
              >
                Découvrir Pixel 404
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
