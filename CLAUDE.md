# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

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

No formal test suite is currently configured (Vitest + Playwright planned Phase 16).

## Architecture

**DeepFrame** is a Next.js 15 App Router application for a French audiovisual production company based in **Saint-Avertin (37)**. Legal status: **auto-entrepreneur** (franchise TVA, art. 293 B CGI).

The platform handles: public showcase, client authentication (CLIENT / TEAM / ADMIN), quote wizard, payment via Stripe, PDF invoices, electronic contracts, and a full admin dashboard.

### Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router, RSC, Server Actions) |
| Language | TypeScript strict |
| Database | Neon PostgreSQL (eu-central-1) via Prisma |
| Auth | Auth.js v5 (JWT strategy currently, migrating to DB sessions + Argon2id + 2FA TOTP) |
| Payments | Stripe Checkout + webhooks |
| Email | Resend + React Email |
| Storage | Cloudflare R2 (planned, currently local public/) |
| Signature | Yousign eIDAS (planned) |
| Cache/RL | Upstash Redis (planned) |
| Styling | Tailwind CSS + shadcn/ui (mobile-first) |
| Animations | GSAP (ScrollTrigger, SplitText, DrawSVG, Flip) |
| State | Zustand (quote wizard) |
| Forms | React Hook Form + Zod |
| PDF | PDFKit server-side |
| Monitoring | Sentry + Plausible (planned) |

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

- **User**: roles CLIENT | ADMIN (migrating to CLIENT | TEAM | ADMIN)
- **Media**: PHOTO | VIDEO with owner (Founder enum: PAPI | LOUISIA | TY), category, client, duration
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

## Agent Squad

Specialized sub-agents in `.claude/agents/`:

| Agent | Responsibility |
|-------|---------------|
| `design-frontend` | UI/UX, React components, animations, responsive, a11y |
| `backend-api` | Prisma, Server Actions, Stripe, Resend, PDF, business logic |
| `security` | HTTP headers, CSP, rate limiting, OWASP, auth hardening |
| `seo-performance` | Metadata, sitemap, robots.txt, Core Web Vitals, bundle |
| `media-content` | Gallery, upload, likes, reviews, moderation |
| `devops-quality` | Errors, loading states, TypeScript strict, deployment |
| `gsap-animations` | GSAP: ScrollTrigger, SplitText, DrawSVG, Flip, Timeline |

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
DATABASE_URL
DIRECT_URL               # Neon direct connection (migrations)
AUTH_SECRET
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY
MAIL_FROM
MAIL_FOUNDERS            # comma-separated founder emails
NEXT_PUBLIC_APP_URL
# Planned:
# ENCRYPTION_KEY          # AES-256-GCM for PII
# R2_ACCOUNT_ID / R2_ACCESS_KEY / R2_SECRET_KEY / R2_BUCKET
# UPSTASH_REDIS_URL / UPSTASH_REDIS_TOKEN
# YOUSIGN_API_KEY
# SENTRY_DSN
# PLAUSIBLE_DOMAIN
```

### Image Hosting

`next.config.mjs` allows remote images from Supabase (`**.supabase.co`), Cloudflare R2 (`**.r2.dev`), and UploadThing (`utfs.io`).

## Migration Roadmap (16 Phases)

Currently between Phase 0 (existing site) and Phase 1. See prompt master document for full roadmap.

### Immediate priorities:
1. shadcn/ui setup + component library
2. Prisma schema evolution (TEAM role, Profile, Session, AuditLog, etc.)
3. Auth hardening (Argon2id, 2FA TOTP, DB sessions)
4. Rate limiting (Upstash Redis)
5. Encryption helpers (AES-256-GCM for PII)
