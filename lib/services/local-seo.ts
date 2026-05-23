/**
 * Static data for geo-local SEO pages.
 *
 * Provides content for 24 pages (6 services x 4 villes) at `/services/[slug]/[ville]`.
 * Entirely static — no database calls.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Ville {
  slug: string;
  name: string;
  department: string;
  departmentCode: string;
}

export type LocalServiceSlug =
  | "montage-video"
  | "production-corporate"
  | "motion-design"
  | "pub-reseaux-sociaux"
  | "photographie-professionnelle"
  | "interview-temoignage";

export interface LocalServiceTemplate {
  serviceName: string;
  shortName: string;
  h1Template: string;
  introTemplate: string;
  points: string[];
  deliveryTime: string;
  priceRange: string;
}

// ---------------------------------------------------------------------------
// Villes
// ---------------------------------------------------------------------------

export const VILLES: Ville[] = [
  {
    slug: "orleans",
    name: "Orléans",
    department: "Loiret",
    departmentCode: "45",
  },
  {
    slug: "tours",
    name: "Tours",
    department: "Indre-et-Loire",
    departmentCode: "37",
  },
  {
    slug: "centre-val-de-loire",
    name: "Centre-Val de Loire",
    department: "Centre-Val de Loire",
    departmentCode: "",
  },
  {
    slug: "loiret",
    name: "Loiret",
    department: "Loiret",
    departmentCode: "45",
  },
];

// ---------------------------------------------------------------------------
// Service slugs eligible for local pages
// ---------------------------------------------------------------------------

export const SERVICES_LOCAL_SLUGS: LocalServiceSlug[] = [
  "montage-video",
  "production-corporate",
  "motion-design",
  "pub-reseaux-sociaux",
  "photographie-professionnelle",
  "interview-temoignage",
];

// ---------------------------------------------------------------------------
// Service data (templates with {ville} / {department} placeholders)
// ---------------------------------------------------------------------------

export const LOCAL_SERVICE_DATA: Record<LocalServiceSlug, LocalServiceTemplate> =
  {
    "montage-video": {
      serviceName: "Montage vidéo professionnel",
      shortName: "Montage vidéo",
      h1Template: "Montage vidéo professionnel à {ville}",
      introTemplate:
        "Vous cherchez un monteur vidéo à {ville} ({department}) ? Splice réalise le montage de vos contenus vidéo avec un rendu professionnel adapté à chaque plateforme. Du montage corporate au contenu réseaux sociaux, nous intervenons rapidement dans tout le {department}.",
      points: [
        "Montage optimisé pour chaque plateforme (YouTube, Instagram, TikTok, LinkedIn)",
        "Sous-titres animés, étalonnage couleur et habillage graphique inclus",
        "Livraison rapide avec 2 allers-retours de corrections",
        "Logiciels professionnels : Premiere Pro, DaVinci Resolve, After Effects",
      ],
      deliveryTime: "7 à 14 jours ouvrés",
      priceRange: "À partir de 390 €",
    },

    "production-corporate": {
      serviceName: "Production vidéo corporate",
      shortName: "Vidéo corporate",
      h1Template: "Production vidéo corporate à {ville}",
      introTemplate:
        "Splice accompagne les entreprises de {ville} et du {department} dans la création de films corporate sur mesure. Présentation d'entreprise, vidéo institutionnelle ou film de marque : chaque projet est pensé pour refléter votre identité et convaincre vos audiences.",
      points: [
        "Pré-production complète : scénario, repérage, casting et planning de tournage",
        "Tournage en qualité cinéma avec matériel professionnel (4K, éclairage, son HF)",
        "Post-production soignée : montage narratif, étalonnage, mixage audio",
        "Versions adaptées pour votre site web, vos réseaux sociaux et vos événements",
      ],
      deliveryTime: "14 à 21 jours ouvrés",
      priceRange: "À partir de 1 490 €",
    },

    "motion-design": {
      serviceName: "Motion design",
      shortName: "Motion design",
      h1Template: "Motion design à {ville}",
      introTemplate:
        "Besoin d'une animation percutante pour votre marque à {ville} ? Splice conçoit des vidéos en motion design qui captent l'attention et simplifient vos messages. Basés en {department}, nous créons des animations 2D et 3D pour tous vos supports de communication.",
      points: [
        "Animations 2D et 3D personnalisées à votre charte graphique",
        "Infographies animées, explainers et habillages vidéo",
        "Intégration fluide avec vos contenus filmés existants",
        "Fichiers source livrés pour vos futures déclinaisons",
      ],
      deliveryTime: "10 à 21 jours ouvrés",
      priceRange: "À partir de 690 €",
    },

    "pub-reseaux-sociaux": {
      serviceName: "Publicité réseaux sociaux",
      shortName: "Pub réseaux sociaux",
      h1Template: "Publicité vidéo pour les réseaux sociaux à {ville}",
      introTemplate:
        "Boostez votre visibilité à {ville} avec des publicités vidéo pensées pour les réseaux sociaux. Splice produit des contenus courts et percutants pour Instagram, TikTok, Facebook et LinkedIn. Nous accompagnons les marques du {department} dans leur stratégie de contenu vidéo.",
      points: [
        "Formats courts optimisés pour chaque réseau (Reels, TikTok, Stories, Shorts)",
        "Scripts accrocheurs et direction artistique orientée conversion",
        "Tournage et montage rapides pour suivre vos temps forts marketing",
        "Packs mensuels disponibles pour une présence régulière",
      ],
      deliveryTime: "5 à 10 jours ouvrés",
      priceRange: "À partir de 290 €",
    },

    "photographie-professionnelle": {
      serviceName: "Photographie professionnelle",
      shortName: "Photographie",
      h1Template: "Photographe professionnel à {ville}",
      introTemplate:
        "Splice propose des prestations de photographie professionnelle à {ville} et dans le {department}. Portraits corporate, shooting produit, couverture événementielle ou reportage : nous capturons l'image juste pour valoriser votre activité.",
      points: [
        "Shooting en studio ou en extérieur, matériel professionnel (flash, réflecteurs)",
        "Retouche avancée et livraison en haute définition pour print et web",
        "Direction artistique adaptée à votre univers de marque",
        "Galerie privée en ligne pour sélectionner et télécharger vos photos",
      ],
      deliveryTime: "5 à 10 jours ouvrés",
      priceRange: "À partir de 350 €",
    },

    "interview-temoignage": {
      serviceName: "Interview & témoignage vidéo",
      shortName: "Interview vidéo",
      h1Template: "Interview et témoignage vidéo à {ville}",
      introTemplate:
        "Donnez la parole à vos collaborateurs et clients grâce à des interviews vidéo réalisées par Splice à {ville}. Les témoignages authentiques renforcent la crédibilité de votre marque. Nous nous déplaçons dans tout le {department} pour des tournages sur site.",
      points: [
        "Préparation éditoriale : brief, questions-guides et déroulé de l'entretien",
        "Tournage multicaméra avec son professionnel (micro-cravate HF)",
        "Montage dynamique avec habillage, sous-titres et musique libre de droits",
        "Format long pour votre site et versions courtes pour les réseaux sociaux",
      ],
      deliveryTime: "10 à 14 jours ouvrés",
      priceRange: "À partir de 890 €",
    },
  };

// ---------------------------------------------------------------------------
// Template helper
// ---------------------------------------------------------------------------

/**
 * Replaces `{ville}` and `{department}` placeholders in a template string
 * with the corresponding values from a `Ville` object.
 */
export function fillTemplate(template: string, ville: Ville): string {
  return template
    .replace(/\{ville\}/g, ville.name)
    .replace(/\{department\}/g, ville.department);
}
