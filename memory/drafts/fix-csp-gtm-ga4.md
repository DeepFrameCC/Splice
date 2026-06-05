---
id: fix-csp-gtm-ga4
title: "Correction CSP — Google Tag Manager et Google Analytics 4 bloqués"
summary: "Correction de la CSP dans middleware.ts pour autoriser le chargement des pixels de suivi de Google Tag Manager (img-src) et les requêtes vers les endpoints régionaux de Google Analytics 4 (connect-src)."
type: fix
coreprimary: fixes
importance: 0.8
status: draft
schemaversion: "3.5"
created: 2026-06-05
updated: 2026-06-05
tags:
  - csp
  - security
  - gtm
  - ga4
  - nextjs
links: []
---

# Correction CSP — Google Tag Manager et Google Analytics 4 bloqués

## Problème
La Content Security Policy (CSP) définie dans le middleware Next.js bloquait certaines ressources nécessaires à Google Tag Manager et Google Analytics 4 :
1. Les pixels de tracking `https://www.googletagmanager.com/a` et `https://www.googletagmanager.com/td` étaient bloqués par la directive `img-src`.
2. Les requêtes d'envoi d'analytics vers `https://region1.analytics.google.com/g/collect` étaient bloquées par la directive `connect-src`.

## Solution appliquée
- Ajout de `https://www.googletagmanager.com` dans la directive `img-src` du fichier `middleware.ts`.
- Ajout de `https://*.analytics.google.com` et `https://analytics.google.com` dans la directive `connect-src` pour couvrir toutes les requêtes d'analytics régionales et globales de GA4.
