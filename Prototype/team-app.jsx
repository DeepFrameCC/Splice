// Splice Studio — Espace équipe
// Login fictif → Dashboard (devis, clients, export PDF)

const { useState, useEffect, useMemo, useRef } = React;

const SEED_CLIENTS = [
  { id: "c1", name: "Maison Lalou",        contact: "Camille Roux",     email: "camille@lalou.fr",     phone: "+33 6 12 34 56 78", city: "Sancerre",  since: "2024",  type: "Vignoble",         devis: 4 },
  { id: "c2", name: "Concession Verneuil", contact: "Julien Marchand",  email: "j.marchand@verneuil.fr", phone: "+33 6 23 45 67 89", city: "Tours",     since: "2023",  type: "Automobile",       devis: 9 },
  { id: "c3", name: "Métropole d'Orléans", contact: "Léa Fontaine",     email: "l.fontaine@orleans.fr", phone: "+33 6 34 56 78 90", city: "Orléans",   since: "2022",  type: "Institutionnel",   devis: 6 },
  { id: "c4", name: "Roastery Café",       contact: "Marc Petit",       email: "marc@roastery.fr",     phone: "+33 6 45 67 89 01", city: "Orléans",   since: "2025",  type: "Hospitality",      devis: 2 },
  { id: "c5", name: "Atelier Joaillier",   contact: "Sophie Bernard",   email: "sophie@joaillier.fr",  phone: "+33 6 56 78 90 12", city: "Tours",     since: "2024",  type: "Artisanat",        devis: 3 },
];

const SEED_QUOTES = [
  { id: "DF-2026-018", clientId: "c2", project: "BMW M2 — sunset roll", type: "Shooting auto",     status: "envoyé",   total: 4200, created: "2026-04-22", due: "2026-05-08" },
  { id: "DF-2026-017", clientId: "c1", project: "La première gorgée — saison 2", type: "Brand film", status: "accepté",  total: 8900, created: "2026-04-18", due: "2026-05-02" },
  { id: "DF-2026-016", clientId: "c3", project: "Aftermovie Festival d'été", type: "Aftermovie",   status: "brouillon",total: 6400, created: "2026-04-15", due: "2026-05-15" },
  { id: "DF-2026-015", clientId: "c4", project: "Pop-up café — reels saison 1", type: "Reel",       status: "accepté",  total: 1780, created: "2026-04-10", due: "2026-04-25" },
  { id: "DF-2026-014", clientId: "c5", project: "Collection capsule — pub IG", type: "Pub sociale", status: "envoyé",   total: 2950, created: "2026-04-04", due: "2026-04-20" },
  { id: "DF-2026-013", clientId: "c2", project: "Porsche 911 Loire Edition",   type: "Shooting auto", status: "accepté", total: 5400, created: "2026-03-28", due: "2026-04-15" },
  { id: "DF-2026-012", clientId: "c1", project: "Manifeste — 60s",             type: "Brand film",  status: "refusé",   total: 3200, created: "2026-03-21", due: "2026-04-04" },
];

const STATUS_META = {
  brouillon: { label: "Brouillon", color: "#94A3B8", bg: "rgba(148,163,184,.12)" },
  envoyé:    { label: "Envoyé",    color: "#F36B1F", bg: "rgba(243,107,31,.10)"   },
  accepté:   { label: "Accepté",   color: "#1F8A5B", bg: "rgba(31,138,91,.12)"  },
  refusé:    { label: "Refusé",    color: "#B91C1C", bg: "rgba(185,28,28,.10)"  },
};

