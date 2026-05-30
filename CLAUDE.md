# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # prisma generate && next build
npm run lint         # ESLint
npm run db:push      # Push Prisma schema to DB (no migration file)
npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Run prisma/seed.ts (admin + services + blog)
npm run seed:galerie # Run prisma/seed-galerie.ts (gallery media)
npm run deploy       # Build + deploy to Cloudflare Workers
npm run preview      # Build + local Cloudflare Workers preview
npm run test         # Vitest run
npm run test:watch   # Vitest watch mode
npm run test:coverage # Vitest test coverage report
npm run test:e2e     # Playwright tests
npm run test:e2e:ui  # Playwright tests in UI mode
npm run cf-typegen   # Generate Cloudflare Env interface types
```

## Architecture

**Splice** is a Next.js 15 App Router application for a French audiovisual production company based in **Orléans (45), France**. Legal status: **auto-entrepreneur** (franchise TVA, art. 293 B CGI).

The platform handles: public showcase, client authentication (CLIENT / TEAM / ADMIN), quote wizard, payment via Stripe, PDF invoices, electronic contracts, and a full admin dashboard.

### Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router, RSC, Server Actions) |
| Language | TypeScript strict |
| Deployment | Cloudflare Workers via OpenNext (`@opennextjs/cloudflare`) |
| Database | Neon PostgreSQL (eu-west-2) via Prisma + `@prisma/adapter-neon` |
| Auth | Auth.js v5 (JWT strategy, PBKDF2 password hashing via WebCrypto, 2FA TOTP) |
| Payments | Stripe Checkout + webhooks |
| Email | Resend (domain: `splicestudio.fr`) |
| Storage | Cloudflare R2 — buckets: `galerie` (media.splicestudio.fr), `splice-cdn` (cdn.splicestudio.fr), `splice-deliveries`, `splice-archive` (via bindings) |
| Anti-bot | Cloudflare Turnstile (invisible CAPTCHA) |
| Cache/RL | Upstash Redis (rate limiting on auth endpoints) |
| Styling | Tailwind CSS + shadcn/ui (mobile-first) |
| Animations | GSAP (ScrollTrigger, SplitText, DrawSVG, Flip) |
| State | Zustand (quote wizard) |
| Forms | React Hook Form + Zod |
| PDF | pdf-lib + @pdf-lib/fontkit server-side |
| Monitoring | Sentry (client-side active) + Plausible (GDPR-compliant consent-based active) |

### Team

- **t.y97one** — ADMIN (monteur / motion designer)
- **by.louisia** — TEAM (photographe)

### Route Structure

```
app/
  page.tsx                   # Landing page ("use client", styles in prototype-styles.css)
  layout.tsx                 # Root layout (fonts, Toaster, JSON-LD)
  (auth)/                    # Auth group: login, register, forgot/reset-password
  devis/page.tsx             # Quote wizard (requires auth)
  galerie/page.tsx           # Gallery (photos + videos, inline video modal)
  equipe/page.tsx            # Team page
  services/                  # Service pages (RSC, ISR 1h, JSON-LD, FAQ)
  contact/page.tsx
  mentions-legales/page.tsx  # Legal notices (LCEN)
  confidentialite/page.tsx   # Privacy policy (RGPD)
  cookies/page.tsx           # Cookie policy
  profil/                    # Client dashboard (auth-protected)
  admin/                     # Admin dashboard (ADMIN role only)
  api/
    auth/[...nextauth]/      # NextAuth handler
    devis/[id]/pdf/          # PDF generation endpoint
    stripe/webhook/          # Stripe webhook
