/**
 * Complete service content for all 11 Splice services.
 * Refactored for UX writing: 50%+ text reduction, clear client benefits, structured visual blocks.
 * Used by prisma/seed.ts to populate the Service table.
 */

import type { ServiceFeature, FAQItem, ServiceDeliverable, EquipmentItem } from "../lib/services/types";

export interface ServiceContent {
  slug: string;
  name: string;
  shortName: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  introParagraph: string;
  problemQuestion: string;
  problemAnswer: string;
  features: ServiceFeature[];
  faq: FAQItem[];
  serviceType: string;
  priceRange: string;
  coverImageUrl: string;
  coverImageAlt: string;
  videoUrl: string | null;
  category: string;
  sortOrder: number;
  iconName: string;
  teamMembers: string[];
  deliverables: ServiceDeliverable[];
  equipment: EquipmentItem[];
  zoneText: string;
  relatedSlugs: string[];
  isPublished: boolean;
}

// ---------------------------------------------------------------------------
// Zone text fragments (reused across services)
// ---------------------------------------------------------------------------

const ZONE_ORLEANS_TOURS =
  "Nous intervenons principalement sur Orléans, Tours et l'ensemble de la région Centre-Val de Loire. Que vous soyez basé dans le Loiret (45), en Indre-et-Loire (37) ou dans un département voisin, notre équipe se déplace pour chaque projet.";

const ZONE_REMOTE =
  "Basés entre Orléans et Tours, nous travaillons aussi bien en présentiel qu'à distance. Les échanges de fichiers, la validation et les retours se font via notre plateforme sécurisée, où que vous soyez en France ou à l'international. Pour les prestations nécessitant un tournage, nous intervenons sur toute la région Centre-Val de Loire et au-delà.";

// ---------------------------------------------------------------------------
// 1. Montage vidéo
// ---------------------------------------------------------------------------

const montageVideo: ServiceContent = {
  slug: "montage-video",
  name: "Montage vidéo professionnel",
  shortName: "Montage vidéo",
  metaTitle: "Montage vidéo professionnel Orléans Tours | Splice",
  metaDescription:
    "Montage vidéo haut de gamme pour entreprises à Orléans et Tours. Post-production, étalonnage DaVinci, sound design. Livraison multi-format rapide.",
  h1: "Des montages vidéo rythmés qui captent et retiennent l'attention",
  introParagraph:
    "Nous transformons vos rushes bruts en contenus percutants et optimisés pour toutes vos plateformes de diffusion.",
  problemQuestion:
    "Pourquoi le montage fait-il la différence entre une vidéo vue et un contenu ignoré ?",
  problemAnswer:
    "Un tournage réussi ne garantit rien sans un montage précis. Le rythme, l'étalonnage cinéma et le sound design conditionnent l'engagement de votre audience de façon mesurable sur chaque réseau social.",
  features: [
    {
      h3: "Montage multi-format réseaux sociaux",
      content:
        "Nous déclinons votre vidéo principale en formats natifs (9:16 vertical, 16:9 horizontal, 1:1 carré) pour couvrir TikTok, Reels, YouTube et LinkedIn.",
    },
    {
      h3: "Étalonnage et color grading DaVinci",
      content:
        "Ajustement professionnel des teintes, lumières et contrastes sur DaVinci Resolve Studio pour un rendu cinéma haut de gamme adapté à votre charte.",
    },
    {
      h3: "Sound design et mixage complet",
      content:
        "Nettoyage des voix, effets sonores immersifs et calage du rythme sur des musiques libres de droits pour doubler le temps de visionnage.",
    },
    {
      h3: "Sous-titrage et accessibilité",
      content:
        "Incrustation de sous-titres dynamiques ou fichiers SRT pour capter les 85 % d'utilisateurs mobiles qui regardent des vidéos sans activer le son.",
    }
  ],
  faq: [
    {
      question: "Quel est le délai de livraison standard ?",
      answer:
        "Nous livrons votre premier montage sous 7 à 14 jours après réception de vos fichiers. Une option express en 48h est également disponible.",
    },
    {
      question: "Combien coûte une prestation de montage vidéo ?",
      answer:
        "Nos prestations de montage vidéo débutent à 29 € pour un pack individuel à l'unité, ou à partir de 45 €/mois via nos formules d'abonnement sans engagement. Retrouvez notre grille complète sur notre page de <a href=\"/tarifs\" class=\"text-df-gold hover:underline\">tarifs fixes</a>.",
    },
    {
      question: "Puis-je vous envoyer mes propres fichiers ?",
      answer:
        "Oui. Transmettez-nous vos fichiers bruts (caméra, smartphone, GoPro, etc.) via notre espace de transfert en ligne haut débit sécurisé.",
    }
  ],
  serviceType: "VideoEditingService",
  priceRange: "$$$",
  coverImageUrl: "/images/services/video.png",
  coverImageAlt:
    "Poste de montage vidéo professionnel avec DaVinci Resolve — studio Splice Orléans",
  videoUrl: null,
  category: "video",
  sortOrder: 1,
  iconName: "scissors",
  teamMembers: ["TY", "LOUISIA"],
  deliverables: [
    { label: "Vidéo montée HD/4K", detail: "Format principal + déclinaisons" },
    { label: "Étalonnage colorimétrique", detail: "DaVinci Resolve Studio" },
    { label: "Sound design et mixage" },
    { label: "Sous-titres", detail: "Incrustés ou fichiers SRT" },
    { label: "Exports multi-plateformes", detail: "TikTok, Instagram, YouTube, LinkedIn" },
  ],
  equipment: [
    { name: "Adobe Premiere Pro CC", detail: "Montage principal" },
    { name: "DaVinci Resolve Studio", detail: "Etalonnage et color grading" },
    { name: "After Effects", detail: "Motion titrage et habillage" },
    { name: "Logic Pro X", detail: "Mixage audio" },
    { name: "Adobe Audition CC", detail: "Nettoyage et sound design" },
  ],
  zoneText: ZONE_REMOTE,
  relatedSlugs: ["production-corporate", "motion-design", "pub-reseaux-sociaux"],
  isPublished: true,
};

// ---------------------------------------------------------------------------
// 2. Production corporate
// ---------------------------------------------------------------------------

