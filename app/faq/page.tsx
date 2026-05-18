import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "FAQ — DeepFrame",
  description:
    "Questions fréquentes sur nos services de production audiovisuelle : tarifs, délais, formats, tournage, livraison et plus.",
  openGraph: {
    title: "FAQ — DeepFrame",
    description:
      "Réponses à vos questions sur la production audiovisuelle DeepFrame.",
  },
};

const L = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href} className="font-semibold text-df-gold underline underline-offset-2 transition hover:text-df-blue">
    {children}
  </Link>
);

interface FaqItem {
  q: string;
  /** Plain text for JSON-LD structured data */
  a: string;
  /** JSX with links for display */
  rich: ReactNode;
}

const FAQ_SECTIONS: { title: string; items: FaqItem[] }[] = [
  {
    title: "Général",
    items: [
      {
        q: "Qu'est-ce que DeepFrame ?",
        a: "DeepFrame est une boîte de production audiovisuelle basée à Orléans et Tours. Nous réalisons des vidéos publicitaires pour les réseaux sociaux, des shootings automobile, des films de marque, des aftermovies et des intros animées.",
        rich: <>DeepFrame est une boîte de production audiovisuelle basée à Orléans et Tours. Nous réalisons des vidéos publicitaires pour les réseaux sociaux, des shootings automobile, des films de marque, des aftermovies et des intros animées. Découvrez <L href="/galerie">nos réalisations</L> et <L href="/equipe">notre équipe</L>.</>,
      },
      {
        q: "Dans quelle zone géographique intervenez-vous ?",
        a: "Nous intervenons principalement en Centre-Val de Loire (Orléans, Tours et environs). Les frais de déplacement sont calculés au kilomètre (0,50 €/km aller-retour).",
        rich: <>Nous intervenons principalement en Centre-Val de Loire (Orléans, Tours et environs). Les frais de déplacement sont calculés au kilomètre (0,50 €/km aller-retour). <L href="/contact">Contactez-nous</L> pour en discuter.</>,
      },
      {
        q: "Comment vous contacter ?",
        a: "Vous pouvez nous écrire à contact@deepframe.cc, remplir le formulaire de contact sur notre site, ou directement demander un devis en ligne. Nous répondons sous 24h.",
        rich: <>Vous pouvez nous écrire à contact@deepframe.cc, remplir notre <L href="/contact">formulaire de contact</L>, ou directement <L href="/devis">demander un devis en ligne</L>. Nous répondons sous 24h.</>,
      },
    ],
  },
  {
    title: "Tarifs & devis",
    items: [
      {
        q: "Comment fonctionne la demande de devis ?",
        a: "Notre configurateur en ligne vous permet de choisir votre pack, vos options et vos coordonnées en 4 étapes. Vous recevez un devis détaillé par email sous 24h. C'est gratuit et sans engagement.",
        rich: <>Notre <L href="/devis">configurateur en ligne</L> vous permet de choisir votre pack, vos options et vos coordonnées en 4 étapes. Vous recevez un devis détaillé par email sous 24h. C&apos;est gratuit et sans engagement.</>,
      },
      {
        q: "Quels sont les tarifs de vos prestations ?",
        a: "Nos packs démarrent à 140 € HT (Pack Basique : 1 vidéo + 5 photos). Le Pack Visibilité est à 340 €, le Visibilité Mix à 420 € et le Premium à partir de 850 €. Les intros animées sont entre 100 et 400 € selon la complexité.",
        rich: <>Nos <L href="/services">packs</L> démarrent à 140 € HT (Pack Basique : 1 vidéo + 5 photos). Le Pack Visibilité est à 340 €, le Visibilité Mix à 420 € et le Premium à partir de 850 €. Les intros animées sont entre 100 et 400 € selon la complexité. <L href="/devis">Demandez un devis</L> pour un tarif personnalisé.</>,
      },
      {
        q: "Faut-il payer un acompte ?",
        a: "Oui, un acompte de 30% est demandé à la validation du devis pour confirmer la réservation de la date de tournage. Le solde est réglé à la livraison.",
        rich: <>Oui, un acompte de 30 % est demandé à la validation du <L href="/devis">devis</L> pour confirmer la réservation de la date de tournage. Le solde est réglé à la livraison.</>,
      },
      {
        q: "Quels moyens de paiement acceptez-vous ?",
        a: "Nous acceptons les paiements par carte bancaire via Stripe (paiement sécurisé en ligne) et par virement bancaire.",
        rich: <>Nous acceptons les paiements par carte bancaire via Stripe (paiement sécurisé en ligne) et par virement bancaire.</>,
      },
    ],
  },
  {
    title: "Tournage & production",
    items: [
      {
        q: "Combien de temps dure un tournage ?",
        a: "La durée dépend du pack choisi. Une demi-journée suffit pour les packs Basique et Visibilité. Les projets Premium peuvent nécessiter une journée complète ou deux jours.",
        rich: <>La durée dépend du <L href="/services">pack choisi</L>. Une demi-journée suffit pour les packs Basique et Visibilité. Les projets Premium peuvent nécessiter une journée complète ou deux jours.</>,
      },
      {
        q: "Quel matériel utilisez-vous ?",
        a: "Nous travaillons avec du matériel professionnel : caméras 4K, objectifs cinéma, stabilisateurs, éclairages LED, et matériel audio professionnel.",
        rich: <>Nous travaillons avec du matériel professionnel : caméras 4K, objectifs cinéma, stabilisateurs, éclairages LED, et matériel audio professionnel. Voyez le résultat dans <L href="/galerie">notre galerie</L>.</>,
      },
      {
        q: "Puis-je assister au tournage ?",
        a: "Absolument ! Votre présence est même recommandée pour valider les prises en temps réel et nous guider sur l'ambiance souhaitée.",
        rich: <>Absolument ! Votre présence est même recommandée pour valider les prises en temps réel et nous guider sur l&apos;ambiance souhaitée.</>,
      },
    ],
  },
  {
    title: "Livraison & formats",
    items: [
      {
        q: "Quels sont les délais de livraison ?",
        a: "Le délai standard est de 7 à 10 jours ouvrés après le tournage. Nous proposons aussi un délai étendu (15 jours) et une option express 48h (+55 €) pour les projets urgents.",
        rich: <>Le délai standard est de 7 à 10 jours ouvrés après le tournage. Nous proposons aussi un délai étendu (15 jours) et une <L href="/devis">option express 48h</L> (+55 €) pour les projets urgents.</>,
      },
      {
        q: "Dans quels formats sont livrées les vidéos ?",
        a: "Nous livrons en format 9:16 (portrait, idéal pour Reels/TikTok/Stories) et 16:9 (paysage, idéal pour YouTube/site web). Vous pouvez demander les deux formats.",
        rich: <>Nous livrons en format 9:16 (portrait, idéal pour Reels/TikTok/Stories) et 16:9 (paysage, idéal pour YouTube/site web). Vous pouvez demander les deux formats.</>,
      },
      {
        q: "Puis-je demander des modifications après livraison ?",
        a: "Une révision est incluse dans chaque pack. Les modifications supplémentaires sont facturées selon leur complexité. Nous vous en informons toujours avant.",
        rich: <>Une révision est incluse dans chaque pack. Les modifications supplémentaires sont facturées selon leur complexité. <L href="/contact">Contactez-nous</L> pour en discuter.</>,
      },
      {
        q: "Les vidéos sont-elles optimisées pour les réseaux sociaux ?",
        a: "Oui ! Nos vidéos sont montées et exportées spécifiquement pour les plateformes sociales : hooks d'accroche, sous-titres, formats adaptés, compression optimale.",
        rich: <>Oui ! Nos vidéos sont montées et exportées spécifiquement pour les plateformes sociales : hooks d&apos;accroche, sous-titres, formats adaptés, compression optimale. Découvrez des <L href="/galerie">exemples</L>.</>,
      },
    ],
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_SECTIONS.flatMap((s) =>
    s.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    }))
  ),
};

