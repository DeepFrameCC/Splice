import fs from "fs";
import path from "path";
import { PrismaClient, Prisma } from "@prisma/client";
import { hashPassword } from "@/lib/crypto/password";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";
import ws from "ws";
import { SERVICES_CONTENT } from "./services-content";

// Simple .env loader to ensure env variables are populated in non-Prisma CLI context
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf-8");
    for (const rawLine of envConfig.split("\n")) {
      const line = rawLine.replace(/\r/g, "").trim();
      if (!line || line.startsWith("#")) continue;
      const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        process.env[key] = value.trim();
      }
    }
  }
} catch (e) {
  console.error("Failed to load .env in seed script", e);
}

const databaseUrl = process.env.DATABASE_URL!;
const cleanUrl = databaseUrl.split("?")[0];
Pool.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: cleanUrl });
const db = new PrismaClient({ adapter });

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
    const passwordHash = await hashPassword(adminPassword);
    await db.user.update({
      where: { id: exists.id },
      data: {
        email: adminEmail,
        passwordHash,
        emailVerified: new Date(),
        role: "ADMIN",
        profile: {
          upsert: {
            create: {
              prenom: "Admin",
              nom: "Splice Studio",
              adresse: "Orleans",
              codePostal: "45000",
              ville: "Orleans",
              tel: "+33651109202",
              age: 25,
            },
            update: {
              nom: "Splice Studio",
            }
          }
        }
      }
    });
    console.log("Compte admin mis a jour:", adminEmail);
  } else {
    const passwordHash = await hashPassword(adminPassword);
    const admin = await db.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
        pseudo: "admin",
        emailVerified: new Date(),
        profile: {
          create: {
            prenom: "Admin",
            nom: "Splice Studio",
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
    { slug: "photographie-google-business", name: "Photo Google Business", color: "#F36B1F" },
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

  // ── Blog Posts ──────────────────────────────────────────────────────
  const { blogContent } = await import("./blog-content");
  const adminUser = await db.user.findUnique({ where: { email: adminEmail } });

  type BlogSeedPost = {
    slug: string;
    title: string;
    excerpt: string;
    publishedAt: Date;
    serviceSlug: string;
    metaTitle?: string;
    metaDescription?: string;
    tags?: string[];
    coverImageAlt?: string;
  };

  const blogPosts: BlogSeedPost[] = [
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
      slug: "prix-video-entreprise-2026",
      title: "Combien coute une video d'entreprise en 2026 ?",
      excerpt: "Les facteurs de prix, des fourchettes par type de film et comment obtenir un devis juste pour votre video d'entreprise.",
      metaTitle: "Prix d'une video d'entreprise en 2026 | Splice Studio",
      metaDescription: "Combien coute une video d'entreprise en 2026 ? Facteurs de prix, fourchettes par type de film et conseils pour un devis juste. Le guide Splice Studio.",
      tags: ["prix video entreprise", "tarif film corporate", "budget video"],
      coverImageAlt: "Tournage d'une video d'entreprise en studio",
      publishedAt: new Date("2026-05-05"),
      serviceSlug: "production-corporate",
    },
    {
      slug: "reussir-shooting-photo-automobile",
      title: "Reussir un shooting photo automobile : le guide complet",
      excerpt: "Lumiere, lieux, reglages, retouche : le guide pour reussir un shooting photo automobile professionnel.",
      metaTitle: "Shooting photo automobile : le guide complet | Splice Studio",
      metaDescription: "Lumiere, lieux, reglages, retouche : le guide complet pour reussir un shooting photo automobile professionnel et valoriser un vehicule.",
      tags: ["shooting photo voiture", "photographe automobile", "photo auto"],
      coverImageAlt: "Shooting photo d'une voiture a l'heure doree",
      publishedAt: new Date("2026-05-09"),
      serviceSlug: "shooting-automobile",
    },
    {
      slug: "vlog-entreprise-definition-formats",
      title: "Vlog d'entreprise : definition, formats et exemples",
      excerpt: "Qu'est-ce qu'un vlog d'entreprise ? Definition, formats et bonnes pratiques pour lancer un vlog corporate efficace.",
      metaTitle: "Vlog d'entreprise : definition et formats | Splice Studio",
      metaDescription: "Qu'est-ce qu'un vlog d'entreprise ? Definition, formats, exemples et bonnes pratiques pour lancer un vlog corporate efficace. Guide Splice Studio.",
      tags: ["vlog entreprise", "c'est quoi un vlog", "vlog corporate"],
      coverImageAlt: "Collaborateur filme pour un vlog d'entreprise",
      publishedAt: new Date("2026-05-14"),
      serviceSlug: "production-corporate",
    },
    {
      slug: "formats-video-reseaux-sociaux-2026",
      title: "Formats video pour les reseaux sociaux : le guide 2026",
      excerpt: "9:16, 1:1, 16:9 : quel format video pour quel reseau social en 2026 et comment decliner une seule captation.",
      metaTitle: "Formats video reseaux sociaux : guide 2026 | Splice Studio",
      metaDescription: "9:16, 1:1, 16:9 : quel format video pour quel reseau social en 2026 ? Bonnes pratiques et declinaison multi-format. Guide Splice Studio.",
      tags: ["format video reseaux sociaux", "9:16", "16:9", "format Reels"],
      coverImageAlt: "Declinaison d'une video en formats vertical, carre et paysage",
      publishedAt: new Date("2026-05-19"),
      serviceSlug: "pub-reseaux-sociaux",
    },
    {
      slug: "photographe-freelance-ou-agence",
      title: "Photographe freelance ou agence : comment choisir ?",
      excerpt: "Avantages, limites, couts et criteres de choix entre un photographe freelance et une agence selon votre projet.",
      metaTitle: "Photographe freelance ou agence : comment choisir ?",
      metaDescription: "Photographe freelance ou agence : avantages, limites, couts et criteres de choix selon votre projet. Le guide objectif de Splice Studio.",
      tags: ["photographe freelance", "agence vs freelance", "choisir photographe"],
      coverImageAlt: "Photographe professionnel en prise de vue",
      publishedAt: new Date("2026-05-23"),
      serviceSlug: "photographie-professionnelle",
    },
    {
      slug: "preparer-evenement-entreprise-checklist",
      title: "Preparer un evenement d'entreprise : la check-list photo/video",
      excerpt: "La check-list complete pour reussir la couverture photo et video de votre evenement d'entreprise.",
      metaTitle: "Check-list photo/video d'un evenement d'entreprise",
      metaDescription: "La check-list complete pour reussir la couverture photo et video de votre evenement d'entreprise : preparation, brief, logistique, livrables.",
      tags: ["couverture evenement entreprise", "check-list evenement", "photo video evenement"],
      coverImageAlt: "Reportage photo lors d'un evenement d'entreprise",
      publishedAt: new Date("2026-05-28"),
      serviceSlug: "production-corporate",
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
      metaTitle: bp.metaTitle ?? null,
      metaDescription: bp.metaDescription ?? null,
      tags: bp.tags ?? [],
      coverImageAlt: bp.coverImageAlt ?? null,
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

  console.log("Seed termine.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