```

### Key Data Models (Prisma)

- **User**: roles CLIENT | TEAM | ADMIN, with Profile relation, 2FA TOTP support (`twoFactorEnabled`, `twoFactorSecret`)
- **Media**: PHOTO | VIDEO with owner (Founder enum: LOUISIA | TY), category, client, duration, groupKey, groupOrder
- **Devis**: Full quote with computed `lines` (JSON), `totalHT`, `acompteAmount` (30%)
- **Facture**: Linked 1:1 to Devis after payment
- **Contrat**: Linked 1:1 to Devis
- **Counter**: Auto-incrementing sequence per year/type for human-readable numbers
- **Service**: slug-based, JSON fields `features` and `faq`, linked to BlogPost
- **BlogPost**: slug-based, linked to parent Service for SEO silo

### Core Business Logic

- **Pricing** (`lib/pricing.ts`): `computeQuote(input)` builds line items. All prices in euros (integers). `MENTIONS_LEGALES` embedded in PDFs.
- **Quote numbering** (`lib/numbering.ts`): `nextNumero(type, tx)` — MUST be called inside `db.$transaction()`, never outside.
- **Fiscal rule**: TVA non applicable, art. 293 B du CGI. Mention obligatoire sur devis et factures.
- **Numbering**: Sequential, no gaps allowed (L123-22 Code commerce). Format: `{YYYY}_{seq:03d}`.

### Server Actions

All mutations use `"use server"`:
- `app/actions/auth.ts` — register, password reset
- `app/actions/devis.ts` — `submitDevis` (validates, computes, creates, sends emails)
- `app/actions/admin.ts` — admin status updates
- `app/actions/likes.ts` — toggle like
- `app/actions/contact.ts` — contact form submission

## Agent Orchestration Protocol (Context-Engineering)

Cette section impose les règles de coordination entre l'orchestrateur (moi, Claude principal) et les 7 sub-agents projet. Elle dérive directement des skills `multi-agent-patterns` et `tool-design`.

**Pattern utilisé** : supervisor/orchestrator avec `forward_message` discipline. Je décompose, route vers les specialists, et **forwarde** leurs artefacts littéralement quand ils sont finaux (copy, JSON-LD, mention PDF, message d'email).

### Règles d'invocation (hard rules)

1. **Cap de parallélisme** : maximum **3 sub-agents en parallèle** par feature. Au-delà → batch en deux vagues séquentielles. Raison : coordination overhead > gain au-delà de 3-5 workers (cf. multi-agent-patterns gotcha #1).
2. **Ne pas déléguer pour les single-file edits triviaux** (un import à ajouter, un typo, un toast à changer). Coût ~15× tokens vs édit inline (cf. multi-agent-patterns token economics).
3. **Contexte minimal** : à chaque invocation, passer **uniquement** le contexte nécessaire au sub-agent (chemins de fichier + intent + contraintes). Ne jamais dumper toute la conversation. Sub-agent = contexte propre par design.
4. **Filesystem-as-shared-state** : si deux sub-agents doivent partager un état, écrire dans un fichier du repo (commentaire, JSON, ou code source). Pas de message-passing entre agents — risque téléphone.
5. **Validation systématique** : avant d'accepter l'output d'un sub-agent, vérifier l'Output Contract — les `Files changed` existent vraiment (Read), le build passe si annoncé, les handoffs listés sont traités.
6. **Forward-message pour artefacts finaux** : copy utilisateur, contenu d'email Resend, texte de MENTIONS_LEGALES PDF, JSON-LD, descriptions metadata — je les **forwarde littéralement** depuis le sub-agent vers l'utilisateur, jamais paraphrasé.
7. **Pas de sycophantic consensus** : si deux sub-agents donnent des avis contradictoires (ex. `security` veut un CSP strict, `seo-performance` veut autoriser un domaine d'image), je tranche en remontant la contrainte la plus stricte par défaut, et je documente le trade-off dans la sortie.

### Routing table (decision tree)

| Tâche | Agent principal | Chain si nécessaire |
|-------|-----------------|---------------------|
| Nouvelle page `/services/[slug]` | `backend-api` (fetch) | → `design-frontend` (JSX) → `seo-performance` (metadata + JSON-LD) |
| Tunnel devis (modif logique) | `backend-api` | → `security` (Zod + ownership) → `design-frontend` (UI feedback) |
| Tunnel devis (modif UI seul) | `design-frontend` | — |
| Animation hero/scroll | `gsap-animations` | → `design-frontend` (si markup) |
| Galerie nouvelle fonctionnalité | `media-content` (data) | → `design-frontend` (cards) → `seo-performance` (OG par média) |
| Mise en prod / pré-deploy audit | `devops-quality` | → `security` (audit OWASP) → `seo-performance` (Lighthouse) |
| Nouveau type d'email (Resend) | `backend-api` (template + send) | → `stop-slop` skill final pass sur la copy |
| Headers HTTP / CSP modifs | `security` | — |
| Migration Prisma destructive | `devops-quality` (plan) | → `backend-api` (code consommateur) — requires user validation |
| Bug TypeScript | l'agent owner du fichier en question | — |

### Output Contract (imposé à tous les sub-agents)

Tout sub-agent doit terminer son invocation par ce bloc :

```
### Files changed
- <path> — <résumé 1 ligne>