const productionCorporate: ServiceContent = {
  slug: "production-corporate",
  name: "Production corporate et brand content",
  shortName: "Production corporate",
  metaTitle: "Production audiovisuelle & film corporate Orléans | Splice",
  metaDescription:
    "Production audiovisuelle à Orléans et Tours : film corporate, vidéo institutionnelle et pub entreprise, de la pré-production au montage final.",
  h1: "Production audiovisuelle & film corporate à Orléans",
  introParagraph:
    "Studio de production audiovisuelle à Orléans et Tours, nous réalisons films corporate, vidéos institutionnelles et pubs d'entreprise — du script à la livraison — pour engager vos clients et partenaires.",
  problemQuestion:
    "Comment un film d'entreprise transforme-t-il l'impact de votre communication ?",
  problemAnswer:
    "Une vidéo professionnelle humanise votre entreprise et valorise votre expertise. Nous prenons le temps de comprendre vos objectifs pour raconter votre histoire de façon authentique.",
  features: [
    {
      h3: "Script et direction artistique",
      content:
        "Nous concevons ensemble le message clé, rédigeons le script et créons un moodboard visuel complet avant d'allumer la caméra.",
    },
    {
      h3: "Tournage cinéma dans vos locaux",
      content:
        "Notre équipe se déplace avec un équipement cinéma 4K (Sony FX, Blackmagic) et des éclairages doux pour sublimer vos espaces et collaborateurs.",
    },
    {
      h3: "Post-production et habillage",
      content:
        "Montage rythmé, étalonnage des couleurs haut de gamme, habillage graphique et sous-titres : un film institutionnel ou une pub entreprise prêts à diffuser sur tous vos canaux.",
    }
  ],
  faq: [
    {
      question: "Quelle différence entre film corporate et vidéo institutionnelle ?",
      answer:
        "Un film corporate raconte une histoire de marque et cherche l'émotion ou la conviction commerciale, tandis qu'une vidéo institutionnelle présente plus factuellement votre organisation, ses valeurs et son fonctionnement. Nous produisons les deux formats selon votre objectif.",
    },
    {
      question: "Quel est le délai de production moyen ?",
      answer:
        "Prévoyez 7 à 14 jours entre le brief initial et la livraison de votre film finalisé, selon la logistique requise (nombre de jours de tournage).",
    },
    {
      question: "Combien coûte un film corporate complet ?",
      answer:
        "Nos prestations de post-production débutent à 29 € pour un montage simple. Pour un projet de tournage complet en entreprise, nous vous invitons à réaliser une simulation sur notre <a href=\"/devis\" class=\"text-df-gold hover:underline\">simulateur de devis</a> ou à consulter notre page de <a href=\"/tarifs\" class=\"text-df-gold hover:underline\">tarifs fixes</a>.",
    },
    {
      question: "Pouvez-vous tourner directement dans nos bureaux ?",
      answer:
        "Oui. Nous adaptons notre éclairage et notre matériel pour transformer vos bureaux ou ateliers en un plateau de tournage de qualité.",
    },
    {
      question: "Filmez-vous aussi nos événements d'entreprise ?",
      answer:
        "Oui, c'est une prestation dédiée. Pour les séminaires, soirées et salons, découvrez notre offre de <a href=\"/photographe-evenementiel\" class=\"text-df-gold hover:underline\">photographe événementiel à Orléans et Tours</a> (reportage photo + aftermovie).",
    }
  ],
  serviceType: "VideographyService",
  priceRange: "$$$",
  coverImageUrl: "/images/services/video.png",
  coverImageAlt:
    "Tournage film corporate en entreprise — équipe Splice avec caméra cinéma",
  videoUrl: null,
  category: "video",
  sortOrder: 2,
  iconName: "video",
  teamMembers: ["TY", "LOUISIA"],
  deliverables: [
    { label: "Film monté HD/4K", detail: "Version longue + version courte" },
    { label: "Déclinaisons réseaux sociaux", detail: "3 à 5 formats" },
    { label: "Sous-titres français", detail: "Incrustés + fichier SRT" },
    { label: "Musique licenciée" },
    { label: "Brief créatif et script validé" },
  ],
  equipment: [
    { name: "Sony ZV1 / FX6", detail: "Caméra cinéma & vlog 4K" },
    { name: "Blackmagic Pocket 6K", detail: "Camera cinema compacte" },
    { name: "Sigma Art 24-70mm f/2.8 + 85mm f/1.4", detail: "Optiques professionnelles" },
    { name: "DJI Ronin RS3 Pro", detail: "Stabilisateur gimbale" },
    { name: "Aputure 300X + LS 600D", detail: "Eclairage LED cinema" },
  ],
  zoneText: ZONE_ORLEANS_TOURS,
  relatedSlugs: ["interview-temoignage", "presentation-entreprise", "montage-video"],
  isPublished: true,
};

// ---------------------------------------------------------------------------
// 3. Motion design
// ---------------------------------------------------------------------------

const motionDesign: ServiceContent = {
  slug: "motion-design",
  name: "Motion design et animation graphique",
  shortName: "Motion design",
  metaTitle: "Motion design animation graphique Orléans Tours | Splice",
  metaDescription:
    "Motion design sur mesure à Orléans et Tours : vidéos explicatives, intros animées. Animation 2D/3D pour marques exigeantes.",
  h1: "Vos idées complexes simplifiées grâce à l'animation graphique",
  introParagraph:
    "Nous concevons des vidéos animées 2D/3D sur mesure pour rendre vos messages clairs, ludiques et mémorables.",
  problemQuestion:
    "Pourquoi choisir le motion design pour présenter votre activité ?",
  problemAnswer:
    "Le motion design rend visuel ce qu'une caméra ne peut filmer. Il permet d'expliquer un concept abstrait, une application web ou des données chiffrées en quelques secondes.",
  features: [
    {
      h3: "Storyboard illustré étape par étape",
      content:
        "Nous concevons ensemble le scénario et le storyboard dessiné pour valider la direction artistique avant d'entamer l'animation.",
    },
    {
      h3: "Animation 2D/3D personnalisée",
      content:
        "Création d'animations fluides de typographies, schémas, icônes ou modélisations 3D, calées à 100 % sur votre charte graphique de marque.",
    },
    {
      h3: "Sound design et voix-off pro",
      content:
        "Enregistrement d'une voix narrative de qualité broadcast, synchronisée sur des effets sonores rythmés pour une immersion totale.",
    }
  ],
  faq: [
    {
      question: "Quel est le délai pour créer une animation ?",
      answer:
        "Il faut compter généralement 7 à 14 jours selon la longueur de la vidéo et la complexité des graphismes à animer.",
    },
    {
      question: "Quel est le budget de départ pour du motion design ?",
      answer:
        "Nos animations de motion design débutent à 29 € pour des habillages simples de <a href=\"/services/montage-video\" class=\"text-df-gold hover:underline\">montages vidéos</a>, ou s'intègrent dans nos abonnements mensuels dès 45 €/mois. Retrouvez tous nos détails sur notre grille de <a href=\"/tarifs\" class=\"text-df-gold hover:underline\">tarifs fixes</a>.",
    },
    {
      question: "Fournissez-vous les fichiers sources After Effects ?",
      answer:
        "Oui, en option sur demande. Nous pouvons également livrer au format Lottie pour une intégration hyper légère sur votre site web.",
    }
  ],
  serviceType: "GraphicDesignService",
  priceRange: "$$$",
  coverImageUrl: "/images/services/motion.png",
  coverImageAlt:
    "Animation motion design en cours de création — interface After Effects studio Splice",
  videoUrl: null,
  category: "motion",
  sortOrder: 3,
  iconName: "palette",
  teamMembers: ["TY", "LOUISIA"],
  deliverables: [
    { label: "Animation HD/4K", detail: "Durée selon brief" },
    { label: "Fichiers exportés", detail: "MP4, MOV, GIF selon besoin" },
    { label: "Storyboard illustré" },
    { label: "2 allers-retours de corrections" },
    { label: "Déclinaisons formats", detail: "Carré, vertical, horizontal" },
  ],
  equipment: [
    { name: "After Effects", detail: "Animation, compositing, expressions" },
    { name: "Cinema 4D", detail: "3D modélisation et rendu" },
    { name: "Illustrator", detail: "Création d’assets vectoriels" },
    { name: "Lottie", detail: "Export animations légères pour le web" },
  ],
  zoneText: ZONE_REMOTE,
  relatedSlugs: ["montage-video", "pub-reseaux-sociaux", "presentation-entreprise"],
  isPublished: true,
};

