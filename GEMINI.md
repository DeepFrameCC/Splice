# GEMINI.md

This file provides guidance to Gemini (Antigravity) when working with code in this repository.

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
npm run test:e2e     # Playwright tests
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
| Storage | Cloudflare R2 — buckets: `galerie` (media.splicestudio.fr), `splice-cdn` (cdn.splicestudio.fr), `splice-deliveries`, `splice-archive` |
| Anti-bot | Cloudflare Turnstile (invisible CAPTCHA) |
| Cache/RL | Upstash Redis (rate limiting on auth endpoints) |
| Styling | Tailwind CSS + shadcn/ui (mobile-first) |
| Animations | GSAP (ScrollTrigger, SplitText, DrawSVG, Flip) |
| State | Zustand (quote wizard) |
| Forms | React Hook Form + Zod |
| PDF | pdf-lib + @pdf-lib/fontkit server-side |
| Monitoring | Sentry (planned) + Plausible (planned) |

### Team

- **t.y97one** — ADMIN (monteur / motion designer)
- **papiforcex** — TEAM (vidéaste / réalisateur)
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
- **Media**: PHOTO | VIDEO with owner (Founder enum: PAPI | LOUISIA | TY), category, client, duration, groupKey, groupOrder
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

Cette section impose les règles de coordination entre l'orchestrateur (moi, Gemini principal) et les 7 sub-agents projet. Elle dérive directement des skills `multi-agent-patterns` et `tool-design`.

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
- Tâche entièrement dans ma zone (réécrire ce fichier GEMINI.md, gérer la mémoire) → inline

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
| `media-content` | Gallery, photo/video upload, R2/Supabase storage, likes, reviews/avis, moderation, founder enum (PAPI/LOUISIA/TY), media metadata |
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

## Workflow Rules

- **Double-check before validating**: Always verify every modification BEFORE declaring done. Re-read modified files, ensure imports are correct, CSS loads, paths exist. Never validate without complete verification.
- **RSC by default**: `"use client"` only when immediate interactivity is required.
- **No `any`**: Use `unknown` with narrowing if needed.
- **Zod validation**: Client AND server, never trust frontend alone.
- **AuditLog**: On every sensitive action (create/modify/delete docs and users).

## Environment Variables Required

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

---

# PRODUCT.md — Splice

> Source de vérité pour `impeccable` et les sub-agents design. Tient lieu de brief produit/marque. À mettre à jour quand la stratégie évolue (`/impeccable teach` régénère depuis ici).

## Register

**brand** — Splice est une boîte de production audiovisuelle. Le site marketing **est** le produit : la qualité visuelle du site fait la première démonstration du savoir-faire. Pas d'app SaaS dashboard derrière (l'espace `/profil` est secondaire). Le design doit refléter l'identité studio créatif, pas la fonctionnalité.

## Product Purpose

Splice produit des contenus audiovisuels pour PME et entreprises du Centre-Val de Loire — pubs sociales, shootings automobile, films de marque, événementiel, intros animées. Le site sert à convertir un prospect en demande de devis qualifiée (tunnel `/devis` 4 étapes, paiement Stripe acompte 30%, livrables sous 14j en moyenne).

## Users

**ICP primaire :**
- Dirigeants de PME locales (Orléans, Tours, Loiret 45, Indre-et-Loire 37) — 5-50 salariés, budget marketing 1k-15k/an
- Concessionnaires & importateurs automobile (segment shooting auto premium)
- Restaurateurs, prestataires services locaux (formules abonnement)

**ICP secondaire :**
- Particuliers premium (mariage, événement personnel — Pack Particulier)
- Agences de communication régionales (sous-traitance ponctuelle)

**Visiteurs friction :**
- Ne savent pas distinguer un studio créatif premium d'un freelance générique
- Doutent du budget — beaucoup pensent "réservé aux grandes marques"
- Hésitent sur le délai et la disponibilité d'une boîte locale

**Job-to-be-done :** "Je veux du contenu vidéo/photo qui me fait passer pour une marque sérieuse sans dépenser 20k€ ni attendre 3 mois."

## Brand

