import { Mail, Instagram, MapPin, Calculator, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez DeepFrame — boîte de production audiovisuelle à Orléans et Tours. Email, Instagram, devis en ligne.",
};

const FOUNDERS = [
  {
    id: "papi",
    name: "Papi",
    role: "Réalisateur & DOP",
    handle: "@papiforcex",
    insta: "https://instagram.com/papiforcex",
    gradient: "linear-gradient(135deg, #FFE0B0 0%, #FFBD59 100%)",
    textColor: "#1A1408",
  },
  {
    id: "louisia",
    name: "Louisia",
    role: "Productrice",
    handle: "@by.louisia",
    insta: "https://instagram.com/by.louisia",
    gradient: "linear-gradient(135deg, #1901AD 0%, #0F0078 100%)",
    textColor: "#fff",
  },
  {
    id: "ty",
    name: "Ty",
    role: "Monteuse · Étalonneuse",
    handle: "@t.y97one",
    insta: "https://instagram.com/t.y97one",
    gradient: "linear-gradient(135deg, #F2D8A8 0%, #5C3A1F 100%)",
    textColor: "#1A1408",
  },
] as const;

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Header */}
      <header className="mb-14">
        <p
          className="mb-3 text-xs font-semibold uppercase tracking-widest text-df-gold"
          style={{ fontFamily: "var(--font-jetbrains)" }}
        >
          On vous répond sous 48h
        </p>
        <h1
          className="text-5xl font-bold leading-none text-df-blue md:text-7xl"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}
        >
          Parlons de<br />
          <em className="italic text-df-gold">votre projet.</em>
        </h1>
      </header>

      {/* Contacts studio */}
      <div className="mb-14 grid gap-4 sm:grid-cols-2">
        <a
          href="mailto:contact@deepframe.cc"
          className="group flex items-center gap-4 rounded-2xl border border-df-blue/10 bg-df-cream p-6 transition hover:border-df-blue/30 hover:shadow-lg"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-df-blue text-white">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-df-blue/50">Email studio</p>
            <p className="text-lg font-bold text-df-blue group-hover:text-df-blue/80">
              contact@deepframe.cc
            </p>
          </div>
        </a>

        <div className="flex items-center gap-4 rounded-2xl border border-df-blue/10 bg-df-cream p-6">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-df-blue text-white">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-df-blue/50">Zone d&apos;intervention</p>
            <p className="font-bold text-df-blue">Orléans · Tours · Centre-Val-de-Loire</p>
            <p className="text-xs text-df-blue/50 mt-0.5">Déplacement 0,50 €/km A/R</p>
          </div>
        </div>
      </div>

      {/* Équipe — cartes individuelles (sans email personnel exposé) */}
      <section className="mb-14">
        <h2
          className="mb-6 text-2xl font-bold text-df-blue"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
        >
          L&apos;équipe
        </h2>
        <p className="mb-6 text-sm text-df-blue/70">
          Pour joindre directement un membre de l&apos;équipe, utilisez le formulaire ci-dessous en
          sélectionnant son nom — vos messages sont relayés en interne sans exposer les adresses
          personnelles.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {FOUNDERS.map((f) => (
            <div
              key={f.id}
              className="rounded-2xl p-6 flex flex-col gap-4"
              style={{ background: f.gradient }}
            >
              <div>
                <p
                  className="text-xl font-bold"
                  style={{ color: f.textColor, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
                >
                  {f.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: f.textColor, opacity: 0.7 }}>
                  {f.role}
                </p>
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <a
                  href={f.insta}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition"
                  style={{
                    background: "rgba(255,255,255,.18)",
                    color: f.textColor,
                    textDecoration: "none",
                  }}
                >
                  <Instagram className="h-3.5 w-3.5 shrink-0" />
                  {f.handle}
                  <ExternalLink className="h-3 w-3 ml-auto opacity-60" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Formulaire de contact */}
      <section className="mb-14">
        <h2
          className="mb-6 text-2xl font-bold text-df-blue"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
        >
          Envoyer un message
        </h2>
        <ContactForm
          members={FOUNDERS.map((f) => ({ id: f.id, name: f.name }))}
        />
      </section>

      {/* CTA devis */}
      <Link
        href="/devis"
        className="flex items-center gap-5 rounded-2xl p-7 transition hover:shadow-xl hover:-translate-y-0.5"
        style={{ background: "#1901AD", textDecoration: "none" }}
      >
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-df-gold">
          <Calculator className="h-6 w-6 text-df-blue" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Le plus rapide</p>
          <p className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            Demandez votre devis en ligne →
          </p>
          <p className="text-sm text-white/60 mt-0.5">Réponse sous 48h · Pré-devis gratuit</p>
        </div>
      </Link>
    </div>
  );
}
