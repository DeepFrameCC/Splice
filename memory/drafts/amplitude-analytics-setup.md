---
id: amplitude-analytics-setup
title: "Amplitude Analytics & Session Replay Integration"
summary: "Intégration d'Amplitude Analytics et de Session Replay via un composant client dédié au niveau du layout racine pour s'assurer que le script s'exécute uniquement côté client."
type: task
coreprimary: tech
importance: 0.7
status: draft
schemaversion: "3.5"
created: 2026-06-08
updated: 2026-06-08
tags:
  - analytics
  - amplitude
  - session-replay
  - setup
  - nextjs
links: []
---

# Amplitude Analytics & Session Replay Integration

## Problématique
Besoin d'installer, d'initialiser et de configurer Amplitude Analytics et Session Replay pour l'application afin de suivre les interactions clés et d'analyser le comportement des utilisateurs, conformément aux exigences de conformité et de performance (chargement client uniquement).

## Solution implémentée
1. **Installation du SDK** : Installation du SDK unifié d'Amplitude (`@amplitude/unified`).
2. **Composant client dédié** : Création de [AmplitudeAnalytics.tsx](file:///c:/Users/Windows/Splice/components/layout/AmplitudeAnalytics.tsx), un composant React client (`"use client"`) pour garantir que l'initialisation s'exécute uniquement côté client (dans un hook `useEffect`), évitant ainsi toute erreur liée à SSR (Server-Side Rendering) ou à l'absence d'objets globaux comme `window` sur le serveur.
3. **Initialisation unique** : Appel unique de `amplitude.initAll` avec la configuration requise :
   - Clef API : `c3065e4c976bce1ddf0b06125132eb3d`
   - Zone serveur : `EU`
   - Autocapture : `true`
   - Taux d'échantillonnage Session Replay : `1` (100% de replay)
4. **Montage dans le Layout racine** : Importation et rendu du composant `<AmplitudeAnalytics />` dans le layout principal [layout.tsx](file:///c:/Users/Windows/Splice/app/layout.tsx) juste avant la fermeture de la balise `<body>` pour un démarrage précoce sans bloquer le rendu visuel initial.

## Fichiers modifiés / créés
- [AmplitudeAnalytics.tsx](file:///c:/Users/Windows/Splice/components/layout/AmplitudeAnalytics.tsx) [NEW] : Composant d'initialisation.
- [layout.tsx](file:///c:/Users/Windows/Splice/app/layout.tsx) [MODIFY] : Intégration dans le layout.
- [package.json](file:///c:/Users/Windows/Splice/package.json) & [package-lock.json](file:///c:/Users/Windows/Splice/package-lock.json) [MODIFY] : Dépendance `@amplitude/unified`.