**Nom :** Splice
**Statut :** auto-entrepreneur (franchise TVA, art. 293 B CGI — non soumise TVA)
**Localisation :** Orléans (45) + Tours (37), interventions Centre-Val de Loire
**Identité visuelle :** "Cinéma Studio" — dark natif, frame cinéma, codes TC, orange brûlé, surfaces glauque/forêt, typographie display condensée.

**Équipe (3 fondateurs) :**
- `papiforcex` — vidéaste / réalisateur (Sony FX, terrain, montages After Effects)
- `by.louisia` — photographe / Sony ZV1 (rendu léché, voice-over)
- `t.y97one` — monteur / motion designer (DaVinci Resolve, étalonnage, sound design)

## Tone

Direct. Premium sans esbroufe. Concret. Confiant.

**Use :**
- Phrases courtes, verbes d'action ("On filme. On cadre. On sublime.")
- Spécifique sur les livrables et délais (jamais vague)
- Tutoiement client = NON (vouvoiement professionnel)
- Italique orange `#F36B1F` pour les accents conceptuels (`<em>`)
- Codes cinéma : TC, frame, 4K, 24fps — donnent l'autorité technique
- Localisation explicite : "Orléans · Tours · Centre-Val de Loire"

**Avoid :**
- Em dashes `—` en copy française (utiliser virgules, deux-points, parenthèses)
- Hype words : "révolutionnaire", "unique", "leader", "passionné"
- Pluriels marketing creux : "expériences", "solutions", "expertises"
- Apostrophes éducation : "captiver l'attention", "raconter votre histoire"
- Anglicismes gratuits (sauf si terme métier reconnu : showreel, rolling shot, motion design)

## Anti-references

