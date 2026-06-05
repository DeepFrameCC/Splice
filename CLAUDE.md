# CLAUDE.md — Splice Studio (projet)

Ce fichier décrit **uniquement les modules spécifiques au projet Splice Studio**. Les compétences (skills), les sous-agents et les bonnes pratiques transverses sont définis dans le `CLAUDE.md` global (`~/.claude/CLAUDE.md`) et s'appliquent à toutes les sessions — ne pas les dupliquer ici.

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
