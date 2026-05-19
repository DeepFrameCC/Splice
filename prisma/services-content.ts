/**
 * Complete service content for all 11 DeepFrame services.
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
  "Nous intervenons principalement sur Orl\u00e9ans, Tours et l\u2019ensemble de la r\u00e9gion Centre-Val de Loire. Que vous soyez bas\u00e9 dans le Loiret (45), en Indre-et-Loire (37) ou dans un d\u00e9partement voisin, notre \u00e9quipe se d\u00e9place pour chaque projet. Des d\u00e9placements en \u00cele-de-France et dans le reste de la France sont \u00e9galement possibles sur devis.";

const ZONE_REMOTE =
  "Bas\u00e9s entre Orl\u00e9ans et Tours, nous travaillons aussi bien en pr\u00e9sentiel qu\u2019\u00e0 distance. Les \u00e9changes de fichiers, la validation et les retours se font via notre plateforme s\u00e9curis\u00e9e, o\u00f9 que vous soyez en France ou \u00e0 l\u2019international. Pour les prestations n\u00e9cessitant un tournage, nous intervenons sur toute la r\u00e9gion Centre-Val de Loire et au-del\u00e0.";

// ---------------------------------------------------------------------------
// 1. Montage vid\u00e9o
// ---------------------------------------------------------------------------

const montageVideo: ServiceContent = {
  slug: "montage-video",
  name: "Montage vid\u00e9o professionnel",
  shortName: "Montage vid\u00e9o",
  metaTitle: "Montage vid\u00e9o professionnel Orl\u00e9ans Tours | DeepFrame",
  metaDescription:
    "Montage vid\u00e9o haut de gamme pour entreprises et marques \u00e0 Orl\u00e9ans et Tours. Post-production, \u00e9talonnage DaVinci, sound design. Livraison multi-format.",
  h1: "Montage vid\u00e9o professionnel \u2014 donnez du rythme \u00e0 votre message",
  introParagraph:
    "Chaque seconde compte. Notre montage transforme vos rushes en contenus percutants, calibr\u00e9s pour capter l\u2019attention sur chaque plateforme. Bas\u00e9s \u00e0 Orl\u00e9ans et Tours, nous accompagnons les entreprises de la r\u00e9gion Centre-Val de Loire dans leur communication vid\u00e9o.",
  problemQuestion:
    "Pourquoi le montage fait la diff\u00e9rence entre un contenu vu et un contenu ignor\u00e9 ?",
  problemAnswer:
    "Un tournage r\u00e9ussi ne garantit rien sans un montage pr\u00e9cis. Le rythme, les coupes, les transitions, le sound design \u2014 tout conditionne l\u2019engagement de votre audience. Chez DeepFrame, chaque montage est pens\u00e9 pour le format de diffusion cible : vertical TikTok, carr\u00e9 Instagram, 16:9 YouTube. L\u2019\u00e9talonnage colorim\u00e9trique sur DaVinci Resolve Studio finalise l\u2019image avec un rendu cin\u00e9ma qui distingue votre marque.",
  features: [
    {
      h3: "Montage multi-format pour r\u00e9seaux sociaux",
      content:
        "Un seul tournage, plusieurs d\u00e9clinaisons. On livre en 9:16, 1:1 et 16:9 pour couvrir TikTok, Instagram Reels, YouTube et LinkedIn sans ressource suppl\u00e9mentaire.",
    },
    {
      h3: "\u00c9talonnage et color grading DaVinci",
      content:
        "\u00c9talonnage professionnel sur DaVinci Resolve Studio. LUTs personnalis\u00e9es, skin tones naturels, ambiance visuelle coh\u00e9rente avec votre charte graphique.",
    },
    {
      h3: "Sound design et mixage audio",
      content:
        "Nettoyage audio, sound design immersif, musique licenci\u00e9e ou sur mesure. Le mix final respecte les normes LUFS de chaque plateforme.",
    },
    {
      h3: "Sous-titrage professionnel et accessibilit\u00e9",
      content:
        "Sous-titres incrust\u00e9s ou fichiers SRT s\u00e9par\u00e9s, en fran\u00e7ais ou multilingue. Indispensable pour maximiser la port\u00e9e sur les r\u00e9seaux o\u00f9 85 % des vid\u00e9os sont vues sans le son.",
    },
    {
      h3: "Exports optimis\u00e9s par plateforme",
      content:
        "Chaque livrable est encod\u00e9 selon les sp\u00e9cifications exactes de la plateforme cible : codec, d\u00e9bit, r\u00e9solution, m\u00e9tadonn\u00e9es. Z\u00e9ro recompression, qualit\u00e9 maximale d\u00e8s le premier upload.",
    },
  ],
  faq: [
    {
      question: "Quel est le d\u00e9lai de livraison pour un montage vid\u00e9o ?",
      answer:
        "D\u00e9lai standard : 7 jours ouvr\u00e9s apr\u00e8s r\u00e9ception des rushes. Option express 48h disponible avec suppl\u00e9ment.",
    },
    {
      question: "Combien co\u00fbte un montage vid\u00e9o professionnel ?",
      answer:
        "Le tarif d\u00e9pend de la dur\u00e9e finale, du nombre de formats et du niveau de post-production. Nos packs d\u00e9marrent \u00e0 partir de 500 \u20ac HT. Demandez un devis gratuit en ligne pour un chiffrage pr\u00e9cis.",
    },
    {
      question: "Combien de formats sont inclus dans une prestation montage ?",
      answer:
        "Chaque pack inclut au minimum 2 formats (vertical + horizontal). Des d\u00e9clinaisons suppl\u00e9mentaires sont factur\u00e9es \u00e0 l\u2019unit\u00e9.",
    },
    {
      question: "Puis-je fournir mes propres rushes pour le montage ?",
      answer:
        "Oui. Envoyez vos fichiers via notre plateforme de transfert s\u00e9curis\u00e9e. Formats accept\u00e9s : ProRes, H.264, H.265, RAW (BRAW, R3D).",
    },
    {
      question: "Proposez-vous du montage vid\u00e9o \u00e0 Orl\u00e9ans et Tours ?",
      answer:
        "Absolument. Notre studio est bas\u00e9 entre Orl\u00e9ans et Tours. Nous travaillons avec des entreprises de toute la r\u00e9gion Centre-Val de Loire, et le montage peut \u00e9galement se faire \u00e0 distance gr\u00e2ce \u00e0 notre plateforme de transfert.",
    },
    {
      question: "Quels logiciels utilisez-vous pour le montage ?",
      answer:
        "Premiere Pro et DaVinci Resolve Studio pour le montage et l\u2019\u00e9talonnage, After Effects pour le motion titrage, et Audition ou Logic Pro pour le mixage audio.",
    },
  ],
  serviceType: "VideoEditingService",
  priceRange: "$$$",
  coverImageUrl: "/images/services/montage-video.jpg",
  coverImageAlt:
    "Poste de montage vid\u00e9o professionnel avec DaVinci Resolve \u2014 studio DeepFrame Orl\u00e9ans",
  videoUrl: null,
  category: "video",
  sortOrder: 1,
  iconName: "scissors",
  teamMembers: ["TY", "PAPI"],
  deliverables: [
    { label: "Vid\u00e9o mont\u00e9e HD/4K", detail: "Format principal + d\u00e9clinaisons" },
    { label: "\u00c9talonnage colorim\u00e9trique", detail: "DaVinci Resolve Studio" },
    { label: "Sound design et mixage" },
    { label: "Sous-titres", detail: "Incrust\u00e9s ou fichiers SRT" },
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
  metaTitle: "Production corporate film de marque Orl\u00e9ans Tours | DeepFrame",
  metaDescription:
    "Films corporate, interviews dirigeants, brand content \u00e0 Orl\u00e9ans et Tours. Production audiovisuelle compl\u00e8te de la pr\u00e9-production \u00e0 la livraison finale.",
  h1: "Production corporate \u2014 racontez votre marque en images",
  introParagraph:
    "Un film corporate ne se r\u00e9sume pas \u00e0 un plan large sur vos locaux. C\u2019est un outil strat\u00e9gique qui porte votre message aupr\u00e8s de vos clients, partenaires et talents. DeepFrame accompagne les entreprises d\u2019Orl\u00e9ans, Tours et du Centre-Val de Loire dans la cr\u00e9ation de contenus vid\u00e9o \u00e0 forte valeur ajout\u00e9e.",
  problemQuestion:
    "Comment un film corporate transforme la perception de votre entreprise ?",
  problemAnswer:
    "80 % des entreprises utilisent la vid\u00e9o dans leur communication. La diff\u00e9rence entre un film corporate efficace et un contenu g\u00e9n\u00e9rique tient \u00e0 trois choses : une direction artistique assum\u00e9e, un storytelling ancr\u00e9 dans votre r\u00e9alit\u00e9 m\u00e9tier, et une qualit\u00e9 technique irr\u00e9prochable. Chez DeepFrame, on prend le temps de comprendre votre positionnement avant de tourner la premi\u00e8re image.",
  features: [
    {
      h3: "Film de pr\u00e9sentation d\u2019entreprise",
      content:
        "De 1 \u00e0 5 minutes, avec interviews dirigeants, plans d\u2019activit\u00e9 et motion titrage. Id\u00e9al pour le site web, les salons et le recrutement.",
    },
    {
      h3: "Interview vid\u00e9o et t\u00e9moignage client",
      content:
        "Setup multi-cam\u00e9ra, \u00e9clairage portrait cin\u00e9matographique, prompteur si n\u00e9cessaire. Montage dynamique avec habillage graphique int\u00e9gr\u00e9.",
    },
    {
      h3: "Brand content r\u00e9seaux sociaux",
      content:
        "S\u00e9ries de contenus courts calibr\u00e9s pour vos r\u00e9seaux. Formats verticaux, sous-titres grav\u00e9s, hooks visuels optimis\u00e9s pour l\u2019algorithme.",
    },
    {
      h3: "Direction artistique et storytelling",
      content:
        "Brief cr\u00e9atif, moodboard, script valid\u00e9 et rep\u00e9rage des lieux avant le moindre plan. Votre histoire m\u00e9rite une narration sur mesure, pas un template.",
    },
    {
      h3: "Captation multi-cam\u00e9ra 4K",
      content:
        "Tournage en cam\u00e9ra cin\u00e9ma (Sony FX, Blackmagic) avec optiques professionnelles, stabilisation gimbale et \u00e9clairage studio portable. Qualit\u00e9 cin\u00e9ma, m\u00eame dans vos locaux.",
    },
  ],
  faq: [
    {
      question: "Combien co\u00fbte un film corporate ?",
      answer:
        "Le tarif d\u00e9pend de la dur\u00e9e, du nombre de jours de tournage et des besoins en post-production. Nos packs d\u00e9marrent \u00e0 partir de 1 500 \u20ac HT. Devis gratuit en ligne.",
    },
    {
      question: "G\u00e9rez-vous la pr\u00e9-production (script, rep\u00e9rage) ?",
      answer:
        "Oui. Chaque projet inclut un brief cr\u00e9atif, une proposition de traitement, un script valid\u00e9 et un rep\u00e9rage des lieux avant tournage.",
    },
    {
      question: "Peut-on tourner dans nos locaux \u00e0 Orl\u00e9ans ou Tours ?",
      answer:
        "Absolument. On s\u2019adapte \u00e0 votre environnement. Notre mat\u00e9riel d\u2019\u00e9clairage portable permet de transformer n\u2019importe quel espace en plateau, que vous soyez \u00e0 Orl\u00e9ans, Tours ou ailleurs en Centre-Val de Loire.",
    },
    {
      question: "Quel est le d\u00e9lai moyen pour un film d\u2019entreprise ?",
      answer:
        "Comptez 3 \u00e0 6 semaines entre le brief initial et la livraison finale, selon la complexit\u00e9 du projet. Un r\u00e9tro-planning d\u00e9taill\u00e9 vous est remis d\u00e8s la signature du devis.",
    },
    {
      question: "Livrez-vous les rushes bruts ?",
      answer:
        "Les rushes bruts ne sont pas inclus par d\u00e9faut. Ils peuvent \u00eatre fournis sur demande, avec un suppl\u00e9ment couvrant le stockage et le transfert des fichiers volumineux.",
    },
    {
      question: "Travaillez-vous avec des entreprises hors r\u00e9gion Centre-Val de Loire ?",
      answer:
        "Oui. Nous nous d\u00e9pla\u00e7ons r\u00e9guli\u00e8rement en \u00cele-de-France et dans toute la France. Les frais de d\u00e9placement sont int\u00e9gr\u00e9s au devis de mani\u00e8re transparente.",
    },
  ],
  serviceType: "VideographyService",
  priceRange: "$$$",
  coverImageUrl: "/images/services/production-corporate.jpg",
  coverImageAlt:
    "Tournage film corporate en entreprise \u2014 \u00e9quipe DeepFrame avec cam\u00e9ra cin\u00e9ma",
  videoUrl: null,
  category: "video",
  sortOrder: 2,
  iconName: "video",
  teamMembers: ["PAPI", "TY"],
  deliverables: [
    { label: "Film mont\u00e9 HD/4K", detail: "Version longue + version courte" },
    { label: "D\u00e9clinaisons r\u00e9seaux sociaux", detail: "3 \u00e0 5 formats" },
    { label: "Sous-titres fran\u00e7ais", detail: "Incrust\u00e9s + fichier SRT" },
    { label: "Musique licenci\u00e9e" },
    { label: "Brief cr\u00e9atif et script valid\u00e9" },
  ],
  equipment: [
    { name: "Sony FX3 / FX6", detail: "Camera cinema full-frame" },
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
  metaTitle: "Motion design animation graphique Orl\u00e9ans Tours | DeepFrame",
  metaDescription:
    "Motion design sur mesure \u00e0 Orl\u00e9ans et Tours : intros anim\u00e9es, infographies vid\u00e9o, habillage graphique. Animation 2D/3D pour marques exigeantes.",
  h1: "Motion design \u2014 animez vos id\u00e9es avec pr\u00e9cision",
  introParagraph:
    "Le motion design rend tangible ce que la cam\u00e9ra ne peut pas filmer. Donn\u00e9es, processus, concepts abstraits : tout devient limpide en animation. Notre studio, bas\u00e9 entre Orl\u00e9ans et Tours, con\u00e7oit des animations sur mesure pour les marques du Centre-Val de Loire et d\u2019ailleurs.",
  problemQuestion:
    "Quand le motion design devient-il indispensable \u00e0 votre communication ?",
  problemAnswer:
    "D\u00e8s que votre message d\u00e9passe le champ visuel d\u2019une cam\u00e9ra. Expliquer un processus technique, animer des chiffres cl\u00e9s, habiller une vid\u00e9o avec votre identit\u00e9 graphique \u2014 le motion design apporte une couche narrative impossible \u00e0 obtenir en prise de vue r\u00e9elle. Chez DeepFrame, chaque animation est construite sur mesure \u00e0 partir de votre charte, pas d\u2019un template g\u00e9n\u00e9rique.",
  features: [
    {
      h3: "Intro et outro anim\u00e9es",
      content:
        "Logo reveal, g\u00e9n\u00e9riques, bumpers. Animation fluide de votre identit\u00e9 visuelle pour ouvrir et fermer chaque vid\u00e9o avec impact.",
    },
    {
      h3: "Infographie anim\u00e9e et data visualization",
      content:
        "Transformation de vos donn\u00e9es en s\u00e9quences anim\u00e9es lisibles et m\u00e9morables. Id\u00e9al pour les rapports d\u2019activit\u00e9, les pitchs investisseurs, les pr\u00e9sentations internes.",
    },
    {
      h3: "Habillage graphique vid\u00e9o",
      content:
        "Lower thirds, titrages, transitions, call-to-action anim\u00e9s. Coh\u00e9rence graphique totale entre vos supports vid\u00e9o et votre charte de marque.",
    },
    {
      h3: "Animation de personnages et mascottes",
      content:
        "Donnez vie \u00e0 vos personnages et mascottes de marque avec des animations 2D fluides. Id\u00e9al pour les vid\u00e9os explicatives, les r\u00e9seaux sociaux et les campagnes publicitaires.",
    },
    {
      h3: "Animation 3D et compositing",
      content:
        "Mod\u00e9lisation et animation d\u2019objets 3D int\u00e9gr\u00e9s dans vos vid\u00e9os. Packshots produits anim\u00e9s, environnements virtuels, compositing r\u00e9aliste pour un rendu haut de gamme.",
    },
  ],
  faq: [
    {
      question: "Quelle est la diff\u00e9rence entre motion design 2D et 3D ?",
      answer:
        "Le motion design 2D utilise des illustrations et typographies anim\u00e9es en plan. Le 3D ajoute de la profondeur avec des objets mod\u00e9lis\u00e9s. Le choix d\u00e9pend du rendu souhait\u00e9 et du budget.",
    },
    {
      question: "Combien co\u00fbte une vid\u00e9o en motion design ?",
      answer:
        "Le tarif d\u00e9pend de la dur\u00e9e, de la complexit\u00e9 graphique et du style (2D, 3D, mixte). Comptez \u00e0 partir de 800 \u20ac HT pour une animation courte. Devis gratuit en ligne.",
    },
    {
      question: "Fournissez-vous les fichiers sources After Effects ?",
      answer:
        "Sur demande et avec suppl\u00e9ment. Les fichiers After Effects / Cinema 4D sont livr\u00e9s avec un guide de modification si vous avez les comp\u00e9tences en interne.",
    },
    {
      question: "Peut-on int\u00e9grer du motion design dans une vid\u00e9o film\u00e9e ?",
      answer:
        "C\u2019est m\u00eame recommand\u00e9. L\u2019habillage graphique renforce le message de la prise de vue r\u00e9elle. On g\u00e8re le compositing pour un r\u00e9sultat homog\u00e8ne.",
    },
    {
      question: "Faites-vous du motion design \u00e0 Orl\u00e9ans ?",
      answer:
        "Oui, notre studio est bas\u00e9 entre Orl\u00e9ans et Tours. Le motion design \u00e9tant un travail de post-production, nous pouvons \u00e9galement collaborer \u00e0 distance avec des clients partout en France.",
    },
    {
      question: "Quel est le d\u00e9lai pour une animation motion design ?",
      answer:
        "Comptez 2 \u00e0 4 semaines selon la complexit\u00e9 et la dur\u00e9e de l\u2019animation. Chaque projet d\u00e9marre par un storyboard valid\u00e9 avant la phase d\u2019animation.",
    },
  ],
  serviceType: "GraphicDesignService",
  priceRange: "$$$",
  coverImageUrl: "/images/services/motion-design.jpg",
  coverImageAlt:
    "Animation motion design en cours de cr\u00e9ation \u2014 interface After Effects studio DeepFrame",
  videoUrl: null,
  category: "motion",
  sortOrder: 3,
  iconName: "palette",
  teamMembers: ["TY", "PAPI"],
  deliverables: [
    { label: "Animation HD/4K", detail: "Dur\u00e9e selon brief" },
    { label: "Fichiers export\u00e9s", detail: "MP4, MOV, GIF selon besoin" },
    { label: "Storyboard illustr\u00e9" },
    { label: "2 allers-retours de corrections" },
    { label: "D\u00e9clinaisons formats", detail: "Carr\u00e9, vertical, horizontal" },
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
// 4. Publicit\u00e9 r\u00e9seaux sociaux
// ---------------------------------------------------------------------------

const pubReseauxSociaux: ServiceContent = {
  slug: "pub-reseaux-sociaux",
  name: "Publicit\u00e9 r\u00e9seaux sociaux",
  shortName: "Pubs r\u00e9seaux sociaux",
  metaTitle: "Publicit\u00e9 vid\u00e9o r\u00e9seaux sociaux Orl\u00e9ans Tours | DeepFrame",
  metaDescription:
    "Cr\u00e9ation de publicit\u00e9s vid\u00e9o pour Instagram Reels, TikTok, Facebook Ads et YouTube Shorts \u00e0 Orl\u00e9ans et Tours. Hooks, rythme et formats verticaux.",
  h1: "Publicit\u00e9 r\u00e9seaux sociaux \u2014 des vid\u00e9os qui convertissent",
  introParagraph:
    "Sur les r\u00e9seaux sociaux, vous avez moins de 3 secondes pour capter l\u2019attention. Nos publicit\u00e9s vid\u00e9o sont con\u00e7ues pour stopper le scroll, transmettre votre message et g\u00e9n\u00e9rer de l\u2019action. Instagram Reels, TikTok, Facebook Ads, YouTube Shorts \u2014 chaque format a ses r\u00e8gles, et on les ma\u00eetrise.",
  problemQuestion:
    "Pourquoi vos publicit\u00e9s vid\u00e9o ne performent pas sur les r\u00e9seaux sociaux ?",
  problemAnswer:
    "Un contenu film\u00e9 pour la t\u00e9l\u00e9vision ou votre site web ne fonctionne pas sur TikTok ou Instagram. Les algorithmes favorisent les vid\u00e9os natives, verticales, avec un hook dans la premi\u00e8re seconde et un rythme soutenu. Chez DeepFrame, on pense chaque publicit\u00e9 pour la plateforme cible : format, dur\u00e9e, sous-titrage, call-to-action. R\u00e9sultat : des taux de compl\u00e9tion et de conversion mesurables.",
  features: [
    {
      h3: "Hooks visuels et copywriting vid\u00e9o",
      content:
        "Chaque publicit\u00e9 d\u00e9marre par un hook visuel ou textuel test\u00e9 pour maximiser le taux de r\u00e9tention. On \u00e9crit et on monte pour l\u2019algorithme autant que pour votre audience.",
    },
    {
      h3: "Formats verticaux natifs 9:16",
      content:
        "Tournage et montage pens\u00e9s en vertical d\u00e8s le d\u00e9part. Pas de recadrage approximatif \u2014 cadrage, typographie et animations sont optimis\u00e9s pour le mobile.",
    },
    {
      h3: "Sous-titrage dynamique int\u00e9gr\u00e9",
      content:
        "Sous-titres anim\u00e9s, synchronis\u00e9s mot par mot, dans le style natif de chaque plateforme. Indispensable quand 85 % des vid\u00e9os sont vues sans le son.",
    },
    {
      h3: "D\u00e9clinaisons multi-plateformes",
      content:
        "Un tournage, plusieurs montages : Reels, TikTok, Stories, YouTube Shorts, Facebook Ads. Chaque version respecte les sp\u00e9cificit\u00e9s de la plateforme.",
    },
    {
      h3: "Tests A/B et it\u00e9rations cr\u00e9atives",
      content:
        "On livre plusieurs variantes (hooks diff\u00e9rents, dur\u00e9es alternatives) pour que vous puissiez tester et optimiser vos campagnes publicitaires.",
    },
  ],
  faq: [
    {
      question: "Combien co\u00fbte une publicit\u00e9 vid\u00e9o pour les r\u00e9seaux sociaux ?",
      answer:
        "Nos packs publicit\u00e9 d\u00e9marrent \u00e0 partir de 400 \u20ac HT pour un contenu court mont\u00e9. Le tarif varie selon le nombre de d\u00e9clinaisons et le besoin en tournage. Devis gratuit en ligne.",
    },
    {
      question: "Quelle est la dur\u00e9e id\u00e9ale pour une pub vid\u00e9o Instagram ou TikTok ?",
      answer:
        "Entre 15 et 30 secondes pour les Reels et TikTok, jusqu\u2019\u00e0 60 secondes pour les Facebook Ads. On adapte la dur\u00e9e \u00e0 votre objectif : notori\u00e9t\u00e9, consid\u00e9ration ou conversion.",
    },
    {
      question: "G\u00e9rez-vous le tournage ou uniquement le montage ?",
      answer:
        "Les deux. On peut tourner le contenu de A \u00e0 Z ou travailler \u00e0 partir de vos rushes existants. Dans les deux cas, le montage est optimis\u00e9 pour le format publicitaire.",
    },
    {
      question: "Faites-vous de la publicit\u00e9 vid\u00e9o \u00e0 Orl\u00e9ans et Tours ?",
      answer:
        "Oui, nous tournons r\u00e9guli\u00e8rement pour des marques et commerces d\u2019Orl\u00e9ans, Tours et de toute la r\u00e9gion Centre-Val de Loire. Notre \u00e9quipe se d\u00e9place \u00e9galement en \u00cele-de-France.",
    },
    {
      question: "Peut-on commander un pack mensuel de contenus ?",
      answer:
        "Absolument. Nous proposons des formules r\u00e9currentes avec un volume de contenus d\u00e9fini par mois, id\u00e9ales pour maintenir une pr\u00e9sence r\u00e9guli\u00e8re sur vos r\u00e9seaux.",
    },
    {
      question: "Incluez-vous la strat\u00e9gie publicitaire (ciblage, budget) ?",
      answer:
        "Notre expertise porte sur la cr\u00e9ation du contenu vid\u00e9o. Pour la strat\u00e9gie m\u00e9dia (ciblage, budget, diffusion), nous pouvons vous orienter vers des partenaires sp\u00e9cialis\u00e9s.",
    },
  ],
  serviceType: "AdvertisingService",
  priceRange: "$$",
  coverImageUrl: "/images/services/pub-reseaux-sociaux.jpg",
  coverImageAlt:
    "Tournage publicit\u00e9 vid\u00e9o verticale pour r\u00e9seaux sociaux \u2014 DeepFrame Orl\u00e9ans",
  videoUrl: null,
  category: "video",
  sortOrder: 4,
  iconName: "megaphone",
  teamMembers: ["LOUISIA"],
  deliverables: [
    { label: "Vid\u00e9os publicitaires mont\u00e9es", detail: "1 \u00e0 5 d\u00e9clinaisons" },
    { label: "Formats 9:16, 1:1, 16:9" },
    { label: "Sous-titres anim\u00e9s int\u00e9gr\u00e9s" },
    { label: "Variantes A/B", detail: "Hooks et dur\u00e9es alternatives" },
    { label: "Exports optimis\u00e9s par plateforme" },
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
  name: "Shooting photo & vid\u00e9o automobile",
  shortName: "Shooting auto",
  metaTitle: "Shooting photo vid\u00e9o automobile Orl\u00e9ans Tours | DeepFrame",
  metaDescription:
    "Shooting photo et vid\u00e9o automobile \u00e0 Orl\u00e9ans et Tours. Rolling shots, studio, \u00e9v\u00e9nementiel auto, concessions et collectionneurs. R\u00e9sultat haut de gamme.",
  h1: "Shooting automobile \u2014 sublimez chaque courbe",
  introParagraph:
    "La photographie et la vid\u00e9o automobile exigent un \u0153il technique et une sensibilit\u00e9 esth\u00e9tique particuli\u00e8re. Chez DeepFrame, on capture la personnalit\u00e9 de chaque v\u00e9hicule avec des images qui font tourner les t\u00eates. Rolling shots, photos studio, couverture \u00e9v\u00e9nementielle \u2014 notre \u00e9quipe intervient sur Orl\u00e9ans, Tours et dans toute la r\u00e9gion Centre-Val de Loire.",
  problemQuestion:
    "Pourquoi un shooting automobile professionnel fait toute la diff\u00e9rence ?",
  problemAnswer:
    "Une photo prise au smartphone ne rend pas justice \u00e0 un v\u00e9hicule d\u2019exception. L\u2019\u00e9clairage, la composition, le choix du lieu et la post-production transforment une simple image en objet de d\u00e9sir. Que vous soyez concession, pr\u00e9parateur ou collectionneur priv\u00e9, un shooting professionnel valorise votre investissement et attire les bons acheteurs.",
  features: [
    {
      h3: "Rolling shots et vid\u00e9o dynamique",
      content:
        "Prises de vue en mouvement depuis un v\u00e9hicule suiveur, avec stabilisation professionnelle. Le r\u00e9sultat : des images cin\u00e9matographiques qui transmettent la puissance et l\u2019\u00e9l\u00e9gance du v\u00e9hicule.",
    },
    {
      h3: "Shooting studio et \u00e9clairage cr\u00e9atif",
      content:
        "S\u00e9ances en studio ou en ext\u00e9rieur avec \u00e9clairage professionnel (light painting, hexlight, n\u00e9ons). Chaque photo met en valeur les lignes, les mat\u00e9riaux et les d\u00e9tails de finition.",
    },
    {
      h3: "Couverture \u00e9v\u00e9nements automobiles",
      content:
        "Reportage photo et vid\u00e9o sur les rassemblements, salons, courses et livraisons. Captation rapide, tri s\u00e9lectif, livraison express pour vos r\u00e9seaux sociaux.",
    },
    {
      h3: "Photographie de d\u00e9tail et packshot v\u00e9hicule",
      content:
        "Gros plans sur les \u00e9l\u00e9ments distinctifs : jantes, sellerie, tableau de bord, finitions carrosserie. Id\u00e9al pour les annonces de vente et les catalogues.",
    },
    {
      h3: "Retouche et post-production automobile",
      content:
        "Retouche avanc\u00e9e : nettoyage des reflets parasites, correction colorim\u00e9trique, remplacement de fond. Livraison en haute r\u00e9solution pour print et web.",
    },
  ],
  faq: [
    {
      question: "Combien co\u00fbte un shooting photo automobile ?",
      answer:
        "Les tarifs d\u00e9pendent du type de shooting (studio, ext\u00e9rieur, rolling shots) et du nombre de v\u00e9hicules. Comptez \u00e0 partir de 350 \u20ac HT pour une s\u00e9ance photo d\u2019un v\u00e9hicule. Devis gratuit en ligne.",
    },
    {
      question: "Faites-vous des shootings auto \u00e0 Orl\u00e9ans et Tours ?",
      answer:
        "Oui, nous connaissons les meilleurs spots de la r\u00e9gion. Nous intervenons r\u00e9guli\u00e8rement \u00e0 Orl\u00e9ans, Tours, en Sologne et dans l\u2019ensemble du Centre-Val de Loire pour des shootings automobiles.",
    },
    {
      question: "Proposez-vous des rolling shots ?",
      answer:
        "Absolument. Nous r\u00e9alisons des rolling shots depuis un v\u00e9hicule suiveur \u00e9quip\u00e9, avec stabilisation gimbale professionnelle. R\u00e9sultat : des images dynamiques et cin\u00e9matographiques.",
    },
    {
      question: "Peut-on combiner photo et vid\u00e9o lors d\u2019un m\u00eame shooting ?",
      answer:
        "C\u2019est m\u00eame recommand\u00e9. On optimise la s\u00e9ance pour capturer photos et vid\u00e9os simultan\u00e9ment, ce qui r\u00e9duit les co\u00fbts et assure une coh\u00e9rence visuelle.",
    },
    {
      question: "Quel mat\u00e9riel utilisez-vous pour les shootings automobile ?",
      answer:
        "Appareils Sony (A7, ZV-1), optiques Sigma Art (35mm, 24-70mm, 90mm Macro), \u00e9clairages LED portables, gimbale DJI RS3. Pour les rolling shots : v\u00e9hicule suiveur avec setup stabilis\u00e9.",
    },
    {
      question: "En combien de temps recevrai-je les photos ?",
      answer:
        "Livraison sous 5 \u00e0 7 jours ouvr\u00e9s apr\u00e8s le shooting, avec retouche compl\u00e8te. Option express 48h disponible pour les urgences.",
    },
  ],
  serviceType: "PhotographyService",
  priceRange: "$$",
  coverImageUrl: "/images/services/shooting-automobile.jpg",
  coverImageAlt:
    "Shooting photo automobile Porsche en studio \u2014 \u00e9clairage cr\u00e9atif DeepFrame",
  videoUrl: null,
  category: "photo",
  sortOrder: 5,
  iconName: "car",
  teamMembers: ["PAPI"],
  deliverables: [
    { label: "Photos HD retouch\u00e9es", detail: "20 \u00e0 50 clich\u00e9s selon le pack" },
    { label: "Vid\u00e9o teaser", detail: "30 \u00e0 60 secondes (option)" },
    { label: "Rolling shots", detail: "Photo et/ou vid\u00e9o" },
    { label: "Galerie en ligne priv\u00e9e" },
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
  metaTitle: "Photographe professionnel Orl\u00e9ans Tours | DeepFrame",
  metaDescription:
    "Photographe professionnel \u00e0 Orl\u00e9ans et Tours. Portraits corporate, \u00e9v\u00e9nementiel, packshots produits, immobilier. Photos retouch\u00e9es haute qualit\u00e9.",
  h1: "Photographie professionnelle \u2014 des images qui parlent pour vous",
  introParagraph:
    "Une image professionnelle inspire confiance avant m\u00eame le premier mot. Portraits de dirigeants, couverture \u00e9v\u00e9nementielle, packshots produits ou photos immobili\u00e8res \u2014 notre photographe capte l\u2019essentiel de votre activit\u00e9 avec un regard artistique et technique. Bas\u00e9s \u00e0 Orl\u00e9ans et Tours, nous intervenons dans tout le Centre-Val de Loire.",
  problemQuestion:
    "Pourquoi investir dans un photographe professionnel pour votre entreprise ?",
  problemAnswer:
    "Les visuels g\u00e9n\u00e9riques de banques d\u2019images ne trompent personne. Vos clients, partenaires et candidats veulent voir la r\u00e9alit\u00e9 de votre entreprise, vos \u00e9quipes, vos produits. Un reportage photo professionnel cr\u00e9e des visuels authentiques, r\u00e9utilisables sur votre site, vos r\u00e9seaux, vos plaquettes et vos annonces de recrutement.",
  features: [
    {
      h3: "Portrait corporate et \u00e9quipe",
      content:
        "Portraits individuels et de groupe pour votre site web, LinkedIn et communications internes. \u00c9clairage studio ou lumi\u00e8re naturelle, selon l\u2019ambiance souhait\u00e9e.",
    },
    {
      h3: "Reportage \u00e9v\u00e9nementiel",
      content:
        "Couverture photo de vos \u00e9v\u00e9nements d\u2019entreprise : s\u00e9minaires, inaugurations, soir\u00e9es, salons. Livraison rapide pour une diffusion imm\u00e9diate sur vos r\u00e9seaux.",
    },
    {
      h3: "Packshot produit e-commerce",
      content:
        "Photos produits sur fond blanc ou en situation (lifestyle). Retouch\u00e9es et d\u00e9tour\u00e9es, pr\u00eates \u00e0 l\u2019int\u00e9gration sur votre boutique en ligne ou vos marketplaces.",
    },
    {
      h3: "Photographie immobili\u00e8re et architecture",
      content:
        "Photos grand angle, lumi\u00e8re ma\u00eetris\u00e9e, retouche perspective. Id\u00e9al pour les agences immobili\u00e8res, les promoteurs et les architectes du Loiret et d\u2019Indre-et-Loire.",
    },
  ],
  faq: [
    {
      question: "Combien co\u00fbte une s\u00e9ance photo professionnelle ?",
      answer:
        "Nos tarifs d\u00e9pendent du type de prestation et de la dur\u00e9e. Comptez \u00e0 partir de 250 \u20ac HT pour une s\u00e9ance portrait et \u00e0 partir de 500 \u20ac HT pour un reportage \u00e9v\u00e9nementiel. Devis gratuit en ligne.",
    },
    {
      question: "Combien de photos retouch\u00e9es sont livr\u00e9es ?",
      answer:
        "Le nombre d\u00e9pend du pack choisi. En g\u00e9n\u00e9ral, 15 \u00e0 30 photos retouch\u00e9es pour un portrait corporate, 50 \u00e0 100+ pour un reportage \u00e9v\u00e9nementiel.",
    },
    {
      question: "Intervenez-vous \u00e0 Orl\u00e9ans et Tours pour des s\u00e9ances photo ?",
      answer:
        "Oui, nous sommes bas\u00e9s entre Orl\u00e9ans et Tours et nous nous d\u00e9pla\u00e7ons dans l\u2019ensemble de la r\u00e9gion Centre-Val de Loire : Loiret, Indre-et-Loire, Loir-et-Cher et au-del\u00e0.",
    },
    {
      question: "En combien de temps recevrai-je mes photos ?",
      answer:
        "D\u00e9lai standard : 5 \u00e0 7 jours ouvr\u00e9s avec retouche compl\u00e8te. Livraison express 48h disponible pour les \u00e9v\u00e9nements avec diffusion imm\u00e9diate.",
    },
    {
      question: "Proposez-vous des abonnements photo pour entreprises ?",
      answer:
        "Oui. Nous proposons des formules r\u00e9currentes (mensuelle ou trimestrielle) incluant un volume de s\u00e9ances fix\u00e9, id\u00e9ales pour alimenter vos r\u00e9seaux et votre site r\u00e9guli\u00e8rement.",
    },
  ],
  serviceType: "PhotographyService",
  priceRange: "$$",
  coverImageUrl: "/images/services/photographie-professionnelle.jpg",
  coverImageAlt:
    "S\u00e9ance photo portrait corporate en entreprise \u2014 photographe DeepFrame Orl\u00e9ans",
  videoUrl: null,
  category: "photo",
  sortOrder: 6,
  iconName: "camera",
  teamMembers: ["LOUISIA"],
  deliverables: [
    { label: "Photos HD retouch\u00e9es", detail: "S\u00e9lection + retouche compl\u00e8te" },
    { label: "Galerie en ligne priv\u00e9e", detail: "T\u00e9l\u00e9chargement s\u00e9curis\u00e9" },
    { label: "Exports web + print", detail: "JPEG, TIFF, PNG" },
    { label: "D\u00e9tourage produits", detail: "Pour packshots e-commerce" },
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
// 7. Interview et t\u00e9moignage d'entreprise
// ---------------------------------------------------------------------------

const interviewTemoignage: ServiceContent = {
  slug: "interview-temoignage",
  name: "Interview et t\u00e9moignage d\u2019entreprise",
  shortName: "Interview & t\u00e9moignage",
  metaTitle: "Interview vid\u00e9o t\u00e9moignage entreprise Orl\u00e9ans | DeepFrame",
  metaDescription:
    "Interviews vid\u00e9o professionnelles \u00e0 Orl\u00e9ans et Tours. T\u00e9moignages clients, portraits dirigeants, interviews collaborateurs. Tournage multi-cam\u00e9ra.",
  h1: "Interview et t\u00e9moignage \u2014 la parole qui cr\u00e9e la confiance",
  introParagraph:
    "Rien ne vaut un t\u00e9moignage authentique pour convaincre. Interviews de clients satisfaits, portraits de dirigeants, paroles de collaborateurs \u2014 la vid\u00e9o donne un visage et une voix \u00e0 votre cr\u00e9dibilit\u00e9. Notre \u00e9quipe met en confiance les intervenants et assure un rendu cin\u00e9matographique professionnel, \u00e0 Orl\u00e9ans, Tours et dans le Centre-Val de Loire.",
  problemQuestion:
    "Pourquoi les t\u00e9moignages vid\u00e9o sont-ils si puissants pour votre marque ?",
  problemAnswer:
    "Un avis \u00e9crit peut \u00eatre ignor\u00e9. Un t\u00e9moignage vid\u00e9o, avec le visage et la voix d\u2019un vrai client, cr\u00e9e un lien \u00e9motionnel imm\u00e9diat. C\u2019est la preuve sociale la plus convaincante. Chez DeepFrame, on g\u00e8re tout : la mise en confiance des intervenants, le tournage multi-cam\u00e9ra, l\u2019\u00e9clairage portrait et le montage dynamique.",
  features: [
    {
      h3: "T\u00e9moignage client vid\u00e9o",
      content:
        "Vos meilleurs clients partagent leur exp\u00e9rience face cam\u00e9ra. On guide l\u2019entretien pour obtenir des r\u00e9ponses naturelles, sinc\u00e8res et exploitables en marketing.",
    },
    {
      h3: "Portrait vid\u00e9o de dirigeant",
      content:
        "Mettez en avant votre leadership avec un portrait vid\u00e9o soign\u00e9. \u00c9clairage cin\u00e9matographique, fond professionnel, montage valorisant. Id\u00e9al pour le site web et LinkedIn.",
    },
    {
      h3: "Interview collaborateur et marque employeur",
      content:
        "Vos \u00e9quipes sont votre meilleur argument de recrutement. On filme leurs t\u00e9moignages pour alimenter votre marque employeur et vos campagnes RH.",
    },
    {
      h3: "Tournage multi-cam\u00e9ra et prompteur",
      content:
        "Setup 2 \u00e0 3 cam\u00e9ras pour un montage dynamique avec changements d\u2019angle. Prompteur disponible pour les intervenants moins \u00e0 l\u2019aise avec l\u2019exercice.",
    },
  ],
  faq: [
    {
      question: "Combien co\u00fbte une interview vid\u00e9o professionnelle ?",
      answer:
        "Le tarif d\u00e9pend du nombre d\u2019intervenants et de la dur\u00e9e souhait\u00e9e. Comptez \u00e0 partir de 800 \u20ac HT pour une interview mont\u00e9e d\u2019un intervenant. Devis gratuit en ligne.",
    },
    {
      question: "Comment mettez-vous les intervenants \u00e0 l\u2019aise ?",
      answer:
        "On prend le temps d\u2019un \u00e9change informel avant le tournage. Pas de script fig\u00e9 : on guide la conversation avec des questions ouvertes. Le prompteur est disponible en option pour ceux qui le souhaitent.",
    },
    {
      question: "Filmez-vous des interviews \u00e0 Orl\u00e9ans et Tours ?",
      answer:
        "Oui, c\u2019est notre zone d\u2019intervention principale. Nous nous d\u00e9pla\u00e7ons dans vos locaux, o\u00f9 que vous soyez dans le Loiret, l\u2019Indre-et-Loire ou le reste du Centre-Val de Loire.",
    },
    {
      question: "Peut-on d\u00e9cliner l\u2019interview en plusieurs formats ?",
      answer:
        "Bien s\u00fbr. \u00c0 partir d\u2019un seul entretien, on monte une version longue (site web), une version courte (r\u00e9seaux sociaux) et des extraits pour vos campagnes publicitaires.",
    },
    {
      question: "Faut-il pr\u00e9parer un script pour l\u2019interview ?",
      answer:
        "Non. Nous pr\u00e9parons une trame de questions en amont, valid\u00e9e avec vous. L\u2019objectif est d\u2019obtenir des r\u00e9ponses spontan\u00e9es, pas un discours r\u00e9cit\u00e9.",
    },
  ],
  serviceType: "VideographyService",
  priceRange: "$$",
  coverImageUrl: "/images/services/interview-temoignage.jpg",
  coverImageAlt:
    "Tournage interview vid\u00e9o en entreprise \u2014 setup multi-cam\u00e9ra DeepFrame",
  videoUrl: null,
  category: "video",
  sortOrder: 7,
  iconName: "user",
  teamMembers: ["LOUISIA"],
  deliverables: [
    { label: "Interview mont\u00e9e HD/4K", detail: "Version longue + courte" },
    { label: "D\u00e9clinaisons r\u00e9seaux sociaux", detail: "Extraits 30s \u00e0 60s" },
    { label: "Sous-titres int\u00e9gr\u00e9s", detail: "Fran\u00e7ais + option anglais" },
    { label: "Habillage graphique", detail: "Titrages, lower thirds" },
  ],
  equipment: [
    { name: "Setup 2-3 caméras Sony FX3", detail: "Multi-angle cinéma" },
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
  metaTitle: "Voix-off sound design Orl\u00e9ans Tours | DeepFrame",
  metaDescription:
    "Enregistrement voix-off, sound design et mixage audio \u00e0 Orl\u00e9ans et Tours. Narration professionnelle, musique d\u2019illustration, habillage sonore pour vid\u00e9os.",
  h1: "Voix-off et sound design \u2014 le son qui donne vie \u00e0 l\u2019image",
  introParagraph:
    "Une vid\u00e9o sans un son soign\u00e9 perd la moiti\u00e9 de son impact. Voix-off narrative, sound design immersif, musique d\u2019illustration \u2014 nous donnons une dimension suppl\u00e9mentaire \u00e0 vos contenus audiovisuels. Notre studio, situ\u00e9 entre Orl\u00e9ans et Tours, dispose de l\u2019\u00e9quipement n\u00e9cessaire pour un rendu broadcast.",
  problemQuestion:
    "Pourquoi le son est-il l\u2019\u00e9l\u00e9ment le plus sous-estim\u00e9 de votre vid\u00e9o ?",
  problemAnswer:
    "Votre audience tol\u00e8re une image moyenne mais coupe imm\u00e9diatement une vid\u00e9o au son m\u00e9diocre. Une voix-off pos\u00e9e, un sound design pr\u00e9cis et un mixage calibr\u00e9 transforment un contenu correct en exp\u00e9rience engageante. Chez DeepFrame, chaque projet audio est trait\u00e9 avec le m\u00eame niveau d\u2019exigence que l\u2019image.",
  features: [
    {
      h3: "Enregistrement voix-off professionnel",
      content:
        "Direction artistique, choix de la voix (homme/femme, ton, rythme), enregistrement en environnement trait\u00e9 acoustiquement. Livraison en qualit\u00e9 broadcast.",
    },
    {
      h3: "Sound design et habillage sonore",
      content:
        "Cr\u00e9ation d\u2019ambiances, bruitages, effets sonores et transitions audio sur mesure. Chaque \u00e9l\u00e9ment renforce la narration visuelle de votre contenu.",
    },
    {
      h3: "Mixage et mastering audio",
      content:
        "Mixage professionnel respectant les normes LUFS de chaque plateforme (YouTube, TV, cin\u00e9ma). \u00c9quilibrage voix, musique, effets pour une \u00e9coute optimale sur tous les supports.",
    },
    {
      h3: "Musique d\u2019illustration et licensing",
      content:
        "S\u00e9lection et licensing de musiques adapt\u00e9es \u00e0 votre projet, ou composition sur mesure. Droits d\u2019utilisation clairs et inclus dans le devis.",
    },
  ],
  faq: [
    {
      question: "Combien co\u00fbte un enregistrement voix-off ?",
      answer:
        "Le tarif d\u00e9pend de la dur\u00e9e du texte et de la voix choisie. Comptez \u00e0 partir de 300 \u20ac HT pour une voix-off de moins de 2 minutes. Devis gratuit en ligne.",
    },
    {
      question: "Proposez-vous des voix-off en plusieurs langues ?",
      answer:
        "Oui. Nous travaillons avec un r\u00e9seau de com\u00e9diens voix fran\u00e7ais et anglophones. D\u2019autres langues sont disponibles sur demande.",
    },
    {
      question: "Faites-vous du sound design \u00e0 Orl\u00e9ans et Tours ?",
      answer:
        "Oui, notre studio est bas\u00e9 entre Orl\u00e9ans et Tours. Le sound design \u00e9tant un travail de post-production, nous collaborons aussi \u00e0 distance avec des clients de toute la France.",
    },
    {
      question: "Puis-je fournir ma propre musique ?",
      answer:
        "Bien s\u00fbr. Si vous disposez de musiques avec les droits n\u00e9cessaires, nous les int\u00e9grons dans le mixage. Sinon, nous vous proposons des alternatives licenci\u00e9es.",
    },
    {
      question: "Le sound design est-il inclus dans vos prestations vid\u00e9o ?",
      answer:
        "Un sound design de base est inclus dans nos packs montage et production. Pour un habillage sonore avanc\u00e9 (bruitages custom, ambiances sur mesure), un compl\u00e9ment est \u00e0 pr\u00e9voir.",
    },
  ],
  serviceType: "AudioService",
  priceRange: "$$",
  coverImageUrl: "/images/services/voix-off-sound-design.jpg",
  coverImageAlt:
    "Studio d\u2019enregistrement voix-off et sound design \u2014 DeepFrame Orl\u00e9ans",
  videoUrl: null,
  category: "audio",
  sortOrder: 8,
  iconName: "mic",
  teamMembers: ["LOUISIA"],
  deliverables: [
    { label: "Fichier voix-off", detail: "WAV 48kHz/24bit" },
    { label: "Sound design complet", detail: "Ambiances, bruitages, effets" },
    { label: "Mixage et mastering", detail: "Normes LUFS par plateforme" },
    { label: "Musique licenci\u00e9e", detail: "Droits inclus" },
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
// 9. Film de pr\u00e9sentation d'entreprise
// ---------------------------------------------------------------------------

const presentationEntreprise: ServiceContent = {
  slug: "presentation-entreprise",
  name: "Film de pr\u00e9sentation d\u2019entreprise",
  shortName: "Film d\u2019entreprise",
  metaTitle: "Film pr\u00e9sentation entreprise Orl\u00e9ans Tours | DeepFrame",
  metaDescription:
    "Film de pr\u00e9sentation d\u2019entreprise \u00e0 Orl\u00e9ans et Tours. Film vitrine, visite virtuelle, pr\u00e9sentation d\u2019activit\u00e9. Production audiovisuelle compl\u00e8te.",
  h1: "Film d\u2019entreprise \u2014 votre meilleur ambassadeur en 3 minutes",
  introParagraph:
    "Un film de pr\u00e9sentation est la pi\u00e8ce ma\u00eetresse de votre communication audiovisuelle. En quelques minutes, il transmet votre identit\u00e9, vos valeurs et votre savoir-faire. Chez DeepFrame, nous r\u00e9alisons des films d\u2019entreprise pour les soci\u00e9t\u00e9s d\u2019Orl\u00e9ans, Tours et du Centre-Val de Loire, de la conception \u00e0 la livraison.",
  problemQuestion:
    "Pourquoi votre entreprise a besoin d\u2019un film de pr\u00e9sentation ?",
  problemAnswer:
    "Votre site web, vos r\u00e9seaux sociaux, vos salons professionnels \u2014 partout, la vid\u00e9o capte l\u2019attention mieux que n\u2019importe quel texte. Un film de pr\u00e9sentation bien r\u00e9alis\u00e9 humanise votre marque, cr\u00e9dibilise votre offre et reste dans les m\u00e9moires. C\u2019est un investissement durable qui travaille pour vous 24h/24.",
  features: [
    {
      h3: "Film vitrine et identit\u00e9 de marque",
      content:
        "Un film de 2 \u00e0 5 minutes qui raconte qui vous \u00eates, ce que vous faites et pourquoi vous le faites. Narration, interviews, plans d\u2019activit\u00e9 et motion design combin\u00e9s.",
    },
    {
      h3: "Visite virtuelle vid\u00e9o",
      content:
        "Faites d\u00e9couvrir vos locaux, vos ateliers ou vos espaces de travail avec une visite vid\u00e9o immersive. Id\u00e9al pour le recrutement, l\u2019accueil de nouveaux clients ou la communication interne.",
    },
    {
      h3: "Pr\u00e9sentation d\u2019activit\u00e9 et savoir-faire",
      content:
        "Mettez en lumi\u00e8re vos processus, votre expertise et vos \u00e9quipes. Chaque plan est pens\u00e9 pour valoriser votre m\u00e9tier avec authenticit\u00e9.",
    },
    {
      h3: "Sc\u00e9narisation et direction artistique",
      content:
        "Script, storyboard, rep\u00e9rage, casting interne \u2014 on structure votre film comme un vrai projet cin\u00e9matographique, avec un fil narratif clair et un rendu professionnel.",
    },
    {
      h3: "D\u00e9clinaisons multi-supports",
      content:
        "Version longue pour le site web, version courte pour les r\u00e9seaux sociaux, version sous-titr\u00e9e pour l\u2019international. Un seul tournage, plusieurs exploitations.",
    },
  ],
  faq: [
    {
      question: "Combien co\u00fbte un film de pr\u00e9sentation d\u2019entreprise ?",
      answer:
        "Le tarif d\u00e9pend de la dur\u00e9e, du nombre de lieux de tournage et du niveau de post-production. Nos films d\u00e9marrent \u00e0 partir de 2 000 \u20ac HT. Devis gratuit en ligne.",
    },
    {
      question: "R\u00e9alisez-vous des films d\u2019entreprise \u00e0 Orl\u00e9ans et Tours ?",
      answer:
        "C\u2019est notre sp\u00e9cialit\u00e9. Nous accompagnons les entreprises d\u2019Orl\u00e9ans, Tours et du Centre-Val de Loire dans la cr\u00e9ation de leur film de pr\u00e9sentation, de la conception au montage final.",
    },
    {
      question: "Quelle est la dur\u00e9e id\u00e9ale pour un film d\u2019entreprise ?",
      answer:
        "Entre 2 et 4 minutes pour un film de pr\u00e9sentation g\u00e9n\u00e9ral. Au-del\u00e0, l\u2019attention diminue. Pour les r\u00e9seaux sociaux, on d\u00e9cline en versions de 30 \u00e0 90 secondes.",
    },
    {
      question: "Nos collaborateurs doivent-ils passer devant la cam\u00e9ra ?",
      answer:
        "Ce n\u2019est pas obligatoire, mais fortement recommand\u00e9. Les visages humains cr\u00e9ent un lien \u00e9motionnel. On met les intervenants \u00e0 l\u2019aise et on guide la prise de parole.",
    },
    {
      question: "Combien de temps dure la production compl\u00e8te ?",
      answer:
        "Comptez 4 \u00e0 8 semaines entre le brief initial et la livraison finale, selon la complexit\u00e9 du projet. Un calendrier d\u00e9taill\u00e9 est fourni d\u00e8s la validation du devis.",
    },
    {
      question: "Peut-on mettre \u00e0 jour le film plus tard ?",
      answer:
        "Oui. Nous conservons les fichiers projet et pouvons r\u00e9aliser des mises \u00e0 jour (nouveau plan, changement de texte, ajout d\u2019interview) \u00e0 un tarif pr\u00e9f\u00e9rentiel.",
    },
  ],
  serviceType: "VideographyService",
  priceRange: "$$$",
  coverImageUrl: "/images/services/presentation-entreprise.jpg",
  coverImageAlt:
    "Tournage film de pr\u00e9sentation d\u2019entreprise \u2014 \u00e9quipe DeepFrame en action",
  videoUrl: null,
  category: "video",
  sortOrder: 9,
  iconName: "building",
  teamMembers: ["PAPI", "LOUISIA", "TY"],
  deliverables: [
    { label: "Film mont\u00e9 HD/4K", detail: "Version longue (2-5 min)" },
    { label: "Version courte r\u00e9seaux sociaux", detail: "30 \u00e0 90 secondes" },
    { label: "Sous-titres", detail: "Fran\u00e7ais + anglais (option)" },
    { label: "Motion design int\u00e9gr\u00e9", detail: "Titrages, transitions, g\u00e9n\u00e9rique" },
    { label: "Script et storyboard valid\u00e9s" },
    { label: "Musique licenci\u00e9e" },
  ],
  equipment: [
    { name: "Sony FX6", detail: "Caméra cinéma full frame" },
    { name: "DJI RS3 Pro", detail: "Stabilisateur professionnel" },
    { name: "Drone DJI (option)", detail: "Plans aériens d’ouverture" },
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
  name: "Clip musical et vid\u00e9oclip",
  shortName: "Clip musical",
  metaTitle: "Clip musical vid\u00e9oclip Orl\u00e9ans Tours | DeepFrame",
  metaDescription:
    "R\u00e9alisation de clips musicaux et vid\u00e9oclips \u00e0 Orl\u00e9ans et Tours. Direction artistique, tournage cin\u00e9ma, montage cr\u00e9atif. Artistes et labels ind\u00e9pendants.",
  h1: "Clip musical \u2014 donnez une image \u00e0 votre son",
  introParagraph:
    "Un clip musical est bien plus qu\u2019une vid\u00e9o : c\u2019est une \u0153uvre visuelle qui prolonge votre univers artistique. Chez DeepFrame, nous r\u00e9alisons des clips pour les artistes et labels ind\u00e9pendants avec une approche cin\u00e9matographique, de la direction artistique au montage final. Bient\u00f4t disponible \u00e0 Orl\u00e9ans, Tours et dans toute la France.",
  problemQuestion:
    "Pourquoi un clip professionnel change la trajectoire d\u2019un artiste ?",
  problemAnswer:
    "Dans un march\u00e9 musical satur\u00e9, l\u2019image fait la diff\u00e9rence. Un clip professionnel, avec une direction artistique forte et un rendu cin\u00e9ma, capte l\u2019attention des playlisters, des m\u00e9dias et du public. Il transforme un morceau en exp\u00e9rience compl\u00e8te et multiplie sa port\u00e9e sur YouTube, Spotify et les r\u00e9seaux sociaux.",
  features: [
    {
      h3: "Direction artistique et concept cr\u00e9atif",
      content:
        "On d\u00e9veloppe un concept visuel coh\u00e9rent avec votre univers musical. Moodboard, traitement visuel, casting, rep\u00e9rage de lieux \u2014 chaque d\u00e9tail est pens\u00e9 avant le tournage.",
    },
    {
      h3: "Tournage cin\u00e9ma et \u00e9clairage cr\u00e9atif",
      content:
        "Cam\u00e9ras cin\u00e9ma, optiques professionnelles, \u00e9clairage d\u2019ambiance. On tourne avec le m\u00eame mat\u00e9riel et la m\u00eame exigence que pour un court-m\u00e9trage.",
    },
    {
      h3: "Montage et \u00e9talonnage clip",
      content:
        "Montage rythm\u00e9 au tempo du morceau, transitions cr\u00e9atives, \u00e9talonnage color grading pour une ambiance visuelle unique. Chaque clip a son identit\u00e9.",
    },
    {
      h3: "Effets visuels et motion design",
      content:
        "Int\u00e9gration d\u2019effets sp\u00e9ciaux, de titrages anim\u00e9s ou de s\u00e9quences en motion design pour enrichir le clip sans le surcharger.",
    },
  ],
  faq: [
    {
      question: "Combien co\u00fbte la r\u00e9alisation d\u2019un clip musical ?",
      answer:
        "Le budget d\u00e9pend de l\u2019ambition cr\u00e9ative : nombre de lieux, figurants, effets visuels. Nos clips d\u00e9marrent \u00e0 partir de 1 500 \u20ac HT. Contactez-nous pour un devis personnalis\u00e9.",
    },
    {
      question: "R\u00e9alisez-vous des clips \u00e0 Orl\u00e9ans et Tours ?",
      answer:
        "Oui, c\u2019est notre base d\u2019op\u00e9rations. Nous connaissons les lieux les plus photog\u00e9niques de la r\u00e9gion. Nous nous d\u00e9pla\u00e7ons \u00e9galement partout en France selon les besoins du projet.",
    },
    {
      question: "Travaillez-vous avec des artistes ind\u00e9pendants ?",
      answer:
        "Absolument. La majorit\u00e9 de nos clips sont r\u00e9alis\u00e9s pour des artistes ind\u00e9pendants et des labels \u00e9mergents. On s\u2019adapte \u00e0 votre budget sans sacrifier la qualit\u00e9.",
    },
    {
      question: "Quel est le d\u00e9lai pour un clip musical ?",
      answer:
        "Comptez 3 \u00e0 6 semaines entre le premier \u00e9change et la livraison, selon la complexit\u00e9 du concept. La pr\u00e9-production (concept, rep\u00e9rage) repr\u00e9sente une part importante du planning.",
    },
    {
      question: "Peut-on tourner un clip en une seule journ\u00e9e ?",
      answer:
        "Oui, pour les concepts les plus simples. La plupart des clips n\u00e9cessitent 1 \u00e0 2 jours de tournage, mais nous optimisons chaque minute sur le plateau.",
    },
  ],
  serviceType: "VideographyService",
  priceRange: "$$$",
  coverImageUrl: "/images/services/clip-musical.jpg",
  coverImageAlt:
    "Tournage clip musical en ext\u00e9rieur \u2014 r\u00e9alisation cin\u00e9ma DeepFrame",
  videoUrl: null,
  category: "video",
  sortOrder: 10,
  iconName: "music",
  teamMembers: ["PAPI", "TY"],
  deliverables: [
    { label: "Clip mont\u00e9 HD/4K", detail: "Dur\u00e9e du morceau" },
    { label: "Teaser promotionnel", detail: "15 \u00e0 30 secondes" },
    { label: "\u00c9talonnage cin\u00e9ma", detail: "Color grading sur mesure" },
    { label: "Concept cr\u00e9atif et moodboard" },
    { label: "Behind the scenes", detail: "Photos + vid\u00e9o (option)" },
  ],
  equipment: [],
  zoneText: ZONE_ORLEANS_TOURS,
  relatedSlugs: ["montage-video", "motion-design", "voix-off-sound-design"],
  isPublished: false,
};

// ---------------------------------------------------------------------------
// 11. Drone et prise de vue a\u00e9rienne (COMING SOON)
// ---------------------------------------------------------------------------

const dronePriseDeVue: ServiceContent = {
  slug: "drone-prise-de-vue-aerienne",
  name: "Drone et prise de vue a\u00e9rienne",
  shortName: "Prise de vue drone",
  metaTitle: "Drone prise de vue a\u00e9rienne Orl\u00e9ans Tours | DeepFrame",
  metaDescription:
    "Prise de vue a\u00e9rienne par drone \u00e0 Orl\u00e9ans et Tours. Vid\u00e9o et photo a\u00e9rienne pour immobilier, \u00e9v\u00e9nementiel, corporate. Pilote certifi\u00e9 DGAC.",
  h1: "Drone et prise de vue a\u00e9rienne \u2014 une perspective unique",
  introParagraph:
    "Les images a\u00e9riennes ajoutent une dimension spectaculaire \u00e0 vos projets vid\u00e9o et photo. Survols d\u2019architecture, immobilier, \u00e9v\u00e9nements en plein air, plans d\u2019ouverture cin\u00e9matographiques \u2014 le drone ouvre des angles impossibles depuis le sol. Bient\u00f4t disponible \u00e0 Orl\u00e9ans, Tours et en Centre-Val de Loire avec pilote certifi\u00e9.",
  problemQuestion:
    "Quand la prise de vue a\u00e9rienne par drone est-elle pertinente ?",
  problemAnswer:
    "D\u00e8s que vous avez besoin de montrer l\u2019ampleur d\u2019un lieu, d\u2019un \u00e9v\u00e9nement ou d\u2019un projet. En immobilier, le drone r\u00e9v\u00e8le l\u2019environnement du bien. En corporate, il donne une dimension \u00e9pique \u00e0 votre film. En \u00e9v\u00e9nementiel, il capture l\u2019\u00e9nergie de la foule vue du ciel. Chez DeepFrame, chaque vol est pr\u00e9par\u00e9 dans le respect strict de la r\u00e9glementation DGAC.",
  features: [
    {
      h3: "Vid\u00e9o a\u00e9rienne 4K stabilis\u00e9e",
      content:
        "Plans a\u00e9riens fluides en 4K avec nacelle stabilis\u00e9e 3 axes. Mouvements de cam\u00e9ra cin\u00e9matographiques : travellings, r\u00e9v\u00e9lations, orbitales.",
    },
    {
      h3: "Photo a\u00e9rienne haute r\u00e9solution",
      content:
        "Photos a\u00e9riennes en haute r\u00e9solution pour l\u2019immobilier, l\u2019urbanisme, l\u2019agriculture ou la communication corporate. Livr\u00e9es retouch\u00e9es et g\u00e9or\u00e9f\u00e9renc\u00e9es sur demande.",
    },
    {
      h3: "Pilotage certifi\u00e9 et autorisations",
      content:
        "Pilote certifi\u00e9 DGAC, assurance RC professionnelle, d\u00e9clarations de vol et demandes d\u2019autorisation pr\u00e9fectorale incluses. On g\u00e8re toute la partie administrative.",
    },
    {
      h3: "Int\u00e9gration dans vos productions vid\u00e9o",
      content:
        "Les plans drone s\u2019int\u00e8grent naturellement dans vos films corporate, clips, reportages ou contenus r\u00e9seaux sociaux. On g\u00e8re le montage et l\u2019\u00e9talonnage pour une coh\u00e9rence parfaite.",
    },
  ],
  faq: [
    {
      question: "Combien co\u00fbte une prestation drone ?",
      answer:
        "Les tarifs d\u00e9pendent de la dur\u00e9e du vol, du nombre de lieux et du type de livrable (vid\u00e9o, photo, les deux). Comptez \u00e0 partir de 500 \u20ac HT pour une demi-journ\u00e9e. Devis gratuit en ligne.",
    },
    {
      question: "Faites-vous du drone \u00e0 Orl\u00e9ans et Tours ?",
      answer:
        "Oui, sous r\u00e9serve des autorisations de vol (certaines zones urbaines sont soumises \u00e0 restrictions). Nous g\u00e9rons les demandes d\u2019autorisation pr\u00e9fectorale pour vous.",
    },
    {
      question: "Votre pilote est-il certifi\u00e9 ?",
      answer:
        "Oui, notre pilote dispose de l\u2019attestation de comp\u00e9tences DGAC (cat\u00e9gorie ouverte et sp\u00e9cifique) et d\u2019une assurance RC professionnelle.",
    },
    {
      question: "Peut-on combiner drone et tournage au sol ?",
      answer:
        "Absolument. C\u2019est m\u00eame le sc\u00e9nario le plus courant. Les plans drone enrichissent un tournage classique avec des angles et perspectives impossibles depuis le sol.",
    },
    {
      question: "Quelles sont les conditions m\u00e9t\u00e9o requises pour un vol drone ?",
      answer:
        "Pas de pluie, vent mod\u00e9r\u00e9 (<40 km/h), visibilit\u00e9 suffisante. En cas de m\u00e9t\u00e9o d\u00e9favorable, nous reprogrammons le vol sans frais suppl\u00e9mentaires.",
    },
  ],
  serviceType: "VideographyService",
  priceRange: "$$",
  coverImageUrl: "/images/services/drone-prise-de-vue-aerienne.jpg",
  coverImageAlt:
    "Prise de vue a\u00e9rienne par drone au-dessus de la Loire \u2014 DeepFrame Orl\u00e9ans",
  videoUrl: null,
  category: "video",
  sortOrder: 11,
  iconName: "plane",
  teamMembers: ["PAPI"],
  deliverables: [
    { label: "Vid\u00e9o a\u00e9rienne 4K", detail: "Plans stabilis\u00e9s" },
    { label: "Photos a\u00e9riennes HD", detail: "Retouch\u00e9es et calibr\u00e9es" },
    { label: "Autorisations de vol", detail: "D\u00e9clarations DGAC incluses" },
    { label: "Int\u00e9gration montage", detail: "Si coupl\u00e9 \u00e0 une production vid\u00e9o" },
  ],
  equipment: [],
  zoneText:
    "Nous r\u00e9alisons des prises de vue a\u00e9riennes \u00e0 Orl\u00e9ans, Tours et dans tout le Centre-Val de Loire (Loiret, Indre-et-Loire, Loir-et-Cher). Les vols en zone urbaine n\u00e9cessitent des autorisations sp\u00e9cifiques que nous g\u00e9rons int\u00e9gralement. D\u00e9placements possibles dans toute la France.",
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
  interviewTemoignage,
  voixOffSoundDesign,
  presentationEntreprise,
  clipMusical,
  dronePriseDeVue,
];
