---
id: decision-pivot-portail-orleans
title: "Pivot Splice → portail local Orléans (acquisition-first)"
summary: "Décision d'architecture : le domaine principal devient un portail/annuaire hyperlocal Orléans multi-villes ; l'offre photo/vidéo devient secondaire (canal de profit alimenté par le portail comme machine d'acquisition B2B). Plan complet dans REFONTE-PLAN.md."
type: decision
coreprimary: decisions
importance: 0.9
status: draft
schemaversion: "3.5"
created: 2026-07-17
updated: 2026-07-17
links: []
---

# Pivot Splice → portail local Orléans

## Problématique
`splicestudio.fr` = site vitrine studio audiovisuel premium B2B. Trafic dépendant de pages SEO "métier+ville". Objectif : construire un business avec système d'acquisition robuste, extensible à d'autres régions.

## Décision (thèse)
Inverser le modèle : le domaine principal devient un **média/annuaire hyperlocal Orléans** (actu légère + agenda + annuaire commerces + guides), pensé **multi-villes dès la conception** (géographie = donnée, jamais codée en dur). Le portail = **machine d'acquisition B2B** ; l'offre photo/vidéo reste le **centre de profit** (ARPU élevé, mission 500-3000€) mais devient une **rubrique secondaire** ciblant les commerces de proximité (shooting magasin/produits).

Avantage défendable : aucun média local n'a de studio intégré → les guides du portail illustrés par nos shootings = SEO + démo commerciale + échantillon gratuit.

Métrique nord = commerces convertis en clients photo/vidéo par mois attribuables au portail (PAS le trafic).

## Conclusions de l'audit (4 agents)
- Socle tech mûr et réutilisable (Next15/Workers/Prisma/Neon/Stripe/Resend/R2). À garder: db, numbering, pricing engine, crypto, infra SEO/JSON-LD.
- Patron programmatic-SEO multi-villes déjà présent: `lib/services/local-seo.ts` + `/services/[slug]/[ville]`. À généraliser en Region/City/District/Category/Place/Event/Guide.
- Charte "Cinéma Studio" annoncée ≠ runtime (1 font Outfit, monochrome orange, tokens faux). `prototype-styles.css` 3770 l. à réécrire ~70-80%.
- Tests quasi nuls hors zones financières. Deploy fragile (5 scripts patch OpenNext/Prisma/WASM).

## Plan (phasé 0→7)
Voir `REFONTE-PLAN.md` (racine repo). Phase 0 = trancher 6 décisions ouvertes (domaine, marque, séparation studio, charte, périmètre MVP, migration blog) AVANT tout code.

## Fichiers modifiés / créés
- REFONTE-PLAN.md [NEW]
- .brain/GOAL.md, .brain/STATE.md [NEW]
- memory/drafts/decision-pivot-portail-orleans.md [NEW]
