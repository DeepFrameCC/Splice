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

const FAQ_ITEMS = [
  {
    q: "Comment fonctionne la demande de devis ?",
    a: "Notre configurateur en ligne vous permet de choisir votre pack, vos options et vos coordonnées en 4 étapes. Vous recevez un devis détaillé par email sous 24h. C\u2019est gratuit et sans engagement.",
  },
  {
    q: "Quels sont vos tarifs ?",
    a: "Nos packs démarrent à 140 \u20AC HT (Pack Basique : 1 vidéo + 5 photos). Le Pack Visibilité est à 340 \u20AC, le Visibilité Mix à 420 \u20AC et le Premium à partir de 850 \u20AC. Les intros animées sont entre 100 et 400 \u20AC selon la complexité. TVA non applicable, art.\u00A0293\u00A0B du CGI.",
  },
  {
    q: "Quels sont les délais de livraison ?",
    a: "Le délai standard est de 7 à 10 jours ouvrés après le tournage. Nous proposons aussi un délai étendu (15 jours) et une option express 48h (+55 \u20AC) pour les projets urgents.",
  },
  {
    q: "Dans quelle zone géographique intervenez-vous ?",
    a: "Nous intervenons principalement en Centre-Val de Loire (Orléans, Tours et environs). Les frais de déplacement sont calculés au kilomètre (0,50 \u20AC/km aller-retour) et détaillés dans le devis.",
  },
  {
    q: "Faut-il payer un acompte ?",
    a: "Oui, un acompte de 30\u00A0% est demandé à la validation du devis pour confirmer la réservation de la date de tournage. Le solde est réglé à la livraison. Paiement par carte bancaire (Stripe) ou virement.",
  },
  {
    q: "Comment vous contacter ?",
    a: "Vous pouvez nous écrire à contact@deepframe.cc, nous appeler au 06 51 10 92 02 ou 07 67 72 75 12, remplir le formulaire ci-dessus, ou directement demander un devis en ligne. Nous répondons sous 24h.",
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
            className="text-5xl font-bold leading-none text-df-blue md:text-7xl"
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.03em",
            }}
          >
            Parlons de
            <br />
            <em className="italic text-df-gold">votre projet.</em>
          </h1>
          <p className="mt-5 max-w-xl text-df-blue/70">
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
              <p className="text-xs font-semibold uppercase tracking-wider text-df-blue/50">
                Email studio
              </p>
              <p className="text-sm font-bold text-df-blue group-hover:text-df-blue/80">
                contact@deepframe.cc
              </p>
              <p className="mt-0.5 text-xs text-df-blue/50">
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
              <p className="text-xs font-semibold uppercase tracking-wider text-df-blue/50">
                WhatsApp
              </p>
              <p className="text-sm font-bold text-df-blue group-hover:text-df-blue/80">
                Écrivez-nous directement
              </p>
              <p className="mt-0.5 text-xs text-df-blue/50">
                Réponse rapide
              </p>
            </div>
          </a>

          <div className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-df-surface p-6">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-df-blue text-white">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-df-blue/50">
                Zone d&apos;intervention
              </p>
              <p className="text-sm font-bold text-df-blue">
                Orléans · Tours · Centre-Val de Loire
              </p>
              <p className="mt-0.5 text-xs text-df-blue/50">
                Déplacement 0,50 €/km A/R
              </p>
            </div>
          </div>
        </section>

        {/* ─── Formulaire + tips sidebar ──────────────── */}
        <section className="mb-14" id="form">
          <h2
            className="mb-2 text-2xl font-bold text-df-blue"
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.02em",
            }}
          >
            Racontez-nous votre projet
          </h2>
          <p className="mb-8 text-sm text-df-blue/70">
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
              <ul className="space-y-4 text-sm text-df-blue/70">
                <li className="border-t border-white/[0.08] pt-4">
                  <span className="font-bold text-df-blue">Le contexte.</span>{" "}
                  Marque, produit, public visé, lieu de diffusion.
                </li>
                <li className="border-t border-white/[0.08] pt-4">
                  <span className="font-bold text-df-blue">
                    2-3 références.
                  </span>{" "}
                  Liens YouTube / Vimeo qui décrivent la vibe.
                </li>
                <li className="border-t border-white/[0.08] pt-4">
                  <span className="font-bold text-df-blue">Un budget.</span>{" "}
                  Même approximatif — nos packs démarrent à 140 € HT.
                </li>
                <li className="border-t border-white/[0.08] pt-4">
                  <span className="font-bold text-df-blue">Une deadline.</span>{" "}
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
              className="text-2xl font-bold text-df-blue"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.02em",
              }}
            >
              Questions fréquentes
            </h2>
            <Link
              href="/faq"
              className="text-sm font-semibold text-df-gold hover:text-df-blue transition"
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
                <summary className="flex cursor-pointer items-center justify-between p-5 font-bold text-df-blue transition hover:bg-white/[0.04]">
                  <span>{item.q}</span>
                  <span className="ml-4 shrink-0 text-df-gold transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 text-sm leading-relaxed text-df-blue/70">
                  {item.a}
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
            <Calculator className="h-6 w-6 text-df-blue" />
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
