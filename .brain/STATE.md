# STATE — Refonte Splice → Portail Orléans

## Objectif
Voir `.brain/GOAL.md`. Livrable = `REFONTE-PLAN.md` (5 sections, phasé).

## Faits établis
- Repo: C:\dev\splice, remote DeepFrameCC/Splice, branche main.
- Stack: Next.js 15 App Router, Cloudflare Workers (OpenNext), Neon PG + Prisma, Auth.js v5, Stripe, Resend, R2, Tailwind+shadcn, GSAP, Zustand.
- Site actuel = boîte prod audiovisuelle Orléans (auto-entrepreneur). Déjà des pages service-ville (orleans/tours) → amorce SEO local existante.
- Routes existantes incluent: agence-communication-orleans, photographe-orleans, production-video-orleans/tours, videaste-orleans, photographe-evenementiel, galerie, tarifs, devis, blog, realisations.

## Pivot visé
Domaine principal → portail/info local Orléans (extensible régions). Photo/vidéo = offre SECONDAIRE pour commerces (shooting magasin). + système d'acquisition robuste.

## Cycles
### Last session
- Cycle 1/15 : 4 agents audit livrés (tech / contenu-SEO / charte / stratégie) → synthèse `REFONTE-PLAN.md` (9 sections, 7 phases). Verifier indépendant = **satisfied**. Mot d'état = **DONE**.

## Résultat
- Livrable: `C:\dev\splice\REFONTE-PLAN.md`. Couvre les 5 sections + phasage 0→7.

## Décisions TRANCHÉES (2026-07-17)
- Domaine: splicestudio.fr CONSERVÉ (pas de bascule DNS ; Phase 6 = réorg URL + 301 internes).
- Marque: "splicestudio" (nom complet, pas "Splice").
- Charte: Swiss minimal clair (blanc, Outfit unique, grille stricte, 1 accent orange #F36B1F, OKLCH). Pas de bi-mode.
- Photo/vidéo: réduit à UNE page unique (offre commerces).
- Blog: 23 articles → recyclés en guides portail.

## Cycle 2/15 — Phase 1 design system : DONE + verifié
- Livrables: `app/styles/tokens.css` [NEW], `app/design-system/page.tsx` [NEW route noindex], `tailwind.config.ts` [MODIFY tokens sémantiques additifs], `app/globals.css` [MODIFY @import], `components/ui/{button,card,input,badge}.tsx` [MODIFY variants swiss non-destructifs].
- Tokens OKLCH: bg #fdfaf8, surface #fff, ink #1f1915, muted #71655d, brand #f57531, brand-ink #b54710 (lien AA 5.23:1). Radius/shadow/space namespacés swiss-*.
- Thème Swiss = OPT-IN via classe `.swiss` (body dark global INCHANGÉ → aucune casse des pages non migrées). Aucun token df-* supprimé.
- Verif: build VERT (95 pages), 68 tests OK, lint clean. Verifier indépendant = satisfied (contrastes recalculés).
- Fix: `*/` dans commentaire globals.css fermait le commentaire → "Unknown word". Corrigé.

## Prochaine étape = Phase 2 (data model portail multi-villes)
- CHECKPOINT: Phase 2 touche la DB Neon (npm run db:push). Écriture base = checkpoint humain → confirmer avant push.
- Valider visuellement `/design-system` (npm run dev) avant d'avancer.

## Faits clés confirmés par l'audit
- Charte "Cinéma Studio" annoncée ≠ runtime: 1 seule font (Outfit), monochrome orange/#0E0E22, tokens df-blue/df-gold/df-cream/df-ink FAUX. `prototype-styles.css` = 3770 l., ~70-80% à réécrire.
- Socle SEO/programmatic excellent et réutilisable: `lib/services/local-seo.ts` + route `/services/[slug]/[ville]` = patron multi-villes transposable. Manque data model établissement/catégorie/quartiers.
- Tests quasi nuls hors pricing/numbering/crypto. Parcours devis→paiement→livraison NON testé.
- Fragilité deploy: 5 scripts patch OpenNext/Prisma/WASM. NextAuth figé beta.25.

## Échecs datés
(aucun)

## Leçons
- Ne jamais se fier à la charte "annoncée" (CLAUDE.md) : vérifier le runtime réel (fonts chargées, tokens résolus). Écart majeur constaté ici.
