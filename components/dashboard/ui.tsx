import Link from "next/link";
import type { LucideIcon } from "lucide-react";

/**
 * Primitives partagées des dashboards (espace client + admin).
 *
 * Objectif : un seul vocabulaire visuel. Avant, chaque page réinventait son
 * en-tête (3 styles de h1 distincts) et sa surface (`bg-white/5` vs
 * `bg-df-surface`). Tout passe désormais par ces composants.
 *
 * Règles de contraste (fond #0E0E22 / #1A1A2E) :
 *  - texte principal : text-white
 *  - texte secondaire : text-white/70 (≈7:1)
 *  - texte discret : text-white/55 (plancher pour un label court ≥3:1)
 *  Ne jamais descendre sous /55 pour du texte porteur d'information.
 */

/* ── En-tête de page unifié ─────────────────────────────────────── */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-display text-3xl font-bold tracking-tight text-white text-balance lg:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 text-sm text-white/55">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

/* ── Surface / panneau (la seule façon de poser un fond) ────────── */
export function Panel({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  return (
    <Tag
      className={`rounded-2xl bg-df-surface ring-1 ring-white/[0.08] ${className}`}
    >
      {children}
    </Tag>
  );
}

/* ── Titre de section dans un panneau ──────────────────────────── */
export function SectionTitle({
  icon: Icon,
  children,
  action,
}: {
  icon?: LucideIcon;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2.5 font-display text-lg font-bold text-white">
        {Icon && <Icon className="h-5 w-5 shrink-0 text-df-gold" aria-hidden />}
        {children}
      </h2>
      {action}
    </div>
  );
}

/* ── État vide qui enseigne l'interface (pas un simple "rien ici") ─ */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Panel className="px-6 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-df-gold/10 ring-1 ring-df-gold/20">
        <Icon className="h-6 w-6 text-df-gold" aria-hidden />
      </div>
      <p className="mt-4 font-display text-base font-bold text-white">{title}</p>
      <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-white/60">
        {description}
      </p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </Panel>
  );
}

/* ── État d'erreur de chargement (DB indisponible, etc.) ───────── */
export function ErrorState({
  title = "Service momentanément indisponible",
  description = "Réessaie dans quelques instants.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Panel className="flex items-start gap-3 px-6 py-5">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15">
        <svg className="h-5 w-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" /><path d="M12 17h.01" />
        </svg>
      </span>
      <div>
        <p className="font-bold text-white">{title}</p>
        <p className="mt-0.5 text-sm text-white/60">{description}</p>
      </div>
    </Panel>
  );
}

/* ── Raccourci compteur (nav rapide, pas un "hero metric") ──────── */
export function CountLink({
  href,
  icon: Icon,
  label,
  count,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/[0.06] transition hover:bg-white/[0.06] hover:ring-df-gold/30"
    >
      <Icon className="h-4 w-4 shrink-0 text-white/45 transition-colors group-hover:text-df-gold" aria-hidden />
      <span className="flex-1 text-sm font-semibold text-white/80">{label}</span>
      <span className="font-display text-base font-bold tabular-nums text-white">
        {count}
      </span>
    </Link>
  );
}
