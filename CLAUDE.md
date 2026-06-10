# CLAUDE.md — Splice Studio (projet)

Ce fichier décrit **uniquement les modules spécifiques au projet Splice Studio**. Les compétences (skills), les sous-agents et les bonnes pratiques transverses sont définis dans le `CLAUDE.md` global (`~/.claude/CLAUDE.md`) et s'appliquent à toutes les sessions — ne pas les dupliquer ici.

## Protocole de raisonnement

Appliquer cette méthode sur **toute** tâche, quelle que soit sa taille. L'objectif : zéro supposition, zéro affirmation non vérifiée.

### 1. Comprendre avant d'agir
- **Lire le code réel avant de répondre ou modifier.** Ne jamais raisonner depuis la mémoire de la stack ou des conventions supposées — Splice a ses propres invariants (numbering transactionnel, prix en euros entiers, Workers ≠ Node runtime).
- Lancer les recherches indépendantes **en parallèle** (Glob + Grep + Read simultanés), pas en série.
- Avant de toucher un fichier, identifier ses consommateurs (`Grep` sur les imports) : une modification de `lib/pricing.ts` ou `lib/numbering.ts` impacte devis, PDF, Stripe et emails.
- Reformuler la demande en une phrase + critères de succès vérifiables. Si deux interprétations existent et changent le code produit, demander **avant** d'implémenter, pas après.

### 2. Calibrer l'effort
- Tâche triviale (typo, copy, valeur de config) → agir directement, pas de plan.
- Tâche non triviale (logique métier, schéma Prisma, auth, paiement) → plan court d'abord : fichiers touchés, ordre des changements, risques, comment vérifier.
- Score d'incertitude honnête : si une hypothèse n'est pas vérifiée dans le code, la marquer comme hypothèse — ou la vérifier maintenant. Ne jamais présenter une supposition comme un fait.

### 3. Debug : cause racine, pas symptôme
1. **Reproduire** (ou localiser la trace exacte : Sentry, logs Workers, erreur build).
2. **Consulter la mémoire d'abord** : `memory/drafts/fix-*.md` et le vault générique — le bug a peut-être déjà été résolu (cf. section Connectome Vault).
3. Formuler 2-3 hypothèses classées par probabilité, puis les **éliminer par la preuve** (lecture de code, log, test), pas par intuition.
4. Corriger la cause racine. Si on ne corrige qu'un symptôme (contrainte de temps), le dire explicitement.
5. Écrire la note `fix-*` dans le vault (format ci-dessous).

### 4. Vérifier avant de déclarer terminé
- Minimum systématique : `npm run lint` + `npm run test`. Si schéma Prisma, route, ou config touchés : `npm run build` (qui inclut `prisma generate`).
- Rapporter les résultats **fidèlement** : un test qui échoue est annoncé avec sa sortie, jamais masqué ni contourné en désactivant le test.
- « Ça devrait marcher » est interdit. Soit c'est vérifié, soit c'est dit comme non vérifié.

### 5. Sobriété du code
- Périmètre minimal : ne corriger que ce qui est demandé. Pas de refactor opportuniste, pas d'abstraction spéculative, pas de dépendance ajoutée sans justification.
- Le code suit l'idiome du fichier hôte (nommage, densité de commentaires, patterns existants).
- Compatibilité Workers obligatoire : pas d'API Node non supportée par le runtime Cloudflare (utiliser WebCrypto, pas `crypto` Node ; pas de `fs`).

## Connectome Vault — mémoire active

Connectome Vault est la bibliothèque de connaissances IA (skills, patterns, fixes, décisions). Deux niveaux :

- **MCP `vault-splice`** — mémoire projet : dossier `memory/` de ce repo (`C:/Users/Windows/Splice/memory` en local).
- **MCP `vault-generic`** — bibliothèque centrale : `C:/Users/Windows/connectome-vault/memory`.
- Schéma mémoire actif : **v3.5**. Règle source : `.agent/rules/connectome.md`.

### Début de session (obligatoire)
1. `memory_get_summary` sur `vault-splice`.
2. **Fallback sans MCP** (sessions distantes/CI) : lire directement `memory/summary.md` puis `memory/00-MOC-project.md`, et parcourir les titres de `memory/drafts/`.

### Lecture — quand consulter le vault
- Avant tout debug → chercher un `fix-*` existant dans `memory/drafts/` et `vault-generic`.
- Avant toute décision d'architecture → vérifier les ADR existants (`decisions/`) pour ne pas contredire un choix acté.
- Avant d'implémenter un pattern courant (upload R2, email Resend, webhook, cron) → chercher un patron `tech/` réutilisable dans `vault-generic`.

### Écriture — quand enrichir le vault
Écrire une note dans `memory/drafts/` à chaque : **bug corrigé** (`fix-*`), **pattern technique réutilisable**, **décision d'architecture (ADR)**, **leçon de prod** (incident, perf, SEO). Format v3.5 :

```markdown
---
id: fix-<slug-court>
title: "Titre descriptif"
summary: "1-2 phrases : symptôme, cause racine, solution."
type: fix            # fix | pattern | decision | feature
coreprimary: fixes   # fixes | tech | decisions | design | product
importance: 0.5      # 0.0-1.0
status: draft
schemaversion: "3.5"
created: YYYY-MM-DD
updated: YYYY-MM-DD
links: []
---

# Titre

## Problématique
(symptôme observé, contexte, message d'erreur exact)

## Cause racine
(le pourquoi réel, pas le symptôme)

## Solution implémentée
(étapes numérotées)

## Fichiers modifiés / créés
- chemin [NEW|MODIFY]
```

