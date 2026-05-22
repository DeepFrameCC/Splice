import Link from "next/link";
import CrewStackFocusCard from "./CrewStackFocusCard";

/**
 * Crew Stack — services en bento asymétrique.
 * Casse la grille 2x2 V1 : un service vedette (Pub sociale, focus, vidéo scope au hover)
 * + 3 services secondaires en escalier.
 */
export default function CrewStack() {
  return (
    <section className="df-cs" aria-label="Services DeepFrame">
      <div className="df-cs-head">
        <span className="df-cs-eyebrow">Services</span>
        <h2 className="df-cs-h2">Ce qu&apos;on cadre, <em>vraiment bien</em>.</h2>
      </div>

      <div className="df-cs-bento">
        {/* Bloc focus : Pub sociale */}
        <CrewStackFocusCard
          tag="Pack abonnement"
          title="Pub sociale"
          pitch="Reels et TikTok qui se regardent jusqu'au bout. Production récurrente, multi-format, recyclage multi-réseaux."
          priceFrom="Dès 45 €/mois"
          href="/services/pub-reseaux-sociaux"
          videoSrc="/videos/AlpineA110.mp4"
        />

        {/* Blocs secondaires */}
        <Link href="/services/shooting-automobile" className="df-cs-card df-cs-sec">
          <span className="df-cs-tag">À la carte</span>
          <h3 className="df-cs-title">Shooting automobile</h3>
          <p className="df-cs-pitch">Photo &amp; vidéo voiture, studio mobile ou décor. Concessionnaires, importateurs, collectionneurs.</p>
          <span className="df-cs-arrow">Voir le service →</span>
        </Link>

        <Link href="/services/intro-animee" className="df-cs-card df-cs-sec">
          <span className="df-cs-tag">Motion</span>
          <h3 className="df-cs-title">Intro animée</h3>
          <p className="df-cs-pitch">5 à 20 secondes sur mesure. Signature animée prête pour tous vos supports.</p>
          <span className="df-cs-arrow">Voir le service →</span>
        </Link>

        <Link href="/services/aftermovie-evenementiel" className="df-cs-card df-cs-wide">
          <span className="df-cs-tag">Sur devis</span>
          <h3 className="df-cs-title">Événementiel</h3>
          <p className="df-cs-pitch">Aftermovie, multicam, captation live. Un film sur mesure pour votre événement.</p>
          <span className="df-cs-arrow">Voir le service →</span>
        </Link>
      </div>

      <Link href="/services" className="df-cs-all">
        Découvrir tous les services →
      </Link>
    </section>
  );
}
