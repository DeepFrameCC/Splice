---
id: pack-test-production-1euro
title: "Pack de Test Production à 1 €"
summary: "Mise en place d'un pack de test à 1€ avec acompte de 100% et contournement de la validation administrative pour tester Stripe en production."
type: decision
coreprimary: tech
importance: 0.7
status: draft
schemaversion: "3.5"
created: 2026-06-09
updated: 2026-06-09
tags:
  - stripe
  - payment
  - production-test
  - pricing
links: []
---

# Pack de Test Production à 1 €

## Contexte
Pour tester les paiements en production via Stripe sans engendrer de coûts importants, un pack de test à 1 € a été intégré.

## Choix Techniques
1. **Acompte Dynamique** : Si le total HT est inférieur ou égal à 5 €, l'acompte est fixé à 100% (soit 1 € pour un pack de 1 €), ce qui évite que l'acompte par défaut de 30% tombe à 0 € (ce qui provoquerait une erreur Stripe).
2. **Bypass de Validation** : Les devis normaux nécessitent un statut `VALIDE` par l'administrateur avant d'être payables. Le pack avec le libellé `"Test Production"` contourne cette condition dans la route Stripe et les vues clients, permettant un paiement direct dès la soumission du devis.
3. **Filtre Public** : L'option de test n'apparaît pas sur la grille tarifaire publique `/tarifs`.