- **Enrichissement central** : tout patron `tech/`, correctif `fixes/` ou ADR `decisions/` **générique** (non spécifique à Splice) doit aussi être écrit comme draft dans `vault-generic` pour la bibliothèque commune.
- Tenir `memory/summary.md` à jour (date, état, prochaine action) en fin de session significative.

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

**Splice Studio** is a Next.js 15 App Router application for a French audiovisual production company based in **Orléans (45), France**. Legal status: **auto-entrepreneur** (franchise TVA, art. 293 B CGI).

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

### Charte visuelle "Cinéma Studio"

Splice Studio a déjà sa direction artistique. Utiliser les skills design globaux (`ui-ux-pro-max`, `impeccable`, `emil-design-eng`) comme référence/checklist **sans écraser les tokens existants** :
- Couleurs : `#0E0E22`, `#6B8779`, `#F36B1F`
- Fonts : Fraunces, Inter, JetBrains Mono (et Anton/Poppins selon contexte)
- Register `impeccable` : `brand` (production audiovisuelle = design IS the product)
- Tinter les neutrals vers `#F36B1F` (chroma 0.005-0.01) pour respecter les design laws OKLCH

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

### Pièges connus (issus du vault — détails dans `memory/drafts/`)

- **Neon scale-to-zero → 504 sur Workers** : la DB en veille dépasse le budget d'exécution du Worker au réveil. Mitigé par le cron keep-alive (`app/api/cron/keep-alive/route.ts`, toutes les 4 min via `wrangler.jsonc`) et `statement_timeout` 8 s dans `lib/db.ts`. Ne pas supprimer ces garde-fous. → `fix-504-timeout-neon-galerie.md`
- **CSP** : la CSP est définie dans `middleware.ts` — toute nouvelle origine (script analytics, pixel, domaine image) doit y être ajoutée (`img-src`, `connect-src`…), sinon blocage silencieux en prod. → `fix-csp-gtm-ga4.md`
- **JSON-LD** : un seul schéma `FAQPage` par page — les doublons cassent les rich results. → `fix-duplicate-faqpage-schema.md`

### Server Actions

All mutations use `"use server"`:
- `app/actions/auth.ts` — register, password reset
- `app/actions/devis.ts` — `submitDevis` (validates, computes, creates, sends emails)
- `app/actions/admin.ts` — admin status updates
- `app/actions/likes.ts` — toggle like
- `app/actions/contact.ts` — contact form submission

### GSAP — setup projet

- Global setup: `lib/gsap.ts` avec `gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVG, Flip)`
- (Voir bonnes pratiques GSAP transverses dans `~/.claude/CLAUDE.md`.)

## Routing projet (application des sous-agents au code Splice Studio)

Les sous-agents et skills sont définis globalement. Voici comment ils s'appliquent aux fichiers Splice Studio.

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

### Chaining examples (Splice Studio)

- Nouvelle page `/services/[slug]` SEO-optimisée → `seo-performance` (metadata, JSON-LD) + `design-frontend` (UI) + `backend-api` (data fetch)
- Tunnel devis avec paiement Stripe → `backend-api` (Server Action, Stripe, Resend) + `design-frontend` (Wizard UI) + `security` (validation Zod, rate limit) + `devops-quality` (error boundary)
- Animation hero landing → `gsap-animations` + `design-frontend` + `seo-performance` (vérifier LCP)
- Refonte tarifs → `backend-api` (`lib/pricing.ts`) + `design-frontend` (PricingSection) + `seo-performance` (metadata)

### Marketing skills — mapping Splice Studio

- Copy des pages services / landing → `copywriting` + `cro`
- Emails devis/onboarding/relance → `emails`
- Page `/services/*` SEO → `seo-audit` + `ai-seo` + `schema`
- Page `/tarifs` → `pricing` + `cro`
- Galerie / showcase → `image` + `social`
- Avis clients → `customer-research`
- Lancement nouveau service → `launch` + `directory-submissions`

### Design skills — cas Splice Studio

- Refonte composant (`components/services/*`, `components/devis/*`, `components/home/*`) → `ui-ux-pro-max` + `design-frontend`
- Polish transitions tunnel devis (`components/devis/Wizard.tsx`, `Steps.tsx`) → `emil-design-eng` → `design-frontend`
- Hover states galerie / showreel (`components/home/HomeContent.tsx`) → `emil-design-eng`
- Toute prose visible client (`prisma/services-content.ts`, `components/services/*`, emails Resend, PDF mentions, hero/baseline) → `stop-slop` en final pass

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

## SEO & Link Building Rules

### Internal Linking Rule (Maillage Interne)
*   Chaque article de blog ou réalisation publié doit comporter **au moins 2 liens internes contextuels** :
    1.  Un lien pointant vers la page service métier générique (ex: `/services/montage-video`).
    2.  Un lien pointant vers la page locale service-ville correspondante (ex: `/services/montage-video/orleans`).
*   Utiliser des ancres de lien sémantiques et descriptives (ex: "expert en montage vidéo à Orléans" au lieu de "cliquez ici").

### Off-Page SEO & Netlinking Guidelines
Pour développer le profil d'autorité (backlinks) de Splice Studio (objectif : rattraper IOA/48 et Mstream/65 RD), l'équipe doit prioriser les actions suivantes :
1.  **Annuaires Locaux** : Inscrire l'établissement dans les annuaires régionaux qualitatifs (Loiret 45 et Indre-et-Loire 37).
2.  **Relations Presse régionales** : Proposer des dossiers/communiqués lors de projets phares (ex: couverture de grands événements à Orléans/Tours) aux rédactions locales (*La République du Centre*, *La Nouvelle République*).
3.  **Backlinks Clients** : Demander systématiquement l'ajout d'un lien d'attribution "Réalisation : Splice Studio" sur les sites des clients réguliers ou institutionnels ayant commandé des vidéos.
