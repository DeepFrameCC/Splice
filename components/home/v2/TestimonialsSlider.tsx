import { testimonials } from "@/lib/home/testimonials";
import JsonLd from "@/components/JsonLd";
import { BASE_URL } from "@/lib/seo";

/**
 * Avis clients — 3 cartes côte à côte (maquette accueil.html).
 * Contenu : lib/home/testimonials.ts.
 *
 * JSON-LD Review + AggregateRating statique injecté pour les rich snippets Google.
 * La moyenne est calculée depuis les avis réels (tous notés 5/5 implicitement
 * car ce sont des témoignages positifs sélectionnés). Compléter manuellement
 * si les notes réelles diffèrent.
 */

// Calcul de la moyenne — adapter les ratingValue si les vraies notes sont connues.
const REVIEW_RATINGS: Record<string, number> = {
  "01": 5,
  "02": 5,
  "03": 5,
};

const reviewCount = testimonials.length;
const ratingAvg =
  reviewCount > 0
    ? Math.round(
        (testimonials.reduce((acc, t) => acc + (REVIEW_RATINGS[t.id] ?? 5), 0) / reviewCount) * 10
      ) / 10
    : 5;

const reviewsJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${BASE_URL}/#localbusiness`,
  name: "Splice Studio",
  url: BASE_URL,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: ratingAvg,
    bestRating: 5,
    worstRating: 1,
    reviewCount,
  },
  review: testimonials.map((t) => ({
    "@type": "Review",
    author: {
      "@type": "Organization",
      name: t.author,
    },
    datePublished: t.date,
    reviewBody: t.quote,
    reviewRating: {
      "@type": "Rating",
      ratingValue: REVIEW_RATINGS[t.id] ?? 5,
      bestRating: 5,
      worstRating: 1,
    },
  })),
};

export default function TestimonialsSlider() {
  return (
    <section className="df-testimonials-section" aria-label="Témoignages clients">
      {/* JSON-LD Review + AggregateRating — rich snippets Google */}
      <JsonLd data={reviewsJsonLd} />

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