// ---------------------------------------------------------------------------
// 4. Publicité réseaux sociaux
// ---------------------------------------------------------------------------

const pubReseauxSociaux: ServiceContent = {
  slug: "pub-reseaux-sociaux",
  name: "Publicité réseaux sociaux",
  shortName: "Pubs réseaux sociaux",
  metaTitle: "Agence social media & pub vidéo Orléans | Splice",
  metaDescription:
    "Agence social media à Orléans : publicités vidéo pour Reels, TikTok, Facebook Ads et YouTube Shorts. Hooks, format vertical et copywriting ROI.",
  h1: "Des publicités vidéo percutantes qui multiplient vos conversions",
  introParagraph:
    "Agence social media à Orléans et Tours, nous concevons des vidéos mobiles au format vertical natif pour stopper le défilement et générer des ventes.",
  problemQuestion:
    "Pourquoi vos vidéos de vente actuelles manquent-elles de performance ?",
  problemAnswer:
    "Sur mobile, vous avez moins de 3 secondes pour capter l'intérêt. Nos formats intègrent des accroches visuelles et un rythme calibrés pour retenir l'attention.",
  features: [
    {
      h3: "Copywriting vidéo orienté ROI",
      content:
        "Rédaction de scripts percutants axés sur la résolution des problèmes de votre cible pour inciter à l'action immédiate.",
    },
    {
      h3: "Optimisation verticale mobile (9:16)",
      content:
        "Tournages, cadrages et habillages pensés à 100 % pour le mobile pour occuper pleinement l'écran sur Instagram, TikTok et YouTube Shorts.",
    },
    {
      h3: "Sous-titres dynamiques natifs",
      content:
        "Intégration de sous-titres animés et rythmés, indispensables pour accrocher l'audience naviguant sans le son.",
    },
    {
      h3: "Agence social media & contenu régulier",
      content:
        "Au-delà de la pub à l'unité, nous accompagnons votre présence sociale dans la durée avec des packs mensuels de contenus pensés pour nourrir vos comptes.",
    }
  ],
  faq: [
    {
      question: "Êtes-vous une agence social media ?",
      answer:
        "Oui. Splice agit comme agence social media pour les marques d'Orléans et de Tours : création de contenus vidéo, publicités et accompagnement régulier. Pour une approche globale (image, événementiel, stratégie), découvrez notre <a href=\"/agence-communication-orleans\" class=\"text-df-gold hover:underline\">agence de communication à Orléans</a>.",
    },
    {
      question: "Quel est le tarif d'un pack publicitaire ?",
      answer:
        "Nos offres de publicité vidéo démarrent à 29 € pour le <a href=\"/services/montage-video\" class=\"text-df-gold hover:underline\">montage</a> d'un format court à l'unité, ou à 45 €/mois via nos abonnements. Pour un projet complet incluant un tournage de <a href=\"/services/production-corporate\" class=\"text-df-gold hover:underline\">film corporate</a>, consultez notre grille de <a href=\"/tarifs\" class=\"text-df-gold hover:underline\">tarifs fixes</a>.",
    },
    {
      question: "Quelle est la durée idéale pour une publicité mobile ?",
      answer:
        "Nous recommandons un format très dynamique compris entre 15 et 30 secondes pour maximiser le taux de complétion.",
    },
    {
      question: "Proposez-vous des variantes pour les tests A/B ?",
      answer:
        "Oui. Nos packs publicitaires intègrent plusieurs introductions (hooks) alternatives pour optimiser les résultats de vos campagnes.",
    }
  ],
  serviceType: "AdvertisingService",
  priceRange: "$$",
  coverImageUrl: "/images/services/video.png",
  coverImageAlt:
    "Tournage publicité vidéo verticale pour réseaux sociaux — Splice Orléans",
  videoUrl: null,
  category: "video",
  sortOrder: 4,
  iconName: "megaphone",
  teamMembers: ["TY", "LOUISIA"],
  deliverables: [
    { label: "Vidéos publicitaires montées", detail: "1 à 5 déclinaisons" },
    { label: "Formats 9:16, 1:1, 16:9" },
    { label: "Sous-titres animés intégrés" },
    { label: "Variantes A/B", detail: "Hooks et durées alternatives" },
    { label: "Exports optimisés par plateforme" },
  ],
  equipment: [
    { name: "Sony ZV-E1", detail: "Captation vidéo compacte full frame" },
    { name: "iPhone Pro", detail: "Contenus authentiques et spontanés" },
    { name: "DJI OM6", detail: "Stabilisateur smartphone" },
    { name: "Premiere Pro", detail: "Montage et export multi-formats" },
  ],
  zoneText: ZONE_ORLEANS_TOURS,
  relatedSlugs: ["montage-video", "photographie-professionnelle", "production-corporate"],
  isPublished: true,
};

// ---------------------------------------------------------------------------
// 5. Shooting automobile
// ---------------------------------------------------------------------------

