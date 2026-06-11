---
id: fix-register-orphan-user-pseudo
title: "Inscription : user orphelin sans profil + pseudo < 3 chars après formatage"
summary: "registerAction créait user puis profile en deux écritures séparées (orphelin possible si la 2e échoue) et validait min(3) sur le pseudo brut avant formatPseudo (pseudo final possible en 1 char). Corrigé par nested create Prisma atomique + revalidation post-formatage."
type: fix
coreprimary: fixes
importance: 0.4
status: draft
schemaversion: "3.5"
created: 2026-06-11
updated: 2026-06-11
links: []
---

# Inscription : user orphelin + pseudo trop court

## Problématique
Audit du flux de création de compte (2026-06-11). Deux bugs :
1. `db.user.create` puis `db.profile.create` en deux requêtes séquentielles. Si la seconde échoue (timeout Neon, coupure Worker), le compte existe sans Profile : email/pseudo "déjà utilisé" alors que l'inscription a échoué, et les pages lisant `profile` peuvent planter.
2. Le `min(3)` Zod s'applique au pseudo brut, mais `formatPseudo` peut le raccourcir (ex. `a__` → `a`), qui passait ensuite la regex `/^[a-z0-9._]+$/`.

## Cause racine
1. Les transactions interactives Prisma sont interdites sur Workers + Neon (connexion recyclée → "Transaction not found"), donc l'auteur avait splitté en écritures séquentielles, perdant l'atomicité.
2. Validation effectuée avant la normalisation, pas après.

## Solution implémentée
1. Nested create Prisma : `db.user.create({ data: { ..., profile: { create: {...} } } })` — une seule requête, atomique côté Prisma, sans transaction interactive. Pattern réutilisable pour toute paire parent/enfant sur Workers + Neon.
2. Revalidation après formatage : `if (pseudo.length < 3 || !pseudoRegex.test(pseudo))`.

## Fichiers modifiés / créés
- app/actions/auth.ts [MODIFY]

## Restant (durcissements non appliqués, cf. audit)
- `.max(128)` sur le password (PBKDF2 600k sur entrée énorme = CPU Worker) + max sur champs texte.
- Asymétrie Turnstile en dev : schéma serveur exige `cf-turnstile-response` même quand `NEXT_PUBLIC_TURNSTILE_SITE_KEY` absent côté client.
- Aucun test unitaire sur registerAction / formatPseudo.
