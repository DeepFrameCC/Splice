import { PrismaClient, Prisma } from "@prisma/client";
import { hash } from "@node-rs/argon2";
import { SERVICES_CONTENT } from "./services-content";

const db = new PrismaClient();

async function main() {
  // ── Admin ──────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_SEED_EMAIL ?? "admin@splice.cc";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD;
  if (!adminPassword) {
    throw new Error(
      "ADMIN_SEED_PASSWORD is required. Set it in your .env file before running seed."
    );
  }

  const exists = await db.user.findFirst({
    where: {
      OR: [
        { email: adminEmail },
        { pseudo: "admin" }
      ]
    }
  });
  if (exists) {
    console.log("Admin existe deja:", exists.email);
    const passwordHash = await hash(adminPassword);
    await db.user.update({
      where: { id: exists.id },
      data: {
        email: adminEmail,
        passwordHash,
        profile: {
          upsert: {
            create: {
              prenom: "Admin",
              nom: "Splice",
              adresse: "Orleans",
              codePostal: "45000",
              ville: "Orleans",
              tel: "+33651109202",
              age: 25,
            },
            update: {
              nom: "Splice",
            }
          }
        }
      }
    });
    console.log("Compte admin mis a jour:", adminEmail);
  } else {
    const passwordHash = await hash(adminPassword);
    const admin = await db.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
        pseudo: "admin",
        profile: {
          create: {
            prenom: "Admin",
            nom: "Splice",
            adresse: "Orleans",
            codePostal: "45000",
            ville: "Orleans",
            tel: "+33651109202",
            age: 25,
          },
        },
      },
    });
    console.log("Compte admin cree:", admin.email);
  }

  // ── Services (11 services depuis services-content.ts) ──────────────
  for (const s of SERVICES_CONTENT) {
    const data = {
      name: s.name,
      shortName: s.shortName,
      metaTitle: s.metaTitle,
      metaDescription: s.metaDescription,
      h1: s.h1,
      introParagraph: s.introParagraph,
      problemQuestion: s.problemQuestion,
      problemAnswer: s.problemAnswer,
      features: s.features as unknown as Prisma.InputJsonValue,
      faq: s.faq as unknown as Prisma.InputJsonValue,
      serviceType: s.serviceType,
      priceRange: s.priceRange,
      coverImageUrl: s.coverImageUrl,
      coverImageAlt: s.coverImageAlt,
      videoUrl: s.videoUrl,
      category: s.category,
      sortOrder: s.sortOrder,
      iconName: s.iconName,
      teamMembers: s.teamMembers,
      deliverables: s.deliverables as unknown as Prisma.InputJsonValue,
      equipment: s.equipment as unknown as Prisma.InputJsonValue,
      zoneText: s.zoneText,
      relatedSlugs: s.relatedSlugs,
      isPublished: s.isPublished,
    };

    await db.service.upsert({
      where: { slug: s.slug },
      update: data,
      create: { slug: s.slug, ...data },
    });
    console.log("Service:", s.slug, s.isPublished ? "(published)" : "(draft)");
  }

  // ── Blog Categories ─────────────────────────────────────────────────
  const blogCategories = [
    { slug: "montage-video", name: "Montage vidéo", color: "#F36B1F" },
    { slug: "production-corporate", name: "Production corporate", color: "#F36B1F" },
    { slug: "motion-design", name: "Motion design", color: "#F36B1F" },
    { slug: "pub-reseaux-sociaux", name: "Publicité réseaux sociaux", color: "#F36B1F" },
    { slug: "shooting-automobile", name: "Shooting automobile", color: "#F36B1F" },
    { slug: "photographie-professionnelle", name: "Photographie professionnelle", color: "#F36B1F" },
    { slug: "interview-temoignage", name: "Interview & témoignage", color: "#F36B1F" },
    { slug: "voix-off-sound-design", name: "Voix-off & sound design", color: "#F36B1F" },
    { slug: "presentation-entreprise", name: "Film d'entreprise", color: "#F36B1F" },
    { slug: "clip-musical", name: "Clip musical", color: "#F36B1F" },
    { slug: "drone-prise-de-vue-aerienne", name: "Drone & aérien", color: "#F36B1F" },
  ];

  for (const cat of blogCategories) {
    await db.blogCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, color: cat.color },
      create: cat,
    });
    console.log("BlogCategory:", cat.slug);
  }

  // ── Blog Posts (2 par service pilier) ──────────────────────────────
  const { blogContent } = await import("./blog-content");
  const adminUser = await db.user.findUnique({ where: { email: adminEmail } });
  const blogPosts = [
    {
      slug: "5-erreurs-montage-video-reseaux-sociaux",
      title: "5 erreurs de montage qui plombent vos videos sur les reseaux sociaux",
      excerpt: "Hooks trop longs, sous-titres absents, mauvais format... Les erreurs les plus courantes et comment les corriger.",
      publishedAt: new Date("2026-03-15"),
      serviceSlug: "montage-video",
    },
    {
      slug: "guide-formats-video-2026",
      title: "Guide des formats video en 2026 : TikTok, Instagram, YouTube, LinkedIn",
      excerpt: "Dimensions, durees, codecs et bonnes pratiques par plateforme. Mise a jour 2026.",
      publishedAt: new Date("2026-04-02"),
      serviceSlug: "montage-video",
    },
    {
      slug: "film-corporate-roi-communication",
      title: "Film corporate : quel ROI attendre pour votre communication ?",
      excerpt: "Chiffres cles, cas d'usage et methode pour mesurer l'impact d'un film d'entreprise.",
      publishedAt: new Date("2026-02-20"),
      serviceSlug: "production-corporate",
    },
    {
      slug: "interview-dirigeant-reussie-7-conseils",
      title: "7 conseils pour reussir une interview video de dirigeant",
      excerpt: "Preparation, eclairage, posture, montage : tout ce qu'il faut savoir pour une interview credible.",
      publishedAt: new Date("2026-03-10"),
      serviceSlug: "production-corporate",
    },
    {
      slug: "motion-design-vs-prise-de-vue-reelle",
      title: "Motion design vs prise de vue reelle : quand choisir l'animation ?",
      excerpt: "Criteres de choix entre motion design et tournage selon votre message et votre budget.",
      publishedAt: new Date("2026-01-25"),
      serviceSlug: "motion-design",
    },
    {
      slug: "intro-animee-logo-reveal-marque",
      title: "Intro animee et logo reveal : pourquoi chaque marque en a besoin",
      excerpt: "Impact de l'intro animee sur la memorisation de marque et les taux de completion video.",
      publishedAt: new Date("2026-04-18"),
      serviceSlug: "motion-design",
    },
  ];

  for (const bp of blogPosts) {
    const service = await db.service.findUnique({ where: { slug: bp.serviceSlug } });
    if (!service) continue;

    const content = blogContent[bp.slug] ?? "";
    const category = await db.blogCategory.findUnique({ where: { slug: bp.serviceSlug } });

    const data = {
      title: bp.title,
      excerpt: bp.excerpt,
      content,
      status: "PUBLISHED" as const,
      publishedAt: bp.publishedAt,
      parentServiceId: service.id,
      authorId: adminUser?.id ?? null,
      readingTimeMin: Math.max(3, Math.round((content.replace(/<[^>]*>/g, "").split(/\s+/).length) / 200)),
    };

    await db.blogPost.upsert({
      where: { slug: bp.slug },
      update: {
        ...data,
        categories: category ? { set: [{ id: category.id }] } : undefined,
      },
      create: {
        slug: bp.slug,
        ...data,
        categories: category ? { connect: [{ id: category.id }] } : undefined,
      },
    });
    console.log("BlogPost:", bp.slug, "->", bp.serviceSlug);
  }

  // ── Médias (galerie) ────────────────────────────────────────────────
  const medias = [
    // Photos
    {
      type: "PHOTO" as const,
      url: "/photos/porsche-hexlight.jpg",
      thumbnailUrl: "/photos/porsche-hexlight.jpg",
      title: "Porsche 911 — Lumière hexagonale",
      category: "automobile",
      client: "CKlean Auto · Saran",
      owner: "LOUISIA" as const,
      prixEstime: 350,
      materiel: ["Sony ZV-1", "Sigma 35mm f/1.4"],
    },
    {
      type: "PHOTO" as const,
      url: "/photos/porsche-studio-1.jpg",
      thumbnailUrl: "/photos/porsche-studio-1.jpg",
      title: "Porsche 911 — Studio shot",
      category: "automobile",
      client: "CKlean Auto · Saran",
      owner: "LOUISIA" as const,
      prixEstime: 350,
      materiel: ["Sony ZV-1", "Sigma 24-70mm f/2.8"],
    },
    {
      type: "PHOTO" as const,
      url: "/photos/porsche-studio-2.jpg",
      thumbnailUrl: "/photos/porsche-studio-2.jpg",
      title: "Porsche 911 — Détail carrosserie",
      category: "automobile",
      client: "CKlean Auto · Saran",
      owner: "LOUISIA" as const,
      prixEstime: 350,
      materiel: ["Sony ZV-1", "Sony 90mm Macro"],
    },
    {
      type: "PHOTO" as const,
      url: "/photos/travail-porsche.jpg",
      thumbnailUrl: "/photos/travail-porsche.jpg",
      title: "Travail de finition — Porsche",
      category: "automobile",
      client: "CKlean Auto · Saran",
      owner: "LOUISIA" as const,
      prixEstime: 300,
      materiel: ["Sony ZV-1", "Sigma 35mm f/1.4"],
    },
    // Vidéos
    {
      type: "VIDEO" as const,
      url: "/videos/bistrot-orleans.mp4",
      thumbnailUrl: "/videos/thumb-bistrot-orleans.jpg",
      title: "Bistrot Orléans — Ambiance",
      category: "reseaux-sociaux",
      client: "Bistrot · Orléans",
      duration: "00:00:22",
      owner: "LOUISIA" as const,
      prixEstime: 800,
      materiel: ["Sony ZV-1", "DJI Mic"],
    },
    {
      type: "VIDEO" as const,
      url: "/videos/interview-cklean-auto.mp4",
      thumbnailUrl: "/videos/thumb-interview-cklean-auto.jpg",
      title: "Interview CKlean Auto — Passion détail",
      category: "automobile",
      client: "CKlean Auto · Saran",
      duration: "00:00:50",
      owner: "LOUISIA" as const,
      prixEstime: 1500,
      materiel: ["Sony ZV-1", "Sigma 35mm f/1.4", "DJI RS3"],
    },
    {
      type: "VIDEO" as const,
      url: "/videos/ppf-cklean-auto.mp4",
      thumbnailUrl: "/videos/thumb-ppf-cklean-auto.jpg",
      title: "PPF — Protection carrosserie",
      category: "automobile",
      client: "CKlean Auto · Saran",
      duration: "00:00:36",
      owner: "PAPI" as const,
      prixEstime: 1200,
      materiel: ["Sony ZV-1", "Sigma 24-70mm f/2.8"],
    },
    {
      type: "VIDEO" as const,
      url: "/videos/presentation-louisia.mp4",
      thumbnailUrl: "/videos/thumb-presentation-louisia.jpg",
      title: "Présentation — Par Louisia",
      category: "automobile",
      client: "CKlean Auto · Saran",
      duration: "00:00:50",
      owner: "LOUISIA" as const,
      prixEstime: 1000,
      materiel: ["Sony ZV-1", "Sigma 16mm f/1.4"],
    },
    {
      type: "VIDEO" as const,
      url: "/videos/time-fayad.mp4",
      thumbnailUrl: "/videos/thumb-time-fayad.jpg",
      title: "Time — Par Fayad",
      category: "automobile",
      client: "CKlean Auto · Saran",
      duration: "00:00:23",
      owner: "LOUISIA" as const,
      prixEstime: 600,
      materiel: ["INSTA360", "DJI"],
    },
    {
      type: "VIDEO" as const,
      url: "/videos/jeanne-darc.mp4",
      thumbnailUrl: "/videos/thumb-jeanne-darc.jpg",
      title: "Fête de Jeanne d'Arc — Orléans 2025",
      category: "evenementiel",
      client: "Événement public · Orléans",
      duration: "00:01:30",
      owner: "PAPI" as const,
      prixEstime: 0,
      materiel: ["Sony ZV-1"],
    },
    {
      type: "VIDEO" as const,
      url: "/videos/AlpineA110.mp4",
      thumbnailUrl: "/videos/thumb-AlpineA110.jpg",
      title: "Alpine A110 — Lignes Bleues",
      category: "automobile",
      client: "Alpine · Orléans & Tours",
      duration: "00:00:33",
      owner: "PAPI" as const,
      prixEstime: 1500,
      materiel: ["Sony FX3", "Sigma 24-70mm f/2.8", "DJI RS3 Pro"],
    },
    {
      type: "VIDEO" as const,
      url: "/videos/West Side.mp4",
      thumbnailUrl: "/videos/thumb-West-Side.jpg",
      title: "West Side — Vibe Urbaine",
      category: "reseaux-sociaux",
      client: "Session Street · Tours",
      duration: "00:00:31",
      owner: "TY" as const,
      prixEstime: 900,
      materiel: ["Sony ZV-E1", "Sony 20mm f/1.8", "DJI Mic"],
    },
  ];

  for (const m of medias) {
    const data = {
      type: m.type,
      url: m.url,
      thumbnailUrl: m.thumbnailUrl,
      title: m.title,
      category: m.category,
      client: m.client,
      duration: m.duration ?? null,
      owner: m.owner,
      prixEstime: m.prixEstime,
      materiel: m.materiel,
      published: true,
    };
    const existing = await db.media.findFirst({ where: { url: m.url } });
    if (existing) {
      await db.media.update({ where: { id: existing.id }, data });
      console.log("Media mis a jour:", m.title);
    } else {
      await db.media.create({ data });
      console.log("Media cree:", m.title);
    }
  }

  console.log("Seed termine.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