const shootingAutomobile: ServiceContent = {
  slug: "shooting-automobile",
  name: "Shooting photo & vidéo automobile",
  shortName: "Shooting automobile",
  metaTitle: "Photographe automobile Orléans & Tours | Splice Studio",
  metaDescription:
    "Photographe automobile à Orléans : voitures de luxe, tuning, moto. Shooting auto pour particuliers, garages et concessions. Rendu pro, livraison rapide.",
  h1: "Photographe & vidéaste automobile à Orléans",
  introParagraph:
    "Photographe automobile à Orléans et Tours, nous réalisons des photos et vidéos haut de gamme de voitures de luxe, de préparations tuning et de motos — pour les particuliers, les garages, concessions et collectionneurs privés.",
  problemQuestion:
    "Pourquoi faire appel à un photographe automobile professionnel ?",
  problemAnswer:
    "L'automobile exige une maîtrise technique des reflets, de la lumière et du mouvement. Nos visuels haut de gamme créent le coup de cœur immédiat, que ce soit pour une annonce de vente ou la communication d'un garage.",
  features: [
    {
      h3: "Voitures de luxe & sportives",
      content:
        "Mise en valeur des lignes, des matières et des détails de vos véhicules d'exception, en extérieur comme en studio, pour un rendu digne d'un magazine automobile.",
    },
    {
      h3: "Tuning & préparations",
      content:
        "Photos qui révèlent le caractère d'une préparation : jantes, échappement, covering, ambiance nocturne. Le rendu valorise le travail réalisé sur le véhicule.",
    },
    {
      h3: "Shooting moto",
      content:
        "Captation dynamique ou posée de votre moto, avec un éclairage qui souligne le réservoir, le moteur et les chromes pour un visuel percutant.",
    },
    {
      h3: "Rolling shots et prises dynamiques",
      content:
        "Photos spectaculaires prises en mouvement de voiture à voiture avec un système de stabilisation professionnel, pour un rendu cinéma.",
    },
    {
      h3: "Studio, light painting & retouche magazine",
      content:
        "Ambiances lumineuses de prestige (néons, peinture de lumière), nettoyage des reflets parasites et étalonnage précis des teintes de carrosserie.",
    },
    {
      h3: "Pour garages, concessions & revendeurs",
      content:
        "Packs de visuels homogènes pour vos annonces, votre site et vos réseaux : un catalogue cohérent qui accélère la vente et renforce votre image.",
    }
  ],
  faq: [
    {
      question: "Quel est le tarif d'un shooting automobile ?",
      answer:
        "Nos prestations photo automobile débutent à seulement 15 € pour un pack de 5 photos essentielles, et à 29 € pour les montages vidéo. Pour estimer précisément votre projet (avec roulage, rolling shots, etc.), configurez votre demande sur notre <a href=\"/devis\" class=\"text-df-gold hover:underline\">simulateur de devis</a> ou consultez nos <a href=\"/tarifs\" class=\"text-df-gold hover:underline\">tarifs fixes</a>.",
    },
    {
      question: "Combien de photos retouchées livrez-vous ?",
      answer:
        "Vous recevez entre 20 et 50 clichés haute résolution optimisés pour le web et l'impression, livrés via une galerie privée.",
    },
    {
      question: "Quelle est la durée à prévoir pour la séance ?",
      answer:
        "Prévoyez 2 à 4 heures de tournage/prise de vue pour capter parfaitement toutes les configurations du véhicule et faire les roulages.",
    }
  ],
  serviceType: "PhotographyService",
  priceRange: "$$",
  coverImageUrl: "/images/services/photo.png",
  coverImageAlt:
    "Shooting photo automobile Porsche en studio — éclairage créatif Splice",
  videoUrl: null,
  category: "photo",
  sortOrder: 5,
  iconName: "car",
  teamMembers: ["TY", "LOUISIA"],
  deliverables: [
    { label: "Photos HD retouchées", detail: "20 à 50 clichés selon le pack" },
    { label: "Vidéo teaser", detail: "30 à 60 secondes (option)" },
    { label: "Rolling shots", detail: "Photo et/ou vidéo" },
    { label: "Galerie en ligne privée" },
    { label: "Exports web + print", detail: "JPEG, TIFF, PNG" },
  ],
  equipment: [
    { name: "Sony A7R V", detail: "61 MP, autofocus IA" },
    { name: "Sigma Art 35mm f/1.4", detail: "Optique prime grand angle" },
    { name: "Sigma Art 90mm Macro", detail: "Détails et textures" },
    { name: "Hexlight LED", detail: "Éclairage studio hexagonal" },
    { name: "DJI RS3", detail: "Véhicule suiveur stabilisé" },
  ],
  zoneText: ZONE_ORLEANS_TOURS,
  relatedSlugs: ["photographie-professionnelle", "pub-reseaux-sociaux", "production-corporate"],
  isPublished: true,
};

// ---------------------------------------------------------------------------
// 6. Photographie professionnelle
// ---------------------------------------------------------------------------

