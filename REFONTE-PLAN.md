# Refonte Splice → Portail local Orléans — Plan complet

> **Statut** : plan de travail (audit + stratégie + phasage). Aucun code de refonte n'est encore écrit.
> **Établi le** : 2026-07-17 · **Repo** : `C:\dev\splice` (remote `DeepFrameCC/Splice`) · **Domaine actuel** : `splicestudio.fr`
> **Auteur du plan** : audit automatisé (4 agents : tech, contenu/SEO, charte, stratégie) + synthèse.

---

## 0. Thèse stratégique (le « pourquoi » du pivot)

Le business ne change pas de **centre de profit** — il change de **porte d'entrée**.

- **Aujourd'hui** : `splicestudio.fr` = site vitrine d'un studio de production audiovisuelle premium B2B (Orléans + Tours). Le trafic dépend de pages SEO « métier + ville » (photographe-orléans, production-vidéo-orléans…). Modèle : on attend que le prospect cherche « vidéaste Orléans ».
- **Cible** : le domaine principal devient un **média / annuaire hyperlocal Orléans** (actu légère + agenda + annuaire commerces + guides), pensé **multi-villes dès la conception**. Ce portail capte un trafic organique récurrent et **sert de machine d'acquisition B2B** : chaque commerce référencé est un prospect identifié pour l'offre photo/vidéo, qui reste le vrai centre de profit à fort ARPU (mission 500–3 000 €).
- **L'avantage défendable** : aucun média local n'a de studio photo/vidéo intégré. Les guides du portail sont illustrés par *nos* shootings → ils sont simultanément du SEO, une démo commerciale et un échantillon gratuit. C'est la douve.
- **Métrique nord** : **pas** le trafic du portail, mais le **nombre de commerces convertis en clients photo/vidéo par mois attribuables au portail**.

