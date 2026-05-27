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

**Équipe (2 fondateurs) :**
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
