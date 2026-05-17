import React from "react";
import { Mail, MapPin, Calculator, MessageCircle } from "lucide-react";
import Link from "next/link";
import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import ContactForm from "./ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — DeepFrame",
  description:
    "Contactez DeepFrame — boîte de production audiovisuelle à Orléans et Tours. Email, téléphone, Instagram, devis en ligne.",
};

const MEMBERS = [
  { id: "papi", name: "Papi" },
  { id: "louisia", name: "Louisia" },
  { id: "ty", name: "Tracy" },
] as const;

const FAQ_ITEMS: { q: string; rich: React.ReactNode }[] = [
  {
    q: "Comment fonctionne la demande de devis ?",
    rich: <>Notre <Link href="/devis" className="font-semibold text-df-gold underline underline-offset-2">configurateur en ligne</Link> vous permet de choisir votre pack, vos options et vos coordonnées en 4 étapes. Vous recevez un devis détaillé par email sous 24h. C&apos;est gratuit et sans engagement.</>,
  },
  {
    q: "Quels sont les tarifs de vos prestations ?",
    rich: <>Nos <Link href="/services" className="font-semibold text-df-gold underline underline-offset-2">packs</Link> démarrent à 140 € HT (Pack Basique : 1 vidéo + 5 photos). Le Pack Visibilité est à 340 €, le Visibilité Mix à 420 € et le Premium à partir de 850 €. Les intros animées sont entre 100 et 400 € selon la complexité. <Link href="/devis" className="font-semibold text-df-gold underline underline-offset-2">Demandez un devis</Link> pour un tarif personnalisé.</>,
  },
  {
    q: "Quels sont les délais de livraison ?",
    rich: <>Le délai standard est de 7 à 10 jours ouvrés après le tournage. Nous proposons aussi un délai étendu (15 jours) et une <Link href="/devis" className="font-semibold text-df-gold underline underline-offset-2">option express 48h</Link> (+55 €) pour les projets urgents.</>,
  },
  {
    q: "Faut-il payer un acompte ?",
    rich: <>Oui, un acompte de 30&nbsp;% est demandé à la validation du <Link href="/devis" className="font-semibold text-df-gold underline underline-offset-2">devis</Link> pour confirmer la réservation de la date de tournage. Le solde est réglé à la livraison. Paiement par carte bancaire (Stripe) ou virement.</>,
  },
];

export default function ContactPage() {
  return (
    <>
      <NavWrapper />

      <div
        className="mx-auto max-w-5xl px-6 pb-20"
        style={{ paddingTop: "calc(80px + 3rem)" }}
      >
        {/* ─── Hero ──────────────────────────────────── */}
        <header className="mb-14">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest text-df-gold"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            On vous répond sous 24h
          </p>
          <h1
            className="text-5xl font-bold leading-none text-white md:text-7xl"
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.03em",
            }}
          >
            Parlons de
            <br />
            <em className="italic text-df-gold">votre projet.</em>
          </h1>
          <p className="mt-5 max-w-xl text-white/70">
            Un brief, une idée, un délai qui presse — écrivez-nous. Nous lisons
            tout et répondons sous 24 heures ouvrées.
          </p>
        </header>

        {/* ─── Quick channels ────────────────────────── */}
        <section className="mb-14 grid gap-4 sm:grid-cols-3">
          <a
            href="mailto:contact@deepframe.cc"
            className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-df-surface p-6 transition hover:border-df-blue/30 hover:shadow-lg"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-df-blue text-white">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Email studio
              </p>
              <p className="text-sm font-bold text-white group-hover:text-df-gold">
                contact@deepframe.cc
              </p>
              <p className="mt-0.5 text-xs text-white/50">
                Réponse sous 24h
              </p>
            </div>
          </a>

          <a
            href="https://wa.me/33651109202"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-df-surface p-6 transition hover:border-df-blue/30 hover:shadow-lg"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#25D366] text-white">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                WhatsApp
              </p>
              <p className="text-sm font-bold text-white group-hover:text-df-gold">
                Écrivez-nous directement
              </p>
              <p className="mt-0.5 text-xs text-white/50">
                Réponse rapide
              </p>
            </div>
          </a>

          <div className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-df-surface p-6">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-df-blue text-white">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Zone d&apos;intervention
              </p>
              <p className="text-sm font-bold text-white">
                Orléans · Tours · Centre-Val de Loire
              </p>
              <p className="mt-0.5 text-xs text-white/50">
                Déplacement 0,50 €/km A/R
              </p>
            </div>
          </div>
        </section>

        {/* ─── Formulaire + tips sidebar ──────────────── */}
        <section className="mb-14" id="form">
          <h2
            className="mb-2 text-2xl font-bold text-white"
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.02em",
            }}
          >
            Racontez-nous votre projet
          </h2>
          <p className="mb-8 text-sm text-white/60">
            Pas de longueur minimum. Le mieux, c&apos;est encore d&apos;écrire
            comme on parle, en glissant deux ou trois références si vous en avez.
          </p>

          <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
            {/* Tips sidebar */}
            <aside className="hidden lg:block">
              <p
                className="mb-4 text-xs font-semibold uppercase tracking-widest text-df-gold"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                À glisser dans le message
              </p>
              <ul className="space-y-4 text-sm text-white/60">
                <li className="border-t border-white/[0.08] pt-4">
                  <span className="font-bold text-df-gold">Le contexte.</span>{" "}
                  Marque, produit, public visé, lieu de diffusion.
                </li>
                <li className="border-t border-white/[0.08] pt-4">
                  <span className="font-bold text-df-gold">
                    2-3 références.
                  </span>{" "}
                  Liens YouTube / Vimeo qui décrivent la vibe.
                </li>
                <li className="border-t border-white/[0.08] pt-4">
                  <span className="font-bold text-df-gold">Un budget.</span>{" "}
                  Même approximatif — nos packs démarrent à 140 € HT.
                </li>
                <li className="border-t border-white/[0.08] pt-4">
                  <span className="font-bold text-df-gold">Une deadline.</span>{" "}
                  Date de diffusion, et si elle bouge ou non.
                </li>
              </ul>
            </aside>

            {/* Form */}
            <ContactForm
              members={MEMBERS.map((m) => ({ id: m.id, name: m.name }))}
            />
          </div>
        </section>

        {/* ─── FAQ ───────────────────────────────────── */}
        <section className="mb-14">
          <div className="mb-6 flex items-end justify-between">
            <h2
              className="text-2xl font-bold text-df-gold"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.02em",
              }}
            >
              Questions fréquentes
            </h2>
            <Link
              href="/faq"
              className="text-sm font-semibold text-df-gold hover:text-white transition"
            >
              Voir toute la FAQ →
            </Link>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <details
                key={item.q}
                className="group rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08]"
                {...(i === 0 ? { open: true } : {})}
              >
                <summary className="flex cursor-pointer items-center justify-between p-5 font-bold text-white transition hover:bg-white/[0.04]">
                  <span>{item.q}</span>
                  <span className="ml-4 shrink-0 text-df-gold transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 text-sm leading-relaxed text-white/60">
                  {item.rich}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ─── CTA devis ─────────────────────────────── */}
        <Link
          href="/devis"
          className="flex items-center gap-5 rounded-2xl bg-df-blue p-7 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-df-gold">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Le plus complet
            </p>
            <p
              className="text-xl font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Demandez votre devis en ligne →
            </p>
            <p className="mt-0.5 text-sm text-white/60">
              Configurateur en 4 étapes · Gratuit, sans engagement
            </p>
          </div>
        </Link>
      </div>

      <Footer />
    </>
  );
}
