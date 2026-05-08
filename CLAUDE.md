# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npm run db:push      # Push Prisma schema to DB (no migration file)
npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Run prisma/seed.ts
```

No formal test suite is currently configured. Testing is done manually via playground environments.

## Architecture

**Deepframe** is a Next.js 15 App Router application for a French audiovisual production company. It handles the full client lifecycle: gallery browsing, quote requests, payment, invoices, and contracts.

### Stack

- **Framework**: Next.js 15 (App Router, React 19 RC)
- **Database**: PostgreSQL via Prisma ORM (`lib/db.ts` singleton)
- **Auth**: NextAuth v5 (beta) with JWT strategy, credentials-only (`lib/auth.ts`)
- **Payments**: Stripe (`lib/stripe.ts`)
- **Email**: Resend (`lib/mailer.ts`)
- **State**: Zustand for the quote wizard (`components/devis/store.ts`)
- **Styling**: Tailwind CSS with custom `df-*` color tokens (blue `#1901AD`, gold `#FFBD59`, ink `#0A0A23`)
- **PDF**: PDFKit generated server-side at `app/api/devis/[id]/pdf/route.ts`
- **3D**: React Three Fiber / Drei (used in landing/intro)

### Route Structure

```
app/
  page.tsx                   # Landing page
  layout.tsx                 # Root layout (fonts, Toaster)
  (auth)/                    # Auth group: login, register, forgot/reset-password
  devis/page.tsx             # Quote wizard (requires auth)
  videos/                    # Video gallery + detail [id]
  photos/page.tsx            # Photo gallery
  avis/page.tsx              # Reviews
  contact/page.tsx
  profil/                    # Client dashboard (auth-protected)
    devis/                   # Quote list + [id] detail + [id]/payer
    factures/
    contrats/
    likes/
  admin/                     # Admin dashboard (ADMIN role only)
    devis/ | factures/ | contrats/
  api/
    auth/[...nextauth]/      # NextAuth handler
    devis/[id]/pdf/          # PDF generation endpoint
```

### Key Data Models (Prisma)

- **User**: roles CLIENT | ADMIN, linked to Devis, Facture, Contrat, Like
- **Media**: PHOTO | VIDEO with owner (Founder enum: PAPI | LOUISIA | TY)
- **Devis**: Full quote with computed `lines` (JSON), `totalHT`, `acompteAmount` (30%). Status: ATTENTE → VALIDE → PAYE | REFUSE
- **Facture**: Linked 1:1 to Devis after payment
- **Contrat**: Linked 1:1 to Devis, status A_VENIR → EN_COURS → FINI
- **Counter**: Auto-incrementing sequence per year/type for human-readable numbers (e.g. `2025_001`)

### Core Business Logic

- **Pricing** (`lib/pricing.ts`): `computeQuote(input)` builds line items from packs, supplements, distance (€0.50/km), usage rights, delivery delay. All prices in euros (integers). `MENTIONS_LEGALES` is embedded in PDFs.
- **Quote numbering** (`lib/numbering.ts`): `nextNumero(type, tx)` uses `Counter` table with atomic upsert inside the same DB transaction as the Devis creation.
- **Chef de projet assignment** (`app/actions/devis.ts`): Auto-assigned to the founder with fewest active devis for the current year.
- **Middleware** (`middleware.ts`): Protects `/profil`, `/devis`, `/admin`. Redirects unauthenticated users to `/login?callbackUrl=...`. Redirects non-admins away from `/admin`.

### Server Actions

All mutations use Next.js Server Actions (`"use server"`):
- `app/actions/auth.ts` — register, password reset flow
- `app/actions/devis.ts` — `submitDevis` (validates, computes quote, creates DB record, sends emails, redirects)
- `app/actions/admin.ts` — admin status updates
- `app/actions/likes.ts` — toggle like

## Agent Squad

Five specialized sub-agents in `.claude/agents/` — invoke them for focused tasks:

| Agent | Responsabilité |
|-------|---------------|
| `design-frontend` | UI/UX, composants React, animations, responsive, accessibilité |
| `backend-api` | Server Actions, Prisma, Stripe, Resend, PDF, logique métier |
| `security` | Headers HTTP, CSP, rate limiting, OWASP, hardening auth |
| `seo-performance` | Métadonnées, sitemap, robots.txt, Core Web Vitals, bundle |
| `media-content` | Galerie photos/vidéos, upload, likes, avis, modération |
| `devops-quality` | Erreurs, loading states, TypeScript strict, déploiement, a11y |
| `gsap-animations` | Animations GSAP avancées : ScrollTrigger, SplitText, DrawSVG, Flip, Timeline, React/Next.js |

### GSAP — Capacités disponibles

Source : https://github.com/greensock/gsap-skills (MIT)

- **Core** : `gsap.to/from/fromTo/set`, easing, stagger, matchMedia responsive
- **Timeline** : séquençage, position params (`<`, `>`, `-=`), labels
- **ScrollTrigger** : scroll-linked, scrub, pin, batch, horizontal scroll
- **SplitText** : révéler texte par chars/words/lines (effet cinéma)
- **DrawSVG** : animer les strokes SVG (logo DeepFrame)
- **Flip** : transitions de layout WAAPI-optimisées
- **Performance** : `quickTo`, `will-change`, `prefers-reduced-motion`
- **React** : `useGSAP()` hook (jamais `useEffect`), scope, cleanup auto

Installation : `npm install gsap @gsap/react`
Setup global : créer `lib/gsap.ts` avec `gsap.registerPlugin(...)`

## Environment Variables Required

```
DATABASE_URL
AUTH_SECRET
STRIPE_SECRET_KEY
RESEND_API_KEY
MAIL_FROM
MAIL_FOUNDERS          # comma-separated founder emails
NEXT_PUBLIC_APP_URL
```

### Image Hosting

`next.config.mjs` allows remote images from Supabase (`**.supabase.co`), Cloudflare R2 (`**.r2.dev`), and UploadThing (`utfs.io`).
