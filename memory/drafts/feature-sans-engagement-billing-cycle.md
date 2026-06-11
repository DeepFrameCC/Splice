---
id: feature-sans-engagement-billing-cycle
title: "Cycle de facturation Sans engagement avec supplément de 20 €"
summary: "Ajout du cycle SANS_ENGAGEMENT (mensuel sans engagement +20 €) et définition d'un engagement minimum de 3 mois pour le tarif MENSUEL de base dans les devis, les tarifs, les factures et le contrat PDF."
type: feature
coreprimary: tech
importance: 0.7
status: draft
schemaversion: "3.5"
created: 2026-06-12
updated: 2026-06-12
links: []
---

# Cycle de facturation Sans engagement avec supplément

## Problématique
1. Les clients souhaitaient une formule mensuelle sans engagement de durée, ce qui n'était pas supporté par le modèle tarifaire binaire (mensuel avec engagement vs annuel payé d'avance).
2. Le tarif mensuel de base devait être assorti d'un engagement minimum de 3 mois pour amortir les coûts d'initialisation, tandis qu'une formule sans engagement devait être facturée avec un supplément de 20 € / mois.

## Solution implémentée
1. **Évolution du modèle** : Extension de `BillingCycle` dans [pricing.ts](file:///C:/Users/Windows/Splice/lib/pricing.ts) pour inclure `"SANS_ENGAGEMENT"`.
2. **Calcul des tarifs** : Ajout de la constante `SANS_ENGAGEMENT_SUPPLEMENT = 20` et de la fonction `resolvePlanMonthlyPrice` pour centraliser le calcul du prix mensuel (mensuel de base vs annuel vs mensuel + 20 €).
3. **Contrat PDF** : Ajout d'une clause d'engagement minimum de 3 mois pour les abonnements avec cycle `"MENSUEL"`, et clause de résiliation libre à tout moment pour `"SANS_ENGAGEMENT"` dans [contrat-pdf.ts](file:///C:/Users/Windows/Splice/lib/contrat-pdf.ts).
4. **Interface utilisateur** :
   - Mise à jour du `BillingToggle` pour inclure l'option "Sans engagement" dans les tarifs et le tunnel de devis.
   - Adaptation de la fiche produit (`PlanCard`) et du récapitulatif du devis (`Recap`, `PayerClient`) pour afficher les mentions et prix corrects.
5. **Validation & Actions** : Mise à jour du schéma Zod dans [devis.ts](file:///C:/Users/Windows/Splice/app/actions/devis.ts) pour valider `"SANS_ENGAGEMENT"`.
6. **Tests** : Ajout de tests unitaires et d'intégration dans [pricing.test.ts](file:///C:/Users/Windows/Splice/__tests__/pricing.test.ts) validant les calculs et la facturation récurrente Stripe pour le cycle `"SANS_ENGAGEMENT"`.

## Fichiers modifiés
- [lib/pricing.ts](file:///C:/Users/Windows/Splice/lib/pricing.ts) [MODIFY]
- [lib/contrat-pdf.ts](file:///C:/Users/Windows/Splice/lib/contrat-pdf.ts) [MODIFY]
- [__tests__/pricing.test.ts](file:///C:/Users/Windows/Splice/__tests__/pricing.test.ts) [MODIFY]
- [app/actions/devis.ts](file:///C:/Users/Windows/Splice/app/actions/devis.ts) [MODIFY]
- [components/tarifs/PlanCard.tsx](file:///C:/Users/Windows/Splice/components/tarifs/PlanCard.tsx) [MODIFY]
- [components/tarifs/BillingToggle.tsx](file:///C:/Users/Windows/Splice/components/tarifs/BillingToggle.tsx) [MODIFY]
- [components/devis/Steps.tsx](file:///C:/Users/Windows/Splice/components/devis/Steps.tsx) [MODIFY]
- [components/devis/Recap.tsx](file:///C:/Users/Windows/Splice/components/devis/Recap.tsx) [MODIFY]
- [components/devis/PayerClient.tsx](file:///C:/Users/Windows/Splice/components/devis/PayerClient.tsx) [MODIFY]
