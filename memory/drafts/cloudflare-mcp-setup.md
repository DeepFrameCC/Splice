---
id: cloudflare-mcp-setup
title: "Configuration du Cloudflare MCP Server"
summary: "Pattern réutilisable pour la configuration et l'installation du Cloudflare MCP Server dans Cursor, Claude Desktop et Antigravity IDE."
type: pattern
coreprimary: tech
coresecondary: mcp
importance: 0.5
status: draft
schemaversion: "3.5"
created: 2026-06-08
updated: 2026-06-08
tags:
  - cloudflare
  - mcp
  - cursor
  - claude-desktop
links: []
---

# Configuration et Intégration du Cloudflare MCP Server

Ce document récapitule les étapes et configurations requises pour intégrer le Cloudflare MCP Server dans l'environnement de l'agent (Cursor, Claude Desktop, et Antigravity IDE) pour interagir avec les services Cloudflare (Workers, KV, R2, D1, etc.).

## Méthodes de configuration

### 1. Serveur API Cloudflare distant (Recommandé)
- **Type :** HTTP / SSE
- **Avantages :** Économe en tokens (~1000 tokens), authentification OAuth sécurisée via navigateur, aucun secret stocké localement.
- **Syntaxe Cursor (`mcp.json`) :**
```json
{
  "mcpServers": {
    "cloudflare-api-remote": {
      "type": "sse",
      "url": "https://mcp.cloudflare.com/mcp"
    }
  }
}
```

### 2. Serveur Local via Node.js
- **Type :** Processus local (CLI command)
- **Avantages :** S'exécute en local avec les identifiants Wrangler actifs ou un Token API Cloudflare dédié.
- **Syntaxe Cursor (`mcp.json`) :**
```json
{
  "mcpServers": {
    "cloudflare-local": {
      "command": "npx",
      "args": ["-y", "@cloudflare/mcp-server-cloudflare", "run", "<ACCOUNT_ID>"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "<YOUR_API_TOKEN>"
      }
    }
  }
}
```

## Emplacements des fichiers de configuration
- **Cursor (Projet) :** `<project-root>\.cursor\mcp.json`
- **Cursor (Global) :** `%USERPROFILE%\.cursor\mcp.json`
- **Claude Desktop :** `%APPDATA%\Claude\claude_desktop_config.json`
- **Antigravity IDE :** `C:\Users\Windows\.gemini\antigravity-ide\mcp_config.json`