**Règle d'or (solo/petite structure)** : le portail n'est **pas** monétisé prioritairement par la pub (levier en déclin structurel, inadapté au solo) ni par un paywall (80 % des Français refusent de payer l'info). Il est traité comme un **actif d'acquisition**. On monétise d'abord ce qui a un ARPU élevé et un cycle court : shooting + publi-rédactionnel. Ne **pas** quitter l'activité photo/vidéo pendant la montée en charge du portail.

---

## 1. Audit du site actuel

### 1.1 Stack technique (mature, réutilisable en grande partie)

| Couche | Réalité constatée |
|---|---|
| Framework | Next.js `15.1.6` App Router, React `19`, TypeScript strict `5.6` |
| Déploiement | **Cloudflare Workers** via OpenNext (`@opennextjs/cloudflare`), worker `splicestudio`, cron keep-alive `*/4 min` |
| DB | Neon Postgres via Prisma `6.19` + adapter Neon **HTTP-fetch** (`lib/db.ts`, singleton `Proxy` init paresseuse, `statement_timeout=8s`) |
| Auth | NextAuth **v5 beta.25** (figée), PBKDF2 WebCrypto, TOTP 2FA, rate-limit intégré |
| Paiement | Stripe `17.4` (init paresseuse Workers-safe), webhook 450 lignes |
| Email | Resend `4.0` (`lib/mailer.ts`, anti-injection) |
| Storage | R2, 3 buckets (`SPLICE_CDN`, `SPLICE_DELIVERIES`, `SPLICE_ARCHIVE`) |
| Cache/RL | KV Cloudflare (cache incrémental) + Upstash Redis (4 limiteurs, fail-closed prod) |
| UI | Tailwind `3.4` + shadcn/ui **minimal** (7 primitives) |
| Anim | GSAP `3.15` + 5 plugins **dont 3 Business** (SplitText, DrawSVG, Flip), 10-11 composants consommateurs |
| Éditeur | TipTap (blog admin), TanStack Table + Recharts (dashboard), Zustand (wizard devis) |

**Schéma Prisma** : 24 modèles, 17 enums. Solide et bien indexé. Modèles clés : `User/Profile/Session`, `Media/Like`, `Devis/Facture/Contrat/Abonnement/Livraison`, `Counter` (numérotation atomique), `Service/BlogPost/BlogCategory`, `Avis` **+** `Review` (doublon), `AuditLog/Notification/ConsentLog`.

**Fragilités structurelles identifiées** :
1. Pipeline de déploiement dépendant de **5 scripts de patch maison** (OpenNext/Prisma/WASM) — point de friction connu, à ne pas casser.
2. NextAuth figé en **beta** → dette de mise à jour.
3. **Couverture de tests quasi nulle** hors pricing/numbering/crypto (4 fichiers unit + 1 smoke e2e). Aucun test du parcours devis→paiement→livraison.

**À garder tel quel** : `lib/db.ts`, `lib/numbering.ts` (24 l., propre, atomique), `lib/env.ts`, `lib/rate-limit.ts`, `lib/r2/client.ts`, `lib/stripe.ts`, `lib/mailer.ts`, crypto/2FA, le moteur de calcul de `lib/pricing.ts` (à modulariser mais logique saine et testée).

**À refactorer** : `components/devis/Steps.tsx` (892 l.), `lib/pricing.ts` (620 l. — séparer domaine/labels/légal), `app/api/stripe/webhook/route.ts` (450 l.), `lib/pdf.ts` (554 l.).

**À jeter / consolider** : les **6 landing SEO local en dur** (agence-communication-orleans, photographe-orleans, production-video-orleans/tours, videaste-orleans, photographe-evenementiel) qui doublonnent la route paramétrée `[slug]/[ville]` ; le double système d'avis (`Avis` vs `Review`) ; l'export `stripe` déprécié ; `LEGACY_PACK_LABELS`.

### 1.2 Contenu & SEO (excellent socle, 100 % mono-thématique audiovisuel)

- **~35 pages publiques** : accueil animé, hub `/services` + 12 services CMS (10 publiés), **route programmatique `/services/[slug]/[ville]`** (SSG, 7 services × 2 villes = 14 URLs géo), 6 landing locales en dur, `/tarifs`, `/galerie`, `/photos`, `/realisations`, blog (**23 articles** rédigés, teintés Orléans/Centre-Val de Loire), `/equipe`, `/faq`, `/contact`, `/devis`, légal.
- **Moteur géo-local** `lib/services/local-seo.ts` (483 l., 100 % statique) : structure `Ville {slug, name, department, departmentCode}`, contenu unique par couple service×ville (quartiers réels : La Source, Saran, Martroi, Plumereau), FAQ « near-me », templates `fillTemplate`. **Directement transposable** à un modèle « catégorie × ville » ou « fiche établissement ».
- **Infra SEO mûre** : `sitemap.ts` (static + DB + grille géo, fallback try/catch), `robots.ts` (10 user-agents dont GPTBot/ClaudeBot/PerplexityBot = stratégie GEO explicite), JSON-LD centralisé (`lib/seo.ts`, `lib/services/schema-service.ts`) : `Organization` + `WebSite` + `LocalBusiness` sitewide, `Service/BlogPosting/CollectionPage/VideoObject/FAQPage/BreadcrumbList` par page.
- **Ton éditorial dominant** = production audiovisuelle premium B2B (« étalonnage DaVinci », « marque employeur », « brand content »). **Signaux commerce local déjà présents mais secondaires** : service `photographie-google-business` (Pack Local), FAQ « restaurants et commerces locaux », prix d'appel bas (photo dès 15 €, vidéo dès 29 €).

**Ce qui manque pour le pivot annuaire** (à créer) :
1. **Modèle de données « établissement/commerce »** (aucune table Business/Place aujourd'hui).
2. **Taxonomie de catégories locales** (restauration, artisanat, services…) — actuellement les catégories = prestations audiovisuelles.
3. **Villes/quartiers en base** (aujourd'hui `VILLES` = tableau hardcodé de 2 entrées).
4. **Recherche/filtre géographique + carte** (Leaflet/Mapbox absent).
5. **Contenu éditorial local non-audiovisuel** (agenda, actus, bons plans).
6. **JSON-LD `ItemList`/`Event`/`LocalBusiness` par fiche tierce**.

### 1.3 Charte graphique (écart majeur entre l'annoncé et le réel)

La charte « Cinéma Studio » **annoncée ne correspond pas au runtime** :

- **Fonts** : aucune des 5 fontes annoncées (Fraunces/Inter/JetBrains Mono/Anton/Poppins) n'est chargée. **Une seule famille réelle : Outfit** (variable, display forcé en 800). Anton/Poppins présents dans `public/fonts/` mais **jamais référencés** (assets morts ; Poppins sert uniquement au PDF).
- **Couleurs** : le vert glauque `#6B8779` est **quasi inutilisé**. Les tokens `--df-blue` et `--df-gold` sont **tous deux aliasés sur l'orange `#F36B1F`**. Le site est en réalité **monochrome orange sur bleu nuit `#0E0E22`**, pas la tri-chromie annoncée. **Tokens sémantiquement faux** : `--df-cream` = presque noir, `--df-ink` a **deux valeurs contradictoires** selon le fichier.
- **Double design system** : Tailwind (`df-*` utilities) **vs** CSS manuscrit `app/prototype-styles.css` (**3770 lignes**, classes `df-*`) → deux définitions de bouton, deux échelles de radius (999/10/14/16/20/28 px, non normalisées).
- **Dérive** : ~144 hex hardcodés dans `components/`, ~79 dans `app/`, ~144 dans `prototype-styles.css` (palette « film » improvisée).
- **A11y plutôt soignée** : skip-link, focus-visible, `prefers-reduced-motion` géré, bouton pause vidéo hero (WCAG 2.2.2). Point de vigilance : textes muted `rgba(255,255,255,.5)` (contraste ~4:1 limite AA).
- **Responsive** : desktop-first (`max-width` queries), breakpoints dispersés (1100/920/900/820/768/720).

**Verdict réutilisabilité pour la refonte** :
- ✅ **Gardable** : structure des tokens Tailwind (`tailwind.config.ts` = future source unique de vérité), primitives shadcn `components/ui/*` (pilotées par tokens, quasi gratuit à re-baser), mécanisme de chargement de fontes, a11y, infra JSON-LD `LocalBusiness`.
- ♻️ **À refaire** : toute la palette (dark cinéma → clair institutionnel/local), **~70-80 % de `prototype-styles.css`**, corriger les tokens menteurs, alléger GSAP (les 3 plugins Business sont surdimensionnés pour un portail), purger fonts mortes + gradients ad hoc.

---

## 2. Refonte du site + nouvelle charte graphique

### 2.1 Nouveau positionnement visuel

Passer de **« studio ciné premium, dark, dramatique, orange saturé »** à **« Swiss minimal clair : blanc, grille stricte, beaucoup d'air, un seul accent »**. Direction verrouillée = **annuaire propre, fonctionnel, ultra-lisible**. Fond blanc, sans-serif unique **Outfit**, accent orange `#F36B1F` conservé (continuité de marque splicestudio), pas de dark-mode, pas de serif.

### 2.2 Système de design cible (à valider avant implémentation — voir §7 décisions ouvertes)

- **Source unique de vérité** = `tailwind.config.ts`. On y définit : 1 primaire « confiance locale », 1 accent chaud (héritage possible de l'orange Splice pour la continuité de marque), une famille de neutres tièdes, les sémantiques (succès/erreur/warning), **une** échelle de radius et **une** échelle d'ombres normalisées. Valeurs en **OKLCH** (tinter les neutres vers l'accent, chroma 0.005–0.01).
- **Typographie** : garder Outfit (neutre, lisible, déjà chargé) OU introduire un vrai duo display/texte assumé (ex. un serif éditorial pour les titres de guides + Outfit pour le texte). Supprimer les woff2 morts.
- **Composants** : re-baser `components/ui/*` sur les nouveaux tokens (quasi gratuit), puis écrire un **CSS de layout léger** qui remplace `prototype-styles.css` section par section — supprimer le double système bouton/radius.
- **Animations** : réduire à ScrollTrigger léger + transitions CSS. Éliminer SplitText/DrawSVG/Flip (coût licence Business + poids client) sauf besoin précis. Gain LCP/INP.

### 2.3 Critères de sortie « design system »

- [ ] `tailwind.config.ts` = seule source de tokens ; zéro hex hardcodé hors tokens dans `components/` et `app/` (lint/grep = 0).
- [ ] `prototype-styles.css` supprimé ou < 400 lignes de layout générique.
- [ ] Contraste AA vérifié sur tous les couples texte/fond (y compris muted et liens).
- [ ] Fonts mortes purgées de `public/fonts/`.
- [ ] Storybook/page de démo interne listant chaque primitive avec ses états hover/focus/active.

---

## 3. Pivot du domaine → Portail local (architecture multi-villes)

### 3.1 Data model (géographie = donnée, jamais codée en dur)

Le piège fatal serait de coder « Orléans » en dur. On modélise la géographie comme donnée pour dupliquer une ville = **insérer une ligne**, pas réécrire le site.

```
Region        (Centre-Val de Loire, slug, code)
  └─ City     (Orléans, slug: "orleans", dept: "45")  → Region
       └─ District (Carmes, slug: "carmes")           → City
Category      (restaurant, coiffeur, fleuriste…)  ← indépendant de la géo, hiérarchisable
Place         (commerce)  → City + District? + Category[]  + NAP + horaires + geo(lat/lng) + photos + ownerUserId?
Event         → City + startDate/endDate + venue(Place?)  + category
Guide         → City + Category? + body (MDX/HTML) + placesFeatured[]
Article       → City? + body (actu légère)
```

Modèles Prisma **nouveaux** à ajouter : `Region`, `City`, `District`, `Category`, `Place`, `Event`, `Guide` (et migrer `BlogPost` → `Article` ou cohabiter). Réutiliser `Media`, `Like`, `Review`, `User/Profile` (un commerçant = un `User` qui gère sa `Place`).

### 3.2 Arborescence d'URL (slugs géo hiérarchiques, templates paramétrés)

```
/                                   → hub national / redirection ville par défaut (Orléans)
/orleans/                           → hub ville (CityHub)
/orleans/agenda/                    → agenda / sorties (moteur de récurrence)
/orleans/agenda/[event-slug]/       → fiche événement
/orleans/restaurants/               → catégorie × ville (CategoryCityPage)
/orleans/restaurants/carmes/        → catégorie × quartier
/orleans/etablissement/[slug]/      → fiche établissement (PlaceDetail)
/orleans/guides/                    → index guides
/orleans/guides/ou-bruncher/        → guide evergreen (GuidePage)
/orleans/quartiers/[district]/      → hub quartier
/studio/…  (ou sous-domaine)        → offre photo/vidéo (voir §4)
```

Ajouter Tours (`/tours/…`) plus tard = 1 ligne `City` + contenu unique. **Programmatic SEO contrôlé** avec **garde-fou anti-duplication obligatoire** : contenu unique injecté par ville/quartier (photos réelles, avis, description spécifique), **jamais** de template vide dupliqué (pénalité Google = mort SEO). Réutiliser le pattern existant `generateStaticParams` + `dynamicParams` + ISR de `/services/[slug]/[ville]` comme socle.

### 3.3 Templates réutilisables (un composant, N villes)

`CityHub`, `CategoryCityPage`, `PlaceDetail`, `EventList`/`EventDetail`, `GuidePage`, `DistrictHub`. Tout le SEO se génère à partir du data model.

### 3.4 Migration du domaine (sensible — checkpoint humain)

- **Stratégie de redirection 301** : les URLs actuelles `splicestudio.fr/*` (services, landing locales, blog) doivent être **cartographiées** vers leurs équivalents (offre studio ou articles migrés) avant bascule. Ne perdre aucun jus SEO acquis.
- **Décision** : garder `splicestudio.fr` comme domaine principal du portail, ou acquérir un nouveau domaine « portail Orléans » et faire de `splicestudio.fr` le sous-espace studio ? → **§7 décision ouverte**.
- **Aucune bascule DNS / redirection prod en autonomie** : la migration de domaine, le déploiement et la mise à jour du sitemap prod sont des **checkpoints humains**.

### 3.5 Critères de sortie « portail »

- [ ] Data model multi-villes migré (Prisma) + seed Orléans (Region/City/Districts réels).
- [ ] Les 6 templates rendent une ville complète à partir des seules données.
- [ ] Ajouter une 2e ville de test (Tours) ne nécessite **aucune** modification de composant.
- [ ] JSON-LD `LocalBusiness`/`Event`/`ItemList`/`FAQPage` (un seul par page) valides.
- [ ] Plan de redirection 301 exhaustif rédigé et validé humainement avant bascule.

---

## 4. Offre photo/vidéo : conservée mais secondaire (packagée commerces)

### 4.1 Repositionnement

L'offre studio quitte le rôle de « site entier » pour devenir une **rubrique transactionnelle du portail** (`/studio/…` ou sous-domaine `studio.splicestudio.fr`), ciblée **commerces de proximité** voulant des photos/vidéos de leur magasin/produits — pas seulement les PME/ETI premium actuelles.

- Le pont naturel existe déjà : service `photographie-google-business` (Pack Local), FAQ commerces/restaurants, prix d'appel bas. On **capitalise dessus** et on **démote** le vocabulaire « brand content premium » au second plan (offre haut de gamme conservée mais moins visible).
- Le tunnel devis, Stripe, PDF, contrats, livraisons R2, espace client → **conservés** (logique métier saine). On les rattache au nouveau parcours.

### 4.2 Packages commerces (à cadrer avec le pricing existant)

Escalier d'upsell, du gratuit au récurrent :

```
Fiche annuaire GRATUITE
   → Fiche premium annuaire (29-79 €/mois)
   → Pack photo boutique (one-shot 400-900 €)
   → Portrait vidéo + publi-rédactionnel (800-1 500 €)
   → Abonnement contenu mensuel (réseaux sociaux)
```

`lib/pricing.ts` sera **modularisé** (plans / options / quote-engine / labels / mentions) et **étendu** avec ces packages commerce. La numérotation atomique (`lib/numbering.ts`) et le moteur de devis restent inchangés.

### 4.3 Critères de sortie « offre studio »

- [ ] Rubrique studio rattachée au portail, tunnel devis/Stripe/PDF fonctionnel de bout en bout.
- [ ] Packages commerce définis dans un `lib/pricing/` modularisé + tests unitaires (le pricing est zone à risque financier).
- [ ] Chaque guide/fiche du portail expose un CTA studio contextuel non intrusif.
- [ ] Au moins 1 test e2e du parcours fiche → devis → confirmation.

---

## 5. Système d'acquisition robuste

Le funnel transforme l'audience du portail en pipeline de missions média.

### 5.1 Sources de trafic (par fiabilité de récurrence)

1. **Agenda hebdo** (« que faire à Orléans ce week-end », concerts/marchés) → le contenu qui **ramène les mêmes gens chaque semaine**, evergreen saisonnier, cible AI Overviews.
2. **Guides evergreen** (« meilleurs restaurants Orléans », « où bruncher », « 10 lieux photogéniques ») → SEO long-tail **+ vitrines commerciales** illustrées par nos shootings.
3. **Fiches annuaire** (catégorie × quartier) → longue traîne evergreen, **contenu unique obligatoire par fiche**.
4. **Actu légère** (curation, pas d'investigation) → pics sans récurrence, socle secondaire.

### 5.2 Leviers d'autorité / netlinking

- **Google Business Profile** du portail (Relevance / Distance / Prominence).
- **Presse régionale** (*La République du Centre*, *La Nouvelle République*) : dossiers/CP lors d'événements → backlinks + notoriété.
- **Backlinks clients** : chaque commerce shooté ajoute « Photos/Réalisation : [portail] » sur son site.
- **Annuaires locaux qualitatifs Loiret 45** (héritage de la règle netlinking CLAUDE.md).

### 5.3 Funnel B2B (portail → client photo/vidéo)

```
Fiche gratuite (pied dans la porte, prospect identifié)
   → Démonstration de la douleur (visuels absents/médiocres visibles sur la fiche)
   → Upsell escalier (§4.2)
   → Prospection outbound TIÈDE :
     « On a mis votre resto dans notre guide des terrasses, X vues ce mois-ci.
       On aimerait refaire vos photos — voici un avant/après d'un voisin. »
```

Taux de réponse très supérieur au cold classique car la fiche + le nom + souvent le contact sont déjà connus, et la preuve sociale (avis, crédits « Photos : portail », études de cas) est intégrée.

### 5.4 Audience possédée : newsletter

Actif **hors Google** (indépendant des algos). Alimentée par l'agenda. Objectif 1–3 k abonnés → newsletter sponsorisée (200–1 000 €/mois) **et** canal de nurturing des commerces. Resend est déjà en place.

### 5.5 Instrumentation (mesurer le nord)

- Attribution : d'où vient chaque lead studio (fiche annuaire ? guide ? newsletter ?).
- Tracking events (respecter la CSP `middleware.ts` + le consentement RGPD `ConsentLog` déjà en place — toute nouvelle origine analytics à ajouter dans la CSP sinon blocage silencieux).
- Tableau de bord admin : commerces convertis/mois attribuables au portail.

### 5.6 Critères de sortie « acquisition »

- [ ] GBP portail créé + optimisé.
- [ ] Agenda automatisé publiant chaque semaine.
- [ ] Newsletter opérationnelle (double opt-in, consentement journalisé).
- [ ] Attribution lead → source fonctionnelle dans l'admin.
- [ ] ≥ 15 guides evergreen illustrés par nos propres shootings publiés.

---

## 6. Phasage (séquencé, avec livrables / risques / critères de sortie)

> Cap de sécurité : chaque phase se termine sur une **vérification tranchable**. Les checkpoints humains (deploy, migration domaine, DNS, envoi email de masse) ne sont **jamais** franchis en autonomie.

### Phase 0 — Cadrage & décisions (avant tout code)
- **Livrables** : validation des décisions ouvertes (§7), choix domaine, choix palette + typo, périmètre MVP ville 1.
- **Risque** : partir sur une charte/nom de domaine non validés → refonte coûteuse.
- **Sortie** : décisions §7 tranchées + maquettes clés approuvées.

### Phase 1 — Fondations design system
- **Livrables** : `tailwind.config.ts` = source unique (palette OKLCH, radius/ombres normalisés) ; `components/ui/*` re-basé ; nouveau CSS layout léger ; purge fonts mortes ; suppression des tokens menteurs.
- **Risque** : casser le rendu des pages existantes non migrées.
- **Sortie** : critères §2.3 verts (0 hex hors token, AA, `prototype-styles.css` réduit).

### Phase 2 — Data model multi-villes
- **Livrables** : migration Prisma (`Region/City/District/Category/Place/Event/Guide`) ; seed Orléans (quartiers réels) ; import initial des fiches commerces (gratuit) ; admin CRUD des nouvelles entités (réutiliser le CMS `app/admin/*`).
- **Risque** : migration destructive ; duplication de contenu SEO.
- **Sortie** : critères §3.5 ; ajouter Tours = 1 ligne `City` sans toucher un composant.

### Phase 3 — Templates portail + SEO
- **Livrables** : les 6 templates (`CityHub`, `CategoryCityPage`, `PlaceDetail`, `EventList/Detail`, `GuidePage`, `DistrictHub`) ; sitemap/robots/JSON-LD étendus aux nouvelles entités ; 15-20 guides evergreen illustrés ; carte (Leaflet/Mapbox).
- **Risque** : programmatic SEO sans garde-fou = pénalité.
- **Sortie** : une ville complète rendue depuis les données ; JSON-LD valides ; garde-fou anti-duplication en place.

### Phase 4 — Offre studio secondaire
- **Livrables** : rubrique `/studio` rattachée ; `lib/pricing/` modularisé + packages commerce + tests ; tunnel devis/Stripe/PDF re-branché ; CTA studio contextuels.
- **Risque** : régression du parcours de paiement (zone financière, peu testée aujourd'hui).
- **Sortie** : critères §4.3 ; e2e devis vert.

### Phase 5 — Acquisition
- **Livrables** : GBP, agenda automatisé, newsletter (double opt-in), attribution lead, dashboard « commerces convertis/mois ».
- **Risque** : envois email non conformes RGPD ; CSP bloquant l'analytics.
- **Sortie** : critères §5.6.

### Phase 6 — Bascule domaine (checkpoint humain fort)
- **Livrables** : plan de redirection 301 exhaustif (URLs actuelles → nouvelles) ; validation humaine ; bascule DNS ; monitoring SEO post-bascule.
- **Risque** : perte de jus SEO, 404 massives.
- **Sortie** : redirections vérifiées, Search Console propre, trafic préservé.

### Phase 7 — Duplication ville n°2 (conditionnelle)
- **Condition d'entrée** : le modèle Orléans **convertit des commerces** (go/no-go sur la métrique nord), pas seulement du trafic.
- **Livrables** : 2e ville (Tours/Blois) via data + contenu unique.
- **Risque** : sur-extension (piège Patch/Gannett) → dette.
- **Sortie** : 2e ville rentable avant d'en lancer une 3e.

---

## 7. Décisions — TRANCHÉES (2026-07-17)

1. **Domaine** : ✅ **`splicestudio.fr` conservé** comme domaine principal du portail. Pas de bascule DNS → Phase 6 se réduit à une réorganisation d'URL interne + redirections 301 des anciennes pages, sans changement de domaine.
2. **Marque** : ✅ **« splicestudio »** (nom complet, pas « Splice » seul). Le portail et le studio partagent la marque splicestudio.
3. **Séparation studio** : ✅ Photo/vidéo réduit à **UNE seule page** (`/studio` ou `/photo-video`), pas une rubrique multi-pages. Offre packagée commerces sur cette page unique.
4. **Charte** : ✅ **Swiss minimal clair** — fond blanc, sans-serif unique **Outfit** (déjà chargé), grille stricte, beaucoup de blanc, **un** accent (orange `#F36B1F` conservé pour continuité de marque), tokens OKLCH. Pas de bi-mode, pas de serif éditorial.
5. **Périmètre MVP** : refonte globale phasée (design system → data model → portail → page studio → acquisition).
6. **Migration blog** : ✅ 23 articles → **recyclés en guides portail** ; les plus purement audiovisuel restent liés à la page studio.

> Conséquence sur le phasage : la Phase 6 (« bascule domaine ») devient **réorganisation d'URL + 301 internes** (domaine inchangé). La Phase 4 (studio) se réduit à **une page unique** au lieu d'une rubrique.

---

## 8. Risques transverses & garde-fous techniques (hérités du vault)

- **Neon scale-to-zero → 504 sur Workers** : conserver le cron keep-alive (`app/api/cron/keep-alive`, `*/4 min`) et `statement_timeout=8s` (`lib/db.ts`). Ne pas supprimer.
- **CSP dans `middleware.ts`** : toute nouvelle origine (analytics, carte Mapbox, pixel) doit y être ajoutée (`img-src`, `connect-src`, `script-src`) sinon blocage silencieux en prod.
- **Un seul `FAQPage` JSON-LD par page** (les doublons cassent les rich results).
- **Numérotation sans trou** (`lib/numbering.ts`, L123-22 Code commerce) : toujours dans `db.$transaction()`.
- **Compatibilité Workers** : WebCrypto (pas `crypto` Node), pas de `fs`.
- **Tests** : la refonte est l'occasion de combler le trou (parcours devis→paiement→livraison non testé). TDD sur toute logique métier touchée.
- **Fiscal** : mention « TVA non applicable, art. 293 B du CGI » obligatoire sur devis/factures (conservée).

---

## 9. Prochaine étape immédiate

Trancher les **décisions ouvertes §7** (Phase 0). Sans elles (surtout domaine + charte + périmètre MVP), toute implémentation avance à l'aveugle. Une fois §7 validé → démarrer Phase 1 (design system) qui est la fondation la moins risquée et débloque tout le reste.
