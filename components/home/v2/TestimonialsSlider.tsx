import { testimonials } from "@/lib/home/testimonials";

/**
 * Avis clients — 3 cartes côte à côte (maquette accueil.html).
 * Contenu : lib/home/testimonials.ts. Guillemet « orange, phrase clé
 * (champ highlight) en orange sans italique, nom 700 + méta atténuée.
 *
 * Le slider interactif V2 (flèches/dots/clavier) est remplacé par une
 * grille statique : les 3 avis sont visibles d'un coup. Le reveal au
 * scroll est assuré par LandingAnimations (cible .df-testimonial /
 * .df-testimonials-grid, avec fallback prefers-reduced-motion).
 */
export default function TestimonialsSlider() {
  return (
    <section className="df-testimonials-section" aria-label="Témoignages clients">
      <div className="df-testimonials-head">
        <span className="df-testimonials-eyebrow">Avis clients</span>
        <h2 className="df-testimonials-h2">
          Ils nous font <em>confiance</em><span style={{ color: "#F36B1F" }}>.</span>
        </h2>
      </div>

      <div className="df-testimonials-grid">
        {testimonials.map((t) => {
          const parts = t.quote.split(t.highlight);
          return (
            <figure key={t.id} className="df-testimonial">
              <span className="df-quote-mark" aria-hidden="true">«</span>
              <blockquote>
                {parts[0]}
                <em>{t.highlight}</em>
                {parts[1]}
              </blockquote>
              <figcaption>
                <b>{t.author}</b>
                <span>{t.location} · {t.service} · {t.date}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