Sites/aesthetics à NE PAS reproduire :
- **Template SaaS B2B générique** (sidebar + cards + KPI tiles)
- **Sites freelance "passion / votre projet est unique"** — agitation fluffy
- **Agences communication régionales** typiques (carrousel témoignages, blocks "Nos valeurs")
- **Wedding photographer "minimal pastel"** (Splice n'est PAS un studio mariage)
- **Sites concession auto** — gris/bleu corporate
- **Templates Webflow/Framer "café-blanc"** (blocs blanc-cassé identiques)

## Strategic principles

1. **Le site démontre le métier.** Chaque section doit prouver visuellement qu'on sait composer une image. Showreel et VideoReel sont des assets stratégiques, pas décoratifs.
2. **Convert ou dégage.** Toute section qui n'aide pas à comprendre, convaincre ou convertir → réduite ou supprimée. Refonte récente : -40% de copy landing.
3. **CTA unique et harmonisé.** "Demander un devis" partout (jamais "Demandez votre devis" ni "Devis gratuit" ni "Estimation"). Tunnel `/devis` est l'unique chemin de conversion principal.
4. **Local-first SEO.** Mots-clés : "production audiovisuelle Orléans", "shooting automobile Tours", "vidéaste Centre-Val de Loire". "Automobile" plutôt que "auto" (volume search).
5. **Pas de stock photos.** Toutes les images visibles sont des réalisations clients (CKCleanAuto45, Bistrot Croix Morin, etc.). Showreel = portfolio direct, pas du remplissage.
6. **Italique orange = signature.** La convention `<em>` italic 700 Poppins en `#F36B1F` est la touche de marque unique. À utiliser avec parcimonie (1-2 par section max) pour qu'elle reste précieuse.

## Conversion path

```
Landing (Hero) → CTA "Demander un devis" → /devis (Wizard 4 étapes) → Stripe acompte 30% → email confirmation Resend
```

Chemins secondaires : `/galerie` (preuve sociale visuelle) · `/tarifs` (clarté pricing) · `/contact` (3 canaux : email, WhatsApp, formulaire) · `/equipe` (humanisation).

## Out of scope

- Pas d'app mobile native
- Pas de marketplace photographes/vidéastes
- Pas de plateforme de streaming
- Pas de réservation de créneau autonome (le devis humain reste obligatoire)

## Stack technique (référence pour design constraints)

Next.js 15 App Router · React 19 · Tailwind CSS · GSAP (ScrollTrigger, SplitText, DrawSVG, Flip) · Zustand · Prisma · Neon PostgreSQL · Auth.js v5 (PBKDF2 + 2FA TOTP) · Stripe · Resend · pdf-lib · Cloudflare Workers (OpenNext) · Cloudflare R2 (media.splicestudio.fr / cdn.splicestudio.fr) · Upstash Redis · Cloudflare Turnstile.

CSS : tokens Cinéma Studio dans `tailwind.config.ts` + classes legacy `df-*` dans `app/prototype-styles.css` (cohabitent). Animations compositor-only (transform, opacity). `prefers-reduced-motion` toujours géré via `gsap.matchMedia()`.

---

# DESIGN.md — Splice Cinéma Studio

> Source de vérité pour `impeccable` et les sub-agents design. Référence concrète des tokens, typographies, motion et composants. Compatible avec les laws `impeccable` (OKLCH, jamais `#000`/`#fff`, hiérarchie ≥1.25, etc.).

## Color strategy

**Niveau commitment :** **Committed** — `#0E0E22` (bg-night) couvre 60-70% des surfaces. C'est l'identité, pas un fond neutre. Orange `#F36B1F` est l'accent ≤10% (CTA, em, eyebrows).

**Theme :** Dark natif (pas de toggle). Scene sentence : *"Un dirigeant PME consulte le site sur son MacBook depuis son bureau lumineux, mais le site assume un dark cinéma — comme regarder un teaser pro plein écran."*

## Palette

Tous les neutrals sont **tintés vers l'orange brûlé** (chroma 0.005-0.015). Jamais `#000` ni `#fff` purs.

### Background

| Token | HEX | OKLCH approx | Usage |
|-------|-----|--------------|-------|
| `--bg-night` | `#0E0E22` | `oklch(13.7% 0.029 277)` | Fond principal de toutes les pages |
| `--bg-deep` | `#0A0A1C` | `oklch(11.2% 0.031 280)` | Sections services, contraste sur night |
| `--surface-glauque` | `#2E4239` | `oklch(33% 0.038 165)` | Cartes services, hero frame |
| `--surface-glauque-mid` | `#6B8779` | `oklch(57.5% 0.044 162)` | Hero frame inner, verso |

### Texte

| Token | HEX | Usage |
|-------|-----|-------|
| `#FFFFFF` *(évité pur)* | — | *NE PAS UTILISER* — préférer `#F4F4F5` ou `--glauque-300` |
| `--glauque-300` | `#C4D2C5` | Texte description sur surface glauque |
| `--glauque-500` | `#9DB5A6` | Bordures, compteurs, méta |
| `rgba(255,255,255,.7)` | — | Body text sur night (équivalent tinté) |
| `rgba(255,255,255,.4)` | — | Captions, secondaire |

### Accent

| Token | HEX | OKLCH | Usage |
|-------|-----|-------|-------|
| `--df-accent` / `--brand-orange` / `df-gold` | `#F36B1F` | `oklch(67% 0.18 47)` | CTA primary, em, eyebrows, badges |
| Orange dark hover | `#C4550A` | `oklch(55% 0.16 47)` | CTA hover state |
| Orange soft | `#F9A06A` | `oklch(75% 0.14 47)` | Disabled CTA, ghosts |

### Legacy (en transition, ne pas utiliser en nouveaux composants)

`#1901AD` (df-blue) — couleur signature historique, conservée dans certains imports anciens (`df-blue` dans tailwind.config maps to orange désormais, le bleu n'est plus utilisé visuellement).

## Typography

**Display :** **Anton Regular** (Google Fonts OFL, local dans `public/fonts/Anton-Regular.ttf`) — condensed bold sans-serif. UN seul poids (400). Uppercase tracking-tight pour tous les titres.

**Body :** **Poppins** (4 fichiers locaux : Regular 400, Bold 700, Italic 400, BoldItalic 700). Italic-700 réservé à `<em>` orange.

**Pas de mono** — Poppins en `font-feature-settings: "tnum"` couvre les codes TC / chiffres tabulaires.

### Hierarchy (ratio ≥1.25)

| Niveau | Font | Size | Weight | Tracking | Transform |
|--------|------|------|--------|----------|-----------|
| Hero h1 | Anton | `clamp(56px, 8vw, 124px)` | 400 | `-0.01em` | `uppercase` |
| h1 standard | Anton | `clamp(40px, 5vw, 72px)` | 400 | `-0.005em` | `uppercase` |
| h2 section | Anton | `clamp(36px, 4.6vw, 68px)` | 400 | `-0.005em` | `uppercase` |
| h3 | Anton | `28px` desktop / `22px` mobile | 400 | `-0.005em` | `uppercase` |
| h4 / sub | Anton | `20px` | 400 | `0em` | `uppercase` |
| Body | Poppins | `15-17px` | 400 | normal | none |
| Body large | Poppins | `18-20px` | 400 | normal | none |
| Caption | Poppins | `13px` | 400 | normal | none |
| Eyebrow | Poppins | `11-12px` | 700 | `0.16-0.18em` | `uppercase` |
| Button | Poppins | `13-15px` | 700 | `-0.005em` | none |

### Italic-orange convention (signature)

```css
.df-root em {
  font-family: var(--font-sans); /* Poppins italic */
  font-style: italic;
  font-weight: 700;
  color: var(--df-accent); /* #F36B1F */
  text-transform: none;
  letter-spacing: -0.005em;
}
```

Anton n'a pas d'italic — la convention italique-orange repose entièrement sur Poppins Italic 700. À utiliser avec parcimonie : 1-2 em par section maximum.

### Line length

Body text capé à `max-width: 46-65ch`. Titres à `text-wrap: balance`. Pas de paragraphes >3 lignes sans break visuel.

## Spacing & rhythm

Variées intentionnellement — **pas de padding uniforme**. Système hybride Tailwind + tokens `df-*`.

| Token | Valeur | Usage |
|-------|--------|-------|
| Section vertical | `clamp(64px, 8vw, 120px)` | Entre sections majeures |
| Section padding-x | `clamp(24px, 4vw, 80px)` | Marges horizontales |
| Card padding | `32px` | Cards services, plans |
| Tight gap | `12-16px` | Listes, badges |
| Wide gap | `40-56px` | Hero CTA cluster, grid services |

Container max-width : `1320px` (legacy) / `max-w-5xl` (1024px) / `max-w-6xl` (1152px) selon contexte.

## Radii

- `rounded-full` (999px) → boutons, badges, pills
- `rounded-2xl` (18px = `--df-radius`) → cards, surfaces glauque, hero frame
- `rounded-xl` (12px) → cards secondaires, list items
- `rounded-lg` (8px) → inputs, form controls
- `border-radius: 0` → **jamais sur les composants visibles** (sauf bandes plein écran)

## Borders & lines

- Bordures principales : `var(--df-line)` = `rgba(255,255,255,0.08)`
- Bordure accentuée : `rgba(243,107,31,0.25)` (df-gold/25)
- **JAMAIS** de border-left/right >1px en accent coloré (interdit par impeccable bans)
- Toujours border complète ou tinted background

## Elevation (shadows)

Très restreint — Splice est dark, les shadows soft sur dark sont peu visibles.

- `--df-shadow-sm` : `0 1px 0 rgba(10,10,35,.04), 0 8px 24px -12px rgba(10,10,35,.10)`
- `--df-shadow-md` : `0 1px 0 rgba(10,10,35,.06), 0 24px 60px -28px rgba(10,10,35,.18)`
- CTA primary glow : `0 8px 22px -8px rgba(243,107,31,0.6)` (orange diffuse)
- **PAS de glassmorphism par défaut** (interdit par impeccable bans). `backdrop-blur` uniquement sur Nav sticky (`14px saturate(160%)`).

## Motion

**Toujours sur properties compositor :** `transform`, `opacity`, `clip-path`, `filter` (sparingly). **JAMAIS** sur `width`, `height`, `top`, `left`, `margin`, `padding`.

### Easings

- Default : `cubic-bezier(.22,.61,.36,1)` (ease-out-quart proche)
- Hero/dramatic : `cubic-bezier(.16,1,.3,1)` (ease-out-expo)
- Quick UI : `cubic-bezier(.4,0,.2,1)` (ease-out)
- **PAS de bounce, PAS d'elastic** (interdit par impeccable bans + ne sied pas à l'identité)

### Durations

- Micro (hover, focus) : `150-200ms`
- Standard (page transition, card lift) : `300-350ms`
- Cinematic (hero reveal, scroll-linked) : `600-900ms`
- GSAP timelines : variables, mais `useGSAP()` obligatoire (jamais `useEffect`)

### Reduced motion

`prefers-reduced-motion: reduce` toujours géré via `gsap.matchMedia()` ou `@media`. Fallback explicite ou animations désactivées — pas de no-op silencieux.

## Components

### Buttons

- **Primary :** `.df-btn-primary` — fond orange `#F36B1F`, texte `#1A1408`, rounded-full, padding `14-18px × 22-28px`, glow shadow. Hover : `translateY(-1px)`.
- **Ghost :** `.df-btn-ghost` — transparent, border `var(--df-line)`, texte clair. Hover : background `rgba(255,255,255,.04)`.
- **Outline :** `.df-btn-outline` — transparent, border orange. Hover : fill orange + texte sombre.
- **CTA libellé unique :** "Demander un devis" (jamais "Demandez votre devis").

### Cards

- Background `--bg-card` ou `--surface-glauque` selon contexte
- Border `1px solid var(--df-line)` toujours
- Hover : `translateY(-2px to -4px)` + shadow-md
- **JAMAIS de nested cards** (interdit par impeccable bans + signal AI slop)
- **JAMAIS de grilles identiques** — varier tailles, breaker rythme (bento approche)

### Forms

- Inputs `bg-white/[0.06]` + border `rgba(255,255,255,.12)` + radius `10px`
- Focus : border `--df-accent` + bg `rgba(255,255,255,.10)` (pas de ring blue par défaut)
- Labels eyebrow style (uppercase tracking-wide Poppins 700)
- Validation inline (pas en alerte modal)

### Nav

- Sticky top, `bg color-mix(in oklab, var(--bg-night) 88%, transparent)`
- Backdrop-blur 14px (exception au ban glassmorphism — purposeful pour ne pas masquer le hero)
- Border-bottom `var(--df-line)`
- Logo Anton condensed, link CTA `df-btn-primary df-btn-sm`

### Showreel / VideoReel

- Aspect ratios variés (16/9, 4/3, 9/16) — pas de grilles uniformes
- Corners décoratifs (4 `<i>`) — signature frame cinéma
- TC overlay format `HH:MM:SS:FF` ou `MM:SS`
- Hover : video play (muted, loop)
- Mouseleave : reset à frame 0

## SEO/Accessibility constraints

- `<html lang="fr">` obligatoire
- Skip link `<a href="#main-content">`
- Tous les éléments interactifs ont focus visible
- Boutons icônes ont `aria-label`
- Images décoratives `alt=""`, contenu `alt` descriptif
- Contraste min 4.5:1 (Anton blanc sur `#0E0E22` ≈ 14:1 ✓)

## Files de référence

- `app/prototype-styles.css` — système tokens legacy + classes `df-*`
- `app/globals.css` — Tailwind base + tokens globaux
- `tailwind.config.ts` — tokens `df-*` namespace + `fontFamily.display/sans`
- `app/layout.tsx` — chargement next/font/local (Anton + 4 Poppins)
- `public/fonts/` — tous les fichiers TTF locaux
- `components/home/HomeContent.tsx` — référence visuelle landing
- `components/layout/Nav.tsx` — nav pattern
- `components/devis/Wizard.tsx` — pattern formulaire multi-step

## Bans absolus (impeccable laws + Splice)

1. `#000` / `#fff` purs — tint vers orange
2. `border-left` / `border-right` >1px coloré en accent
3. `background-clip: text` + gradient text
4. Glassmorphism par défaut (sauf Nav sticky)
5. Hero-metric template (gros chiffre + label, gradient accent)
6. Grilles de cards identiques (icon + heading + text répété)
7. Modal-first reflex
8. Em dashes `—` en copy française (utiliser `,` `:` `;` `.` `()`)
9. Italique sur `font-display` Anton (synthèse fake italic moche) → toujours via Poppins italic
10. Animations sur layout properties (width/height/top/left/margin/padding)
11. Bounce / elastic easings
12. `useEffect` pour animations GSAP (toujours `useGSAP()`)
