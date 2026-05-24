import Link from "next/link";

/**
 * LastFrame — cinematic CTA section.
 * End-card aesthetic: full-screen, cine corners, single CTA.
 * Replaces HomeFAQ + Quote + Pricing from V1.
 * RSC — no client interactivity needed.
 */
export default function LastFrame() {
  return (
    <section className="df-lf" aria-label="Demander un devis Splice">
      {/* Cine corners */}
      <div className="df-cine-corners df-lf-corners" aria-hidden="true">
        <i /><i /><i /><i />
      </div>

      <div className="df-lf-inner">
        <h2 className="df-lf-title">
          Votre prochain projet,
          <br />
          on le cadre <em>ensemble.</em>
        </h2>

        <Link href="/devis" className="df-btn df-btn-primary df-btn-lg df-lf-cta">
          Demander un devis →
        </Link>

        <div className="df-lf-meta">
          <a href="mailto:contact.splicestudio@gmail.com" className="df-lf-meta-link">contact.splicestudio@gmail.com</a>
          <span className="df-lf-sep">·</span>
          <a
            href="https://wa.me/33651109202"
            target="_blank"
            rel="noopener noreferrer"
            className="df-lf-meta-link"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
