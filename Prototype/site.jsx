// DeepFrame — sections du site

function Site() {
  return (
    <div className="df-root">
      <Nav />
      <Hero />
      <Showreel />
      <Marquee />
      <About />
      <Services />
      <Projects />
      <Testimonials />
      <Pricing />
      <Team />
      <Quote />
      <Footer />
    </div>
  );
}

function Showreel() {
  // Each "clip" is a stylized poster frame, with timecode, label and a play affordance
  const clips = [
    { tag: "Pub auto",      title: "Porsche 911",        tc: "01:24",  i: 0, ratio: 16/9 },
    { tag: "Brand film",    title: "Maison Lalou",       tc: "00:52",  i: 1, ratio: 4/3 },
    { tag: "Reel",          title: "Pop-up café",        tc: "00:14",  i: 2, ratio: 9/16 },
    { tag: "Aftermovie",    title: "Festival d'été",     tc: "02:08",  i: 3, ratio: 16/9 },
    { tag: "Shooting",      title: "BMW M2 — sunset",    tc: "00:38",  i: 4, ratio: 4/3 },
    { tag: "Pub sociale",   title: "Atelier Joaillier",  tc: "00:21",  i: 5, ratio: 9/16 },
    { tag: "Doc court",     title: "Vignerons du Loiret",tc: "03:45",  i: 1, ratio: 16/9 },
    { tag: "Clip",          title: "Naya — Paloma",      tc: "01:11",  i: 2, ratio: 4/3 },
  ];
  // Duplicate for seamless infinite scroll
  const loop = [...clips, ...clips];

  return (
    <section className="df-showreel" aria-label="Showreel">
      <div className="df-showreel-head">
        <span className="df-showreel-eyebrow">
          <i /> Showreel · 2026
        </span>
        <span className="df-showreel-meta">8 projets récents · survolez pour voir</span>
      </div>
      <div className="df-showreel-track">
        <div className="df-showreel-loop">
          {loop.map((c, i) => (
            <article
              key={i}
              className="df-clip"
              data-i={c.i}
              style={{ aspectRatio: c.ratio }}
            >
              <div className="df-clip-noise" />
              <div className="df-clip-corners"><i /><i /><i /><i /></div>
              <div className="df-clip-tc">{c.tc}</div>
              <button className="df-clip-play" aria-label={`Lire ${c.title}`}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <div className="df-clip-meta">
                <span>{c.tag}</span>
                <b>{c.title}</b>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Nav() {
  return (
    <header className="df-nav">
      <a href="#" className="df-logo-mark" aria-label="DeepFrame">
        <img src="assets/deepframe-logo.svg" alt="" />
        <span>DEEPFRAME</span>
      </a>
      <nav className="df-nav-links">
        <a href="#about">À propos</a>
        <a href="#services">Services</a>
        <a href="#projects">Projets</a>
        <a href="#pricing">Tarifs</a>
        <a href="#team">Équipe</a>
      </nav>
      <div className="df-nav-cta">
        <a href="Espace Equipe.html" className="df-nav-staff">Espace équipe →</a>
        <a href="#quote" className="df-btn df-btn-primary df-btn-sm">Demandez votre devis</a>
      </div>
    </header>
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
        DeepFrame embellit les marques avec des publicités sociales, des shootings auto
        et des contenus audiovisuels qui se regardent jusqu'au bout.
      </p>
      <div className="df-hero-cta">
        <a href="#quote" className="df-btn df-btn-primary">Demandez votre devis →</a>
        <a href="#projects" className="df-btn df-btn-ghost">Voir les projets</a>
      </div>

      <div className="df-hero-frame">
        <div className="df-hero-frame-inner">
          <div className="df-rec"><span /> REC · 04:21</div>
          <div className="df-frame-corners">
            <i /><i /><i /><i />
          </div>
          <div className="df-frame-stats">
            <div><b>4K</b><span>50fps</span></div>
            <div><b>f/2.8</b><span>24mm</span></div>
            <div><b>ISO 400</b><span>shutter 1/100</span></div>
          </div>
          <div className="df-frame-tag">SHOT 042 · TAKE 03 · LOIRET</div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    "Pubs réseaux sociaux", "Shootings automobile", "Films de marque",
    "Reels & TikTok", "Clips musicaux", "Aftermovies", "Photo produit",
    "Documentaires courts", "Direction artistique",
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
  return (
    <section id="about" className="df-section df-about">
      <div className="df-eyebrow">À propos</div>
      <div className="df-about-grid">
        <h2 className="df-h2">
          Une boîte de production qui pense l'image comme un <em>levier</em> business.
        </h2>
        <div className="df-about-copy">
          <p>
            Basés à Orléans et Tours, on accompagne les marques de la région — et au-delà —
            sur tout ce qui touche à l'audiovisuel. Pubs sociales, shootings auto,
            contenus de marque, captations événementielles.
          </p>
          <p>
            Petite équipe, gros matériel, vraies idées. On écrit, on tourne, on monte,
            on étalonne — et on livre des films qui font le job.
          </p>
        </div>
      </div>
      <div className="df-stats">
        <div><b>+120</b><span>Films livrés</span></div>
        <div><b>9</b><span>Ans dans la région</span></div>
        <div><b>48h</b><span>Délai express possible</span></div>
        <div><b>4K · 6K</b><span>Cinéma & broadcast</span></div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      n: "01", title: "Pub réseaux sociaux",
      body: "Reels, TikTok, formats verticaux pensés pour la performance. Du concept au montage final.",
      tags: ["Reels", "TikTok", "Meta Ads"],
    },
    {
      n: "02", title: "Shooting automobile",
      body: "Photo & vidéo voiture, en studio mobile ou décor. Concessionnaires, importateurs, collectionneurs.",
      tags: ["Photo", "Rolling shot", "Drone"],
    },
    {
      n: "03", title: "Films de marque",
      body: "Brand content, documentaires courts, manifestes. On raconte ce qui rend votre marque vraie.",
      tags: ["Brand film", "Doc", "Interview"],
    },
    {
      n: "04", title: "Captation événementielle",
      body: "Aftermovies, lancements, salons. Multicam, son léger, livraison rapide.",
      tags: ["Aftermovie", "Multicam", "Live"],
    },
  ];
  return (
    <section id="services" className="df-section df-services">
      <div className="df-section-head">
        <div className="df-eyebrow">Services</div>
        <h2 className="df-h2">Ce qu'on fait, <em>vraiment bien</em>.</h2>
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
    </section>
  );
}

function Projects() {
  const projects = [
    { tag: "Automobile", title: "Porsche 911 — Loire Edition", client: "Concession privée · Tours", ratio: 4/5 },
    { tag: "Brand film",  title: "Maison Lalou — la première gorgée", client: "Vignoble · Sancerre", ratio: 16/9 },
    { tag: "Reel",        title: "Saison 2 — Pop-up café", client: "Roastery · Orléans", ratio: 9/16 },
    { tag: "Aftermovie",  title: "Festival d'été 2025", client: "Métropole d'Orléans", ratio: 16/9 },
    { tag: "Shooting",    title: "BMW M2 — sunset roll", client: "Importateur · Blois", ratio: 4/5 },
    { tag: "Pub sociale", title: "L'Atelier joaillier", client: "E-commerce · Tours", ratio: 9/16 },
  ];
  return (
    <section id="projects" className="df-section df-projects">
      <div className="df-section-head">
        <div className="df-eyebrow">Projets sélectionnés</div>
        <h2 className="df-h2">Ce qu'on a tourné <em>récemment</em>.</h2>
      </div>
      <div className="df-projects-grid">
        {projects.map((p, i) => (
          <a className="df-project" key={i} style={{ aspectRatio: p.ratio }}>
            <div className="df-project-thumb" data-i={i % 3}>
              <div className="df-project-corners"><i /><i /><i /><i /></div>
              <div className="df-project-tc">TC 00:0{i+1}:23:11</div>
            </div>
            <div className="df-project-meta">
              <span className="df-project-tag">{p.tag}</span>
              <h3>{p.title}</h3>
              <span className="df-project-client">{p.client}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      q: "On a doublé le taux de complétion sur nos reels Insta. Le passage chez DeepFrame a vraiment changé la donne.",
      a: "Camille R.", r: "Directrice marketing — Maison Lalou",
    },
    {
      q: "Shooting auto livré en 5 jours, étalonnage parfait. C'est rare de voir autant de soin sur un format aussi rapide.",
      a: "Julien M.", r: "Concession indépendante — Tours",
    },
    {
      q: "L'aftermovie a tourné en boucle sur nos comptes pendant deux semaines. Brief respecté à 100%.",
      a: "Léa F.", r: "Métropole d'Orléans",
    },
  ];
  return (
    <section className="df-section df-testimonials">
      <div className="df-eyebrow">Ils en parlent</div>
      <div className="df-testimonials-grid">
        {items.map((it, i) => (
          <figure key={i} className="df-testimonial">
            <div className="df-quote-mark">"</div>
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
      name: "Reel", price: "à partir de 890 €",
      pitch: "Un format vertical, calibré pour les réseaux.",
      feats: ["Demi-journée tournage", "Montage + étalonnage", "1 livraison + 2 retouches", "Sous-titres FR"],
      cta: "Demander un devis",
    },
    {
      name: "Signature", price: "à partir de 2 400 €",
      pitch: "Le bon équilibre pour une campagne ou un shooting auto.",
      feats: ["Journée complète", "Repérage + DA", "Films 16:9 + 9:16", "Photos retouchées (10)", "3 cycles de retouche"],
      cta: "Réserver une date",
      featured: true,
    },
    {
      name: "Devis personnalisé", price: "sur mesure",
      pitch: "Brand film, documentaire, campagne complète.",
      feats: ["Écriture + scénario", "Équipe étendue", "6K · drone · steadicam", "Étalonnage cinéma", "Versions multi-formats"],
      cta: "Parlons-en",
    },
  ];
  return (
    <section id="pricing" className="df-section df-pricing">
      <div className="df-section-head">
        <div className="df-eyebrow">Tarifs</div>
        <h2 className="df-h2">Trois formats, <em>une exigence</em>.</h2>
      </div>
      <div className="df-pricing-grid">
        {plans.map((p) => (
          <div key={p.name} className={"df-plan" + (p.featured ? " df-plan-featured" : "")}>
            {p.featured && <div className="df-plan-badge">Le plus demandé</div>}
            <h3>{p.name}</h3>
            <div className="df-plan-price">{p.price}</div>
            <p className="df-plan-pitch">{p.pitch}</p>
            <ul>
              {p.feats.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <a href="#quote" className={"df-btn " + (p.featured ? "df-btn-primary" : "df-btn-outline")}>{p.cta}</a>
          </div>
        ))}
      </div>
    </section>
  );
}

function Team() {
  const team = [
    { n: "Papi",    r: "Réalisateur & DOP" },
    { n: "Louisia", r: "Productrice" },
    { n: "Tracy",   r: "Monteuse · étalonneuse" },
  ];
  return (
    <section id="team" className="df-section df-team">
      <div className="df-section-head">
        <div className="df-eyebrow">Équipe</div>
        <h2 className="df-h2">Trois <em>artisans</em> de l'image.</h2>
      </div>
      <div className="df-team-grid">
        {team.map((m, i) => (
          <div key={m.n} className="df-member">
            <div className="df-member-photo" data-i={i}>
              <div className="df-member-initials">{m.n[0]}</div>
            </div>
            <h3>{m.n}</h3>
            <span>{m.r}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Quote() {
  return (
    <section id="quote" className="df-section df-quote">
      <div className="df-quote-card">
        <div>
          <div className="df-eyebrow df-eyebrow-light">Demandez votre devis</div>
          <h2 className="df-h2 df-h2-light">
            On répond en <em>moins de 24h</em>.<br />
            Pré-devis gratuit, sans engagement.
          </h2>
          <p className="df-quote-sub">Dites-nous ce que vous avez en tête. On revient vers vous avec un plan, un budget et une date.</p>
        </div>

        <form className="df-form" onSubmit={(e) => e.preventDefault()}>
          <label>
            <span>Vous êtes</span>
            <input type="text" placeholder="Marie Dupont — Studio Lalou" />
          </label>
          <label>
            <span>Email</span>
            <input type="email" placeholder="marie@lalou.fr" />
          </label>
          <label>
            <span>Type de projet</span>
            <select defaultValue="">
              <option value="" disabled>Choisir…</option>
              <option>Pub réseaux sociaux</option>
              <option>Shooting automobile</option>
              <option>Film de marque</option>
              <option>Aftermovie / événement</option>
              <option>Autre</option>
            </select>
          </label>
          <label>
            <span>Budget envisagé</span>
            <select defaultValue="">
              <option value="" disabled>Choisir…</option>
              <option>&lt; 1 500 €</option>
              <option>1 500 — 5 000 €</option>
              <option>5 000 — 15 000 €</option>
              <option>&gt; 15 000 €</option>
            </select>
          </label>
          <label className="df-form-full">
            <span>Brief</span>
            <textarea rows={4} placeholder="Le contexte, l'objectif, la deadline…" />
          </label>
          <button type="submit" className="df-btn df-btn-primary df-btn-lg df-form-full">
            Envoyer ma demande →
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="df-footer">
      <div className="df-footer-top">
        <div>
          <div className="df-footer-mark">
            <img src="assets/deepframe-logo.svg" alt="" />
            <span>DEEPFRAME</span>
          </div>
          <p>Boîte de production audiovisuelle.<br/>Orléans · Tours · partout en région.</p>
        </div>
        <div>
          <h4>Navigation</h4>
          <ul>
            <li><a href="#about">À propos</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#projects">Projets</a></li>
            <li><a href="#pricing">Tarifs</a></li>
            <li><a href="#team">Équipe</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li>hello@deepframe.fr</li>
            <li>+33 2 38 00 00 00</li>
            <li>Studio · 12 quai du Châtelet, Orléans</li>
          </ul>
        </div>
        <div>
          <h4>Suivre</h4>
          <ul>
            <li>Instagram</li>
            <li>Vimeo</li>
            <li>YouTube</li>
            <li>LinkedIn</li>
          </ul>
        </div>
      </div>
      <div className="df-footer-bot">
        <span>© 2026 DeepFrame · Tous droits réservés</span>
        <span>Mentions légales · Confidentialité</span>
      </div>
    </footer>
  );
}

window.Site = Site;