const photographieProfessionnelle: ServiceContent = {
  slug: "photographie-professionnelle",
  name: "Photographie professionnelle",
  shortName: "Photographie pro",
  metaTitle: "Photographe professionnel Orléans & Tours | Splice Studio",
  metaDescription:
    "Photographe professionnel à Orléans et Tours : portraits corporate, reportages métier, packshots produits et immobilier. Photographe freelance réactif.",
  h1: "Photographe professionnel à Orléans",
  introParagraph:
    "Photographe professionnel à Orléans et Tours, nous réalisons portraits d'équipe, reportages métier, packshots produits et photos immobilier. Une approche de photographe freelance, réactive et proche de vos besoins, pour inspirer confiance au premier regard.",
  problemQuestion:
    "Pourquoi investir dans des photos sur mesure plutôt qu'en banque d'images ?",
  problemAnswer:
    "Vos prospects veulent voir la réalité de votre activité, vos collaborateurs et vos locaux. Des images réelles renforcent votre marque employeur et vos ventes.",
  features: [
    {
      h3: "Portraits corporate soignés",
      content:
        "Photos individuelles ou de groupe en studio mobile ou lumière naturelle, idéales pour LinkedIn et votre communication d'entreprise.",
    },
    {
      h3: "Reportage métier sur site",
      content:
        "Immersion dans vos ateliers ou bureaux pour photographier vos gestes techniques et documenter votre savoir-faire de façon authentique.",
    },
    {
      h3: "Packshots produits e-commerce",
      content:
        "Photographies produits d'une netteté absolue, sur fond neutre ou en ambiance, prêtes à l'intégration pour votre boutique en ligne.",
    }
  ],
  faq: [
    {
      question: "Quel est le coût d'un reportage photo ?",
      answer:
        "Nos forfaits photo débutent à 15 € pour un pack de 5 photos. Pour des projets événementiels ou portraits d'équipe sur mesure, consultez notre grille complète de <a href=\"/tarifs\" class=\"text-df-gold hover:underline\">tarifs fixes</a>. Si vous possédez un véhicule d'exception, découvrez notre offre de <a href=\"/services/shooting-automobile\" class=\"text-df-gold hover:underline\">shooting automobile</a>.",
    },
    {
      question: "Sous quel délai livrez-vous les clichés ?",
      answer:
        "Toutes les photos sélectionnées et retouchées vous sont remises sous 7 à 14 jours après la séance via une galerie en ligne.",
    },
    {
      question: "Travaillez-vous en freelance ?",
      answer:
        "Oui. Splice intervient avec la souplesse d'un photographe freelance / auto-entrepreneur : un interlocuteur direct, des délais réactifs et des formules à la carte, tout en conservant un niveau d'exigence professionnel sur la prise de vue et la retouche.",
    },
    {
      question: "Comment trouver un photographe autour de moi à Orléans ?",
      answer:
        "Nous nous déplaçons dans vos locaux partout à Orléans, à Tours et dans le Loiret. Vous pouvez nous retrouver via notre fiche établissement et notre page de contact, ou demander un devis en ligne pour fixer la date et le lieu de la séance.",
    },
    {
      question: "Proposez-vous des collaborations régulières ?",
      answer:
        "Oui, nos formules d'abonnement (mensuel ou trimestriel) vous permettent d'alimenter vos canaux de communication en contenus frais.",
    }
  ],
  serviceType: "PhotographyService",
  priceRange: "$$",
  coverImageUrl: "/images/services/photo.png",
  coverImageAlt:
    "Séance photo portrait corporate en entreprise — photographe Splice Orléans",
  videoUrl: null,
  category: "photo",
  sortOrder: 6,
  iconName: "camera",
  teamMembers: ["TY", "LOUISIA"],
  deliverables: [
    { label: "Photos HD retouchées", detail: "Sélection + retouche complète" },
    { label: "Galerie en ligne privée", detail: "Téléchargement sécurisé" },
    { label: "Exports web + print", detail: "JPEG, TIFF, PNG" },
    { label: "Détourage produits", detail: "Pour packshots e-commerce" },
  ],
  equipment: [
    { name: "Sony A7R V", detail: "61 MP, autofocus IA" },
    { name: "Sigma Art 24-70mm f/2.8", detail: "Polyvalence studio et reportage" },
    { name: "Sigma Art 85mm f/1.4", detail: "Portrait et bokeh" },
    { name: "Godox AD400 Pro", detail: "Flash studio portable" },
    { name: "X-Rite ColorChecker", detail: "Calibration couleur fidèle" },
  ],
  zoneText: ZONE_ORLEANS_TOURS,
  relatedSlugs: ["shooting-automobile", "pub-reseaux-sociaux", "production-corporate"],
  isPublished: true,
};

// ---------------------------------------------------------------------------
// 6b. Photographie Google Business Profile
// ---------------------------------------------------------------------------

const photographieGoogleBusiness: ServiceContent = {
  slug: "photographie-google-business",
  name: "Photographie Google Business Profile",
  shortName: "Photo Google Business",
  metaTitle: "Photographe Google Business Profile Orléans Tours | Splice",
  metaDescription:
    "Optimisez votre fiche Google Business Profile à Orléans et Tours. Photos professionnelles d'établissement, portraits d'équipe et packshots locaux certifiés SEO.",
  h1: "Photographe Google Business Profile & Référencement Local",
  introParagraph:
    "Nous réalisons des shootings photo professionnels optimisés pour votre Fiche Établissement Google afin de booster votre visibilité dans le Pack Local et d'attirer plus de clients.",
  problemQuestion:
    "Pourquoi les photos de votre fiche Google Business Profile sont-elles cruciales ?",
  problemAnswer:
    "Une fiche Google contenant des photos professionnelles récentes génère 35% de clics en plus vers votre site web et 42% de demandes d'itinéraires en plus. C'est le premier point de contact avec vos clients locaux.",
  features: [
    {
      h3: "Shooting extérieur & vitrine",
      content:
        "Mise en valeur de votre façade et de votre enseigne pour faciliter la localisation de votre commerce et inciter à la visite physique.",
    },
    {
      h3: "Intérieurs & ambiance chaleureuse",
      content:
        "Prises de vue de vos espaces de vente, bureaux ou ateliers sous leur meilleur jour avec un éclairage soigné pour rassurer vos visiteurs.",
    },
    {
      h3: "Portraits de l'équipe en action",
      content:
        "Photos de vos collaborateurs accueillants et professionnels pour humaniser votre fiche établissement et instaurer une relation de confiance.",
    },
    {
      h3: "Formatage et métadonnées SEO",
      content:
        "Optimisation des dimensions, du poids et de la qualité des fichiers selon les recommandations strictes de Google pour un affichage optimal et un meilleur référencement local."
    }
  ],
  faq: [
    {
      question: "Quel est l'impact réel des photos sur le référencement local ?",
      answer:
        "Google favorise les fiches actives qui publient régulièrement des images de qualité. Les photos professionnelles augmentent le taux de clic (CTR), un signal fort utilisé par l'algorithme pour classer votre commerce dans les premiers résultats de recherche locale.",
    },
    {
      question: "Combien coûte un shooting photo Google Business Profile ?",
      answer:
        "Nos tarifs pour un shooting de fiche établissement débutent à 190 € pour un forfait de base comprenant 15 photos optimisées. Vous pouvez consulter notre page de <a href=\"/tarifs\" class=\"text-df-gold hover:underline\">tarifs fixes</a> ou faire une simulation sur notre <a href=\"/devis\" class=\"text-df-gold hover:underline\">simulateur de devis</a>.",
    },
    {
      question: "Combien de temps dure la séance photo sur place ?",
      answer:
        "Prévoyez généralement entre 1h et 2h d'intervention dans vos locaux. Nous intervenons en dehors de vos heures d'affluence pour ne pas perturber vos clients.",
    },
    {
      question: "Gérez-vous la publication des photos sur ma fiche ?",
      answer:
        "Nous vous livrons les fichiers au format idéal prêts à être téléversés. En option, nous pouvons nous charger de l'intégration et de l'optimisation directement sur votre compte Google Business Profile.",
    }
  ],
  serviceType: "PhotographyService",
  priceRange: "$$",
  coverImageUrl: "/images/services/photo.png",
  coverImageAlt:
    "Optimisation de fiche Google Business Profile avec photos professionnelles d'établissement — Splice Studio",
  videoUrl: null,
  category: "photo",
  sortOrder: 7,
  iconName: "camera",
  teamMembers: ["TY", "LOUISIA"],
  deliverables: [
    { label: "Photos d'établissement HD", detail: "Extérieur, intérieur, équipe" },
    { label: "Optimisation de format", detail: "Fichiers compressés spécial Google Web" },
    { label: "Intégration Google Map (option)", detail: "Publication et géolocalisation" },
    { label: "Droits d'utilisation commerciaux", detail: "Inclus sans limite de durée" },
  ],
  equipment: [
    { name: "Sony A7R V", detail: "Capteur 61 MP pour des détails parfaits" },
    { name: "Objectif grand angle 16-35mm f/2.8", detail: "Idéal pour valoriser l'espace intérieur" },
    { name: "Trépied et têtes panoramiques", detail: "Alignements verticaux rigoureux" },
    { name: "Éclairage d'appoint LED portable", detail: "Débouchage des ombres" },
  ],
  zoneText: ZONE_ORLEANS_TOURS,
  relatedSlugs: ["photographie-professionnelle", "production-corporate", "presentation-entreprise"],
  isPublished: true,
};


