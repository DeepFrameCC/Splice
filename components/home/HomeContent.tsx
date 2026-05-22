"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import Nav from "@/components/layout/Nav";
import ClientShell from "@/components/home/ClientShell";

interface HomeContentProps {
  user?: { name: string; role: string } | null;
}

export default function HomeContent({ user }: HomeContentProps) {
  return (
    <>
      <ClientShell />
      <div className="df-site">
        <div className="df-root">
          <Nav user={user} />
          <Hero />
          <Showreel />
          <Marquee />
          <VideoReel />
          <About />
          <Services />
          <GalleryTeaser />
          <Testimonials />
          <Pricing />
          <HomeFAQ />
          <Quote />
          <Footer />
        </div>
      </div>
    </>
  );
}

function Showreel() {
  const clips: { tag: string; title: string; tc: string; ratio: number; src: string; type: "video" | "image"; credit?: string }[] = [
    { tag: "Pub automobile", title: "Alpine A110 — Lignes Bleues", tc: "00:33", ratio: 9 / 16, src: "/videos/AlpineA110.mp4", type: "video", credit: "papi" },
    { tag: "Clip", title: "West Side — Vibe Urbaine", tc: "00:31", ratio: 9 / 16, src: "/videos/West Side.mp4", type: "video", credit: "ty" },
    { tag: "Pub automobile", title: "Porsche 911 — Pose PPF", tc: "00:36", ratio: 16 / 9, src: "/videos/ppf-cklean-auto.mp4", type: "video", credit: "papi" },
    { tag: "Interview", title: "CKCLEANAUTO45", tc: "00:50", ratio: 4 / 3, src: "/videos/interview-cklean-auto.mp4", type: "video", credit: "by.louisia" },
    { tag: "Shooting automobile", title: "Porsche — Travail détail", tc: "00:38", ratio: 4 / 3, src: "/photos/travail-porsche.jpg", type: "image", credit: "by.louisia" },
    { tag: "Pub locale", title: "Bistrot de la Croix Morin", tc: "00:22", ratio: 9 / 16, src: "/videos/bistrot-orleans.mp4", type: "video", credit: "ty" },
    { tag: "Clip", title: "Time — Par Fayad", tc: "00:23", ratio: 9 / 16, src: "/videos/time-fayad.mp4", type: "video", credit: "papi" },
  ];
  const loop = [...clips, ...clips];

  return (
    <section className="df-showreel" aria-label="Showreel">
      <div className="df-showreel-head">
        <span className="df-showreel-eyebrow">
          <i /> Showreel · 2026
        </span>
        <span className="df-showreel-meta">{clips.length} projets récents · survolez pour voir</span>
      </div>
      <div className="df-showreel-track">
        <div className="df-showreel-loop">
          {loop.map((c, index) => (
            <article
              key={index}
              className="df-clip"
              style={{ aspectRatio: c.ratio }}
            >
              {c.type === "video" ? (
                <video
                  className="df-clip-media"
                  src={c.src}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onMouseEnter={(e) => { void e.currentTarget.play().catch(() => {}); }}
                  onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                />
              ) : (
                <Image className="df-clip-media" src={c.src} alt={c.title} width={400} height={300} loading="lazy" unoptimized />
              )}
              <div className="df-clip-noise" />
              <div className="df-clip-corners"><i /><i /><i /><i /></div>
              <div className="df-clip-tc">{c.tc}</div>
              <div className="df-clip-meta">
                <span>{c.tag}</span>
                <b>{c.title}</b>
                {c.credit && <span className="df-clip-credit">@ {c.credit}</span>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section className="df-hero">
      <div className="df-hero-meta">
        <span className="df-dot" /> Boîte de production · Orléans · Tours
      </div>
      <h1 className="df-hero-title">
        On filme. On cadre.<br />
        <em>On sublime.</em>
      </h1>
      <p className="df-hero-sub">
        Pubs sociales, shootings automobile, films de marque — production audiovisuelle complète à Orléans &amp; Tours.
      </p>
      <div className="df-hero-cta">
        <Link href="/devis" className="df-btn df-btn-primary">Demander un devis →</Link>
        <Link href="/galerie" className="df-btn df-btn-ghost">Voir les projets</Link>
      </div>

      <div className="df-hero-frame">
        <div className="df-hero-frame-inner">
          <video
            className="df-hero-video"
            src="/videos/presentation-louisia.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    "Pubs réseaux sociaux", "Shootings automobile", "Intro personnalisée",
    "Reels & TikTok", "Clips musicaux", "Photo produit", "Photos retouchées",

  ];
  return (
    <div className="df-marquee" aria-hidden="true">
      <div className="df-marquee-track">
        {[...items, ...items, ...items].map((s, i) => (
          <span key={i}>
            <i className="df-marquee-dot" />{s}
          </span>
        ))}
      </div>
    </div>
  );
}

function About() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          el.querySelectorAll(":scope > div").forEach((child) => child.classList.add("visible"));
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="df-section df-about">
      <div className="df-eyebrow">À propos</div>
      <div className="df-about-grid">
        <h2 className="df-h2">
          Une boîte de production qui pense l&apos;image comme un <em>levier</em> business.
        </h2>
        <div className="df-about-copy">
          <p>
            On accompagne PME et entreprises du Centre-Val de Loire — pubs sociales, shootings automobile, films de marque, événementiel. Production complète, livrables qui se regardent jusqu&apos;au bout.
          </p>
        </div>
      </div>
      <div className="df-stats" ref={statsRef}>
        <div><b>30+</b><span>Projets réalisés</span></div>
        <div><b>18</b><span>Mois dans la région</span></div>
        <div><b>48h</b><span>Délai express possible</span></div>
        <div><b>4K</b><span>Réalisations</span></div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      n: "01", title: "Pub réseaux sociaux",
      body: "Reels, TikTok, formats verticaux pensés pour la performance. Du concept au montage final.",
      tags: ["Reels", "TikTok", "Format vertical"],
    },
    {
      n: "02", title: "Shooting automobile",
      body: "Photo & vidéo voiture, en studio mobile ou décor. Concessionnaires, importateurs, collectionneurs.",
      tags: ["Photo", "Rolling shot"],
    },
    {
      n: "03", title: "Intro animée",
      body: "Une introduction animée sur mesure pour votre marque. Durée 5 à 20 secondes. Format adapté à vos supports",
      tags: ["Intro animée"],
    },
    {
      n: "04", title: "Evenementiel",
      body: "Un film sur mesure pour votre événement.",
      tags: ["Aftermovie", "Multicam", "Live"],
    },
  ];
  return (
    <section id="services" className="df-section df-services">
      <div className="df-section-head">
        <div className="df-eyebrow">Services</div>
        <h2 className="df-h2">Ce qu&apos;on fait, <em>vraiment bien</em>.</h2>
      </div>
      <div className="df-services-grid">
        {services.map((s) => (
          <article key={s.n} className="df-service">
            <div className="df-service-n">{s.n}</div>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
            <div className="df-tags">
              {s.tags.map((t) => <span key={t}>{t}</span>)}
            </div>
          </article>
        ))}
      </div>
      <Link href="/services" className="df-services-link">
        Découvrir tous nos services →
      </Link>
    </section>
  );
}

function GalleryTeaser() {
  return (
    <section id="projects" className="df-section df-gallery-teaser">
      <div className="df-section-head">
        <div className="df-eyebrow">Nos réalisations</div>
        <h2 className="df-h2">Le travail de <em>chacun</em>.</h2>
      </div>

      <div className="df-teaser-grid">
        <Link href="/galerie" className="df-teaser-card df-teaser-a">
          <div className="df-teaser-noise" />
          <div className="df-teaser-corners"><i /><i /><i /><i /></div>
          <div className="df-teaser-inner">
            <span className="df-teaser-tag">Photos · Vidéos</span>
            <h3>Galerie complète</h3>
            <p>Toutes nos réalisations réunies en un seul endroit.</p>
            <span className="df-teaser-cta">Explorer &rarr;</span>
          </div>
        </Link>

        <Link href="/equipe" className="df-teaser-card df-teaser-b">
          <div className="df-teaser-noise" />
          <div className="df-teaser-corners"><i /><i /><i /><i /></div>
          <div className="df-teaser-inner">
            <span className="df-teaser-tag">Papi · Louisia · Ty</span>
            <h3>Portfolios</h3>
            <p>L&apos;univers visuel de chaque membre de l&apos;équipe.</p>
            <span className="df-teaser-cta">Découvrir &rarr;</span>
          </div>
        </Link>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      q: "Équipe au top, dynamique et à l'écoute. Les vidéos sont tops et parfaitement adaptées pour notre compte Insta.",
      a: "Kevin", r: "CKCleanAuto45 · Saran",
    },
    {
      q: "Un rendu pro, livré rapidement. Ils ont su capter l'univers de notre marque dès la première session.",
      a: "Clément", r: "Pixel 404 · Orléans",
    },
    {
      q: "Super expérience du début à la fin, le résultat reflète parfaitement l'ambiance de notre établissement.",
      a: "Gérant(e)", r: "Bistrot Croix Morant · Orléans",
    },
  ];
  return (
    <section className="df-section df-testimonials">
      <div className="df-eyebrow">Ils nous ont fait confiance</div>
      <div className="df-testimonials-grid">
        {items.map((it, i) => (
          <figure key={i} className="df-testimonial">
            <div className="df-quote-mark">&ldquo;</div>
            <blockquote>{it.q}</blockquote>
            <figcaption>
              <b>{it.a}</b><span>{it.r}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Standard", price: "49 €", unit: "/mois",
      pitch: "Pour démarrer sans gros budget.",
      feats: [
        { name: "2 vidéos sources / mois", active: true },
        { name: "Recyclage multi-réseaux", active: true },
        { name: "Formats 9:16 + 16:9", active: true },
        { name: "Podcasts courts / mois", active: false },
        { name: "Cadrage stratégique mensuel", active: false },
        { name: "Option express 48h", active: false },
      ],
    },
    {
      name: "Pro", price: "99 €", unit: "/mois",
      pitch: "Pour publier toutes les semaines.",
      feats: [
        { name: "5 vidéos sources / mois", active: true },
        { name: "Recyclage multi-réseaux", active: true },
        { name: "Formats 9:16 + 16:9", active: true },
        { name: "2 podcasts courts / mois", active: true },
        { name: "Cadrage stratégique mensuel", active: true },
        { name: "Option express 48h", active: false },
      ],
      featured: true,
    },
    {
      name: "Premium", price: "189 €", unit: "/mois",
      pitch: "Pour une présence quasi quotidienne.",
      feats: [
        { name: "8 vidéos sources / mois", active: true },
        { name: "Recyclage multi-réseaux", active: true },
        { name: "Formats 9:16 + 16:9", active: true },
        { name: "4 podcasts courts / mois", active: true },
        { name: "Cadrage stratégique mensuel", active: true },
        { name: "Option express 48h", active: true },
      ],
    },
  ];
  return (
    <section id="pricing" className="df-section df-pricing">
      <div className="df-section-head">
        <div className="df-eyebrow">Tarifs</div>
        <h2 className="df-h2">Trois formules, <em>une exigence</em>.</h2>
      </div>
      <div className="df-pricing-grid df-pricing-grid-4">
        {/* Formule Bienvenue */}
        <div className="df-plan df-plan-bienvenue">
          <div className="df-plan-badge df-plan-badge-gold">Gratuit</div>
          <h3>Bienvenue</h3>
          <div className="df-plan-price">0 €</div>
          <p className="df-plan-pitch">1 par client · Places limitées</p>
          <ul className="df-plan-feats">
            {[
              "2 stories offertes",
              "5 photos offertes",
              "Découverte de notre univers",
              "Sans engagement",
            ].map((f) => (
              <li key={f} className="feat-active">
                <span className="feat-icon active-icon">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link href="/devis" className="df-btn df-btn-outline">Demander ma formule</Link>
        </div>

        {plans.map((p) => (
          <div key={p.name} className={"df-plan" + (p.featured ? " df-plan-featured" : "")}>
            {p.featured && <div className="df-plan-badge">Recommandé</div>}
            <h3>{p.name}</h3>
            <div className="df-plan-price">{p.price}<span className="df-plan-unit">{p.unit}</span></div>
            <p className="df-plan-pitch">{p.pitch}</p>
            <ul className="df-plan-feats">
              {p.feats.map((f) => (
                <li key={f.name} className={f.active ? "feat-active" : "feat-inactive"}>
                  <span className={"feat-icon " + (f.active ? "active-icon" : "inactive-icon")}>
                    {f.active ? "✓" : "✕"}
                  </span>
                  <span>{f.name}</span>
                </li>
              ))}
            </ul>
            <Link href="/devis" className={"df-btn " + (p.featured ? "df-btn-primary" : "df-btn-outline")}>Demander un devis</Link>
          </div>
        ))}
      </div>
      <div className="df-pricing-extra-card">
        <div className="df-pricing-extra-badge">Prestations à la carte</div>
        <p className="df-pricing-extra-text">
          <strong>Besoin ponctuel ?</strong> Découvrez notre <span>Pack Particulier dès 29 €</span> — des réalisations photos et vidéos sur-mesure adaptées à vos besoins spécifiques.
        </p>
      </div>
      <Link href="/tarifs" className="df-services-link">
        Comparer toutes les formules →
      </Link>
    </section>
  );
}

function HomeFAQ() {
  const faqs = [
    {
      q: "Quels sont vos tarifs et vos formules ?",
      a: (
        <>
          Nos abonnements professionnels démarrent à{" "}
          <Link href="/tarifs" className="text-df-gold hover:underline">
            45 €/mois
          </Link>{" "}
          (formule Standard en engagement annuel). Pour des besoins plus ponctuels, nos packs de vidéos individuelles commencent à{" "}
          <Link href="/tarifs" className="text-df-gold hover:underline">
            29 €/vidéo
          </Link>{" "}
          et nos packs de photos à{" "}
          <Link href="/tarifs" className="text-df-gold hover:underline">
            15 €
          </Link>
          . Vous pouvez également simuler librement votre budget sur notre{" "}
          <Link href="/devis" className="text-df-gold hover:underline">
            générateur de devis
          </Link>
          .
        </>
      ),
    },
    {
      q: "Dans quelle zone géographique intervenez-vous ?",
      a: (
        <>
          Nous sommes basés entre Orléans et Tours, et nous nous déplaçons sur l&apos;ensemble de la région Centre-Val de Loire (Loiret, Indre-et-Loire, Loir-et-Cher, etc.) pour réaliser tous nos tournages et nos prises de vues par drone. Les frais de déplacement sont calculés de manière 100 % transparente à 0,50 €/km A/R.
        </>
      ),
    },
    {
      q: "Quels sont les délais de livraison pour mes vidéos ?",
      a: (
        <>
          Nous livrons généralement votre premier montage sous 7 à 10 jours ouvrés après le tournage ou la réception de vos rushes. Si vous êtes pressé par une deadline imminente ou le lancement d&apos;une campagne, nous proposons également une option de livraison express sous 48h.
        </>
      ),
    },
  ];

  return (
    <section className="df-section df-home-faq max-w-4xl mx-auto px-6">
      <div className="df-section-head text-center mb-10">
        <div className="df-eyebrow">Des réponses à vos questions</div>
        <h2 className="df-h2">Questions <em>fréquentes</em></h2>
      </div>

      <div className="space-y-4 mb-10">
        {faqs.map((faq, idx) => (
          <details
            key={idx}
            className="group rounded-2xl bg-white/[0.02] border border-white/[0.08] transition duration-300 hover:bg-white/[0.04]"
          >
            <summary className="flex cursor-pointer items-center justify-between p-5 font-bold text-white outline-none select-none">
              <span className="text-base sm:text-lg">{faq.q}</span>
              <span className="ml-4 text-df-gold transition-transform duration-300 group-open:rotate-45 text-xl">
                +
              </span>
            </summary>
            <div className="px-5 pb-5 text-sm sm:text-base leading-relaxed text-white/70 border-t border-white/[0.04] pt-4">
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 gap-4">
        <p className="text-sm text-white/70 text-center sm:text-left">
          <span className="font-semibold text-white">Une question fréquente ?</span> Consultez notre FAQ complète.
        </p>
        <Link
          href="/faq"
          className="text-sm font-semibold text-df-gold hover:text-white transition-colors flex items-center gap-1 group"
        >
          <span>Voir la FAQ</span>
          <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}

function Quote() {
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      nom: fd.get("nom") as string,
      email: fd.get("email") as string,
      type: fd.get("type") as string,
      budget: fd.get("budget") as string,
      brief: fd.get("brief") as string,
    };

    setSending(true);
    const { submitContact } = await import("@/app/actions/contact");
    const result = await submitContact(payload);
    setSending(false);

    if (result.success) {
      toast.success("Demande envoyée ! On revient vers vous sous 24h.");
      form.reset();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <>
    <section id="quote" className="df-section df-quote">
      <div className="df-quote-card">
        <div>
          <div className="df-eyebrow df-eyebrow-light">Demander un devis</div>
          <h2 className="df-h2 df-h2-light">
            Réponse en <em>moins de 24h</em>.<br />
            Pré-devis gratuit, sans engagement.
          </h2>
          <p className="df-quote-sub">Dites-nous ce que vous avez en tête. On revient vers vous avec un plan, un budget et une date.</p>
        </div>

        <form className="df-form" onSubmit={handleSubmit}>
          <label>
            <span>Vous êtes</span>
            <input name="nom" type="text" placeholder="Marie Dupont — Studio Lalou" required />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" placeholder="marie@lalou.fr" required />
          </label>
          <label>
            <span>Type de projet</span>
            <select name="type" defaultValue="" required>
              <option value="" disabled>Choisir…</option>
              <option>Pub réseaux sociaux</option>
              <option>Shooting automobile</option>
              <option>Intro animée</option>
              <option>Événement</option>
              <option>Autre</option>
            </select>
          </label>
          <label>
            <span>Budget envisagé</span>
            <select name="budget" defaultValue="" required>
              <option value="" disabled>Choisir…</option>
              <option>&lt; 1000€</option>
              <option>1 000 — 3000 €</option>
              <option>&gt; 3000€</option>
            </select>
          </label>
          <label className="df-form-full">
            <span>Brief</span>
            <textarea name="brief" rows={4} placeholder="Le contexte, l'objectif, la deadline…" required />
          </label>
          <button type="submit" disabled={sending} className="df-btn df-btn-primary df-btn-lg df-form-full" style={sending ? { opacity: 0.6 } : undefined}>
            {sending ? "Envoi en cours…" : "Envoyer ma demande →"}
          </button>
        </form>
      </div>
    </section>

    </>
  );
}

function Footer() {
  return (
    <footer className="df-footer">
      <div className="df-footer-top">
        <div>
          <div className="df-footer-mark">
            <span className="font-display text-lg font-bold tracking-wide text-white">DEEP<span className="text-[#F36B1F]">FRAME</span></span>
          </div>
          <p>Boîte de production audiovisuelle.<br />Orléans · Tours · partout en région.</p>
        </div>
        <div>
          <h3>Navigation</h3>
          <ul>
            <li><a href="#about">À propos</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#projects">Projets</a></li>
            <li><Link href="/tarifs">Tarifs</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h3>Contact</h3>
          <ul>
            <li>contact@deepframe.cc</li>
            <li>Orléans, 45000</li>
          </ul>
        </div>
        <div>
          <h3>Suivre</h3>
          <ul>
            <li><a href="https://www.instagram.com/deepframe.cc/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://www.facebook.com/profile.php?id=61589292522120" target="_blank" rel="noopener noreferrer">Facebook</a></li>
          </ul>
        </div>
      </div>
      <div className="df-footer-bot">
        <span>© 2026 DeepFrame · Tous droits réservés</span>
        <span><Link href="/mentions-legales">Mentions légales</Link> · <Link href="/confidentialite">Confidentialité</Link> · <Link href="/cookies">Cookies</Link></span>
      </div>
    </footer>
  );
}

// ── Video Reel Band ──────────────────────────────────────────────────────────
const VIDEO_SRC = "/videos/jeanne-darc.mp4";

function VideoReel() {
  return (
    <section className="df-vr" aria-label="Showreel DeepFrame">

      {/* Fond : vidéo ou gradient placeholder */}
      {VIDEO_SRC ? (
        <video
          className="df-vr-video"
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      ) : (
        <div className="df-vr-placeholder" aria-hidden="true" />
      )}

      {/* Overlay sombre pour lisibilité */}
      <div className="df-vr-overlay" aria-hidden="true" />

      {/* Grain cinéma */}
      <div className="df-vr-noise" aria-hidden="true" />

      {/* Contenu bas-gauche */}
      <div className="df-vr-body" style={{ alignItems: "flex-start", justifyContent: "flex-end" }}>
        <span className="df-vr-eyebrow">
          <i className="df-vr-rec" />
          Showreel · 2026
        </span>
        <Link href="/galerie" className="df-vr-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
          Voir nos projets
        </Link>
      </div>

      {/* Coins caméra déco */}
      <div className="df-vr-corners" aria-hidden="true">
        <i /><i /><i /><i />
      </div>

      {/* Timecode déco */}
      <div className="df-vr-tc" aria-hidden="true">TC 00:02:34:18 · 4K · 50fps</div>
    </section>
  );
}
