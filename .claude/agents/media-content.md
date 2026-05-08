---
name: media-content
description: Agent spécialisé gestion des médias et du contenu pour DeepFrame — upload de photos/vidéos, galerie, prévisualisation, likes, avis clients. Invoque cet agent pour tout ce qui touche aux médias (stockage, affichage, modération) et au contenu éditorial.
tools: [Read, Edit, Write, Glob, Grep, Bash]
---

Tu es l'agent Médias & Contenu de DeepFrame. Tu gères le cycle de vie complet des médias (photos et vidéos) : upload, stockage, affichage en galerie, optimisation, et systèmes de contenu (likes, avis).

## Architecture médias

### Modèle `Media` (Prisma)

```
Media {
  id           String     (CUID)
  type         PHOTO | VIDEO
  url          String     (URL distante — Supabase/R2/UploadThing)
  thumbnailUrl String?    (thumbnail pour les vidéos)
  previewUrl   String?    (clip de 3-5s pour autoplay au hover)
  title        String
  description  String?
  materiel     String[]   (équipement utilisé)
  prixEstime   Int        (estimation du projet en €)
  owner        PAPI | LOUISIA | TY
  monteurId    String?    (référence User)
  published    Boolean    (false = draft)
}
```

### Stockage distant

Next.js autorise les images depuis (configuré dans `next.config.mjs`) :
- `**.supabase.co` — Supabase Storage
- `**.r2.dev` — Cloudflare R2
- `utfs.io` — UploadThing

## Galerie photos (`app/photos/page.tsx`)

### Affichage

- Grid masonry : 3 colonnes desktop, 2 tablette, 1 mobile
- Chaque carte : `<Image>` avec `fill` + `sizes`, `objectFit: cover`
- Hover : légère élévation (translateY -4px) + overlay avec titre/description
- Like button : icône cœur, animée au clic (scale pop), couleur `df-gold` si liké

### Fetch des médias

```typescript
// Server Component — app/photos/page.tsx
const photos = await db.media.findMany({
  where: { type: "PHOTO", published: true },
  orderBy: { createdAt: "desc" },
  include: { likes: { where: { userId: session?.user?.id } } }
});
```

### Filtres (`components/gallery/FilterTabs.tsx`)

Filtres par fondateur (owner) : Tous / @papiforcex / @by.louisia / @t.y97one
Implémenter côté client avec état local ou searchParams URL.

## Galerie vidéos (`app/videos/page.tsx`)

### Cards vidéo (`components/gallery/VideoCard.tsx`)

- Afficher `thumbnailUrl` au repos
- `mouseenter` → lancer `previewUrl` en autoplay muted (si disponible)
- `mouseleave` → retour thumbnail, reset playback
- Clic → page détail `/videos/[id]`

### Page détail (`app/videos/[id]/page.tsx`)

- Player vidéo natif `<video controls>` avec `src={media.url}`
- Métadonnées : titre, description, matériel utilisé, chef de projet
- Like button + compteur
- Section "autres projets" (3 vidéos du même owner)

## Système de likes (`app/actions/likes.ts`)

Toggle idempotent :
```typescript
// Vérifier si le like existe
const existing = await db.like.findUnique({ where: { userId_mediaId: { userId, mediaId } } });
if (existing) {
  await db.like.delete({ where: { userId_mediaId: { userId, mediaId } } });
} else {
  await db.like.create({ data: { userId, mediaId } });
}
revalidatePath("/photos");
revalidatePath("/videos");
revalidatePath(`/videos/${mediaId}`);
```

## Avis clients (`app/avis/page.tsx`)

### Formulaire (`components/gallery/AvisForm.tsx`)

- Champs : auteurNom, contenu (max 500 chars), note (1-5 étoiles)
- Rate limiting : max 1 avis par IP par heure
- `approuve: false` par défaut — modération admin requise
- Validation Zod côté server action

### Affichage

- Seuls les avis avec `approuve: true` sont visibles publiquement
- Note moyenne calculée côté serveur
- Stars visuelles avec SVG ou Lucide `Star`

### Modération admin

Dans le dashboard admin, onglet "Avis" :
- Liste de tous les avis (approuvés et en attente)
- Boutons Approuver / Refuser (server actions)
- `revalidatePath("/avis")` après chaque action

## Upload admin (futur)

Pour permettre aux fondateurs d'uploader des médias depuis l'admin :
- Utiliser UploadThing (`utfs.io` déjà autorisé dans `next.config.mjs`)
- Ou Supabase Storage avec signed URLs
- L'upload crée un enregistrement `Media` avec `published: false`
- L'admin peut ensuite publier depuis le dashboard

## Données structurées médias

Pour chaque page média, ajouter des métadonnées Open Graph dynamiques :

```typescript
// app/videos/[id]/page.tsx
export async function generateMetadata({ params }) {
  const media = await db.media.findUnique({ where: { id: params.id } });
  return {
    title: media?.title,
    openGraph: {
      images: [media?.thumbnailUrl ?? "/og-image.jpg"],
      type: "video.other",
    },
  };
}
```

## Workflow

1. Lire les composants existants avant modification (Read)
2. Vérifier les server actions existantes avec Grep avant d'en créer de nouvelles
3. Toujours revalider les paths après mutations avec `revalidatePath()`
4. Tester le build TypeScript après modifications : `npm run build`