// ---------------------------------------------------------------------------
// 7. Interview et témoignage d'entreprise
// ---------------------------------------------------------------------------

const interviewTemoignage: ServiceContent = {
  slug: "interview-temoignage",
  name: "Interview et témoignage d’entreprise",
  shortName: "Interview & témoignage",
  metaTitle: "Interview vidéo témoignage entreprise Orléans Tours | Splice",
  metaDescription:
    "Interviews vidéo professionnelles à Orléans et Tours. Témoignages clients, portraits dirigeants, équipement multi-caméras.",
  h1: "Créez une confiance immédiate avec le témoignage client",
  introParagraph:
    "Donnez la parole à vos clients satisfaits et à vos collaborateurs à travers des formats d'interviews dynamiques.",
  problemQuestion:
    "Pourquoi la vidéo témoignage est-elle le meilleur outil de conversion ?",
  problemAnswer:
    "Un avis écrit peut être mis en doute. Un client qui parle sincèrement de son expérience face caméra constitue la preuve sociale la plus rassurante.",
  features: [
    {
      h3: "Interviews clients naturelles",
      content:
        "Nous guidons l'entretien avec empathie pour obtenir un discours fluide et convaincant, sans aspect récité.",
    },
    {
      h3: "Valorisation marque employeur",
      content:
        "Filmez vos collaborateurs pour exprimer les valeurs de votre entreprise et dynamiser vos recrutements (RH).",
    },
    {
      h3: "Technique haut de gamme & prompteur",
      content:
        "Setup multi-caméras 4K, micros cravates professionnels et prompteur de lecture pour mettre vos collaborateurs en confiance.",
    }
  ],
  faq: [
    {
      question: "Comment rassurez-vous les personnes devant la caméra ?",
      answer:
        "Nous échangeons de façon conviviale avant d'enregistrer et pouvons utiliser un prompteur pour sécuriser la prise de parole.",
    },
    {
      question: "Combien coûte une interview d'entreprise ?",
      answer:
        "Nos prestations d'interviews débutent à 29 € pour la partie <a href=\"/services/montage-video\" class=\"text-df-gold hover:underline\">montage</a>. Pour y ajouter le tournage de <a href=\"/services/production-corporate\" class=\"text-df-gold hover:underline\">film corporate</a>, vous pouvez estimer votre budget via notre <a href=\"/devis\" class=\"text-df-gold hover:underline\">simulateur de devis</a> ou consulter nos <a href=\"/tarifs\" class=\"text-df-gold hover:underline\">tarifs fixes</a>.",
    },
    {
      question: "Gérez-vous la trame éditoriale des questions ?",
      answer:
        "Oui. Nous validons ensemble les questions et l'angle stratégique du message en amont du tournage.",
    }
  ],
  serviceType: "VideographyService",
  priceRange: "$$",
  coverImageUrl: "/images/services/video.png",
  coverImageAlt:
    "Tournage interview vidéo en entreprise — setup multi-caméra Splice",
  videoUrl: null,
  category: "video",
  sortOrder: 8,
  iconName: "user",
  teamMembers: ["TY", "LOUISIA"],
  deliverables: [
    { label: "Interview montée HD/4K", detail: "Version longue + courte" },
    { label: "Déclinaisons réseaux sociaux", detail: "Extraits 30s à 60s" },
    { label: "Sous-titres intégrés", detail: "Français + option anglais" },
    { label: "Habillage graphique", detail: "Titrages, lower thirds" },
  ],
  equipment: [
    { name: "Setup 2-3 caméras Sony ZV1", detail: "Multi-angle vlog & interview" },
    { name: "Aputure 300X + LS 600D", detail: "Éclairage interview doux" },
    { name: "Prompteur", detail: "Confort pour les intervenants" },
    { name: "DPA 4060", detail: "Micro-cravate broadcast" },
  ],
  zoneText: ZONE_ORLEANS_TOURS,
  relatedSlugs: ["production-corporate", "presentation-entreprise", "voix-off-sound-design"],
  isPublished: true,
};

// ---------------------------------------------------------------------------
// 8. Voix-off et sound design
// ---------------------------------------------------------------------------

const voixOffSoundDesign: ServiceContent = {
  slug: "voix-off-sound-design",
  name: "Voix-off et sound design",
  shortName: "Voix-off & sound design",
  metaTitle: "Voix-off sound design Orléans Tours | Splice",
  metaDescription:
    "Enregistrement voix-off et mixage audio à Orléans et Tours. Voix-off narrative professionnelle et design sonore premium.",
  h1: "Donnez une voix et une identité sonore à votre marque",
  introParagraph:
    "Enregistrements de voix-off narratives et habillages sonores pour captiver votre audience à 100%.",
  problemQuestion:
    "Pourquoi la qualité audio de votre vidéo est-elle primordiale ?",
  problemAnswer:
    "Une audience tolère une image moyenne mais quitte instantanément une vidéo dont le son grésille ou est inaudible. L'audio double l'impact perçu.",
  features: [
    {
      h3: "Enregistrement voix professionnelle",
      content:
        "Accès à un large catalogue de voix masculines/féminines enregistrées dans notre studio isolé acoustiquement pour une clarté absolue.",
    },
    {
      h3: "Habillage sonore & bruitage",
      content:
        "Création d'effets sonores, de transitions et d'ambiances acoustiques uniques pour donner du relief à vos visuels.",
    },
    {
      h3: "Mixage et mastering plateforme",
      content:
        "Traitement des voix et égalisation des volumes audio conformes aux exigences techniques (LUFS) des réseaux et de la TV.",
    }
  ],
  faq: [
    {
      question: "Quel est le coût d'un enregistrement voix-off ?",
      answer:
        "Nos options de voix-off professionnelle débutent à seulement 12 € par vidéo en option à la carte, ou à 29 € pour un pack de montage complet. Tous les prix sont détaillés sur notre page de <a href=\"/tarifs\" class=\"text-df-gold hover:underline\">tarifs fixes</a>.",
    },
    {
      question: "Proposez-vous des voix en langues étrangères ?",
      answer:
        "Oui, nous disposons de comédiens voix natifs français, anglais et dans d'autres langues pour vos projets internationaux.",
    },
    {
      question: "Le sound design est-il inclus par défaut ?",
      answer:
        "Un design sonore standard est inclus dans nos offres de <a href=\"/services/montage-video\" class=\"text-df-gold hover:underline\">montage vidéo</a>. Les créations complexes font l'objet d'un chiffrage spécifique.",
    }
  ],
  serviceType: "AudioService",
  priceRange: "$$",
  coverImageUrl: "/images/services/audio.png",
  coverImageAlt:
    "Studio d’enregistrement voix-off et sound design — Splice Orléans",
  videoUrl: null,
  category: "audio",
  sortOrder: 9,
  iconName: "mic",
  teamMembers: ["TY", "LOUISIA"],
  deliverables: [
    { label: "Fichier voix-off", detail: "WAV 48kHz/24bit" },
    { label: "Sound design complet", detail: "Ambiances, bruitages, effets" },
    { label: "Mixage et mastering", detail: "Normes LUFS par plateforme" },
    { label: "Musique licenciée", detail: "Droits inclus" },
  ],
  equipment: [
    { name: "Studio traité acoustiquement", detail: "Isolation et absorption" },
    { name: "Neumann TLM 103", detail: "Micro condensateur broadcast" },
    { name: "Universal Audio Apollo Twin MKII", detail: "Interface audio et préamplis" },
    { name: "Logic Pro X", detail: "Mixage, mastering et sound design" },
  ],
  zoneText: ZONE_REMOTE,
  relatedSlugs: ["montage-video", "production-corporate", "interview-temoignage"],
  isPublished: true,
};