### Decisions
- <choix non-évident>

### Verified
- <ce qui a été testé/buildé>

### Handoff
- @<sibling-agent> : <ce qui doit être traité ailleurs>
```

Si le bloc manque ou si une ligne ne correspond pas à la réalité (fichier non créé, build cassé alors qu'annoncé ok), je rejette l'output et redemande au sub-agent avec la finding spécifique.

### Quand NE PAS invoquer un sub-agent

- Édit single-file < 10 lignes → inline
- Recherche / exploration / lecture sans modification → inline (Read/Grep/Glob)
- Question conceptuelle de l'utilisateur → réponse directe
- Tâche entièrement dans ma zone (réécrire ce fichier CLAUDE.md, gérer la mémoire) → inline

### Quand chaîner vs paralléliser

- **Séquentiel obligatoire** : data → UI → metadata → security audit. La sortie de l'un est l'input de l'autre.
- **Parallèle OK** : audits indépendants (ex. `security` + `seo-performance` sur la même PR avant merge), ou refactors de domaines disjoints.

## Agent Squad — Capabilities (Proactive Auto-Invocation)

Specialized sub-agents in `.claude/agents/`. **MANDATORY: invoke automatically based on task context, never wait for the user to name them.** Detect intent, call the Agent tool, then produce output. Chain selon la routing table ci-dessus. Respecter le cap de 3 agents parallèles.

| Agent | Auto-invoke when the task involves… |
|-------|-------------------------------------|
| `design-frontend` | Any React component, page layout, Tailwind, shadcn/ui, responsive breakpoint, hover/focus state, form UI, mobile menu, modal, drawer, accessibility (WCAG/ARIA), or "make it look better" |
| `backend-api` | Prisma schema/migration, Server Action, API route, Stripe checkout/webhook, Resend email, PDF generation, devis/facture/contrat logic, numbering, pricing computation, AuditLog |
| `security` | Auth flow, NextAuth config, CSP/HTTP headers, rate limiting, CSRF, input validation, secret handling, OWASP concerns, password hashing, 2FA, session storage, encryption (AES-GCM) |
| `seo-performance` | `<head>` metadata, OpenGraph, JSON-LD, sitemap.xml, robots.txt, image optimization (next/image), bundle size, Core Web Vitals (LCP/INP/CLS), lazy loading, RSC vs client split |
| `media-content` | Gallery, photo/video upload, R2/Supabase storage, likes, reviews/avis, moderation, founder enum (LOUISIA/TY), media metadata |
| `devops-quality` | `error.tsx` / `not-found.tsx` / `loading.tsx`, global error handlers, TypeScript strict issues, environment variables, deployment config (Cloudflare Workers / OpenNext), `next.config.mjs`, `wrangler.jsonc`, Sentry, monitoring |
| `gsap-animations` | GSAP Timeline, ScrollTrigger, SplitText, DrawSVG, Flip, scroll-linked motion, text reveal, pinning, `useGSAP()`, `gsap.matchMedia()`, `prefers-reduced-motion` |

**Chaining examples:**
- Nouvelle page `/services/[slug]` SEO-optimisée → `seo-performance` (metadata, JSON-LD) + `design-frontend` (UI) + `backend-api` (data fetch)
- Tunnel devis avec paiement Stripe → `backend-api` (Server Action, Stripe, Resend) + `design-frontend` (Wizard UI) + `security` (validation Zod, rate limit) + `devops-quality` (error boundary)
- Animation hero landing → `gsap-animations` + `design-frontend` + `seo-performance` (vérifier LCP)
- Refonte tarifs → `backend-api` (`lib/pricing.ts`) + `design-frontend` (PricingSection) + `seo-performance` (metadata)

**Marketing skills auto-invocation** (depuis `~/.claude/skills/marketingskills/`) :
- Copy des pages services / landing → `copywriting` + `cro`
- Emails devis/onboarding/relance → `emails`
- Page `/services/*` SEO → `seo-audit` + `ai-seo` + `schema`
- Page `/tarifs` → `pricing` + `cro`
- Galerie / showcase → `image` + `social`
- Avis clients → `customer-research`
- Lancement nouveau service → `launch` + `directory-submissions`

**Exception — NE PAS auto-invoquer** : `higgsfield-generate`, `higgsfield-marketplace-cards`, `higgsfield-product-photoshoot`, `higgsfield-soul-id` (génération vidéo/photo payante — requiert demande explicite de l'utilisateur).

## UI/UX Pro Max (nextlevelbuilder/ui-ux-pro-max-skill)

Repo dans `~/.claude/skills/ui-ux-pro-max-skill/` (MIT, NextLevelBuilder). 7 skills jonctionnés dans `~/.claude/skills/` : `ui-ux-pro-max`, `design`, `design-system`, `ui-styling`, `brand`, `banner-design`, `slides`. Base de données : 67 styles UI, 161 palettes, 57 pairings de fonts, 99 règles UX, 25 types de charts, 10 stacks.

- **Repo** : https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- **Auto-invocation** : MANDATORY avant toute tâche UI/UX/composant sur Splice. Invoquer `ui-ux-pro-max` en amont pour pull style + palette + typo + règles UX, puis chaîner `design-frontend` (agent projet) pour l'implémentation React/Tailwind/shadcn.
- **Cas Splice** :
  - Refonte composant existant (`components/services/*`, `components/devis/*`, `components/home/*`) → `ui-ux-pro-max` + `design-frontend`
  - Nouveau token / variable CSS / palette (charte "Cinéma Studio") → `design-system` + `ui-styling`
  - Bannière OG / hero / cover services / social → `banner-design`
  - Refonte identité visuelle ou guidelines de tonalité → `brand`
  - Présentation interne ou pitch → `slides`
- **Compatibilité charte existante** : Splice a déjà sa DA "Cinéma Studio" (cf. mémoire) — utiliser `ui-ux-pro-max` comme système de référence/checklist, sans écraser les tokens existants (`#0E0E22`, `#F36B1F`, Fraunces, Inter, JetBrains Mono).
- **Update** : `cd ~/.claude/skills/ui-ux-pro-max-skill && git pull`

## Impeccable — Design Engineering Workflow (pbakaus/impeccable)

Installé via `npx skills add` (Apache 2.0, basé sur Anthropic frontend-design fork par Paul Bakaus). Skill **workflow complet** avec 24 sous-commandes, design laws strictes, et système de register brand/product.

- **Repo** : https://github.com/pbakaus/impeccable
- **Register Splice** : `brand` (production audiovisuelle = design IS the product, pas un app UI)
- **Setup recommandé** : créer `PRODUCT.md` à la racine du projet avec users (clients PME Centre-Val de Loire), brand (Splice Cinéma Studio), tone (premium, sobre, direct), anti-references (templates SaaS génériques, fillers décoratifs), strategic principles. Optionnel : `DESIGN.md` avec palette `#0E0E22`/`#6B8779`/`#F36B1F`, fonts Anton/Poppins, charte DA Cinéma Studio. Sans ces fichiers le skill sera invité à invoquer `/impeccable teach` en premier.
- **Sous-commandes** : `craft`, `shape`, `polish`, `critique`, `audit`, `bolder`, `quieter`, `distill`, `harden`, `onboard`, `animate`, `colorize`, `typeset`, `layout`, `delight`, `overdrive`, `clarify`, `adapt`, `optimize`, `live`, `extract`, `teach`, `document`.
- **Design laws strictes** (impeccable applique partout) :
  - OKLCH only, jamais `#000`/`#fff` purs, tinter les neutrals vers `#F36B1F` (chroma 0.005-0.01)
  - Theme choisi par "scene sentence" (qui, où, dans quelle ambiance) — pas par défaut "dark cool"
  - Typography : line-length 65-75ch body, hiérarchie ≥1.25 ratio
  - Spacing varié pour le rythme, pas de padding uniforme
  - **Bans absolus** : side-stripe borders >1px, gradient text, glassmorphism par défaut, hero-metric template SaaS, grilles de cards identiques, modal-first, em dashes (—) en français → utiliser virgules/parenthèses
  - Motion : ease-out-quart/quint/expo, pas de bounce/elastic, ne jamais animer layout properties

**Auto-invocation sur Splice** :
- Refonte d'une page entière → `impeccable shape` → `impeccable craft`
- Polish d'un composant → `impeccable polish <fichier>`
- Page trop fade → `impeccable bolder <fichier>`
- Page trop chargée → `impeccable quieter <fichier>` ou `impeccable distill <fichier>`
- Audit a11y/perf/responsive → `impeccable audit`
- Critique UX heuristique → `impeccable critique`
- Production-ready (errors, i18n, edge cases) → `impeccable harden`
- First-run flows, empty states → `impeccable onboard`
- UI performance → `impeccable optimize`

**Complémentarité avec les autres design skills Splice** :
- `ui-ux-pro-max` = DB statique structurée (67 styles × 161 palettes × 57 fonts) — référentiel
- `emil-design-eng` = sensibilité Emil Kowalski sur micro-interactions / feel
- `impeccable` = **workflow opérationnel** avec laws + commandes + register
- `design-frontend` (agent projet) = implémentation finale React/Tailwind/Framer Motion

**Chaînage type pour grosse refonte sur Splice** :
```
impeccable shape (plan)
  → impeccable craft (build)
  → emil-design-eng (polish/feel)
  → impeccable critique + audit (eval)
  → impeccable polish (final pass)
  → design-frontend (implémentation finale si pas encore couverte)
```

**Update** : `npx skills add https://github.com/pbakaus/impeccable --skill impeccable`

## Design Engineering (emilkowalski/skill)

Cloné dans `~/.claude/skills/emil-skill/` (MIT, Emil Kowalski). Skill auto-découvert sous le nom `emil-design-eng` via jonction. Encode la philosophie design engineering : UI polish, micro-interactions, animation feel, détails invisibles qui font la différence entre une UI fonctionnelle et une UI premium.

- **Repo** : https://github.com/emilkowalski/skill
- **Auto-invocation** : MANDATORY en amont de `design-frontend` (agent projet) sur Splice pour toute tâche UI sensible au "feel" — micro-interactions, hover/focus states, animation timing, polish de composants. Chaîner avec `ui-ux-pro-max` (DB styles/palettes) en parallèle pour couvrir système ET sensibilité.
- **Cas Splice** :
  - Polish des transitions tunnel devis (`components/devis/Wizard.tsx`, `Steps.tsx`)
  - Hover states galerie / showreel (`components/home/HomeContent.tsx` Showreel function)
  - Animation feel des CTA primaires (df-btn-primary scale/translateY)
  - Sortie d'erreurs/toasts (`react-hot-toast` timing)
  - Subtilités d'apparition (IntersectionObserver dans About stats)
- **Chaînage type** : `emil-design-eng` (philosophie/principes) → `ui-ux-pro-max` (DB styles si besoin de palette/font) → `design-frontend` (implémentation React/Tailwind/Framer Motion ou GSAP via `gsap-animations`).
- **Update** : `cd ~/.claude/skills/emil-skill && git pull`

## Anti-Slop Skill (hardikpandya/stop-slop)

Cloné dans `~/.claude/skills/stop-slop/` (MIT, Hardik Pandya). Élimine les patterns d'écriture IA dans la prose : ouvertures bavardes, contrastes binaires ("c'est pas X, c'est Y"), béquilles d'emphase, voix passive, jargon corporate, fragmentation dramatique.

- **Repo** : https://github.com/hardikpandya/stop-slop
- **Auto-invocation** : MANDATORY en final pass après toute génération/édition de prose (copy services, emails devis, mentions légales, descriptions galerie, posts blog, OG/meta descriptions). Chaîner systématiquement après `copywriting`, `copy-editing`, `emails`, `cold-email`.
- **Cas Splice** : tout texte visible côté client (`prisma/services-content.ts`, `components/services/*`, `components/devis/*`, emails Resend, PDF mentions, hero/baseline) doit passer par `stop-slop` avant validation.
- **Update** : `cd ~/.claude/skills/stop-slop && git pull`

## Marketing Skills (coreyhaines31/marketingskills)

Cloned globally to `~/.claude/skills/marketingskills/` (MIT, Corey Haines). 40+ skills for technical marketers: conversion optimization, copywriting, SEO, ads, analytics, growth.

- **Repo**: https://github.com/coreyhaines31/marketingskills
- **Categories**: `cro`, `copywriting`, `emails`, `seo-audit`, `ai-seo`, `programmatic-seo`, `schema`, `ads`, `ad-creative`, `analytics`, `ab-testing`, `referrals`, `churn-prevention`, `onboarding`, `pricing`, `launch`, `popups`, `paywalls`, `signup`, `lead-magnets`, `cold-email`, `community-marketing`, `social`, `video`, `image`, `customer-research`, `competitor-profiling`, `marketing-psychology`, `product-marketing`, `sales-enablement`, `revops`, `content-strategy`, `aso`, `directory-submissions`, `site-architecture`, `free-tools`, `marketing-ideas`, `co-marketing`, `copy-editing` (full list in `~/.claude/skills/marketingskills/skills/`)
- **Usage**: invoke via Skill tool by name (e.g. `cro`, `copywriting`, `emails`) when working on landing pages, devis emails, service SEO pages, or launch copy for Splice
- **Tool registry**: `~/.claude/skills/marketingskills/tools/REGISTRY.md` — integration guides for GA4, Stripe, Resend, Google Ads, Meta Ads, HubSpot, etc.
- **Update**: `git pull` dans `~/.claude/skills/marketingskills/`

## GSAP

- Install: `npm install gsap @gsap/react`
- Rule: always `useGSAP()` (never `useEffect`) in React
- Global setup: `lib/gsap.ts` with `gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVG, Flip)`
- GSAP components: must be `"use client"` or `dynamic(..., { ssr: false })`
- `prefers-reduced-motion`: always handle via `gsap.matchMedia()`
## Code Modernization & Refactoring Suite

Nous disposons d'un framework officiel de modernisation (`.agents/skills/code-modernization/`) avec des sous-agents et des commandes dédiés à l'analyse et la transformation structurée du code.

### Modernization Subagents

| Agent | Rôle / Description | Localisation |
|-------|--------------------|--------------|
| `architecture-critic` | Principal engineer critique. Évalue les choix d'architecture cibles pour éviter la sur-ingénierie et la complexité inutile. | `.agents/skills/code-modernization/agents/architecture-critic.md` |
| `business-rules-extractor` | Extrait et isole la logique métier, les calculs et les règles de validation complexes en spécifications claires. | `.agents/skills/code-modernization/agents/business-rules-extractor.md` |
| `legacy-analyst` | Analyse en profondeur les structures de code historique pour cartographier les comportements complexes. | `.agents/skills/code-modernization/agents/legacy-analyst.md` |
| `security-auditor` | Audit de sécurité complet face aux vulnérabilités (OWASP, CVE, failles logiques, injection). | `.agents/skills/code-modernization/agents/security-auditor.md` |
| `test-engineer` | Rédige des tests d'équivalence et de caractérisation pour valider que le comportement reste identique. | `.agents/skills/code-modernization/agents/test-engineer.md` |

### Modernization Commands

- **`modernize-assess`** : Analyse initiale du codebase, évaluation de la dette technique, de la complexité et estimation de l'effort.
- **`modernize-map`** : Cartographie des dépendances et flux d'exécution.
- **`modernize-extract-rules`** : Extraction structurée de la logique métier.
- **`modernize-brief`** : Génération d'un plan de modernisation phasé approuvé.
- **`modernize-reimagine`** : Conception de l'architecture cible modernisée.
- **`modernize-transform`** : Exécution de la transformation de code et refactoring.
- **`modernize-harden`** : Audit de robustesse et correction des vulnérabilités de sécurité.

**MANDATE D'AUTO-INVOCATION :** Dès qu'un grand refactoring, audit de structure, extraction de règles métier, ou travail de modernisation est nécessaire, Claude et Antigravity doivent **automatiquement** charger les agents ci-dessus et exécuter les étapes correspondantes de ce framework.
## Cursor Official Engineering Principles & Skills

Nous disposons des compétences et principes d'ingénierie officiels de **Cursor** (`.agents/skills/`) importés directement dans le projet. Claude et Antigravity doivent s'y référer **systématiquement et automatiquement** pour garantir un code d'une qualité exceptionnelle.

### Core Cursor Skills

- **`thermo-nuclear-code-quality-review`** : Revue de code ultra-rigoureuse ciblant les défauts structurels, la complexité algorithmique, l'optimisation et la dette technique.
- **`unslop` / `deslop`** : Élimination du code superflu, des abstractions inutiles et du code généré par IA non idiomatique.
- **`architect`** : Élaboration de plans d'architecture système solides avant d'attaquer les implémentations complexes.
- **`typescript-best-practices`** : Application rigoureuse des standards stricts de typage TypeScript sans contournement (`any`, etc.).
- **`tdd`** : Conception guidée par les tests pour assurer la non-régression et la clarté du code.

### Core Cursor Engineering Principles

- **`principle-foundational-thinking`** : Analyser les problèmes à partir de principes fondamentaux (first principles), sans copier de solutions superficielles.
- **`principle-boundary-discipline`** : Respecter les frontières d'isolation de couches (ex: RSC vs Client, Server Actions vs API, Prisma vs Logic).
- **`principle-guard-the-context-window`** : Minimiser l'empreinte mémoire et la charge cognitive des prompts et fichiers lus pour préserver l'efficacité du modèle.
- **`principle-fix-root-causes`** : Corriger la source réelle d'un bug plutôt que de rajouter un correctif superficiel (workaround).
- **`principle-subtract-before-you-add`** : Supprimer le code mort ou inutile avant d'implémenter de nouvelles fonctionnalités.
- **`principle-never-block-on-the-human`** : Concevoir des processus asynchrones et autonomes extrêmement robustes.
- **`principle-prove-it-works`** : Valider et tester systématiquement chaque édit de code par des commandes ou tests concrets avant livraison.

## Workflow Rules

- **Double-check before validating**: Always verify every modification BEFORE declaring done. Re-read modified files, ensure imports are correct, CSS loads, paths exist. Never validate without complete verification.
- **RSC by default**: `"use client"` only when immediate interactivity is required.
- **No `any`**: Use `unknown` with narrowing if needed.
- **Zod validation**: Client AND server, never trust frontend alone.
- **AuditLog**: On every sensitive action (create/modify/delete docs and users).

## Environment Variables Required

### Runtime Environment Validation
All environment variables are validated at startup using Zod in `lib/env.ts`.
* In local development, runtime bindings and secrets are loaded from `.dev.vars` (used by Wrangler/OpenNext) and client fallbacks from `.env`.

### Cloudflare Bindings (wrangler.jsonc)
In production, R2 buckets and KV namespaces are configured as direct bindings:
- **R2 Buckets**: `SPLICE_CDN` (`splice-cdn`), `SPLICE_DELIVERIES` (`splice-deliveries`), `SPLICE_ARCHIVE` (`splice-archive`).
- **KV Cache**: `SPLICE_INCREMENTAL_CACHE` and `NEXT_INC_CACHE_KV`.

```
DATABASE_URL                        # Neon PostgreSQL (with pooler)
DIRECT_URL                          # Neon direct connection (migrations)
AUTH_SECRET                         # Auth.js v5 secret (openssl rand -base64 32)
NEXTAUTH_SECRET                     # Same as AUTH_SECRET
NEXTAUTH_URL                        # https://splicestudio.fr
NEXT_PUBLIC_APP_URL                 # https://splicestudio.fr
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
RESEND_API_KEY
MAIL_FROM                           # "Splice Studio <noreply@splicestudio.fr>"
MAIL_FOUNDERS                       # comma-separated founder emails
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME                      # splice-app-prod
R2_PUBLIC_URL                       # https://cdn.splicestudio.fr
NEXT_PUBLIC_CDN_GALERIE_URL         # https://media.splicestudio.fr
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
# Optional / Planned:
# ENCRYPTION_KEY                    # AES-256-GCM for PII
# SENTRY_DSN
# NEXT_PUBLIC_PLAUSIBLE_DOMAIN
```

### Image & Media Hosting

`next.config.mjs` allows remote images from Cloudflare R2 (`**.r2.dev`), `cdn.splicestudio.fr`, and `media.splicestudio.fr`.

Homepage videos served from R2 bucket `galerie` via `media.splicestudio.fr/videos/`. Gallery media also on R2 via same CDN domain. No local video files in `public/`.
