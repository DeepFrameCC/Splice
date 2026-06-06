---
id: redesign-page-partenaire-pixel-404
title: "Redesign — Refonte de la page partenaire Pixel 404 (Esthétique Cyber & Gaming)"
summary: "Refonte globale de la page /partenaires/pixel-404 avec une direction artistique fusionnant le néon violet et l'orange Splice. Résolution du bug de boot client en découpant le composant en Server/Client."
type: concept
coreprimary: design
importance: 0.5
status: draft
schemaversion: "3.5"
created: 2026-06-06
updated: 2026-06-06
links: []
---

# Refonte de la page partenaire Pixel 404

## Objectifs et Direction Artistique
La page partenaire de Pixel 404 a été entièrement repensée pour s'éloigner du design générique et adopter une direction artistique immersive :
- **Couleurs** : Arrière-plan anthracite sombre `#08080C`, touches de violet néon électrique `#9500de` et dégradés vers l'orange emblématique de Splice Studio `#F36B1F`.
- **Typographie** : Graisses contrastées et touches de police monospace pour asseoir l'ambiance technologique et e-sport.
- **Interactivité** :
  - Un sélecteur d'activités réactif (PC sur-mesure, réparation, Pokémon, Gaming Room).
  - Une carte virtuelle interactive style Pokémon en CSS pur 3D avec effet de retournement (flip) au clic.
  - Des cartes de collaboration ("Dans l'œil de Splice") avec effet de survol néon progressif.

## Architecture technique & Résolution de bug
Afin de préserver le bon fonctionnement de Next.js (App Router) et d'éviter les erreurs de compilation client provoquées par l'importation de variables d'environnement serveur (ex: `DATABASE_URL` absente côté client) :
- La page racine [page.tsx](file:///c:/Users/Windows/Splice/app/partenaires/pixel-404/page.tsx) reste un **Server Component**. Elle s'occupe d'injecter la configuration SEO, les schémas JSON-LD structurels (`BreadcrumbList` et `Organization`), et d'envelopper la page avec `NavWrapper` et `Footer`.
- L'ensemble de la mise en page interactive et des effets CSS est délégué à [Pixel404Interactive.tsx](file:///c:/Users/Windows/Splice/components/partners/Pixel404Interactive.tsx), marqué comme `"use client"`. Il n'a aucun lien avec les fichiers de base de données, éliminant tout risque de fuite de variables serveur ou de plantage.

## Correctifs d'intégration UI
- Ajout de la règle `overflow-hidden` sur les conteneurs des cartes de collaboration afin de clipper parfaitement la ligne supérieure de gradient néon lors des survols souris (`hover`), évitant ainsi le débordement de la ligne droite sur les coins arrondis (`rounded-3xl`).

