---
name: ia-security
version: 2.0.0
description: >-
  Skill sécurité pour les systèmes IA et LLM : prompt injection,
  jailbreak, sécurité multi-agents, CSP, auth et cryptographie.
tags:
  - security
  - prompt-injection
  - jailbreak
  - agent-security
  - owasp
  - csp
  - auth
category: security
priority: critical
---

# IA Security Skill

## Quand utiliser cette skill

- Le système IA manipule des données sensibles ou exécute des actions sur des systèmes réels.
- La demande implique des agents autonomes avec tools puissants ou accès étendus.
- Il faut concevoir ou auditer la sécurité d'une application IA.

## Objectif

Réduire la surface d'attaque des systèmes LLM et agents, en appliquant systématiquement les défenses connues contre les vecteurs d'attaque modernes.

## Instructions opérationnelles

### Web & Application

1. CSP stricte avec nonces dynamiques côté serveur.
2. Cookies sensibles : `HttpOnly`, `Secure`, `SameSite=Strict`.
3. Rotation régulière des secrets, jamais de secrets codés en dur.
4. Journalisation des événements d'authentification et actions sensibles.
5. Validation de toutes les entrées par schéma (Zod/ArkType).
6. Encodage de sortie selon le contexte (HTML, JS, SQL, URL).

### LLM / Prompt Security

1. **Prompt Injection** :
   - Filtrer et valider toutes les entrées utilisateur avant injection dans un prompt.
   - Ne jamais concaténer du contenu utilisateur non échappé dans le prompt système.
   - Utiliser des délimiteurs explicites (balises XML, blocs JSON) pour séparer instructions et données.
2. **Jailbreak Defense** :
   - Auditer régulièrement les prompts système avec des red team tests.
   - Mettre en place une couche de modération en sortie (Llama Guard, Azure AI Content Safety).
   - Surveiller les patterns d'attaque émergents (les architectures multi-agents sont des vecteurs particulièrement exposés).
3. **Structured Output Validation** :
   - Toujours parser et valider le JSON retourné par le LLM avant de l'utiliser.
   - Ne jamais exécuter de code retourné par un LLM sans sandbox et revue.

### Agent Security (Priorité Critique)

1. **Moindre privilège** : chaque agent accède uniquement aux outils et données strictement nécessaires.
2. **Human-in-the-loop** : confirmation humaine obligatoire pour actions destructrices ou irréversibles.
3. **Audit trail** : journaliser toutes les actions des agents (timestamp, tool, input, output, résultat).
4. **Sandbox** : isoler les agents manipulant le système de fichiers ou exécutant du code (containers, VMs, runtimes isolés).
5. **Limites d'itération** : toujours définir un maximum d'étapes pour éviter les boucles infinies coûteuses.

### Auth Moderne

- OAuth 2.1 / OIDC correctement implémentés.
- Sessions courtes + refresh tokens en cookie HttpOnly.
- Passkeys / WebAuthn privilégiés si l'expérience le permet.
- RBAC / ABAC : contrôles d'autorisation séparés de l'authentification.

### Cryptographie

- Chiffrement au repos : AES-256-GCM.
- Transit : TLS 1.3.
- Gestion centralisée des clés : AWS KMS, HashiCorp Vault, Cloudflare Secrets.
- Minimisation des données collectées + politique de rétention explicite.

## Ressources associées

- `docs/PROMPT-INJECTION.md` — Patterns d'attaque & défenses.
- `docs/JAILBREAK.md` — Techniques modernes et contre-mesures.
- `docs/AGENT-SECURITY.md` — Sécurité multi-agents en profondeur.
