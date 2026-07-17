import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

/* Page de référence interne du Design System "Swiss minimal" (Phase 1).
   Noindex : ne doit jamais apparaître dans les résultats de recherche. */
export const metadata: Metadata = {
  title: "Design System — splicestudio",
  robots: { index: false, follow: false },
};

/* ── Données de la palette (token, variable, hex de référence, rôle) ─────── */
const PALETTE: { name: string; token: string; hex: string; role: string; onDark?: boolean }[] = [
  { name: "bg", token: "--color-bg", hex: "#fdfaf8", role: "Fond de page" },
  { name: "surface", token: "--color-surface", hex: "#ffffff", role: "Cards" },
  { name: "surface-2", token: "--color-surface-2", hex: "#f7f3ef", role: "Panneau creux / hover" },
  { name: "line", token: "--color-line", hex: "#e9e3df", role: "Hairline" },
  { name: "line-strong", token: "--color-line-strong", hex: "#d6cdc6", role: "Bordure input" },
  { name: "ink", token: "--color-ink", hex: "#1f1915", role: "Texte principal · 16.7:1", onDark: true },
  { name: "muted", token: "--color-muted", hex: "#71655d", role: "Texte secondaire · 5.46:1", onDark: true },
  { name: "brand", token: "--color-brand", hex: "#f57531", role: "Accent / fill (texte ink)", onDark: true },
  { name: "brand-hover", token: "--color-brand-hover", hex: "#df6328", role: "Hover fill", onDark: true },
  { name: "brand-ink", token: "--color-brand-ink", hex: "#b54710", role: "Texte lien · 5.23:1", onDark: true },
  { name: "brand-soft", token: "--color-brand-soft", hex: "#ffefe1", role: "Tint de fond doux" },
  { name: "success", token: "--color-success", hex: "#2d8949", role: "Succès (fill)", onDark: true },
  { name: "warning", token: "--color-warning", hex: "#cd8800", role: "Alerte (fill)", onDark: true },
  { name: "danger", token: "--color-danger", hex: "#d72e2d", role: "Erreur (fill)", onDark: true },
];

const TYPE_SCALE: { label: string; varName: string; weight: string; sample: string }[] = [
  { label: "display", varName: "--text-display", weight: "700", sample: "Production audiovisuelle" },
  { label: "3xl", varName: "--text-3xl", weight: "600", sample: "Vidéo, photo & motion" },
  { label: "2xl", varName: "--text-2xl", weight: "600", sample: "Un studio à Orléans" },
  { label: "xl", varName: "--text-xl", weight: "600", sample: "Titre de section" },
  { label: "lg", varName: "--text-lg", weight: "500", sample: "Sous-titre de bloc" },
  { label: "base", varName: "--text-base", weight: "400", sample: "Corps de texte courant, lisible et aéré." },
  { label: "sm", varName: "--text-sm", weight: "400", sample: "Texte secondaire, légendes et méta." },
  { label: "xs", varName: "--text-xs", weight: "500", sample: "LABEL / OVERLINE" },
];

