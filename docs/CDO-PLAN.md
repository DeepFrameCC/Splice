# Splice Studio — Plan CDO & triage des 90 commandes

> Principe non négociable (le tien) : **aucune fabrication**. Je ne génère pas
> de volumes de recherche Google, de classements SEO concurrents, de listes de
> PME avec emails, ni de KPIs inventés. Tout ce qui demande une donnée réelle que
> je n'ai pas est marqué **BESOIN INPUT** — pas rempli au hasard. Le reste, c'est
> du code/SEO réel, livrable.

Statuts : ✅ Fait · 🔵 Livrable code (j'ai les faits) · 🟡 Besoin input (toi) ·
🌐 Faisable via recherche web (si tu valides le scope) · ⚪ Archive / N/A.

---

## Déjà livré cette session (commité sur `main`)

| Sujet | Commit |
|---|---|
| Déconnexion sans erreur ni flash | `fix(auth): smooth logout…` |
| Suppression de compte réelle + garde session | `fix(auth)` |
| Section « processus en 4 étapes » réelle | `feat(home)` |
| Matériel honnête partout (ZV-1, iPhone 14, DJI Mic, DaVinci, AE, Premiere, Logic, Audition) | `fix(services)` |
| « Tracy » partout (plus de T.Y) | `fix(services)` |
| **Page `/partenaires/pixel-404` + `/partenaires` + lien footer + sitemap + breadcrumb** | `feat(partenaires)` |

⚠️ **Bloqueur actif** : `npm run db:seed` est refusé par le sandbox (écriture prod
Neon). Le matériel corrigé est **en code mais pas encore en base**. À lancer par toi
localement, ou ajoute une règle de permission Bash.

---

## Phase 1 — Diagnostic technique

| Cmd | Statut | Détail / ce qu'il me faut |
|---|---|---|
| /impeccable, /code-review | 🔵 | Audit ciblé livrable. `tsc --noEmit` passe déjà à 0. |
| /review (perf, a11y, responsive) | 🔵 | Audit code OK. Lighthouse réel = `npm run build` + ton URL prod. |
| /security-review | 🔵 | CSP/nonce déjà en place dans `middleware.ts`. Je peux durcir + auditer rate-limit (`lib/rate-limit.ts`). |
| /seo-audit | 🔵🌐 | Audit on-page (titles/meta/H1/alt/canonical) faisable sur le code. Core Web Vitals = besoin prod. |
| /site-architecture | 🟡 | Les URLs sont déjà flat. Refonte = besoin de **tes décisions** (quoi renommer → 301). |
| /debug | ✅ | Logout + suppression compte = corrigés. |
| /schema | 🔵 | Manque : `Person` (Tracy, Louisia), `Service` par presta, `FAQPage`. Existant : Org, LocalBusiness, Breadcrumb. **Je peux le faire maintenant.** |

## Phase 2 — Marché & stratégie

| Cmd | Statut | Détail |
|---|---|---|
| /deep-research, /competitor-profiling, /competitors | 🌐 | Faisable **avec recherche web réelle** si tu me donnes : les 5 concurrents (noms/URL) ou autorises la recherche. Sinon = fabrication, donc non. |
| /customer-research | 🟡 | Besoin : transcripts/avis clients réels, ou j'extrais des avis publics (web) si tu valides. |
| /prospecting, /cold-email | 🟡 | Je **n'invente pas** 50 PME + emails. Donne-moi tes critères de cible + ta source (CRM/export), je structure et rédige la séquence. |
| /product-marketing | ✅🔵 | Positionnement déjà réaligné sur le vrai matériel. Pages services existantes (`/services/[slug]`). |
| /marketing-psychology, /insights, /co-marketing | 🔵 | Co-marketing Pixel 404 : page livrée. 3 actions concrètes → ci-dessous. |

## Phase 3 — Copy & nettoyage

| Cmd | Statut | Détail |
|---|---|---|
| /stop-slop, /simplify, /clear, /compact, /copy-editing | ✅🔵 | Appliqués sur tout ce que j'ai touché (process, services, partenaires). Passe complète sur les pages restantes = livrable, dis-moi lesquelles en priorité. |
| /copywriting | 🔵 | Hero/équipe/footer réécrivables. Besoin léger : confirmer l'accroche locale voulue. |
| /content-strategy | 🔵🟡 | 12 sujets blog + calendrier = livrable (basé sur tes vrais services). Pas de promesse de volumes de recherche sans audit. |

## Phase 4 — SEO & visibilité

| Cmd | Statut | Détail |
|---|---|---|
| /programmatic-seo | ✅ | **Déjà en place** : `lib/services/local-seo.ts` + `app/services/[slug]/[ville]` + sitemap géo. Extension = ajouter villes/services dans les arrays. |
| /ai-seo, /ia-seo | 🔵 | Title/meta longue traîne + alt text = livrable code. |
| /directory-submissions | 🔵 | Liste des 30 annuaires (URL + données à préparer + priorité) = livrable, **0 fabrication** (ce sont des plateformes publiques). |
| /social, /community-marketing | 🔵🟡 | Bios + templates = livrable. Audit profils existants = donne-moi les handles. |
| /aso | ⚪ | Pas d'app → `ARCHIVE.md`. |
| /google-antigravity-sdk | ⚪ | Hors sujet site marketing → archive. (GA4/GSC = voir /analytics.) |

## Phase 5 — Conversion & UX

| Cmd | Statut | Détail |
|---|---|---|
| /cro, /ui-ux-pro-max, /popups | 🔵🟡 | Audit friction + CTA sticky mobile + skeletons = livrable. Quelques arbitrages UX à valider. |
| /pricing | 🟡 | **Donne-moi ta vraie grille** (3 niveaux + montants). Je ne fixe pas tes prix. |
| /signup, /onboarding | 🔵 | Form devis (champs, validation temps réel, email confirmation HTML) = livrable. |
| /lead-magnets | 🔵 | Les 3 PDF/guides : je rédige le contenu réel (checklist, guide, template brief). |
| /ab-testing | 🔵 | Plan de tests + implémentation Vercel/Edge = livrable. |
| /paywalls, /team-onboarding | ⚪ | N/A pour l'instant → archive. |

## Phase 6 — Activation & campagnes

| Cmd | Statut | Détail |
|---|---|---|
| /ad-creative, /ads | 🟡 | Concepts d'annonces = livrable. Budgets/ciblage réels + accès comptes = toi. |
| /analytics | 🔵🟡 | GA4 + GTM + events custom = code. Besoin : **ton ID GA4 / conteneur GTM**. |
| /marketing-ideas, /marketing-plan, /launch | 🔵 | Idées + plan trimestriel (sans chiffres inventés) = livrable. |
| /emails, /sms, /referrals, /churn-prevention | 🔵🟡 | Templates = livrable. Branchement (Resend déjà là / Twilio) + termes d'offre = toi. |
| /sales-enablement, /revops | 🔵 | One-pager, scripts, pipeline CRM = livrable. |

## Phase 7 — Assets & IA interne

| Cmd | Statut | Détail |
|---|---|---|
| /video, /image | 🔵 | Scripts/storyboards + audit images `next/image` (WebP/AVIF, lazy) = livrable. |
| /claude-api, /ia-core, /ia-cursor, /ia-rag, /ia-security, /jarvis | ⚪ | Outillage interne, hors périmètre du **site**. Archive (référencé pour plus tard). |

## Phases 8-9 — Orchestration & méta

| Cmd | Statut |
|---|---|
| /init /context /goal /run /batch /schedule /loop /insights | Méta-orchestration = **ce document**. |
| /free-tools, /update-config | 🔵 livrable. |
| /usage /usage-credits /extra-usage /heapdump /remote-control /reload-skills /fewer-permission-prompts | ⚪ ops/env, hors code site → archive. |
| /verify | 🔵 checklist finale exécutable avant prod. |

---

## Ce dont j'ai besoin de toi pour débloquer (par ordre d'impact)

1. **Lancer `npm run db:seed`** (ou règle de permission) → le matériel corrigé passe en base.
2. **La vraie grille tarifaire** (3 niveaux + montants) → /pricing, /cro, page tarifs.
3. **Pixel 404** : URL officielle, logo, ville, et l'offre bundle exacte → enrichir la page + schema Organization.
4. **GA4 / GTM** : ID propriété + conteneur → /analytics, events, dashboard.
5. **Cible prospection** : critères + source (export CRM/liste) → /prospecting, /cold-email (je ne scrape pas d'emails au hasard).
6. **Autorisation recherche web** (oui/non) → /deep-research, /competitor-profiling avec vraies données.
7. **Handles réseaux actuels** Splice → audit /social.

---

## 3 actions co-marketing Pixel 404 (à valider, pas inventées)

1. **Aftermovie d'un événement boutique** (sortie de jeu / tournoi) diffusé sur les deux chaînes.
2. **Série « coulisses atelier »** : courts formats réparation/setup, montés par Tracy.
3. **Offre croisée créateurs** : bundle « setup + vidéo de présentation » pour les clients streamers de Pixel 404.

---

## Roadmap 90 jours (squelette — chiffres à fixer ensemble)

- **S1-4 — Quick wins** : seed prod, schema Person/Service/FAQ, audit sécurité headers, form devis, audit images.
- **S5-8 — Contenu & SEO local** : annuaires, blog (12 sujets), extension pages géo, GA4/GTM.
- **S9-12 — Acquisition** : campagnes Ads, séquences email, co-marketing Pixel 404, dashboard KPIs.

## KPI à instrumenter (cibles à définir avec les vraies bases)
Trafic organique · positions sur requêtes locales · leads form devis · taux de
conversion visite→devis · source des leads · délai de réponse. *Pas de chiffres
ici tant qu'ils ne sont pas mesurés — pas d'invention.*
