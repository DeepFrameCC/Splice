---
id: feature-documents-pdf-emails-contrat
title: "Devis/factures par e-mail avec PDF joint + contrat PDF juridique complet"
summary: "Extraction des générateurs PDF devis/facture dans lib/pdf-documents.ts pour les joindre aux e-mails (client + copie Splice Studio), création d'un contrat PDF de prestation audiovisuelle avec clauses juridiques FR, et croix rouges cohérentes sur les tarifs."
type: feature
coreprimary: tech
importance: 0.7
status: draft
schemaversion: "3.5"
created: 2026-06-10
updated: 2026-06-10
links: []
---

# Documents PDF par e-mail + contrat juridique

## Problématique
1. Les e-mails devis/factures ne contenaient que des liens — ni le client ni Splice Studio ne recevaient les documents PDF.
2. Le modèle `Contrat` n'avait aucun contenu : pas de PDF, pas de texte juridique (`pdfUrl` toujours null, lien de téléchargement jamais affiché).
3. Les croix des tarifs étaient grises/barrées, peu lisibles, et les exclusions affichées ne correspondaient pas aux règles réelles de `computeAbonnementQuote` (ex. montage express interdit en Standard mais non affiché).

## Solution implémentée
1. **`lib/pdf-documents.ts`** [NEW] : `buildDevisPdfBytes`, `buildFacturePdfBytes`, `parseDevisLines`, `bytesToBase64` (compatible Workers, btoa chunké, pas de Buffer) — extraits des routes PDF, partagés entre routes et mailer.
2. **`lib/mailer.ts`** : `sendMail` accepte `attachments` (Resend, contenu base64) ; `notifyFoundersNewDevis` aussi.
3. **PDF joints + copie Splice** (`bcc` MAIL_FOUNDERS, fallback MAIL_CONTACT) sur : soumission devis (`app/actions/devis.ts`), validation devis (`app/actions/admin.ts`), paiement acompte et facture d'abonnement (`app/api/stripe/webhook/route.ts`). Génération best-effort : jamais bloquante pour l'action métier.
4. **Contrat PDF** : `lib/contrat-pdf.ts` [NEW] — contrat de prestation audiovisuelle (14 articles : objet, durée jusqu'à fin du projet, prix 293 B CGI, annulation/report, obligations, livraison 2 AR + 50 €/h, cession de droits L.131-3 CPI, droit à l'image, rétractation L.221-18/L.221-28 C. conso, responsabilité plafonnée + force majeure 1218 C. civ., RGPD, médiation L.612-1, juridiction Orléans). Route `app/api/contrat/[id]/pdf` [NEW] (auth owner/admin). Liens dans `/profil/contrats` et la table admin. `dateDebut` posée au paiement (webhook).
5. **Tarifs** : croix `text-red-400` + `sr-only` "(non inclus)", suppression du barré ; `excludedFeatures` alignées sur les vraies limites des plans.

## Pièges notés
- `wrapText`/`drawParagraph` ajoutés à `lib/pdf.ts` (coordonnées top-down via `ty()`, saut de page manuel à y>780).
- Le texte du contrat doit être relu par un professionnel du droit avant tout engagement contractuel réel.

## Fichiers modifiés / créés
- lib/pdf-documents.ts [NEW]
- lib/contrat-pdf.ts [NEW]
- app/api/contrat/[id]/pdf/route.ts [NEW]
- lib/pdf.ts [MODIFY]
- lib/mailer.ts [MODIFY]
- lib/pricing.ts [MODIFY]
- app/actions/devis.ts [MODIFY]
- app/actions/admin.ts [MODIFY]
- app/api/stripe/webhook/route.ts [MODIFY]
- app/api/devis/[id]/pdf/route.ts [MODIFY]
- app/api/facture/[id]/pdf/route.ts [MODIFY]
- components/tarifs/PlanCard.tsx [MODIFY]
- components/tarifs/PricingSection.tsx [MODIFY]
- components/dashboard/ContratsTable.tsx [MODIFY]
- app/profil/contrats/page.tsx [MODIFY]