export default function FAQPage() {
  return (
    <>
      <NavWrapper />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-6 pb-20" style={{ paddingTop: "calc(80px + 3rem)" }}>
        <header className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-df-gold">
            FAQ
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold italic text-white md:text-5xl">
            Questions fréquentes
          </h1>
          <p className="mt-3 text-white/70">
            Tout ce que vous devez savoir avant de travailler avec nous.
          </p>
        </header>

        <div className="space-y-10">
          {FAQ_SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="mb-4 font-display text-xl font-bold text-df-gold">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08]"
                  >
                    <summary className="flex cursor-pointer items-center justify-between p-5 font-bold text-white transition hover:bg-white/[0.04]">
                      <h3 className="text-[length:inherit] font-[weight:inherit] m-0 leading-[inherit]">{item.q}</h3>
                      <span className="ml-4 shrink-0 text-df-gold transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-sm leading-relaxed text-white/70">
                      {item.rich}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-df-blue p-8 text-center text-white">
          <h2 className="font-display text-2xl font-bold italic">
            Vous avez d&apos;autres questions ?
          </h2>
          <p className="mt-2 text-white/70">
            Contactez-nous directement ou demandez un devis gratuit.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/devis"
              className="inline-flex items-center gap-2 rounded-full bg-df-gold px-6 py-3 font-bold text-white transition hover:bg-df-gold/90"
            >
              Demander un devis →
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 font-bold text-white transition hover:bg-white/10"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
