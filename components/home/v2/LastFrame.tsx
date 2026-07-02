import Link from "next/link";
import { Check } from "lucide-react";

/**
 * LastFrame — CTA final.
 * Carte arrondie 28px fond #0A0A1C (maquette accueil.html) : H2 sentence-case,
 * CTA orange, rangée de réassurance, contact.
 * RSC — no client interactivity needed.
 */
export default function LastFrame() {
  return (
    <section className="df-lf" aria-label="Demander un devis Splice Studio">
      <div className="df-lf-inner">
        <h2 className="df-lf-title">
          Votre projet, on s&apos;en occupe
          <br />
          comme si c&apos;était <em>le nôtre.</em>
        </h2>

        <Link href="/devis" className="df-btn df-btn-primary df-btn-lg df-lf-cta">
          Demander un devis →
        </Link>

        <ul className="df-lf-reassurance">
          <li><Check className="df-lf-reassurance-ic" aria-hidden="true" /> 15 projets livrés</li>
          <li><Check className="df-lf-reassurance-ic" aria-hidden="true" /> Devis gratuit sous 24h</li>
          <li><Check className="df-lf-reassurance-ic" aria-hidden="true" /> 2 retours inclus, sans engagement</li>
          <li><Check className="df-lf-reassurance-ic" aria-hidden="true" /> Paiement sécurisé Stripe</li>
        </ul>

        <div className="df-lf-meta">
          <a href="mailto:contact.splicestudio@gmail.com" className="df-lf-meta-link">contact.splicestudio@gmail.com</a>
          <span className="df-lf-sep">·</span>
          <a
            href="https://wa.me/33651109202"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="df-lf-meta-link"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
