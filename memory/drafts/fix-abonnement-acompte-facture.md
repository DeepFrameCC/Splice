---
id: fix-abonnement-acompte-facture
title: "Incohérences devis/factures des abonnements (acompte fantôme, facture morte-née)"
summary: "Le devis d'abonnement affichait un acompte 30 % alors que Stripe prélève 100 % en récurrent ; la validation créait une facture EMISE jamais payée ; la facture de cycle réimprimait les lignes du devis. Acompte mis à 0 à la racine, facture de validation supprimée pour les abonnements, facture de cycle avec ligne de période dédiée."
type: fix
coreprimary: fixes
importance: 0.7
status: draft
schemaversion: "3.5"
created: 2026-06-10
updated: 2026-06-10
links: []
---

# Incohérences devis/factures des abonnements

## Problématique
1. **Acompte fantôme** : `computeAbonnementQuote` calculait `acompte = 30 %` ; le devis (PDF, page client, e-mails) annonçait « Acompte 30 % / Solde à la livraison » alors que le checkout Stripe en mode `subscription` prélève 100 % du cycle dès l'activation. Écart contractuel = risque de litige.
2. **Facture morte-née** : `validerDevis` créait une facture `EMISE` liée au devis même pour un abonnement ; les paiements réels passant par `invoice.paid` (factures par cycle, `abonnementId`), cette facture restait « émise » à jamais — problème pour la numérotation sans trou (L123-22 C. com).
3. **Facture de cycle illisible** : `buildFacturePdfBytes` réimprimait les lignes du devis d'origine avec un bloc « ACOMPTE (0%) » égal au montant.

## Cause racine
Le modèle acompte/solde des prestations ponctuelles a été réutilisé tel quel pour les abonnements lors de leur introduction, sans adapter le calcul (`lib/pricing.ts`), le cycle de vie de la facturation (`validerDevis`) ni les documents.

## Solution implémentée
1. `computeAbonnementQuote` retourne `acompte: 0, solde: 0` ; `submitDevis` stocke `acompteRate: 0` pour les abonnements. (Les devis abonnement existants gardent leurs anciennes valeurs — l'affichage branche sur `devisType`, pas sur le montant.)
2. `validerDevis` ne crée plus de facture quand `devisType === "ABONNEMENT"` (le contrat, lui, reste créé).
3. Devis PDF abonnement : bloc `drawTotalsBlockRecurrent` (« PRÉLÈVEMENT MENSUEL/ANNUEL ») + mentions légales dédiées (résiliation à échéance, tarif maintenu, pas d'acompte). Facture de cycle : ligne unique « {pack} — prélèvement {cycle} », période facturée affichée dans le bloc règlement, mention droits d'auteur adaptée.
4. Page `/profil/devis/[id]` : totaux et bouton « Activer mon abonnement » branchés sur `devisType` (l'ancienne condition `acompteAmount > 0` aurait masqué le bouton avec acompte 0) + bannière succès `?abonne=1` qui n'était pas gérée.

## Fichiers modifiés / créés
- lib/pricing.ts [MODIFY]
- lib/pdf.ts [MODIFY] (drawTotalsBlockRecurrent)
- lib/pdf-documents.ts [MODIFY]
- app/actions/devis.ts [MODIFY]
- app/actions/admin.ts [MODIFY]
- app/profil/devis/[id]/page.tsx [MODIFY]
