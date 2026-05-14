import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/argon2";

const db = new PrismaClient();

async function main() {
  // ── Admin ──────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_SEED_EMAIL ?? "admin@deepframe.cc";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD;
  if (!adminPassword) {
    throw new Error(
      "ADMIN_SEED_PASSWORD is required. Set it in your .env file before running seed."
    );
  }

  const exists = await db.user.findUnique({ where: { email: adminEmail } });
  if (exists) {
    console.log("Admin existe deja:", exists.email);
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
            nom: "DeepFrame",
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

  // ── Services ───────────────────────────────────────────────────────
  const services = [
    {
      slug: "montage-video",
      name: "Montage video professionnel",
      shortName: "Montage video",
      metaTitle: "Montage video professionnel Orleans Tours | DeepFrame",
      metaDescription:
        "Montage video haut de gamme pour entreprises et marques. Post-production, etalonnage DaVinci, sound design. Livraison multi-format reseaux sociaux.",
      h1: "Montage video professionnel — donnez du rythme a votre message",
      introParagraph:
        "Chaque seconde compte. Notre montage transforme vos rushes en contenus percutants, calibres pour capter l'attention sur chaque plateforme.",
      problemQuestion:
        "Pourquoi le montage fait la difference entre un contenu vu et un contenu ignore ?",
      problemAnswer:
        "Un tournage reussi ne garantit rien sans un montage precis. Le rythme, les coupes, les transitions, le sound design — tout conditionne l'engagement de votre audience. Chez DeepFrame, chaque montage est pense pour le format de diffusion cible : vertical TikTok, carre Instagram, 16:9 YouTube. L'etalonnage colorimetrique sur DaVinci Resolve Studio finalise l'image avec un rendu cinema qui distingue votre marque.",
      features: [
        {
          h3: "Montage multi-format",
          content:
            "Un seul tournage, plusieurs declinaisons. On livre en 9:16, 1:1 et 16:9 pour couvrir TikTok, Instagram Reels, YouTube et LinkedIn sans ressource supplementaire.",
        },
        {
          h3: "Etalonnage et color grading",
          content:
            "Etalonnage professionnel sur DaVinci Resolve Studio. LUTs personnalisees, skin tones naturels, ambiance visuelle coherente avec votre charte graphique.",
        },
        {
          h3: "Sound design et mixage",
          content:
            "Nettoyage audio, sound design immersif, musique licensiee ou sur mesure. Le mix final respecte les normes LUFS de chaque plateforme.",
        },
      ],
      faq: [
        {
          question: "Quel est le delai de livraison pour un montage video ?",
          answer:
            "Delai standard : 7 jours ouvrés apres reception des rushes. Option express 48h disponible avec supplement.",
        },
        {
          question: "Combien de formats sont inclus dans une prestation montage ?",
          answer:
            "Chaque pack inclut au minimum 2 formats (vertical + horizontal). Des declinaisons supplementaires sont facturées a l'unite.",
        },
        {
          question: "Puis-je fournir mes propres rushes pour le montage ?",
          answer:
            "Oui. Envoyez vos fichiers via notre plateforme de transfert securisee. Formats acceptes : ProRes, H.264, H.265, RAW (BRAW, R3D).",
        },
      ],
      serviceType: "VideoEditingService",
      priceRange: "$$$",
      coverImageUrl: "/images/services/montage-video.jpg",
      coverImageAlt: "Poste de montage video professionnel avec DaVinci Resolve — studio DeepFrame Orleans",
    },
    {
      slug: "production-corporate",
      name: "Production corporate et brand content",
      shortName: "Production corporate",
      metaTitle: "Production corporate et film de marque Orleans Tours | DeepFrame",
      metaDescription:
        "Films corporate, interviews dirigeants, brand content. Production audiovisuelle complete de la pre-production a la livraison finale.",
      h1: "Production corporate — racontez votre marque en images",
      introParagraph:
        "Un film corporate ne se resume pas a un plan large sur vos locaux. C'est un outil strategique qui porte votre message aupres de vos clients, partenaires et talents.",
      problemQuestion:
        "Comment un film corporate transforme la perception de votre entreprise ?",
      problemAnswer:
        "80% des entreprises utilisent la video dans leur communication. La difference entre un film corporate efficace et un contenu generique tient a trois choses : une direction artistique assumee, un storytelling ancre dans votre realite metier, et une qualite technique irreprochable. Chez DeepFrame, on prend le temps de comprendre votre positionnement avant de tourner la premiere image.",
      features: [
        {
          h3: "Film de presentation entreprise",
          content:
            "De 1 a 5 minutes, avec interviews dirigeants, plans d'activite et motion titrage. Ideal pour le site web, les salons et le recrutement.",
        },
        {
          h3: "Interview et temoignage",
          content:
            "Setup multi-camera, eclairage portrait cinematographique, prompteur si necessaire. Montage dynamique avec habillage graphique integre.",
        },
        {
          h3: "Brand content reseaux sociaux",
          content:
            "Series de contenus courts calibres pour vos reseaux. Formats verticaux, sous-titres graves, hooks visuels optimises pour l'algorithme.",
        },
      ],
      faq: [
        {
          question: "Combien coute un film corporate ?",
          answer:
            "Le tarif depend de la duree, du nombre de jours de tournage et des besoins en post-production. Nos packs demarrent a partir de 1 500 euros HT. Devis gratuit en ligne.",
        },
        {
          question: "Gerez-vous la pre-production (script, reperage) ?",
          answer:
            "Oui. Chaque projet inclut un brief creatif, une proposition de traitement, un script valide et un reperage des lieux avant tournage.",
        },
        {
          question: "Peut-on tourner dans nos locaux ?",
          answer:
            "Absolument. On s'adapte a votre environnement. Notre materiel d'eclairage portable permet de transformer n'importe quel espace en plateau.",
        },
      ],
      serviceType: "VideographyService",
      priceRange: "$$$",
      coverImageUrl: "/images/services/production-corporate.jpg",
      coverImageAlt: "Tournage film corporate en entreprise — equipe DeepFrame avec camera cinema",
    },
    {
      slug: "motion-design",
      name: "Motion design et animation graphique",
      shortName: "Motion design",
      metaTitle: "Motion design et animation graphique Orleans Tours | DeepFrame",
      metaDescription:
        "Motion design sur mesure : intros animees, infographies video, habillage graphique, transitions. Animation 2D/3D pour marques exigeantes.",
      h1: "Motion design — animez vos idees avec precision",
      introParagraph:
        "Le motion design rend tangible ce que la camera ne peut pas filmer. Donnees, processus, concepts abstraits : tout devient limpide en animation.",
      problemQuestion:
        "Quand le motion design devient-il indispensable a votre communication ?",
      problemAnswer:
        "Des que votre message depasse le champ visuel d'une camera. Expliquer un processus technique, animer des chiffres cles, habiller une video avec votre identite graphique — le motion design apporte une couche narrative impossible a obtenir en prise de vue reelle. Chez DeepFrame, chaque animation est construite sur mesure a partir de votre charte, pas d'un template generique.",
      features: [
        {
          h3: "Intro et outro animees",
          content:
            "Logo reveal, generiques, bumpers. Animation fluide de votre identite visuelle pour ouvrir et fermer chaque video avec impact.",
        },
        {
          h3: "Infographie et data visualization",
          content:
            "Transformation de vos donnees en sequences animees lisibles et memorables. Ideal pour les rapports d'activite, les pitchs investisseurs, les presentations internes.",
        },
        {
          h3: "Habillage graphique video",
          content:
            "Lower thirds, titrages, transitions, call-to-action animes. Coherence graphique totale entre vos supports video et votre charte de marque.",
        },
      ],
      faq: [
        {
          question: "Quelle est la difference entre motion design 2D et 3D ?",
          answer:
            "Le motion design 2D utilise des illustrations et typographies animees en plan. Le 3D ajoute de la profondeur avec des objets modeles. Le choix depend du rendu souhaite et du budget.",
        },
        {
          question: "Fournissez-vous les fichiers sources ?",
          answer:
            "Sur demande et avec supplement. Les fichiers After Effects / Cinema 4D sont livres avec un guide de modification si vous avez les competences en interne.",
        },
        {
          question: "Peut-on integrer du motion design dans une video filmee ?",
          answer:
            "C'est meme recommande. L'habillage graphique renforce le message de la prise de vue reelle. On gere le compositing pour un resultat homogene.",
        },
      ],
      serviceType: "GraphicDesignService",
      priceRange: "$$$",
      coverImageUrl: "/images/services/motion-design.jpg",
      coverImageAlt: "Animation motion design en cours de creation — interface After Effects studio DeepFrame",
    },
  ];

  for (const s of services) {
    await db.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
    console.log("Service:", s.slug);
  }

  // ── Blog Posts (2 par service) ─────────────────────────────────────
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

    await db.blogPost.upsert({
      where: { slug: bp.slug },
      update: {
        title: bp.title,
        excerpt: bp.excerpt,
        publishedAt: bp.publishedAt,
        parentServiceId: service.id,
      },
      create: {
        slug: bp.slug,
        title: bp.title,
        excerpt: bp.excerpt,
        publishedAt: bp.publishedAt,
        parentServiceId: service.id,
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
