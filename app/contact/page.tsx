import { Mail, MapPin, Calculator, MessageCircle } from "lucide-react";
import Link from "next/link";
import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import ContactForm from "./ContactForm";
import { buildContactPageJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import type { Metadata } from "next";
import { BASE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact — Splice",
  description:
    "Contactez Splice — boîte de production audiovisuelle à Orléans et Tours. Email, téléphone, Instagram, devis en ligne.",
  openGraph: {
    title: "Contactez Splice",
    description:
      "Email, WhatsApp, formulaire en ligne. Réponse sous 24h. Orléans & Tours.",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${BASE_URL}/contact` },
};

const MEMBERS = [
  { id: "louisia", name: "Louisia" },
  { id: "ty", name: "Tracy" },
] as const;

export default function ContactPage() {
  return (
    <>
      <JsonLd data={buildContactPageJsonLd()} />
      <NavWrapper />

      <div
        className="mx-auto max-w-5xl px-6 pb-20"
        style={{ paddingTop: "calc(80px + 3rem)" }}
      >
        {/* ─── Hero ──────────────────────────────────── */}
        <header className="mb-14">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest text-df-gold"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            On vous répond sous 24h
          </p>
          <h1
            className="text-5xl font-bold leading-none text-white md:text-7xl"
            style={{
              fontFamily: "var(--font-sans)",
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
        <section className="mb-14 grid gap-4 sm:grid-cols-3 overflow-hidden">
          <a
            href="mailto:contact.splicestudio@gmail.com"
            className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-df-surface p-6 transition hover:border-df-blue/30 hover:shadow-lg"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-df-blue text-white">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Email studio
              </p>
              <p className="text-sm font-bold text-white group-hover:text-df-gold break-all">
                contact.splicestudio@gmail.com
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
          <h2 className="mb-2 text-2xl font-semibold text-white">
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
                style={{ fontFamily: "var(--font-sans)" }}
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
                  Même approximatif — nos abonnements démarrent à 45 €/mois.
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

        {/* ─── Lien FAQ ──────────────────────────────── */}
        <section className="mb-14 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-df-surface p-5">
          <p className="text-sm text-white/70">
            <span className="font-semibold text-white">Une question fréquente ?</span> Consultez notre FAQ complète.
          </p>
          <Link
            href="/faq"
            className="text-sm font-semibold text-df-gold transition hover:text-white"
          >
            Voir la FAQ →
          </Link>
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
            <p className="text-xl font-semibold uppercase text-white">
              Demander un devis en ligne →
            </p>
            <p className="mt-0.5 text-sm text-white/60">
              Configurateur en 3 étapes · Gratuit, sans engagement
            </p>
          </div>
        </Link>
      </div>

      <Footer />
    </>
  );
}
