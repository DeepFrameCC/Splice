---
trigger: always_on
description: Charge la mémoire locale et globale avant toute tâche pour orchestrer et enrichir la bibliothèque

# Mémoire active — Splice Studio
- MCP Local : `vault-splice` (projet Splice Studio dans `C:/Users/Windows/Splice/memory`)
- MCP Global : `vault-generic` (bibliothèque centrale dans `C:/Users/Windows/connectome-vault/memory`)
- Commence chaque session par : `memory_get_summary` sur `vault-splice`
- Schéma mémoire actif : v3.5
- Enrichissement central : Tout patron technique (tech/), correctif réutilisable (fixes/) ou ADR (decisions/) générique développé dans Splice doit également être écrit comme draft dans `vault-generic` pour enrichir la bibliothèque commune.
---