// ---------------------------------------------------------------------------
// 9. Film de présentation d'entreprise
// ---------------------------------------------------------------------------

const presentationEntreprise: ServiceContent = {
  slug: "presentation-entreprise",
  name: "Film de présentation d’entreprise",
  shortName: "Film d’entreprise",
  metaTitle: "Film présentation entreprise Orléans Tours | Splice",
  metaDescription:
    "Film vitrine de présentation d'entreprise à Orléans et Tours. Racontez votre expertise en vidéo de prestige.",
  h1: "Votre meilleur ambassadeur commercial en 3 minutes",
  introParagraph:
    "Un film vitrine haut de gamme qui transmet vos valeurs et votre savoir-faire pour séduire prospects et partenaires.",
  problemQuestion:
    "Pourquoi chaque entreprise a-t-elle besoin d'un film vitrine ?",
  problemAnswer:
    "Un film de présentation est le moyen le plus rapide d'humaniser votre marque, de marquer durablement les esprits et de devancer vos concurrents.",
  features: [
    {
      h3: "Scénarisation et concept uniques",
      content:
        "Nous construisons un récit captivant adapté à vos objectifs commerciaux et à votre charte d'entreprise.",
    },
    {
      h3: "Tournage cinématique soigné",
      content:
        "Prises de vue terrestres cinématiques 4K mettant en valeur vos équipes et vos infrastructures de façon professionnelle.",
    },
    {
      h3: "Habillage de marque sur mesure",
      content:
        "Intégration d'animations graphiques stylisées pour valoriser vos chiffres clés et vos éléments textuels.",
    }
  ],
  faq: [
    {
      question: "Quelle est la durée idéale d'un film vitrine ?",
      answer:
        "Nous recommandons un format équilibré de 2 à 3 minutes pour retenir l'attention de vos prospects du début à la fin.",
    },
    {
      question: "Quel budget faut-il prévoir pour un film complet ?",
      answer:
        "Le <a href=\"/services/montage-video\" class=\"text-df-gold hover:underline\">montage</a> d'un film de présentation débute à 29 €. Pour une production complète incluant le tournage dans vos locaux, estimez votre budget sur notre <a href=\"/devis\" class=\"text-df-gold hover:underline\">générateur de devis</a> ou sur notre page <a href=\"/tarifs\" class=\"text-df-gold hover:underline\">tarifs fixes</a>.",
    },
    {
      question: "Pouvons-nous décliner le film principal ?",
      answer:
        "Absolument, nous extrayons des formats courts de 30 secondes pour alimenter vos réseaux et vos campagnes publicitaires.",
    }
  ],
  serviceType: "VideographyService",
  priceRange: "$$$",
  coverImageUrl: "/images/services/video.png",
  coverImageAlt:
    "Tournage film de présentation d’entreprise — équipe Splice en action",
  videoUrl: null,
  category: "video",
  sortOrder: 10,
  iconName: "building",
  teamMembers: ["TY", "LOUISIA"],
  deliverables: [
    { label: "Film monté HD/4K", detail: "Version longue (2-5 min)" },
    { label: "Version courte réseaux sociaux", detail: "30 à 90 secondes" },
    { label: "Sous-titres", detail: "Français + anglais (option)" },
    { label: "Motion design intégré", detail: "Titrages, transitions, générique" },
    { label: "Script et storyboard validés" },
    { label: "Musique licenciée" },
  ],
  equipment: [
    { name: "Sony FX6", detail: "Caméra cinéma full frame" },
    { name: "DJI RS3 Pro", detail: "Stabilisateur professionnel" },
    { name: "Aputure kit complet", detail: "300X, LS 600D, panneaux LED" },
  ],
  zoneText: ZONE_ORLEANS_TOURS,
  relatedSlugs: ["production-corporate", "interview-temoignage", "motion-design"],
  isPublished: true,
};

// ---------------------------------------------------------------------------
// 10. Clip musical (COMING SOON)
// ---------------------------------------------------------------------------