const fmtEuro = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const fmtDate = (s) => new Date(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

// ──────────────────────────────────────────────────────────────────
// Login

function Login({ onLogin }) {
  const [email, setEmail] = useState("papi@splice.fr");
  const [pw, setPw] = useState("••••••••");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setErr("");
    if (!email.includes("@splice")) {
      setErr("Compte réservé à l'équipe Splice Studio.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const name = email.split("@")[0];
      onLogin({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        role: "Réalisateur"
      });
    }, 700);
  };

  return (
    <div className="df-login">
      <div className="df-login-left">
        <a href="Splice Studio Site.html" className="df-logo-mark df-logo-mark-light">
          <img src="assets/splice-logo.svg" alt="" />
          <span>SPLICE</span>
        </a>
        <div className="df-login-hero">
          <div className="df-eyebrow df-eyebrow-light">Espace équipe</div>
          <h1>Gérez les devis,<br/><em>du brief au signé</em>.</h1>
          <p>Connectez-vous pour accéder aux devis en cours, à la base clients et aux exports PDF.</p>
          <ul className="df-login-feat">
            <li><i /> Suivi devis en temps réel</li>
            <li><i /> Export PDF en un clic</li>
            <li><i /> Base clients centralisée</li>
            <li><i /> Stats équipe</li>
          </ul>
        </div>
        <div className="df-login-foot">© 2026 Splice Studio · Espace réservé</div>
      </div>

      <div className="df-login-right">
        <form className="df-login-form" onSubmit={submit}>
          <div className="df-tabs">
            <button type="button" className="df-tab df-tab-on">Connexion</button>
            <button type="button" className="df-tab" onClick={() => setErr("Création de compte sur invitation uniquement.")}>Créer un compte</button>
          </div>
          <h2>Bon retour parmi nous.</h2>
          <p className="df-login-sub">Identifiants équipe Splice Studio.</p>

          <label>
            <span>Email pro</span>
            <input
              type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="prenom@splice.fr"
              autoFocus
            />
          </label>
          <label>
            <span>Mot de passe</span>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
          </label>
          <div className="df-login-row">
            <label className="df-check">
              <input type="checkbox" defaultChecked /> Rester connecté
            </label>
            <a href="#" className="df-link">Mot de passe oublié ?</a>
          </div>

          {err && <div className="df-alert">{err}</div>}

          <button type="submit" className="df-btn df-btn-primary df-btn-lg" disabled={loading}>
            {loading ? "Connexion…" : "Se connecter →"}
          </button>

          <div className="df-login-hint">
            <b>Demo :</b> n'importe quel email <code>@splice.fr</code> fonctionne.<br/>
            Suggestions : <code>papi@splice.fr</code>, <code>louisia@splice.fr</code>, <code>tracy@splice.fr</code>
          </div>
        </form>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Dashboard

function Dashboard({ user, onLogout }) {
  const [view, setView] = useState("devis"); // devis | clients | stats
  const [quotes, setQuotes] = useState(SEED_QUOTES);
  const [clients, setClients] = useState(SEED_CLIENTS);
  const [openQuote, setOpenQuote] = useState(null);
  const [pdfQuote, setPdfQuote] = useState(null);
  const [openClient, setOpenClient] = useState(null);
  const [creating, setCreating] = useState(false);

  const clientById = (id) => clients.find(c => c.id === id);

  const stats = useMemo(() => {
    const accepted = quotes.filter(q => q.status === "accepté");
    const sent     = quotes.filter(q => q.status === "envoyé");
    const draft    = quotes.filter(q => q.status === "brouillon");
    const ca       = accepted.reduce((s, q) => s + q.total, 0);
    const pipeline = sent.reduce((s, q) => s + q.total, 0);
    return { accepted: accepted.length, sent: sent.length, draft: draft.length, ca, pipeline, total: quotes.length };
  }, [quotes]);

  return (
    <div className="df-app">
      <aside className="df-side">
        <a href="Splice Studio Site.html" className="df-logo-mark df-logo-mark-light">
          <img src="assets/splice-logo.svg" alt="" />
          <span>SPLICE</span>
        </a>
        <nav className="df-side-nav">
          <button className={view === "devis" ? "on" : ""} onClick={() => setView("devis")}>
            <Icon name="doc" /> Devis <em>{quotes.length}</em>
          </button>
          <button className={view === "clients" ? "on" : ""} onClick={() => setView("clients")}>
            <Icon name="users" /> Clients <em>{clients.length}</em>
          </button>
          <button className={view === "stats" ? "on" : ""} onClick={() => setView("stats")}>
            <Icon name="chart" /> Statistiques
          </button>
        </nav>
        <div className="df-side-foot">
          <div className="df-user">
            <div className="df-user-av">{user.name[0]}</div>
            <div>
              <b>{user.name}</b>
              <span>{user.role}</span>
            </div>
          </div>
          <button className="df-side-logout" onClick={onLogout} title="Déconnexion">
            <Icon name="logout" />
          </button>
        </div>
      </aside>

      <main className="df-main">
        {view === "devis" && (
          <DevisView
            quotes={quotes}
            clients={clients}
            clientById={clientById}
            onOpen={setOpenQuote}
            onPdf={setPdfQuote}
            onNew={() => setCreating(true)}
            onStatus={(id, status) => setQuotes(qs => qs.map(q => q.id === id ? { ...q, status } : q))}
            onDelete={(id) => setQuotes(qs => qs.filter(q => q.id !== id))}
          />
        )}
        {view === "clients" && (
          <ClientsView clients={clients} quotes={quotes} onOpen={setOpenClient} />
        )}
        {view === "stats" && (
          <StatsView stats={stats} quotes={quotes} clientById={clientById} />
        )}
      </main>

      {openQuote && (
        <QuoteDrawer
          quote={openQuote}
          client={clientById(openQuote.clientId)}
          onClose={() => setOpenQuote(null)}
          onPdf={() => { setPdfQuote(openQuote); setOpenQuote(null); }}
        />
      )}
      {pdfQuote && (
        <PdfPreview
          quote={pdfQuote}
          client={clientById(pdfQuote.clientId)}
          onClose={() => setPdfQuote(null)}
        />
      )}
      {openClient && (
        <ClientDrawer
          client={openClient}
          quotes={quotes.filter(q => q.clientId === openClient.id)}
          onClose={() => setOpenClient(null)}
        />
      )}
      {creating && (
        <NewQuoteModal
          clients={clients}
          onClose={() => setCreating(false)}
          onCreate={(q) => { setQuotes(qs => [q, ...qs]); setCreating(false); }}
        />
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Devis

function DevisView({ quotes, clientById, onOpen, onPdf, onNew, onStatus, onDelete }) {
  const [filter, setFilter] = useState("tous");
  const [search, setSearch] = useState("");

  const filtered = quotes.filter(q => {
    if (filter !== "tous" && q.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      const c = clientById(q.clientId);
      return q.id.toLowerCase().includes(s)
          || q.project.toLowerCase().includes(s)
          || (c && c.name.toLowerCase().includes(s));
    }
    return true;
  });

  const totals = {
    tous:       quotes.length,
    brouillon:  quotes.filter(q => q.status === "brouillon").length,
    envoyé:     quotes.filter(q => q.status === "envoyé").length,
    accepté:    quotes.filter(q => q.status === "accepté").length,
    refusé:     quotes.filter(q => q.status === "refusé").length,
  };

  return (
    <>
      <header className="df-main-head">
        <div>
          <div className="df-eyebrow">Espace équipe</div>
          <h1>Devis</h1>
        </div>
        <div className="df-main-head-cta">
          <div className="df-search">
            <Icon name="search" />
            <input
              placeholder="Rechercher un devis, un projet, un client…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="df-btn df-btn-primary df-btn-sm" onClick={onNew}>+ Nouveau devis</button>
        </div>
      </header>

      <div className="df-filters">
        {["tous","brouillon","envoyé","accepté","refusé"].map(f => (
          <button key={f} className={"df-chip " + (filter === f ? "on" : "")} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <em>{totals[f]}</em>
          </button>
        ))}
      </div>

      <div className="df-table">
        <div className="df-thead">
          <span>Référence</span>
          <span>Projet</span>
          <span>Client</span>
          <span>Statut</span>
          <span>Montant</span>
          <span>Échéance</span>
          <span></span>
        </div>
        {filtered.map(q => {
          const c = clientById(q.clientId);
          const sm = STATUS_META[q.status];
          return (
            <div className="df-trow" key={q.id} onClick={() => onOpen(q)}>
              <span className="df-mono">{q.id}</span>
              <span><b>{q.project}</b><em>{q.type}</em></span>
              <span>{c ? c.name : "—"}</span>
              <span>
                <span className="df-badge" style={{ color: sm.color, background: sm.bg }}>
                  <i style={{ background: sm.color }} />{sm.label}
                </span>
              </span>
              <span className="df-mono">{fmtEuro(q.total)}</span>
              <span>{fmtDate(q.due)}</span>
              <span className="df-row-actions" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => onPdf(q)} title="Exporter en PDF"><Icon name="pdf" /></button>
                <details className="df-menu">
                  <summary><Icon name="dots" /></summary>
                  <div>
                    {Object.entries(STATUS_META).map(([k, v]) => (
                      <button key={k} onClick={() => onStatus(q.id, k)}>
                        <i style={{ background: v.color }} /> Marquer {v.label.toLowerCase()}
                      </button>
                    ))}
                    <hr />
                    <button className="df-danger" onClick={() => { if (confirm(`Supprimer ${q.id} ?`)) onDelete(q.id); }}>
                      Supprimer
                    </button>
                  </div>
                </details>
              </span>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="df-empty">Aucun devis ne correspond.</div>
        )}
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────
// Clients

function ClientsView({ clients, quotes, onOpen }) {
  const [search, setSearch] = useState("");
  const filtered = clients.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
            || c.contact.toLowerCase().includes(search.toLowerCase())
  );
  const ca = (id) => quotes.filter(q => q.clientId === id && q.status === "accepté").reduce((s, q) => s + q.total, 0);

  return (
    <>
      <header className="df-main-head">
        <div>
          <div className="df-eyebrow">Espace équipe</div>
          <h1>Clients</h1>
        </div>
        <div className="df-main-head-cta">
          <div className="df-search">
            <Icon name="search" />
            <input placeholder="Rechercher un client…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="df-btn df-btn-primary df-btn-sm">+ Nouveau client</button>
        </div>
      </header>

      <div className="df-clients-grid">
        {filtered.map(c => (
          <article className="df-client-card" key={c.id} onClick={() => onOpen(c)}>
            <div className="df-client-av" data-i={parseInt(c.id.slice(1)) % 4}>{c.name[0]}</div>
            <div className="df-client-body">
              <h3>{c.name}</h3>
              <span className="df-client-type">{c.type} · {c.city}</span>
              <div className="df-client-meta">
                <div><b>{c.devis}</b><span>devis</span></div>
                <div><b>{fmtEuro(ca(c.id))}</b><span>CA accepté</span></div>
                <div><b>{c.since}</b><span>Client depuis</span></div>
              </div>
            </div>
            <div className="df-client-go">→</div>
          </article>
        ))}
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────
// Stats

function StatsView({ stats, quotes, clientById }) {
  const recent = [...quotes].slice(0, 5);
  return (
    <>
      <header className="df-main-head">
        <div>
          <div className="df-eyebrow">Espace équipe</div>
          <h1>Statistiques</h1>
        </div>
      </header>

      <div className="df-kpis">
        <div className="df-kpi"><span>CA signé (YTD)</span><b>{fmtEuro(stats.ca)}</b><em>+18% vs 2025</em></div>
        <div className="df-kpi"><span>Pipeline envoyé</span><b>{fmtEuro(stats.pipeline)}</b><em>{stats.sent} devis en attente</em></div>
        <div className="df-kpi"><span>Devis acceptés</span><b>{stats.accepted}</b><em>sur {stats.total} émis</em></div>
        <div className="df-kpi"><span>Taux de conversion</span><b>{Math.round(stats.accepted / Math.max(1, stats.total) * 100)}%</b><em>moyenne 2026</em></div>
      </div>

      <div className="df-stats-row">
        <div className="df-card df-bars">
          <h3>Devis par mois</h3>
          <div className="df-bars-chart">
            {[3, 4, 6, 5, 8, 7].map((v, i) => (
              <div className="df-bar" key={i} style={{ height: `${v * 11}%` }}>
                <em>{["Nov","Déc","Jan","Fév","Mar","Avr"][i]}</em>
              </div>
            ))}
          </div>
        </div>
        <div className="df-card">
          <h3>Devis récents</h3>
          <ul className="df-recent">
            {recent.map(q => {
              const c = clientById(q.clientId);
              const sm = STATUS_META[q.status];
              return (
                <li key={q.id}>
                  <span className="df-mono">{q.id}</span>
                  <b>{c ? c.name : "—"}</b>
                  <span className="df-badge" style={{ color: sm.color, background: sm.bg }}>{sm.label}</span>
                  <span className="df-mono">{fmtEuro(q.total)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────
// Drawers / modals

function QuoteDrawer({ quote, client, onClose, onPdf }) {
  const sm = STATUS_META[quote.status];
  const lines = [
    { label: "Pré-production · repérage", qty: 1, unit: 1200 },
    { label: "Tournage (journée + équipe)", qty: 1, unit: 2400 },
    { label: "Post-prod (montage + étalonnage)", qty: 1, unit: 1100 },
    { label: "Livrables multi-formats", qty: 3, unit: Math.round(quote.total * 0.05) },
  ];
  const subtotal = quote.total / 1.2;
  const tva = quote.total - subtotal;

  return (
    <div className="df-drawer-wrap" onClick={onClose}>
      <aside className="df-drawer" onClick={(e) => e.stopPropagation()}>
        <header>
          <div>
            <span className="df-mono df-muted">{quote.id}</span>
            <h2>{quote.project}</h2>
            <span className="df-badge" style={{ color: sm.color, background: sm.bg }}>
              <i style={{ background: sm.color }} />{sm.label}
            </span>
          </div>
          <button className="df-close" onClick={onClose}>×</button>
        </header>

        <div className="df-drawer-grid">
          <div><span>Client</span><b>{client?.name}</b></div>
          <div><span>Contact</span><b>{client?.contact}</b></div>
          <div><span>Type</span><b>{quote.type}</b></div>
          <div><span>Créé le</span><b>{fmtDate(quote.created)}</b></div>
          <div><span>Échéance</span><b>{fmtDate(quote.due)}</b></div>
          <div><span>Total TTC</span><b>{fmtEuro(quote.total)}</b></div>
        </div>

        <h3>Lignes</h3>
        <div className="df-lines">
          {lines.map((l, i) => (
            <div className="df-line" key={i}>
              <span>{l.label}</span>
              <span className="df-mono">{l.qty} ×</span>
              <span className="df-mono">{fmtEuro(l.unit)}</span>
              <span className="df-mono">{fmtEuro(l.qty * l.unit)}</span>
            </div>
          ))}
          <div className="df-line df-line-total"><span>Sous-total HT</span><span></span><span></span><span className="df-mono">{fmtEuro(subtotal)}</span></div>
          <div className="df-line df-line-total"><span>TVA 20%</span><span></span><span></span><span className="df-mono">{fmtEuro(tva)}</span></div>
          <div className="df-line df-line-total df-line-grand"><span>Total TTC</span><span></span><span></span><span className="df-mono">{fmtEuro(quote.total)}</span></div>
        </div>

        <footer>
          <button className="df-btn df-btn-ghost" onClick={onClose}>Fermer</button>
          <button className="df-btn df-btn-outline">Modifier</button>
          <button className="df-btn df-btn-primary" onClick={onPdf}>
            <Icon name="pdf" /> Exporter en PDF
          </button>
        </footer>
      </aside>
    </div>
  );
}

function ClientDrawer({ client, quotes, onClose }) {
  return (
    <div className="df-drawer-wrap" onClick={onClose}>
      <aside className="df-drawer" onClick={(e) => e.stopPropagation()}>
        <header>
          <div>
            <span className="df-mono df-muted">{client.type}</span>
            <h2>{client.name}</h2>
          </div>
          <button className="df-close" onClick={onClose}>×</button>
        </header>

        <div className="df-drawer-grid">
          <div><span>Contact</span><b>{client.contact}</b></div>
          <div><span>Email</span><b>{client.email}</b></div>
          <div><span>Téléphone</span><b>{client.phone}</b></div>
          <div><span>Ville</span><b>{client.city}</b></div>
          <div><span>Client depuis</span><b>{client.since}</b></div>
          <div><span>Devis</span><b>{client.devis}</b></div>
        </div>

        <h3>Historique devis</h3>
        <div className="df-lines">
          {quotes.map(q => {
            const sm = STATUS_META[q.status];
            return (
              <div className="df-line" key={q.id}>
                <span className="df-mono">{q.id}</span>
                <span>{q.project}</span>
                <span><span className="df-badge" style={{ color: sm.color, background: sm.bg }}>{sm.label}</span></span>
                <span className="df-mono">{fmtEuro(q.total)}</span>
              </div>
            );
          })}
          {quotes.length === 0 && <div className="df-empty df-empty-small">Aucun devis pour ce client.</div>}
        </div>

        <footer>
          <button className="df-btn df-btn-ghost" onClick={onClose}>Fermer</button>
          <button className="df-btn df-btn-outline">Modifier</button>
          <button className="df-btn df-btn-primary">+ Nouveau devis</button>
        </footer>
      </aside>
    </div>
  );
}

function NewQuoteModal({ clients, onClose, onCreate }) {
  const [clientId, setClientId] = useState(clients[0]?.id || "");
  const [project, setProject] = useState("");
  const [type, setType] = useState("Pub sociale");
  const [total, setTotal] = useState(2400);

  const submit = (e) => {
    e.preventDefault();
    const today = new Date();
    const due = new Date(today.getTime() + 14 * 86400000);
    const id = `DF-2026-${String(19 + Math.floor(Math.random() * 80)).padStart(3, "0")}`;
    onCreate({
      id, clientId, project, type, total: Number(total),
      status: "brouillon",
      created: today.toISOString().slice(0, 10),
      due: due.toISOString().slice(0, 10),
    });
  };

  return (
    <div className="df-modal-wrap" onClick={onClose}>
      <form className="df-modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <header>
          <h2>Nouveau devis</h2>
          <button type="button" className="df-close" onClick={onClose}>×</button>
        </header>

        <label>
          <span>Client</span>
          <select value={clientId} onChange={(e) => setClientId(e.target.value)}>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label>
          <span>Nom du projet</span>
          <input value={project} onChange={(e) => setProject(e.target.value)} placeholder="Ex : Sunset roll BMW M2" required />
        </label>
        <div className="df-modal-row">
          <label>
            <span>Type</span>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {["Pub sociale","Shooting auto","Brand film","Aftermovie","Reel","Photo produit"].map(t => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label>
            <span>Montant TTC (€)</span>
            <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} min={0} step={50} />
          </label>
        </div>

        <footer>
          <button type="button" className="df-btn df-btn-ghost" onClick={onClose}>Annuler</button>
          <button type="submit" className="df-btn df-btn-primary">Créer le devis</button>
        </footer>
      </form>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// PDF Preview (uses window.print on the preview node)

function PdfPreview({ quote, client, onClose }) {
  const ref = useRef(null);

  const print = () => {
    const node = ref.current;
    if (!node) return;
    const w = window.open("", "_blank", "width=900,height=1200");
    w.document.write(`
      <!doctype html><html><head><meta charset="utf-8" />
      <title>${quote.id} — Splice Studio</title>
      <style>
        body { font-family: 'Inter', system-ui, sans-serif; margin: 0; padding: 40px; color: #0A0A23; }
        ${PDF_CSS}
      </style></head><body>${node.outerHTML}
      <script>window.onload = () => { window.print(); }</script>
      </body></html>
    `);
    w.document.close();
  };

  const lines = [
    { label: "Pré-production · repérage", qty: 1, unit: 1200 },
    { label: "Tournage (journée + équipe)", qty: 1, unit: 2400 },
    { label: "Post-prod (montage + étalonnage)", qty: 1, unit: 1100 },
    { label: "Livrables multi-formats", qty: 3, unit: Math.round(quote.total * 0.05) },
  ];
  const subtotal = quote.total / 1.2;
  const tva = quote.total - subtotal;

  return (
    <div className="df-modal-wrap" onClick={onClose}>
      <div className="df-pdf-modal" onClick={(e) => e.stopPropagation()}>
        <header>
          <div>
            <h2>Aperçu PDF</h2>
            <span className="df-muted">Prêt à exporter — {quote.id}</span>
          </div>
          <div className="df-pdf-actions">
            <button className="df-btn df-btn-ghost" onClick={onClose}>Fermer</button>
            <button className="df-btn df-btn-primary" onClick={print}>
              <Icon name="download" /> Télécharger PDF
            </button>
          </div>
        </header>

        <div className="df-pdf-scroll">
          <div className="df-pdf-page" ref={ref}>
            <div className="pdf-head">
              <div className="pdf-brand">
                <img src="assets/splice-logo.svg" alt="" />
                <div>
                  <b>SPLICE</b>
                  <span>Boîte de production audiovisuelle</span>
                </div>
              </div>
              <div className="pdf-meta">
                <div><span>Devis</span><b>{quote.id}</b></div>
                <div><span>Émis le</span><b>{fmtDate(quote.created)}</b></div>
                <div><span>Valable jusqu'au</span><b>{fmtDate(quote.due)}</b></div>
              </div>
            </div>

            <div className="pdf-parties">
              <div>
                <h4>Émetteur</h4>
                <p>
                  <b>Splice Studio SAS</b><br/>
                  12 quai du Châtelet, 45000 Orléans<br/>
                  hello@splice.fr · +33 2 38 00 00 00<br/>
                  SIRET 000 000 000 00000 · TVA FR00000000000
                </p>
              </div>
              <div>
                <h4>Destinataire</h4>
                <p>
                  <b>{client?.name}</b><br/>
                  {client?.contact}<br/>
                  {client?.email} · {client?.phone}<br/>
                  {client?.city}
                </p>
              </div>
            </div>

            <h3 className="pdf-project">{quote.project}</h3>
            <span className="pdf-type">{quote.type}</span>

            <table className="pdf-table">
              <thead>
                <tr><th>Description</th><th>Qté</th><th>P.U. HT</th><th>Total HT</th></tr>
              </thead>
              <tbody>
                {lines.map((l, i) => (
                  <tr key={i}>
                    <td>{l.label}</td>
                    <td>{l.qty}</td>
                    <td>{fmtEuro(l.unit)}</td>
                    <td>{fmtEuro(l.qty * l.unit)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr><td colSpan={3}>Sous-total HT</td><td>{fmtEuro(subtotal)}</td></tr>
                <tr><td colSpan={3}>TVA 20%</td><td>{fmtEuro(tva)}</td></tr>
                <tr className="grand"><td colSpan={3}>Total TTC</td><td>{fmtEuro(quote.total)}</td></tr>
              </tfoot>
            </table>

            <div className="pdf-terms">
              <h4>Conditions</h4>
              <p>Acompte de 30% à la signature. Solde à la livraison. Validité du devis : 30 jours. Cession des droits sur les supports prévus au brief.</p>
            </div>

            <div className="pdf-sign">
              <div>
                <span>Bon pour accord — date & signature</span>
                <div className="pdf-sign-box"></div>
              </div>
              <div className="pdf-stamp">
                <span>Splice Studio</span>
                <i>—</i>
                <span>Orléans · Tours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PDF_CSS = `
  .df-pdf-page { background: #fff; padding: 56px 64px; max-width: 800px; margin: 0 auto; }
  .pdf-head { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 2px solid #F36B1F; }
  .pdf-brand { display: flex; gap: 14px; align-items: center; }
  .pdf-brand img { width: 36px; height: 48px; }
  .pdf-brand b { font-size: 14px; letter-spacing: 0.18em; color: #F36B1F; }
  .pdf-brand span { display: block; font-size: 11px; color: #555; }
  .pdf-meta { display: grid; grid-template-columns: 1fr; gap: 6px; text-align: right; font-size: 12px; }
  .pdf-meta span { color: #777; }
  .pdf-meta b { color: #0A0A23; font-weight: 600; }
  .pdf-parties { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; padding: 28px 0; }
  .pdf-parties h4 { margin: 0 0 8px; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #F36B1F; }
  .pdf-parties p { margin: 0; font-size: 13px; line-height: 1.6; }
  .pdf-project { margin: 8px 0 4px; font-family: 'Fraunces', Georgia, serif; font-size: 26px; color: #F36B1F; font-weight: 500; }
  .pdf-type { display: inline-block; font-size: 11px; padding: 4px 10px; border-radius: 999px; background: #FFF1D6; color: #7A4500; }
  .pdf-table { width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 13px; }
  .pdf-table th { text-align: left; background: #FAF8F2; padding: 10px 12px; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: #555; }
  .pdf-table td { padding: 12px; border-bottom: 1px solid #EEE; }
  .pdf-table tfoot td { padding: 8px 12px; font-size: 13px; text-align: right; }
  .pdf-table tfoot td:first-child { text-align: right; font-weight: 500; }
  .pdf-table tfoot .grand td { font-size: 18px; font-weight: 600; color: #F36B1F; padding-top: 14px; border-top: 2px solid #F36B1F; }
  .pdf-terms { margin: 18px 0; padding: 16px 18px; background: #FAF8F2; border-radius: 8px; }
  .pdf-terms h4 { margin: 0 0 6px; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #F36B1F; }
  .pdf-terms p { margin: 0; font-size: 12px; line-height: 1.6; color: #444; }
  .pdf-sign { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 32px; }
  .pdf-sign > div:first-child { flex: 1; }
  .pdf-sign span { font-size: 11px; color: #777; }
  .pdf-sign-box { margin-top: 6px; height: 70px; border: 1px dashed #CCC; border-radius: 6px; max-width: 320px; }
  .pdf-stamp { text-align: right; font-size: 11px; color: #F36B1F; }
  .pdf-stamp i { display: block; }
  @media print { body { padding: 0 !important; } .df-pdf-page { padding: 30px !important; } }
`;

// ──────────────────────────────────────────────────────────────────
// Icons

function Icon({ name }) {
  const icons = {
    doc: <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm7 0v5h5" />,
    users: <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-7 1.7-7 5v2h14v-2c0-3.3-3.7-5-7-5Zm9-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 2c-1 0-2 .2-2.8.5 1.7 1 2.8 2.6 2.8 4.5v2h5v-2c0-2.7-3.3-5-5-5Z" />,
    chart: <path d="M4 20V8m6 12V4m6 16v-8m6 8V12" strokeLinecap="round" />,
    logout: <path d="M14 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3M9 12h12m0 0-3-3m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />,
    search: <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm6-2 4 4" strokeLinecap="round" />,
    pdf: <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm7 0v5h5M9 14h6M9 17h4" strokeLinecap="round" />,
    dots: <path d="M5 12h.01M12 12h.01M19 12h.01" strokeLinecap="round" strokeWidth="3" />,
    download: <path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="16" height="16">
      {icons[name]}
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────────
// Root

function TeamApp() {
  const [user, setUser] = useState(() => {
    try { const u = sessionStorage.getItem("df_user"); return u ? JSON.parse(u) : null; } catch { return null; }
  });
  useEffect(() => {
    try {
      if (user) sessionStorage.setItem("df_user", JSON.stringify(user));
      else sessionStorage.removeItem("df_user");
    } catch {}
  }, [user]);

  return user
    ? <Dashboard user={user} onLogout={() => setUser(null)} />
    : <Login onLogin={setUser} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<TeamApp />);
