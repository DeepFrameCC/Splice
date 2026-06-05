---
name: jarvis
version: 1.0.0
description: >-
  Skill de construction d'un assistant IA personnel de type Jarvis :
  architecture fullstack Next.js 16 + Claude Opus 4.6, orchestration
  multi-agents, mémoire persistante, MCP serveurs custom, voice interface,
  dashboard de contrôle et déploiement production.
tags:
  - jarvis
  - assistant-ia
  - multi-agent
  - nextjs
  - claude
  - mcp
  - voice
  - memory
  - fullstack
category: tooling
priority: high
---

# Jarvis — Assistant IA Personnel

## Quand utiliser cette skill

- L'utilisateur veut construire un assistant IA personnel, un copilote ou un agent autonome de type Jarvis.
- Le projet implique une interface conversationnelle + des agents spécialisés + des outils réels (web, code, fichiers, APIs).
- Il faut architecturer un système avec mémoire persistante, voice, dashboard et déploiement production.

## Objectif

Guider la conception et l'implémentation complète d'un assistant IA personnel fullstack : de l'architecture initiale au déploiement production, en couvrant orchestration des agents, mémoire, MCP, voice, sécurité et observabilité.

## Stack de référence

| Couche | Technologie |
|---|---|
| Frontend | Next.js 16 App Router, React 19, Tailwind CSS v4 |
| LLM principal | Claude Opus 4.6 (agents) / Sonnet 4.6 (chat) |
| Orchestration | Mastra (TS) ou LangGraph (Python) |
| Protocole tools | MCP (Model Context Protocol) |
| Mémoire court terme | Context window + compaction |
| Mémoire long terme | pgvector (PostgreSQL) + Mem0 |
| Voice | Whisper (STT) + ElevenLabs / Edge TTS (TTS) |
| Auth | NextAuth v5 / Clerk |
| DB | PostgreSQL (Neon) + Drizzle ORM |
| Déploiement | Vercel (front) + Modal (agents GPU) |
| Observabilité | Langfuse ou LangSmith |

## Architecture Jarvis — Modules

```
┌─────────────────────────────────────────────────┐
│               INTERFACE JARVIS                   │
│  Chat UI (streaming) │ Voice │ Dashboard admin   │
└──────────────────────┬──────────────────────────┘
                       │
              ┌────────▼────────┐
              │  ORCHESTRATEUR  │
              │ Claude Opus 4.6 │
              │  + task ledger  │
              └────────┬────────┘
          ┌────────────┼────────────┐
          │ A2A        │ A2A        │ A2A
          ▼            ▼            ▼
   ┌──────────┐  ┌──────────┐  ┌──────────┐
   │  BRAIN   │  │  HANDS   │  │  EYES    │
   │ (mémoire,│  │ (code,   │  │ (web,    │
   │  contexte│  │  shell,  │  │  vision, │
   │  profil) │  │  deploy) │  │  search) │
   └────┬─────┘  └────┬─────┘  └────┬─────┘
        │ MCP          │ MCP          │ MCP
        ▼              ▼              ▼
  [pgvector,      [bash, git,    [browser,
   Mem0, DB]       fs, Vercel]    Perplexity,
                                  vision API]
```

## Instructions opérationnelles

### Phase 1 — Architecture & setup

1. Créer le repo Next.js 16 avec App Router + TypeScript strict.
2. Configurer Tailwind CSS v4 (CSS-first, tokens dans `@theme`).
3. Configurer PostgreSQL (Neon) + Drizzle ORM + pgvector extension.
4. Implémenter l'auth (Clerk ou NextAuth v5) + protection des routes.
5. Mettre en place Langfuse pour l'observabilité dès le départ.

### Phase 2 — Core agent + MCP