function SectionTitle({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <div className="mb-6 flex items-baseline gap-3 border-b border-line pb-2">
      <span className="font-mono text-xs text-brand-ink">{id}</span>
      <h2 className="text-2xl font-semibold tracking-tight text-ink">{children}</h2>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="swiss min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        {/* En-tête */}
        <header className="mb-16">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-brand-ink">
            Design System · Phase 1
          </p>
          <h1
            className="font-semibold tracking-tight text-ink"
            style={{ fontSize: "var(--text-display)", lineHeight: 1.02 }}
          >
            splicestudio
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Fondation « Swiss minimal ». Fond clair, grille stricte, un seul accent
            orange, sans-serif unique (Outfit). Tous les couples texte/fond validés
            WCAG&nbsp;AA.
          </p>
        </header>

        {/* 01 — Palette */}
        <section className="mb-20">
          <SectionTitle id="01">Palette</SectionTitle>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {PALETTE.map((c) => (
              <div key={c.name} className="rounded-swiss-md border border-line bg-surface shadow-swiss-sm">
                <div
                  className="h-24 rounded-t-swiss-md border-b border-line"
                  style={{ backgroundColor: `var(${c.token})` }}
                  aria-hidden
                />
                <div className="p-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-mono text-sm font-medium text-ink">{c.name}</p>
                    <span className="font-mono text-xs text-muted">{c.hex}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{c.role}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted">
            Règle de contraste : le <span className="font-medium text-ink">brand</span> pur
            (2.8:1 sur blanc) sert aux fills et accents, jamais au petit texte. Le texte de
            lien utilise <span className="font-medium text-brand-ink">brand-ink</span> (5.2:1).
          </p>
        </section>

        {/* 02 — Typographie */}
        <section className="mb-20">
          <SectionTitle id="02">Typographie · Outfit</SectionTitle>
          <div className="space-y-5">
            {TYPE_SCALE.map((t) => (
              <div
                key={t.label}
                className="flex flex-col gap-1 border-b border-line pb-4 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <div className="w-28 shrink-0 font-mono text-xs text-muted">
                  {t.label} · {t.weight}
                </div>
                <p
                  className="tracking-tight text-ink"
                  style={{ fontSize: `var(${t.varName})`, fontWeight: Number(t.weight), lineHeight: 1.15 }}
                >
                  {t.sample}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 03 — Grille */}
        <section className="mb-20">
          <SectionTitle id="03">Grille · 12 colonnes</SectionTitle>
          <div className="grid grid-cols-12 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex h-16 items-center justify-center rounded-swiss-sm bg-brand-soft font-mono text-xs text-brand-ink"
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-12 gap-2">
            <div className="col-span-12 flex h-14 items-center justify-center rounded-swiss-sm border border-line bg-surface font-mono text-xs text-muted md:col-span-8">
              col-span-8
            </div>
            <div className="col-span-12 flex h-14 items-center justify-center rounded-swiss-sm border border-line bg-surface font-mono text-xs text-muted md:col-span-4">
              col-span-4
            </div>
          </div>
        </section>

        {/* 04 — Boutons */}
        <section className="mb-20">
          <SectionTitle id="04">Boutons</SectionTitle>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="swiss">Demander un devis</Button>
            <Button variant="swiss-outline">Voir la galerie</Button>
            <Button variant="swiss-ghost">En savoir plus</Button>
            <Button variant="swiss-link">Nos réalisations</Button>
            <Button variant="swiss" disabled>
              Indisponible
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Button variant="swiss" size="sm">
              Petit
            </Button>
            <Button variant="swiss" size="default">
              Moyen
            </Button>
            <Button variant="swiss" size="lg">
              Grand
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted">
            États hover / focus-visible / active gérés par CSS. Le focus utilise un anneau
            <span className="font-medium text-brand-ink"> brand-ink</span> (&gt; 3:1). Testez au
            clavier&nbsp;: <kbd className="rounded-swiss-sm border border-line-strong bg-surface-2 px-1.5 py-0.5 font-mono text-xs">Tab</kbd>.
          </p>
        </section>

        {/* 05 — Badges */}
        <section className="mb-20">
          <SectionTitle id="05">Badges</SectionTitle>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="swiss">Neutre</Badge>
            <Badge variant="swiss-brand">Nouveau</Badge>
            <Badge variant="swiss-success">Payé</Badge>
            <Badge variant="swiss-warning">En attente</Badge>
            <Badge variant="swiss-danger">Refusé</Badge>
            <Badge variant="swiss-outline">Contour</Badge>
          </div>
        </section>

        {/* 06 — Inputs */}
        <section className="mb-20">
          <SectionTitle id="06">Champs de formulaire</SectionTitle>
          <div className="grid max-w-xl gap-5">
            <div>
              <label htmlFor="ds-name" className="mb-1.5 block text-sm font-medium text-ink">
                Nom du projet
              </label>
              <Input id="ds-name" variant="swiss" placeholder="Film corporate — printemps 2026" />
            </div>
            <div>
              <label htmlFor="ds-email" className="mb-1.5 block text-sm font-medium text-ink">
                Email
              </label>
              <Input id="ds-email" variant="swiss" type="email" placeholder="contact@exemple.fr" />
              <p className="mt-1.5 text-sm text-muted">Nous répondons sous 24&nbsp;h ouvrées.</p>
            </div>
            <div>
              <label htmlFor="ds-dis" className="mb-1.5 block text-sm font-medium text-muted">
                Champ désactivé
              </label>
              <Input id="ds-dis" variant="swiss" placeholder="Indisponible" disabled />
            </div>
          </div>
        </section>

        {/* 07 — Cards */}
        <section className="mb-20">
          <SectionTitle id="07">Cards</SectionTitle>
          <div className="grid gap-6 md:grid-cols-3">
            <Card variant="swiss" className="p-6">
              <h3 className="text-lg font-semibold tracking-tight text-ink">Card standard</h3>
              <p className="mt-2 text-sm text-muted">
                Surface blanche, hairline, ombre discrète. Le radius suit l&apos;échelle
                Swiss (<code className="font-mono text-xs text-brand-ink">--radius-lg</code>).
              </p>
            </Card>
            <Card variant="swiss" className="p-6">
              <Badge variant="swiss-brand" className="mb-3">
                En vedette
              </Badge>
              <h3 className="text-lg font-semibold tracking-tight text-ink">Card + accent</h3>
              <p className="mt-2 text-sm text-muted">
                L&apos;accent orange reste rare et intentionnel.
              </p>
            </Card>
            <Card variant="swiss" className="flex flex-col justify-between p-6">
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-ink">Card + action</h3>
                <p className="mt-2 text-sm text-muted">Composée avec un bouton primaire.</p>
              </div>
              <Button variant="swiss" size="sm" className="mt-4 self-start">
                Ouvrir
              </Button>
            </Card>
          </div>
        </section>

        {/* 08 — Fiche établissement (préfiguration portail) */}
        <section className="mb-20">
          <SectionTitle id="08">Fiche établissement</SectionTitle>
          <Card variant="swiss" className="overflow-hidden">
            <div className="grid md:grid-cols-[1fr_2fr]">
              <div className="flex items-center justify-center bg-brand-soft p-10">
                <span className="font-mono text-sm text-brand-ink">media 4:3</span>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-muted">
                      Production vidéo · Orléans (45)
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
                      Studio Le Cadran
                    </h3>
                  </div>
                  <Badge variant="swiss-success">Vérifié</Badge>
                </div>
                <p className="mt-3 max-w-prose text-muted">
                  Captation multi-caméra, motion design et post-production. Basé au cœur
                  d&apos;Orléans, intervient sur toute la région Centre-Val de Loire.
                </p>
                <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-5 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted">Projets</dt>
                    <dd className="mt-0.5 text-lg font-semibold text-ink">128</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted">Délai moyen</dt>
                    <dd className="mt-0.5 text-lg font-semibold text-ink">7 j</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted">Note</dt>
                    <dd className="mt-0.5 text-lg font-semibold text-ink">4,9 / 5</dd>
                  </div>
                </dl>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button variant="swiss" size="sm">
                    Contacter
                  </Button>
                  <Button variant="swiss-outline" size="sm">
                    Voir le portfolio
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* 09 — Card guide (préfiguration portail) */}
        <section className="mb-8">
          <SectionTitle id="09">Card guide</SectionTitle>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { tag: "Guide", title: "Bien préparer son tournage", read: "6 min" },
              { tag: "Guide", title: "Choisir son format vidéo", read: "4 min" },
              { tag: "Guide", title: "Budget d’une captation", read: "5 min" },
            ].map((g) => (
              <a
                key={g.title}
                href="#"
                className="group block rounded-swiss-lg border border-line bg-surface p-6 shadow-swiss-sm transition-colors hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <span className="font-mono text-xs uppercase tracking-widest text-brand-ink">
                  {g.tag}
                </span>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink group-hover:text-brand-ink">
                  {g.title}
                </h3>
                <p className="mt-6 flex items-center justify-between border-t border-line pt-4 text-sm text-muted">
                  <span>Lecture {g.read}</span>
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