const clipMusical: ServiceContent = {
  slug: "clip-musical",
  name: "Clip musical et vidéoclip",
  shortName: "Clip musical",
  metaTitle: "Clip musical vidéoclip Orléans Tours | Splice",
  metaDescription:
    "Réalisation de clips musicaux artistiques à Orléans et Tours. Univers cinématographique de haute qualité pour artistes.",
  h1: "Donnez une dimension cinématographique à votre musique",
  introParagraph:
    "Nous traduisons votre univers artistique en une œuvre visuelle unique conçue pour marquer les esprits.",
  problemQuestion:
    "Pourquoi un clip professionnel est-il crucial pour votre sortie ?",
  problemAnswer:
    "Dans un marché saturé, l'image est indispensable pour capter l'intérêt des médias et étendre votre audience sur YouTube et les réseaux sociaux.",
  features: [
    {
      h3: "Direction artistique & Concept",
      content:
        "Création de concepts visuels et de scénarios en harmonie avec le style de votre morceau et vos influences.",
    },
    {
      h3: "Esthétique cinéma & Lumières",
      content:
        "Utilisation de caméras cinéma grand capteur et de configurations d'éclairages élaborées pour un look authentique.",
    },
    {
      h3: "Post-production & Color grading",
      content:
        "Montage rythmé au tempo de votre titre et étalonnage poussé des couleurs pour signer l'esthétique du clip.",
    }
  ],
  faq: [
    {
      question: "Quel budget faut-il prévoir pour un clip ?",
      answer:
        "Le montage de clip musical débute à 29 € à l'unité. Pour une réalisation complète (tournage, éclairages) avec intégration de <a href=\"/services/motion-design\" class=\"text-df-gold hover:underline\">motion design</a>, consultez nos <a href=\"/tarifs\" class=\"text-df-gold hover:underline\">tarifs fixes</a> ou faites une simulation de devis.",
    },
    {
      question: "Combien de temps dure la production ?",
      answer:
        "Comptez entre 3 et 6 semaines. La phase d'écriture et de repérage des spots prend la plus grande partie du calendrier.",
    },
    {
      question: "Travaillez-vous avec des artistes indépendants ?",
      answer:
        "Absolument, nous aimons collaborer avec la scène émergente et concevons des projets ambitieux adaptés à vos moyens.",
    }
  ],
  serviceType: "VideographyService",
  priceRange: "$$$",
  coverImageUrl: "/images/services/video.png",
  coverImageAlt:
    "Tournage clip musical en extérieur — réalisation cinéma Splice",
  videoUrl: null,
  category: "video",
  sortOrder: 11,
  iconName: "music",
  teamMembers: ["TY", "LOUISIA"],
  deliverables: [
    { label: "Clip monté HD/4K", detail: "Durée du morceau" },
    { label: "Teaser promotionnel", detail: "15 à 30 secondes" },
    { label: "Étalonnage cinéma", detail: "Color grading sur mesure" },
    { label: "Concept créatif et moodboard" },
    { label: "Behind the scenes", detail: "Photos + vidéo (option)" },
  ],
  equipment: [],
  zoneText: ZONE_ORLEANS_TOURS,
  relatedSlugs: ["montage-video", "motion-design", "voix-off-sound-design"],
  isPublished: false,
};

// ---------------------------------------------------------------------------
// 11. Drone et prise de vue aérienne (COMING SOON)
// ---------------------------------------------------------------------------

const dronePriseDeVue: ServiceContent = {
  slug: "drone-prise-de-vue-aerienne",
  name: "Drone et prise de vue aérienne",
  shortName: "Prise de vue drone",
  metaTitle: "Drone prise de vue aérienne Orléans Tours | Splice",
  metaDescription:
    "Prises de vues aériennes par drone à Orléans et Tours. Vidéo 4K et photos certifiées DGAC pour l'immobilier et le corporate.",
  h1: "Prenez de la hauteur avec des prises de vue spectaculaires",
  introParagraph:
    "Valorisez vos chantiers, vos bâtiments et vos événements sous un angle unique grâce au drone 4K.",
  problemQuestion:
    "Quand faut-il intégrer des images par drone dans votre communication ?",
  problemAnswer:
    "Le survol aérien est idéal pour témoigner de l'ampleur d'un site industriel, d'un domaine ou pour donner du souffle et du prestige à un film.",
  features: [
    {
      h3: "Vidéo 4K stable et fluide",
      content:
        "Mouvements de caméras lents et cinématiques (orbitales, travellings) sur nacelle stabilisée 3 axes pour un rendu parfait.",
    },
    {
      h3: "Photos haute résolution",
      content:
        "Photographies aériennes haute définition pour valoriser un patrimoine immobilier, guider un suivi de chantier ou l'architecture.",
    },
    {
      h3: "Pilote agréé et conformité DGAC",
      content:
        "Le respect strict des règles de sécurité de l'espace aérien et la gestion intégrale des demandes d'autorisation préfectorales.",
    }
  ],
  faq: [
    {
      question: "Quel est le tarif d'une mission de vol drone ?",
      answer:
        "Nos prises de vue aériennes débutent à 15 € pour un pack de 5 photos et à 29 € pour le montage vidéo. Pour des vols nécessitant des autorisations spécifiques, découvrez tous nos packs sur notre page de <a href=\"/tarifs\" class=\"text-df-gold hover:underline\">tarifs fixes</a>, et associez-les à nos <a href=\"/services/presentation-entreprise\" class=\"text-df-gold hover:underline\">films de présentation d'entreprise</a> ou à nos <a href=\"/services/shooting-automobile\" class=\"text-df-gold hover:underline\">shootings automobile</a>.",
    },
    {
      question: "Que se passe-t-il en cas de mauvaise météo ?",
      answer:
        "En cas de conditions de sécurité compromises (pluie, vent fort), la mission est reportée sans aucun frais pour vous.",
    },
    {
      question: "Qu'en est-il du survol en agglomération ?",
      answer:
        "Nous prenons en charge toutes les demandes d'autorisation spécifiques auprès de la préfecture de la région concernée.",
    }
  ],
  serviceType: "VideographyService",
  priceRange: "$$",
  coverImageUrl: "/images/services/video.png",
  coverImageAlt:
    "Prise de vue aérienne par drone au-dessus de la Loire — Splice Orléans",
  videoUrl: null,
  category: "video",
  sortOrder: 12,
  iconName: "plane",
  teamMembers: ["TY", "LOUISIA"],
  deliverables: [
    { label: "Vidéo aérienne 4K", detail: "Plans stabilisés" },
    { label: "Photos aériennes HD", detail: "Retouchées et calibrées" },
    { label: "Autorisations de vol", detail: "Déclarations DGAC incluses" },
    { label: "Intégration montage", detail: "Si couplé à une production vidéo" },
  ],
  equipment: [],
  zoneText:
    "Nous réalisons des prises de vue aériennes à Orléans, Tours et dans tout le Centre-Val de Loire (Loiret, Indre-et-Loire, Loir-et-Cher). Les vols en zone urbaine nécessitent des autorisations spécifiques que nous gérons intégralement. Déplacements possibles dans toute la France.",
  relatedSlugs: ["production-corporate", "shooting-automobile", "presentation-entreprise"],
  isPublished: false,
};

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const SERVICES_CONTENT: ServiceContent[] = [
  montageVideo,
  productionCorporate,
  motionDesign,
  pubReseauxSociaux,
  shootingAutomobile,
  photographieProfessionnelle,
  photographieGoogleBusiness,
  interviewTemoignage,
  voixOffSoundDesign,
  presentationEntreprise,
  clipMusical,
  dronePriseDeVue,
];