1. Implémenter l'orchestrateur avec Claude Opus 4.6 (Anthropic SDK).
2. Activer le streaming Server-Sent Events dans Next.js (Route Handler).
3. Créer les serveurs MCP custom :
   - `memory-mcp` : lecture/écriture mémoire pgvector + Mem0.
   - `tools-mcp` : shell, git, file system (sandboxé).
   - `search-mcp` : web search, Perplexity API.
4. Appliquer les 6 règles de construction MCP (voir skill `ia-core`).

### Phase 3 — Mémoire persistante

1. Implémenter la mémoire in-session : compaction automatique quand context > 80% de la fenêtre.
2. Implémenter la mémoire cross-session : extraire et stocker les faits importants dans pgvector après chaque session.
3. Implémenter les profils utilisateur : préférences, historique, contexte métier persistant.
4. Utiliser le pattern Retrieve : rappel des souvenirs pertinents à chaque nouvelle session.

### Phase 4 — Voice interface

1. STT : Whisper API (OpenAI) ou Whisper.cpp local pour la transcription.
2. TTS : ElevenLabs API (voix réaliste) ou Edge TTS (gratuit, acceptable).
3. Implémentation : MediaRecorder API côté client → upload → transcription → réponse LLM → synthèse vocale → lecture audio.
4. Streaming audio : utiliser Web Audio API pour lire le TTS en streaming.

### Phase 5 — Dashboard & personnalisation

1. Dashboard admin : historique des conversations, métriques (coût, latence, tokens), gestion mémoire.
2. Paramètres utilisateur : personnalité de Jarvis, domaines de connaissance, préférences de réponse.
3. Gestion des compétences : activer/désactiver des agents spécialisés selon le contexte.

### Phase 6 — Sécurité & déploiement

1. Appliquer toutes les règles Agent Security (voir skill `ia-security`).
2. Sandbox strict pour les agents avec accès shell/fs.
3. Rate limiting sur les routes LLM.
4. Déployer le front sur Vercel, les agents lourds sur Modal.
5. Variables d'environnement via Cloudflare Secrets ou Vercel env.

## Patterns d'implémentation clés

### Streaming SSE avec Next.js 16

```ts
// app/api/jarvis/route.ts
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(req: Request) {
  const { message, sessionId } = await req.json()
  
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const response = await client.messages.stream({
        model: 'claude-opus-4-6',
        max_tokens: 4096,
        system: buildSystemPrompt(sessionId),
        messages: [{ role: 'user', content: message }],
        tools: getMCPTools(),
      })
      
      for await (const chunk of response) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`))
        }
      }
      controller.close()
    }
  })
  
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
  })
}
```

### Compaction mémoire in-session

```ts
async function compactContext(messages: Message[]): Promise<Message[]> {
  if (estimateTokens(messages) < CONTEXT_THRESHOLD) return messages
  
  const summary = await claude.messages.create({
    model: 'claude-sonnet-4-6', // modèle léger pour la compaction
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Résume ces échanges en préservant les faits importants et les décisions prises :\n\n${JSON.stringify(messages.slice(0, -10))}`
    }]
  })
  
  return [
    { role: 'user', content: `[Contexte résumé] : ${summary.content[0].text}` },
    ...messages.slice(-10)
  ]
}
```

## Gardes-fous obligatoires Jarvis

```
[JARVIS SAFETY]
├── rate_limit: 20 req/min par utilisateur
├── max_agent_steps: 30 par run
├── shell_sandbox: Docker isolé, pas de root
├── memory_size_limit: 10MB par utilisateur
├── cost_alert: seuil $ par jour avec notification
└── human_confirm: avant toute action fs/deploy/API externe
```

## Ressources associées

- `skill.md` §3.9 — Architecture de référence agents autonomes complexes.
- `skill.md` §3.3 — MCP : construction de serveurs custom.
- `skill.md` §5.2 — Sécurité agents, sandbox, audit trail.
- Skills complémentaires : `ia-core`, `ia-security`, `ia-rag`, `deep-research`.
