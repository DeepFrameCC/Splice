import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { BASE_URL } from "@/lib/seo";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "FAQ — production vidéo Orléans & Tours",
  description:
    "Réponses à vos questions fréquentes sur nos services de production vidéo et photo à Orléans et Tours : tarifs, délais de livraison, formats livrés, shooting automobile, montage vidéo et plus.",
  alternates: { canonical: `${BASE_URL}/faq` },
  openGraph: {
    title: "FAQ production audiovisuelle — Splice Studio",
    description:
      "Tout savoir sur les prestations audiovisuelles Splice Studio : tarifs, délais, formats, shooting photo & vidéo à Orléans et Tours.",
    url: `${BASE_URL}/faq`,
  },
  twitter: { card: "summary_large_image" },
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
    title: "Splice Studio à Orléans & Tours",
    items: [
      {
        q: "Quel studio choisir pour une pub réseaux sociaux à Orléans ?",
        a: "Splice Studio Orléans est un studio de production audiovisuelle spécialisé dans la publicité courte pour Instagram, TikTok et YouTube. Basés à Orléans (45) et Tours, nous tournons et montons des formats verticaux optimisés pour les réseaux, avec hooks d'accroche et sous-titres animés.",
        rich: <>Splice Studio Orléans est un studio de production audiovisuelle spécialisé dans la <L href="/services/montage-video">publicité courte pour Instagram, TikTok et YouTube</L>. Basés à Orléans (45) et Tours, nous tournons et montons des formats verticaux optimisés réseaux, avec hooks d&apos;accroche et sous-titres animés. Voyez <L href="/galerie">nos réalisations</L>.</>,
      },
      {
        q: "Qui réalise du shooting automobile photo et vidéo dans le Loiret ?",
        a: "Splice Studio Orléans réalise des shootings automobile photo et vidéo dans tout le Loiret (45) et le Centre-Val de Loire : rolling shots, plans détails et montage dynamique. Les packs photo démarrent à 15 € et les packs vidéo à 29 €.",
        rich: <>Splice Studio Orléans réalise des <L href="/services/shooting-automobile">shootings automobile photo et vidéo</L> dans tout le Loiret (45) et le Centre-Val de Loire : rolling shots, plans détails et montage dynamique. Les packs photo démarrent à 15 € et les packs vidéo à 29 €. <L href="/devis">Simulez votre devis</L>.</>,
      },
      {
        q: "Combien coûte un aftermovie événementiel à Tours ?",
        a: "Le tarif d'un aftermovie événementiel à Tours dépend de la durée de captation et du montage souhaité. Splice Studio Orléans intervient à Tours (37) et dans toute l'Indre-et-Loire ; le devis en ligne est gratuit, avec une réponse sous 24h ouvrées.",
        rich: <>Le tarif d&apos;un aftermovie événementiel à Tours dépend de la durée de captation et du montage souhaité. Splice Studio Orléans intervient à Tours (37) et dans toute l&apos;Indre-et-Loire ; le <L href="/devis">devis en ligne</L> est gratuit, avec une réponse sous 24h ouvrées.</>,
      },
      {
        q: "Quel est le délai pour recevoir un devis vidéo ?",
        a: "Vous recevez votre devis vidéo détaillé par email sous 24h ouvrées après avoir utilisé notre simulateur en ligne. Le devis est gratuit et sans engagement.",
        rich: <>Vous recevez votre devis vidéo détaillé par email sous 24h ouvrées après avoir utilisé notre <L href="/devis">simulateur en ligne</L>. Le devis est gratuit et sans engagement.</>,
      },
      {
        q: "Dans quelles villes Splice Studio intervient-il ?",
        a: "Splice Studio Orléans intervient à Orléans, Tours, Blois, Chartres, Bourges et dans tout le Centre-Val de Loire (Loiret 45, Indre-et-Loire 37). Des déplacements au-delà de cette zone sont possibles sur devis.",
        rich: <>Splice Studio Orléans intervient à Orléans, Tours, Blois, Chartres, Bourges et dans tout le Centre-Val de Loire (Loiret 45, Indre-et-Loire 37). Des déplacements au-delà sont possibles sur devis. <L href="/contact">Contactez-nous</L>.</>,
      },
    ],
  },
  {
    title: "Général",
    items: [
      {
        q: "Qu'est-ce que Splice Studio, votre agence vidéo à Orléans et Tours ?",
        a: "Splice Studio est une boîte de production audiovisuelle basée à Orléans et Tours spécialisée en vidéo publicitaire pour les réseaux sociaux, shooting automobile, film de marque et aftermovie événementiel. Nous intervenons sur tout le Centre-Val de Loire.",
        rich: <>Splice Studio est une boîte de production audiovisuelle basée à Orléans et Tours spécialisée en vidéo publicitaire pour les réseaux sociaux, shooting automobile, film de marque et aftermovie événementiel. Découvrez <L href="/galerie">nos réalisations</L> et <L href="/equipe">notre équipe</L>.</>,
      },
      {
        q: "Dans quelle zone géographique votre vidéaste intervient-il ?",
        a: "Nous intervenons principalement en Centre-Val de Loire : Orléans, Tours, Blois, Chartres, Bourges et environs. Les frais de déplacement sont calculés à 0,50 €/km aller-retour au-delà de 30 km.",
        rich: <>Nous intervenons principalement en Centre-Val de Loire : Orléans, Tours, Blois, Chartres, Bourges et environs. Les frais de déplacement sont calculés à 0,50 €/km aller-retour au-delà de 30 km. <L href="/contact">Contactez-nous</L> pour en discuter.</>,
      },
      {
        q: "Comment contacter Splice Studio pour un projet vidéo ou photo ?",
        a: "Vous pouvez nous écrire à contact.splicestudio@gmail.com, remplir le formulaire de contact sur notre site, ou directement demander un devis en ligne via notre simulateur. Nous répondons sous 24h ouvrées.",
        rich: <>Vous pouvez nous écrire à contact.splicestudio@gmail.com, remplir notre <L href="/contact">formulaire de contact</L>, ou directement <L href="/devis">demander un devis en ligne</L> via notre simulateur. Nous répondons sous 24h ouvrées.</>,
      },
    ],
  },
  {
    title: "Tarifs & devis",
    items: [
      {
        q: "Comment fonctionne le simulateur de devis vidéo en ligne ?",
        a: "Notre configurateur en ligne vous permet de choisir votre formule (abonnement ou pack à l'unité), vos options de montage et vos coordonnées en 3 étapes. Vous recevez un devis détaillé par email sous 24h. C'est gratuit et sans engagement.",
        rich: <>Notre <L href="/devis">configurateur en ligne</L> vous permet de choisir votre formule (abonnement ou pack à l&apos;unité), vos options de montage et vos coordonnées en 3 étapes. Vous recevez un devis détaillé par email sous 24h. C&apos;est gratuit et sans engagement.</>,
      },
      {
        q: "Combien coûte un montage vidéo professionnel chez Splice Studio ?",
        a: "Nos abonnements de montage vidéo démarrent à 45 €/mois (formule Standard : 2 vidéos sources + recyclage multi-réseaux). La formule Pro est à 99 €/mois et la Premium à 189 €/mois. Pour un besoin ponctuel, le Pack Particulier démarre à 29 € la vidéo.",
        rich: <>Nos <L href="/tarifs">abonnements de montage vidéo</L> démarrent à 45 €/mois (formule Standard : 2 vidéos sources + recyclage multi-réseaux). La formule Pro est à 99 €/mois et la Premium à 189 €/mois. Pour un besoin ponctuel, le Pack Particulier démarre à 29 € la vidéo. <L href="/devis">Demandez un devis</L> pour un tarif personnalisé.</>,
      },
      {
        q: "Faut-il verser un acompte pour confirmer un tournage ?",
        a: "Oui, un acompte de 30 % est demandé à la validation du devis pour confirmer la réservation de la date de tournage. Le solde est réglé à la livraison finale.",
        rich: <>Oui, un acompte de 30 % est demandé à la validation du <L href="/devis">devis</L> pour confirmer la réservation de la date de tournage. Le solde est réglé à la livraison finale.</>,
      },
      {
        q: "Quels moyens de paiement sont acceptés pour une prestation vidéo ?",
        a: "Nous acceptons les paiements par carte bancaire via Stripe (paiement sécurisé en ligne) et par virement bancaire. Le paiement est simple, rapide et sécurisé.",
        rich: <>Nous acceptons les paiements par carte bancaire via Stripe (paiement sécurisé en ligne) et par virement bancaire. Le paiement est simple, rapide et sécurisé.</>,
      },
      {
        q: "Combien coûte un shooting photo professionnel à Orléans ?",
        a: "Nos packs photo démarrent à 15 € pour 5 photos retouchées (shooting automobile). Une séance professionnelle complète — portraits corporate, packshots produits ou reportage métier à Orléans et Tours — est chiffrée selon la durée et le nombre de livrables. Le devis en ligne est gratuit et sans engagement.",
        rich: <>Nos <L href="/services/photographie-professionnelle">packs photo</L> démarrent à 15 € pour 5 photos retouchées (shooting automobile). Une séance professionnelle complète — portraits corporate, packshots produits ou reportage métier à Orléans et Tours — est chiffrée selon la durée et le nombre de livrables. Le <L href="/devis">devis en ligne</L> est gratuit et sans engagement.</>,
      },
    ],
  },
  {
    title: "Tournage & production",
    items: [
      {
        q: "Combien de temps dure un tournage vidéo professionnel ?",
        a: "La durée dépend de la formule choisie. Une demi-journée (4h) suffit pour la plupart des projets comme un shooting automobile ou un portrait d'entreprise. Les tournages plus ambitieux (aftermovie, film corporate) nécessitent une journée complète ou deux jours.",
        rich: <>La durée dépend de la <L href="/tarifs">formule choisie</L>. Une demi-journée (4h) suffit pour la plupart des projets comme un <L href="/services/shooting-automobile">shooting automobile</L> ou un <L href="/services/interview-temoignage">portrait d&apos;entreprise</L>. Les tournages plus ambitieux (aftermovie, <L href="/services/production-corporate">film corporate</L>) nécessitent une journée complète ou deux jours.</>,
      },
      {
        q: "Quel matériel de tournage vidéo utilisez-vous à Orléans ?",
        a: "Nous tournons avec un setup léger et efficace : Sony ZV-1 et iPhone 14 en 4K, micro sans fil DJI pour le son, puis montage et étalonnage sur DaVinci Resolve Studio.",
        rich: <>Nous tournons avec un setup léger et efficace : Sony ZV-1 et iPhone 14 en 4K, micro sans fil DJI pour le son, puis montage et étalonnage sur DaVinci Resolve Studio. Voyez le résultat dans <L href="/galerie">notre galerie</L>.</>,
      },
      {
        q: "Puis-je assister au tournage de ma vidéo d'entreprise ?",
        a: "Absolument ! Votre présence est même recommandée pour valider les prises en temps réel et nous guider sur l'ambiance souhaitée.",
        rich: <>Absolument ! Votre présence est même recommandée pour valider les prises en temps réel et nous guider sur l&apos;ambiance souhaitée.</>,
      },
    ],
  },
  {
    title: "Livraison & formats",
    items: [
      {
        q: "Quel est le délai de livraison d'une vidéo montée ?",
        a: "Le délai standard de livraison est de 7 à 14 jours après le tournage. Nous proposons aussi un délai étendu (15 jours) et une option express 48h (+50 €) pour les projets urgents.",
        rich: <>Le délai standard de livraison est de 7 à 14 jours après le tournage. Nous proposons aussi un délai étendu (15 jours) et une <L href="/devis">option express 48h</L> (+50 €) pour les projets urgents.</>,
      },
      {
        q: "En quels formats vidéo livrez-vous les fichiers finaux ?",
        a: "Nous livrons en format 9:16 vertical (idéal pour Reels Instagram, TikTok et Stories) et 16:9 paysage (idéal pour YouTube et site web). Les deux formats peuvent être demandés simultanément.",
        rich: <>Nous livrons en format 9:16 vertical (idéal pour Reels Instagram, TikTok et Stories) et 16:9 paysage (idéal pour YouTube et site web). Les deux formats peuvent être demandés simultanément.</>,
      },
      {
        q: "Combien de retouches ou modifications sont incluses ?",
        a: "Deux allers-retours de modifications mineures sont inclus dans chaque prestation. Les modifications supplémentaires sont facturées au tarif horaire de 50 €/h. Nous vous en informons toujours avant.",
        rich: <>Deux allers-retours de modifications mineures sont inclus dans chaque prestation. Les modifications supplémentaires sont facturées au tarif horaire de 50 €/h. <L href="/contact">Contactez-nous</L> pour en discuter.</>,
      },
      {
        q: "Vos vidéos sont-elles optimisées pour les réseaux sociaux ?",
        a: "Oui ! Nos vidéos sont montées et exportées spécifiquement pour les plateformes sociales : hooks d'accroche dès les premières secondes, sous-titres animés, formats natifs adaptés et compression optimale pour chaque réseau.",
        rich: <>Oui ! Nos vidéos sont montées et exportées spécifiquement pour les plateformes sociales : hooks d&apos;accroche dès les premières secondes, sous-titres animés, formats natifs adaptés et compression optimale. Découvrez des <L href="/galerie">exemples dans notre galerie</L>.</>,
      },
      {
        q: "Quel format vidéo pour des Reels Instagram ?",
        a: "Pour des Reels Instagram, le format est le 9:16 vertical (1080×1920 px), valable aussi pour TikTok et YouTube Shorts. Nous livrons des vidéos courtes de 15 à 30 secondes avec une accroche dès la première seconde et des sous-titres animés pour le visionnage sans son.",
        rich: <>Pour des Reels Instagram, le format est le 9:16 vertical (1080×1920 px), valable aussi pour TikTok et YouTube Shorts. Nous livrons des <L href="/services/pub-reseaux-sociaux">vidéos courtes de 15 à 30 secondes</L> avec une accroche dès la première seconde et des sous-titres animés pour le visionnage sans son.</>,
      },
    ],
  },
  {
    title: "Services spécialisés",
    items: [
      {
        q: "Combien coûte un shooting photo automobile à Orléans ?",
        a: "Nos shootings photo automobile démarrent à 15 € pour un pack de 5 photos retouchées. Les packs vidéo automobile incluant rolling shots et montage débutent à 29 €. Nous intervenons pour les particuliers, concessions et garages.",
        rich: <>Nos <L href="/services/shooting-automobile">shootings photo automobile</L> démarrent à 15 € pour un pack de 5 photos retouchées. Les packs vidéo automobile incluant rolling shots et montage débutent à 29 €. Nous intervenons pour les particuliers, concessions et garages. <L href="/devis">Simulez votre devis</L>.</>,
      },
      {
        q: "Réalisez-vous des films corporate et vidéos institutionnelles ?",
        a: "Oui, le film corporate est l'une de nos spécialités. Nous gérons l'intégralité du processus : écriture du script, tournage multi-caméras 4K, montage rythmé et étalonnage cinéma. Le délai moyen est de 7 à 14 jours.",
        rich: <>Oui, le <L href="/services/production-corporate">film corporate</L> est l&apos;une de nos spécialités. Nous gérons l&apos;intégralité du processus : écriture du script, tournage multi-caméras 4K, montage rythmé et étalonnage cinéma. Le délai moyen est de 7 à 14 jours. <L href="/devis">Estimez votre projet</L>.</>,
      },
      {
        q: "Faites-vous des photos professionnelles pour entreprise ?",
        a: "Oui. Nous réalisons portraits corporate, reportages métier, packshots produits et photos immobilier à Orléans et Tours. Les forfaits débutent à 15 € pour un pack de 5 photos retouchées, livrées sous 7 à 14 jours.",
        rich: <>Oui. Nous réalisons <L href="/services/photographie-professionnelle">portraits corporate, reportages métier, packshots produits</L> et photos immobilier à Orléans et Tours. Les forfaits débutent à 15 € pour un pack de 5 photos retouchées, livrées sous 7 à 14 jours.</>,
      },
      {
        q: "Qu'est-ce que le motion design ?",
        a: "Le motion design, c'est l'animation graphique : textes, logos, icônes et illustrations mis en mouvement pour expliquer un message ou habiller une vidéo. Chez Splice Studio, nous créons des animations 2D et 3D calées sur votre charte — explainers, infographies animées, habillages — à Orléans, Tours et dans tout le Centre-Val de Loire.",
        rich: <>Le motion design, c&apos;est l&apos;animation graphique : textes, logos, icônes et illustrations mis en mouvement pour expliquer un message ou habiller une vidéo. Nous créons des <L href="/services/motion-design">animations 2D et 3D</L> calées sur votre charte — explainers, infographies animées, habillages — à Orléans, Tours et dans tout le Centre-Val de Loire.</>,
      },
      {
        q: "Quelle est la différence entre un aftermovie et un film d'entreprise ?",
        a: "Un aftermovie résume l'ambiance d'un événement passé (concert, salon, soirée) en un montage court et rythmé. Un film d'entreprise est scénarisé en amont pour présenter une activité, un produit ou une marque. Le premier capte l'émotion d'un moment, le second construit un message durable.",
        rich: <>Un aftermovie résume l&apos;ambiance d&apos;un événement passé (concert, salon, soirée) en un montage court et rythmé. Un <L href="/services/production-corporate">film d&apos;entreprise</L> est scénarisé en amont pour présenter une activité, un produit ou une marque. Le premier capte l&apos;émotion d&apos;un moment, le second construit un message durable.</>,
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
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-3xl px-6 pb-20" style={{ paddingTop: "calc(80px + 3rem)" }}>
        <header className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-df-gold">
            FAQ
          </p>
          <h1 className="mt-2 font-display text-4xl uppercase tracking-tight text-white md:text-5xl">
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
                    <summary className="flex cursor-pointer items-center justify-between p-5 text-white transition hover:bg-white/[0.04]">
                      <span className="font-sans text-base font-medium text-white m-0 leading-normal">{item.q}</span>
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
        <div className="mt-12 rounded-2xl bg-df-blue p-8 text-center text-df-night">
          <h2 className="font-display text-2xl uppercase tracking-tight">
            Vous avez d&apos;autres questions ?
          </h2>
          <p className="mt-2 text-df-night/85">
            Contactez-nous directement ou demandez un devis gratuit.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/devis"
              className="inline-flex items-center gap-2 rounded-full bg-df-night px-6 py-3 font-bold text-white transition hover:bg-df-night/90"
            >
              Demander un devis →
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border-2 border-df-night/40 px-6 py-3 font-bold text-df-night transition hover:bg-df-night/10"
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
