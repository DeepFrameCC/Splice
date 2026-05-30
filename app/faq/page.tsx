import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "FAQ production audiovisuelle Orléans Tours — Splice",
  description:
    "Réponses à vos questions fréquentes sur nos services de production vidéo et photo à Orléans et Tours : tarifs, délais de livraison, formats livrés, shooting automobile, montage vidéo et plus.",
  openGraph: {
    title: "FAQ production audiovisuelle — Splice",
    description:
      "Tout savoir sur les prestations audiovisuelles Splice : tarifs, délais, formats, shooting photo & vidéo à Orléans et Tours.",
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
        q: "Qu'est-ce que Splice Studio, votre agence vidéo à Orléans et Tours ?",
        a: "Splice est une boîte de production audiovisuelle basée à Orléans et Tours spécialisée en vidéo publicitaire pour les réseaux sociaux, shooting automobile, film de marque, aftermovie événementiel et intro animée. Nous intervenons sur tout le Centre-Val de Loire.",
        rich: <>Splice est une boîte de production audiovisuelle basée à Orléans et Tours spécialisée en vidéo publicitaire pour les réseaux sociaux, shooting automobile, film de marque, aftermovie événementiel et intro animée. Découvrez <L href="/galerie">nos réalisations</L> et <L href="/equipe">notre équipe</L>.</>,
      },
      {
        q: "Dans quelle zone géographique votre vidéaste intervient-il ?",
        a: "Nous intervenons principalement en Centre-Val de Loire : Orléans, Tours, Blois, Chartres, Bourges et environs. Les frais de déplacement sont calculés à 0,50 €/km aller-retour au-delà de 30 km.",
        rich: <>Nous intervenons principalement en Centre-Val de Loire : Orléans, Tours, Blois, Chartres, Bourges et environs. Les frais de déplacement sont calculés à 0,50 €/km aller-retour au-delà de 30 km. <L href="/contact">Contactez-nous</L> pour en discuter.</>,
      },
      {
        q: "Comment contacter Splice pour un projet vidéo ou photo ?",
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
        q: "Combien coûte un montage vidéo professionnel chez Splice ?",
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
        a: "Nous travaillons avec du matériel cinéma professionnel : caméras Sony FX3/FX6 4K, objectifs Sigma Art, stabilisateurs Ronin RS3 Pro, éclairages Aputure LED et micros cravates DPA broadcast.",
        rich: <>Nous travaillons avec du matériel cinéma professionnel : caméras Sony FX3/FX6 4K, objectifs Sigma Art, stabilisateurs Ronin RS3 Pro, éclairages Aputure LED et micros cravates DPA broadcast. Voyez le résultat dans <L href="/galerie">notre galerie</L>.</>,
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
        a: "Le délai standard de livraison est de 7 à 10 jours ouvrés après le tournage. Nous proposons aussi un délai étendu (15 jours) et une option express 48h (+50 €) pour les projets urgents.",
        rich: <>Le délai standard de livraison est de 7 à 10 jours ouvrés après le tournage. Nous proposons aussi un délai étendu (15 jours) et une <L href="/devis">option express 48h</L> (+50 €) pour les projets urgents.</>,
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
        q: "Proposez-vous un service de motion design et animation graphique ?",
        a: "Oui, nous créons des animations 2D/3D sur mesure : vidéos explicatives, intros animées, habillages graphiques et typographies animées. Nos animations motion design débutent à 29 € pour des habillages de montage, ou à 45 €/mois via nos abonnements.",
        rich: <>Oui, nous créons des <L href="/services/motion-design">animations 2D/3D sur mesure</L> : vidéos explicatives, intros animées, habillages graphiques et typographies animées. Nos animations motion design débutent à 29 € pour des habillages de montage, ou à 45 €/mois via nos abonnements.</>,
      },
      {
        q: "Réalisez-vous des films corporate et vidéos institutionnelles ?",
        a: "Oui, le film corporate est l'une de nos spécialités. Nous gérons l'intégralité du processus : écriture du script, tournage multi-caméras 4K, montage rythmé et étalonnage cinéma. Le délai moyen est de 3 à 6 semaines.",
        rich: <>Oui, le <L href="/services/production-corporate">film corporate</L> est l&apos;une de nos spécialités. Nous gérons l&apos;intégralité du processus : écriture du script, tournage multi-caméras 4K, montage rythmé et étalonnage cinéma. Le délai moyen est de 3 à 6 semaines. <L href="/devis">Estimez votre projet</L>.</>,
      },
      {
        q: "Faites-vous des photos professionnelles pour entreprise ?",
        a: "Oui. Nous réalisons portraits corporate, reportages métier, packshots produits et photos immobilier à Orléans et Tours. Les forfaits débutent à 15 € pour un pack de 5 photos retouchées, livrées sous 5 à 7 jours ouvrés.",
        rich: <>Oui. Nous réalisons <L href="/services/photographie-professionnelle">portraits corporate, reportages métier, packshots produits</L> et photos immobilier à Orléans et Tours. Les forfaits débutent à 15 € pour un pack de 5 photos retouchées, livrées sous 5 à 7 jours ouvrés.</>,
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
          <h2 className="font-display text-2xl uppercase tracking-tight">
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
