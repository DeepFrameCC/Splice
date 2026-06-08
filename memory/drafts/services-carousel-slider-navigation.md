---
id: services-carousel-slider-navigation
title: "Services Carousel Premium Slider Navigation"
summary: "Ajout d'une barre de progression de défilement horizontal (sliding handle) et de boutons de navigation (flèches) pour le carrousel des services."
type: pattern
coreprimary: design
importance: 0.7
status: draft
schemaversion: "3.5"
created: 2026-06-08
updated: 2026-06-08
tags:
  - design
  - ux
  - carousel
  - slider
  - components
links: []
---

# Services Carousel Premium Slider Navigation

## Problématique
Le carrousel des services sur la page d'accueil (composant `CrewStack`) était défilable par glissement (drag souris/tactile), mais sans indication visuelle forte pour les utilisateurs n'ayant pas de pavé tactile ou de souris adaptée, ou ne réalisant pas qu'il y a plus de 3 services.

## Solution implémentée
1. **Boutons de navigation (flèches)** : Ajout de flèches gauche/droite pour faire défiler le carrousel d'une largeur de carte + espace (`cardWidth + gap`) avec un effet de défilement doux (`scrollTo({ behavior: "smooth" })`).
2. **Barre de défilement (sliding handle)** : Remplacement de l'ancienne barre de progression `scaleX` (qui était invisible au chargement initial quand le scroll était à 0) par une barre de défilement premium avec un curseur (handle) de taille fixe (`40px`).
3. **Calcul de translation dynamique** : Calcul de la translation du curseur `translateX` basé sur le pourcentage de scroll par rapport à la largeur disponible de la piste de progression, évitant tout débordement peu importe la taille de l'écran.
4. **Intégration responsive** : Masquage ou adaptation de l'affichage en fonction des périphériques, avec une surbrillance au survol.

## Fichiers modifiés
- [CrewStack.tsx](file:///c:/Users/Windows/Splice/components/home/v2/CrewStack.tsx) : Logique de scroll et structure HTML (Boutons + Piste).
- [prototype-styles.css](file:///c:/Users/Windows/Splice/app/prototype-styles.css) : Styles CSS de la barre de progression, des flèches directionnelles et de la mise en page responsive.
