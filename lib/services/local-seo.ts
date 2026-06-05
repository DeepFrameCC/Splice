/**
 * Static data for geo-local SEO pages.
 *
 * Provides content for 12 pages (6 services x 2 villes : Orléans + Tours) at
 * `/services/[slug]/[ville]`. Entirely static — no database calls.
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
  | "photographie-google-business"
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

export interface LocalFaqItem {
  question: string;
  answer: string;
}

/**
 * Unique editorial content per (service × ville) couple. Used to give each
 * geo page a genuinely distinct body — anti-doorway. `localContext` is a single
 * prose block (200-300 mots) and `localFaq` includes the "near-me" question.
 */
export interface LocalPageContent {
  localContext: string;
  localFaq: LocalFaqItem[];
}

export type LocalVilleSlug = "orleans" | "tours";

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
  "photographie-google-business",
  "interview-temoignage",
];

// ---------------------------------------------------------------------------

export const LOCAL_SERVICE_DATA: Record<LocalServiceSlug, LocalServiceTemplate> =
  {
    "montage-video": {
      serviceName: "Montage vidéo professionnel",
      shortName: "Montage vidéo",
      h1Template: "Montage vidéo professionnel à {ville}",
      introTemplate:
        "Vous cherchez un monteur vidéo à {ville} ({department}) ? Splice Studio réalise le montage de vos contenus vidéo avec un rendu professionnel adapté à chaque plateforme. Du montage corporate au contenu réseaux sociaux, nous intervenons rapidement dans tout le {department}.",
      points: [
        "Montage optimisé pour chaque plateforme (YouTube, Instagram, TikTok, LinkedIn)",
        "Sous-titres animés, étalonnage couleur et habillage graphique inclus",
        "Livraison rapide avec 2 allers-retours de corrections",
        "Logiciels professionnels : Premiere Pro, DaVinci Resolve, After Effects",
      ],
      deliveryTime: "7 à 14 jours",
      priceRange: "À partir de 390 €",
    },

    "production-corporate": {
      serviceName: "Production vidéo corporate",
      shortName: "Vidéo corporate",
      h1Template: "Production vidéo corporate à {ville}",
      introTemplate:
        "Splice Studio accompagne les entreprises de {ville} et du {department} dans la création de films corporate sur mesure. Présentation d'entreprise, vidéo institutionnelle ou film de marque : chaque projet est pensé pour refléter votre identité et convaincre vos audiences.",
      points: [
        "Pré-production complète : scénario, repérage, casting et planning de tournage",
        "Tournage en qualité cinéma avec un setup léger (Sony ZV-1 4K, micro sans fil DJI)",
        "Post-production soignée : montage narratif, étalonnage, mixage audio",
        "Versions adaptées pour votre site web, vos réseaux sociaux et vos événements",
      ],
      deliveryTime: "7 à 14 jours",
      priceRange: "À partir de 1 490 €",
    },

    "motion-design": {
      serviceName: "Motion design",
      shortName: "Motion design",
      h1Template: "Motion design à {ville}",
      introTemplate:
        "Besoin d'une animation percutante pour votre marque à {ville} ? Splice Studio conçoit des vidéos en motion design qui captent l'attention et simplifient vos messages. Basés en {department}, nous créons des animations 2D et 3D pour tous vos supports de communication.",
      points: [
        "Animations 2D et 3D personnalisées à votre charte graphique",
        "Infographies animées, explainers et habillages vidéo",
        "Intégration fluide avec vos contenus filmés existants",
        "Fichiers source livrés pour vos futures déclinaisons",
      ],
      deliveryTime: "7 à 14 jours",
      priceRange: "À partir de 690 €",
    },

    "pub-reseaux-sociaux": {
      serviceName: "Publicité réseaux sociaux",
      shortName: "Pub réseaux sociaux",
      h1Template: "Publicité vidéo pour les réseaux sociaux à {ville}",
      introTemplate:
        "Boostez votre visibilité à {ville} avec des publicités vidéo pensées pour les réseaux sociaux. Splice Studio produit des contenus courts et percutants pour Instagram, TikTok, Facebook et LinkedIn. Nous accompagnons les marques du {department} dans leur stratégie de contenu vidéo.",
      points: [
        "Formats courts optimisés pour chaque réseau (Reels, TikTok, Stories, Shorts)",
        "Scripts accrocheurs et direction artistique orientée conversion",
        "Tournage et montage rapides pour suivre vos temps forts marketing",
        "Packs mensuels disponibles pour une présence régulière",
      ],
      deliveryTime: "7 à 14 jours",
      priceRange: "À partir de 290 €",
    },

    "photographie-professionnelle": {
      serviceName: "Photographie professionnelle",
      shortName: "Photographie",
      h1Template: "Photographe professionnel à {ville}",
      introTemplate:
        "Splice Studio propose des prestations de photographie professionnelle à {ville} et dans le {department}. Portraits corporate, shooting produit, couverture événementielle ou reportage : nous capturons l'image juste pour valoriser votre activité.",
      points: [
        "Shooting en studio ou en extérieur, boîtier hybride 4K et lumière naturelle",
        "Retouche avancée et livraison en haute définition pour print et web",
        "Direction artistique adaptée à votre univers de marque",
        "Galerie privée en ligne pour sélectionner et télécharger vos photos",
      ],
      deliveryTime: "7 à 14 jours",
      priceRange: "À partir de 350 €",
    },

    "photographie-google-business": {
      serviceName: "Photographie Google Business Profile",
      shortName: "Photo Google Business",
      h1Template: "Photographe Google Business Profile à {ville}",
      introTemplate:
        "Valorisez votre établissement à {ville} et boostez votre référencement local. Splice Studio réalise des reportages photo professionnels optimisés pour votre fiche Google Business Profile dans tout le département du {department}.",
      points: [
        "Shooting intérieur, extérieur et photos d'équipe à {ville}",
        "Photos optimisées pour le Pack Local et les critères de l'algorithme Google",
        "Retouches de qualité professionnelle et formats de fichiers web optimisés",
        "Intervention rapide sur site avec livraison sous 7 à 14 jours",
      ],
      deliveryTime: "7 à 14 jours",
      priceRange: "À partir de 190 €",
    },

    "interview-temoignage": {
      serviceName: "Interview & témoignage vidéo",
      shortName: "Interview vidéo",
      h1Template: "Interview et témoignage vidéo à {ville}",
      introTemplate:
        "Donnez la parole à vos collaborateurs et clients grâce à des interviews vidéo réalisées par Splice Studio à {ville}. Les témoignages authentiques renforcent la crédibilité de votre marque. Nous nous déplaçons dans tout le {department} pour des tournages sur site.",
      points: [
        "Préparation éditoriale : brief, questions-guides et déroulé de l'entretien",
        "Tournage multicaméra avec son professionnel (micro-cravate HF)",
        "Montage dynamique avec habillage, sous-titres et musique libre de droits",
        "Format long pour votre site et versions courtes pour les réseaux sociaux",
      ],
      deliveryTime: "7 à 14 jours",
      priceRange: "À partir de 890 €",
    },
  };

// ---------------------------------------------------------------------------
// Unique local content (6 services × 2 villes = 12 blocs distincts)
// ---------------------------------------------------------------------------

export const LOCAL_PAGE_CONTENT: Record<
  LocalServiceSlug,
  Record<LocalVilleSlug, LocalPageContent>
> = {
  "montage-video": {
    orleans: {
      localContext:
        "À Orléans, le tissu économique tertiaire — services, administrations, sièges régionaux et acteurs de la Cosmetic Valley — produit beaucoup d'images mais manque souvent de temps pour les exploiter. Splice Studio prend le relais sur la partie montage : nous récupérons vos rushes (interviews internes, captations d'événements, fonds de tournage) et nous les transformons en contenus prêts à diffuser. Le rythme d'une métropole comme Orléans impose des formats courts et clairs : capsules de formation, résumés de séminaire, vidéos LinkedIn pour la marque employeur. Nous montons en pensant à votre canal de diffusion final, avec sous-titres animés indispensables pour le visionnage sans son et un étalonnage qui respecte votre charte. Nos allers-retours de validation sont pensés pour les équipes communication qui travaillent dans des délais serrés. Que vous soyez implanté dans le centre-ville, à La Source, à Saran ou à Olivet, le montage se fait à distance à partir de vos fichiers, sans contrainte de déplacement. Nous montons régulièrement les contenus de PME locales et d'entreprises orléanaises qui cherchent à gagner en visibilité sur les réseaux, ainsi que des captations confiées par des mairies du Loiret pour leurs événements.",
      localFaq: [
        {
          question: "Comment trouver un monteur vidéo autour de moi à Orléans ?",
          answer:
            "Le montage ne nécessite pas de rendez-vous physique : vous nous transmettez vos rushes en ligne et nous livrons le montage finalisé via une galerie privée. Splice Studio est basé en Centre-Val de Loire et travaille au quotidien avec des clients d'Orléans et de toute la métropole. Pour un échange de cadrage, retrouvez-nous sur notre fiche établissement et notre page de contact.",
        },
        {
          question: "Puis-je vous envoyer des rushes filmés par mes propres équipes ?",
          answer:
            "Oui. Nous montons aussi bien nos propres tournages que vos fichiers existants (smartphone, caméra, captation prestataire). Nous vous indiquons en amont les réglages idéaux pour garantir un rendu homogène.",
        },
      ],
    },
    tours: {
      localContext:
        "À Tours, la demande de montage vidéo est portée par d'autres univers qu'à Orléans : acteurs du tourisme et du patrimoine du Val de Loire, domaines viticoles, restauration et vie étudiante dynamisent un fort besoin de contenus web. Splice Studio monte vos images pour qu'elles racontent une histoire : teasers de visite, capsules gastronomiques, formats verticaux pour les réseaux. Le défi tourangeau, c'est souvent la saisonnalité — il faut publier vite avant le pic touristique. Nous calons donc nos délais de montage sur vos temps forts et livrons des versions multiples (format long pour le site, formats courts pour Instagram et TikTok). Sous-titres, habillage graphique aligné sur votre identité et musique libre de droits sont inclus. Le travail s'effectue à partir de vos rushes transmis en ligne, ce qui nous permet d'intervenir pour les structures du centre historique, du quartier Plumereau comme de la périphérie tourangelle sans logistique de déplacement. À Tours, nous montons aussi bien les vidéos de PME et de restaurants que des captations d'événements municipaux confiées par les collectivités locales.",
      localFaq: [
        {
          question: "Comment trouver un monteur vidéo autour de moi à Tours ?",
          answer:
            "Le montage se fait intégralement à distance : transmettez vos rushes en ligne, recevez le montage via une galerie privée. Splice Studio intervient régulièrement pour des clients de Tours et d'Indre-et-Loire. Un échange visio ou téléphonique suffit pour cadrer le projet ; notre fiche établissement et notre formulaire de contact restent à votre disposition.",
        },
        {
          question: "Pouvez-vous livrer plusieurs formats à partir d'un même tournage ?",
          answer:
            "Oui, c'est même recommandé : à partir d'un seul lot de rushes, nous déclinons une version longue pour votre site et des formats courts verticaux pour vos réseaux sociaux.",
        },
      ],
    },
  },

  "production-corporate": {
    orleans: {
      localContext:
        "Orléans concentre un tissu de PME et d'ETI industrielles, de laboratoires de la Cosmetic Valley et de sièges de services qui ont tout intérêt à valoriser leur savoir-faire en vidéo. Splice Studio produit des films corporate sur site, dans vos locaux ou vos ateliers des zones d'activité de Saran, Ingré, Fleury-les-Aubrais ou de la technopole d'Orléans La Source. Notre approche est intégrale : nous écrivons le message clé avec vous, repérons les lieux de tournage, filmons en qualité cinéma (Sony ZV-1 4K, micro sans fil DJI) puis assurons la post-production. L'objectif d'un film d'entreprise à Orléans est rarement la notoriété grand public : il s'agit le plus souvent de convaincre des clients B2B, de recruter, ou de présenter une expertise technique. Nous structurons donc le récit autour de la preuve et de l'humain. Chaque film est décliné pour votre site, vos rendez-vous commerciaux et vos réseaux. Nos clients à Orléans sont surtout des PME locales et des entreprises en quête de visibilité, ainsi que des mairies du Loiret pour leurs films institutionnels et la couverture d'événements de la ville.",
      localFaq: [
        {
          question: "Comment trouver un vidéaste corporate autour de moi à Orléans ?",
          answer:
            "Splice Studio se déplace dans vos locaux partout dans la métropole d'Orléans et le Loiret pour le tournage. La pré-production et la post-production se gèrent à distance. Demandez un devis en ligne pour caler une date de tournage ; nous confirmons notre zone d'intervention et la logistique.",
        },
        {
          question: "Combien de temps faut-il prévoir pour un film corporate ?",
          answer:
            "Comptez en général 7 à 14 jours entre le brief validé et la livraison, selon le nombre de jours de tournage. Nous calons le planning avec vos disponibilités internes.",
        },
      ],
    },
    tours: {
      localContext:
        "À Tours, la production audiovisuelle corporate s'adresse à un écosystème marqué par le tourisme, la viticulture du Val de Loire, la gastronomie et un pôle universitaire actif. Un film de marque tourangeau valorise souvent un territoire et un terroir autant qu'une entreprise : domaines viticoles, maisons gastronomiques, acteurs du patrimoine UNESCO. Splice Studio se déplace dans vos locaux, vos chais ou vos sites de production en Indre-et-Loire pour tourner en qualité cinéma. Nous prenons en charge l'ensemble de la chaîne : scénario, repérage, tournage 4K avec micro sans fil DJI, puis montage narratif, étalonnage et mixage. À la différence d'un film purement industriel, le brand content tourangeau mise volontiers sur l'esthétique des lieux et l'émotion. Chaque production est livrée en plusieurs versions : film institutionnel pour le site, capsules pour les réseaux, formats pour vos événements et salons professionnels. À Tours, nous accompagnons des PME, des entreprises tournées vers leur communication sur les réseaux et des collectivités qui souhaitent valoriser leur territoire en vidéo.",
      localFaq: [
        {
          question: "Comment trouver un vidéaste corporate autour de moi à Tours ?",
          answer:
            "Splice Studio intervient sur site partout en Indre-et-Loire pour le tournage de votre film d'entreprise ; la conception et le montage se font à distance. Faites une demande de devis en ligne et nous validons ensemble la date et le lieu de tournage à Tours ou aux alentours.",
        },
        {
          question: "Pouvez-vous tourner dans un domaine viticole ou un lieu patrimonial ?",
          answer:
            "Oui. Nous adaptons notre matériel léger aux contraintes des lieux (chais, caves, monuments) pour en révéler l'atmosphère tout en restant discrets sur site.",
        },
      ],
    },
  },

  "motion-design": {
    orleans: {
      localContext:
        "Le motion design répond à un besoin précis des entreprises orléanaises : rendre clair et mémorable un message qui ne se filme pas facilement. Process industriel, offre de service, données chiffrées, parcours client — autant de sujets où l'animation 2D ou 3D fait gagner en pédagogie. Splice Studio conçoit pour les acteurs d'Orléans des explainers, des infographies animées et des habillages vidéo calés sur leur charte graphique. La cible est souvent B2B ou institutionnelle : il faut donc un motion sobre, précis, qui sert le propos plutôt que la démonstration technique. Nous travaillons à partir de votre identité visuelle existante et livrons les fichiers source pour vos futures déclinaisons. L'intégration avec vos contenus filmés (interviews, films corporate) est pensée dès le départ pour une cohérence d'ensemble. Tout le travail est réalisable à distance à partir de votre brief et de vos éléments de marque. Le motion design s'adresse ici à nos clients PME et aux entreprises orléanaises qui veulent se démarquer sur les réseaux, comme aux mairies pour habiller leurs campagnes et leurs événements.",
      localFaq: [
        {
          question: "Comment trouver un studio de motion design autour de moi à Orléans ?",
          answer:
            "Le motion design se conçoit à distance : vous nous transmettez votre charte et votre brief, nous animons et livrons en ligne. Splice Studio accompagne régulièrement des clients d'Orléans et du Loiret. Un appel ou une visio suffit pour cadrer le projet.",
        },
        {
          question: "Fournissez-vous les fichiers source des animations ?",
          answer:
            "Oui, les fichiers source sont livrés sur demande afin que vous puissiez réutiliser ou décliner vos animations par la suite.",
        },
      ],
    },
    tours: {
      localContext:
        "À Tours, le motion design trouve un terrain naturel auprès des acteurs culturels, touristiques et événementiels du Val de Loire, mais aussi des startups et structures de l'enseignement supérieur. L'animation y sert souvent à habiller un événement, à dynamiser une campagne saisonnière ou à vulgariser une offre. Splice Studio crée pour les marques tourangelles des animations 2D et 3D, des titrages animés et des boucles graphiques pour écrans et réseaux. Là où le motion orléanais penche vers le B2B et l'institutionnel, la demande tourangelle est volontiers plus créative et grand public. Nous partons de votre univers de marque pour proposer un style d'animation qui vous distingue, puis nous l'intégrons à vos contenus filmés existants. Les fichiers source sont fournis pour vos déclinaisons. La conception se fait entièrement à distance, à partir de votre brief et de vos éléments graphiques, sans contrainte de localisation. À Tours, nous créons des animations pour des PME, des commerces et des collectivités locales souhaitant dynamiser leurs communications et leurs événements de ville.",
      localFaq: [
        {
          question: "Comment trouver un studio de motion design autour de moi à Tours ?",
          answer:
            "Le motion design ne nécessite pas de rendez-vous physique : transmettez-nous votre brief et votre charte, nous livrons l'animation en ligne. Splice Studio travaille avec des clients de Tours et d'Indre-et-Loire ; un échange visio suffit à lancer le projet.",
        },
        {
          question: "Pouvez-vous animer un logo ou une charte existante ?",
          answer:
            "Oui. Nous partons de vos éléments de marque (logo, couleurs, typographies) pour créer des animations cohérentes avec votre identité visuelle.",
        },
      ],
    },
  },

  "pub-reseaux-sociaux": {
    orleans: {
      localContext:
        "Les commerces, restaurants et marques locales d'Orléans se disputent l'attention sur des réseaux saturés. La publicité vidéo verticale est devenue le levier le plus efficace pour émerger localement — à condition d'accrocher dans les trois premières secondes. Splice Studio produit pour les acteurs orléanais des contenus courts pensés pour le mobile : Reels Instagram, TikTok, Stories et Shorts. Nous écrivons des scripts orientés conversion, tournons des formats 9:16 natifs et intégrons des sous-titres animés indispensables au visionnage sans son. Pour un commerce du centre-ville d'Orléans, un restaurant ou une enseigne locale, l'enjeu est de transformer la visibilité en visites et en ventes. Nous proposons des packs réguliers pour entretenir une présence constante plutôt qu'un coup ponctuel. Le tournage peut se faire sur votre lieu d'activité dans la métropole, et le montage est livré rapidement pour coller à vos temps forts commerciaux. Nos clients sur Orléans sont en majorité des restaurants, des commerces de proximité et des entreprises locales qui veulent gagner en visibilité sur les réseaux — jusqu'aux particuliers pour des prestations ponctuelles.",
      localFaq: [
        {
          question: "Comment trouver une agence de pub réseaux sociaux autour de moi à Orléans ?",
          answer:
            "Splice Studio se déplace sur votre lieu d'activité à Orléans pour le tournage, et gère le montage à distance. Nous accompagnons les commerces et marques de la métropole avec des packs vidéo réguliers. Demandez un devis en ligne pour démarrer.",
        },
        {
          question: "Proposez-vous des contenus en plusieurs versions pour tester ?",
          answer:
            "Oui. Nos packs publicitaires incluent plusieurs accroches (hooks) et durées alternatives pour optimiser vos campagnes en test A/B.",
        },
      ],
    },
    tours: {
      localContext:
        "À Tours, la publicité sur les réseaux sociaux est tirée par une scène locale très vivante : bars et restaurants du quartier Plumereau, commerces du vieux Tours, événements étudiants et acteurs du tourisme. Le public tourangeau, plus jeune et plus connecté en moyenne, attend des contenus rythmés et authentiques. Splice Studio produit des vidéos verticales courtes — Reels, TikTok, Shorts — calibrées pour stopper le défilement et donner envie de pousser la porte. Nous misons sur des accroches fortes, un montage nerveux et des sous-titres animés. Contrairement à une logique purement B2B, la pub social tourangelle joue volontiers la carte de l'ambiance, du lieu et de l'instant. Nous tournons sur place, dans votre établissement, et livrons vite pour suivre l'agenda local et la saisonnalité touristique. Des packs mensuels permettent d'alimenter régulièrement vos comptes et de capitaliser sur la régularité plutôt que sur des publications isolées. À Tours, nous produisons ces contenus pour des restaurants, des commerces et des entreprises en quête de notoriété sociale, ainsi que pour des particuliers ayant un projet précis.",
      localFaq: [
        {
          question: "Comment trouver une agence de pub réseaux sociaux autour de moi à Tours ?",
          answer:
            "Splice Studio intervient directement dans votre établissement à Tours pour le tournage, puis assure le montage à distance. Nous travaillons avec des commerces, restaurants et marques d'Indre-et-Loire via des packs réguliers. Une demande de devis en ligne lance le projet.",
        },
        {
          question: "Quelle durée recommandez-vous pour une vidéo publicitaire mobile ?",
          answer:
            "Nous recommandons des formats de 15 à 30 secondes, très rythmés, pour maximiser le taux de complétion sur Instagram, TikTok et YouTube Shorts.",
        },
      ],
    },
  },

  "photographie-professionnelle": {
    orleans: {
      localContext:
        "La photographie professionnelle à Orléans répond d'abord à des besoins d'entreprise : portraits corporate pour LinkedIn et la marque employeur, reportages métier dans les ateliers, packshots produits pour les acteurs de la Cosmetic Valley et de l'e-commerce local. Splice Studio réalise un shooting photo à Orléans en studio mobile ou en lumière naturelle, directement dans vos locaux du centre-ville, de La Source ou des zones d'activité voisines. Des visuels réels, qui montrent vos équipes, vos gestes techniques et vos produits, inspirent bien plus confiance qu'une banque d'images générique. C'est particulièrement vrai pour les PME orléanaises qui veulent renforcer leur crédibilité B2B. Nous assurons la direction artistique, la retouche avancée et la livraison en haute définition pour le print comme pour le web, via une galerie privée en ligne. Pour les besoins ponctuels comme pour des collaborations régulières, nous adaptons les formules. Nous photographions aussi bien des PME locales et des restaurants que des entreprises soignant leur image, des mairies lors d'événements de la ville et des particuliers souhaitant une prestation pour eux.",
      localFaq: [
        {
          question: "Comment trouver un photographe autour de moi à Orléans ?",
          answer:
            "Splice Studio se déplace dans vos locaux partout dans la métropole d'Orléans et le Loiret pour vos shootings photo. Vous pouvez aussi nous retrouver via notre fiche établissement et demander un devis en ligne. Nous confirmons la date et le lieu de prise de vue avec vous.",
        },
        {
          question: "Sous quel délai livrez-vous les photos ?",
          answer:
            "Les clichés sélectionnés et retouchés sont livrés sous 7 à 14 jours via une galerie en ligne privée et sécurisée.",
        },
      ],
    },
    tours: {
      localContext:
        "À Tours, la photographie professionnelle s'oriente davantage vers le terroir, l'art de vivre et le patrimoine du Val de Loire : reportages dans les domaines viticoles, photographie gastronomique, immobilier de caractère et portraits d'artisans. Splice Studio réalise un shooting photo à Tours en studio mobile ou en lumière naturelle, sur votre lieu d'activité en Indre-et-Loire. Là où la demande orléanaise est nettement corporate, le besoin tourangeau valorise souvent l'esthétique du lieu et du produit — une bouteille, un plat, une façade, un savoir-faire manuel. Nous soignons la direction artistique pour traduire votre univers, puis assurons une retouche avancée et une livraison haute définition adaptée au print et au web. Une galerie privée en ligne vous permet de sélectionner et de télécharger vos images. Nous proposons aussi bien des prestations ponctuelles que des formules régulières pour alimenter durablement vos supports de communication. À Tours, nos prises de vue couvrent les PME, les restaurants et commerces, les collectivités lors d'événements de ville, comme les particuliers en quête d'une séance dédiée.",
      localFaq: [
        {
          question: "Comment trouver un photographe autour de moi à Tours ?",
          answer:
            "Splice Studio se déplace sur votre lieu d'activité à Tours et en Indre-et-Loire pour vos prises de vue. Retrouvez-nous via notre fiche établissement et notre page de contact, ou demandez directement un devis en ligne pour fixer la séance.",
        },
        {
          question: "Photographiez-vous les produits et les lieux, pas seulement les personnes ?",
          answer:
            "Oui. Nous réalisons portraits, reportages métier, packshots produits et photographie de lieux (immobilier, domaines, établissements) selon vos besoins.",
        },
      ],
    },
  },

  "photographie-google-business": {
    orleans: {
      localContext:
        "À Orléans, la visibilité locale est capitale pour les commerces du centre-ville (rues commerçantes autour de la place du Martroi, rue de la République), les restaurants des quais de Loire, mais aussi les artisans, professions libérales et agences implantés à Saran, Olivet ou Fleury-les-Aubrais. Une fiche Google Business Profile bien optimisée avec des photos professionnelles de votre établissement est le moyen le plus efficace de capter des clients dans le Loiret (45). Splice Studio réalise des prises de vue de votre commerce ou de vos bureaux sous leur meilleur jour : façade valorisée, espaces intérieurs accueillants, et portraits de vos équipes en action. Nous cadrons chaque image pour susciter la confiance des clients orléanais dès leur recherche sur Google Maps. De plus, nos fichiers sont livrés avec les bonnes dimensions et un poids optimisé pour le web, respectant les prérequis de l'algorithme local de Google pour favoriser votre classement dans le Pack Local. Que vous gériez une boutique de créateurs, un cabinet médical, un restaurant ou une agence de services, nous intervenons dans vos locaux à Orléans et dans sa périphérie pour créer une galerie de photos d'établissement de haute qualité qui convertit les internautes en visiteurs physiques.",
      localFaq: [
        {
          question: "Comment trouver un photographe Google Business Profile autour de moi à Orléans ?",
          answer:
            "Splice Studio se déplace dans votre établissement partout à Orléans et dans la métropole pour réaliser la séance photo. Nous livrons des photos conformes aux standards de Google. Contactez-nous pour planifier votre shooting.",
        },
        {
          question: "Quel est l'impact de photos professionnelles sur le Pack Local à Orléans ?",
          answer:
            "Les fiches Google Business Profile disposant de visuels professionnels récents enregistrent un taux de clic et des demandes d'itinéraires bien plus élevés. Ces signaux d'engagement positifs incitent l'algorithme de Google à mieux classer votre établissement à Orléans.",
        },
      ],
    },
    tours: {
      localContext:
        "À Tours, l'attractivité touristique et la richesse de la vie commerciale autour du Vieux Tours (place Plumereau, rue Colbert) et de l'avenue de la Tranchée rendent la concurrence locale particulièrement rude. Les commerçants, hôteliers, restaurateurs et prestataires de services d'Indre-et-Loire (37) ont besoin d'une fiche Google Business Profile impeccable pour capter les flux de visiteurs locaux et touristiques. Splice Studio propose un service de photographie d'établissement sur mesure à Tours pour valoriser votre pas-de-porte, vos chais, vos salles de restaurant ou vos bureaux. Nous capturons l'atmosphère de votre lieu avec des angles soignés et un éclairage adapté, tout en tirant des portraits authentiques de vos collaborateurs pour humaniser votre entreprise. Chaque image est calibrée et compressée selon les prérequis techniques de Google, évitant les refus de publication et améliorant le temps de chargement sur mobile. Une fiche riche en visuels de qualité supérieure rassure immédiatement les internautes tourangeaux et favorise l'obtention d'itinéraires et d'appels directs.",
      localFaq: [
        {
          question: "Comment trouver un photographe Google Business Profile autour de moi à Tours ?",
          answer:
            "Splice Studio intervient directement sur site à Tours, Joué-lès-Tours, Saint-Cyr-sur-Loire et dans toute la Touraine pour photographier votre commerce. Pour obtenir un devis ou fixer un rendez-vous, utilisez notre formulaire de contact.",
        },
        {
          question: "Les photos aident-elles à attirer les touristes à Tours ?",
          answer:
            "Absolument. Les touristes de passage à Tours utilisent massivement Google Maps pour trouver des restaurants, hôtels ou boutiques de spécialités locales. Des visuels professionnels de votre établissement et de vos produits font toute la différence face à vos concurrents.",
        },
      ],
    },
  },

  "interview-temoignage": {
    orleans: {
      localContext:
        "L'interview filmée est un format particulièrement adapté au tissu B2B d'Orléans : témoignages de dirigeants, paroles d'experts, retours clients qui crédibilisent une offre de service ou un savoir-faire industriel. Splice Studio réalise ces tournages sur site, dans vos bureaux ou ateliers de la métropole orléanaise. Notre valeur ajoutée commence avant la caméra : nous préparons un déroulé éditorial, des questions-guides et un cadrage qui mettent à l'aise les intervenants, souvent peu habitués à l'exercice. Le tournage est mené en multicaméra avec un son professionnel (micro-cravate HF), gage de crédibilité. En post-production, nous montons un format dynamique avec habillage, sous-titres et musique libre de droits. À Orléans, ces témoignages servent surtout le commercial et le recrutement : nous livrons donc une version longue pour votre site et des extraits courts pour les réseaux sociaux. À Orléans, ces interviews servent surtout des PME et des entreprises soucieuses de leur visibilité, ainsi que des mairies qui donnent la parole aux acteurs de la vie locale.",
      localFaq: [
        {
          question: "Comment trouver un vidéaste pour une interview autour de moi à Orléans ?",
          answer:
            "Splice Studio se déplace dans vos locaux à Orléans et dans le Loiret pour tourner vos interviews et témoignages. La préparation éditoriale et le montage se gèrent à distance. Demandez un devis en ligne pour planifier le tournage.",
        },
        {
          question: "Mettez-vous à l'aise les personnes qui n'ont pas l'habitude de la caméra ?",
          answer:
            "Oui, c'est central dans notre méthode : déroulé préparé, questions-guides et installation soignée permettent d'obtenir des prises de parole naturelles et sincères.",
        },
      ],
    },
    tours: {
      localContext:
        "À Tours, l'interview et le témoignage vidéo prennent volontiers une dimension de transmission : portraits filmés d'artisans, de vignerons et de figures du Val de Loire, paroles de fondateurs et récits de savoir-faire. Splice Studio tourne ces entretiens sur site, dans vos locaux, vos chais ou vos lieux de production en Indre-et-Loire. Là où l'interview orléanaise sert d'abord le commercial B2B, la demande tourangelle met souvent en avant l'humain, le terroir et l'authenticité d'un métier. Nous préparons un déroulé éditorial sur mesure, filmons en multicaméra avec un son professionnel au micro-cravate HF, puis montons un format vivant avec habillage, sous-titres et musique libre de droits. Le résultat se décline en une version longue pour votre site et des capsules courtes pour les réseaux sociaux. Cette approche valorise aussi bien une entreprise qu'un territoire et son patrimoine vivant. À Tours, nous filmons les témoignages de dirigeants de PME, d'entrepreneurs et d'acteurs locaux, y compris pour des collectivités valorisant leur territoire.",
      localFaq: [
        {
          question: "Comment trouver un vidéaste pour une interview autour de moi à Tours ?",
          answer:
            "Splice Studio intervient sur site partout en Indre-et-Loire pour filmer vos interviews et témoignages ; la préparation et le montage se font à distance. Faites une demande de devis en ligne pour caler la date de tournage à Tours.",
        },
        {
          question: "Pouvez-vous filmer un artisan ou un vigneron sur son lieu de travail ?",
          answer:
            "Oui. Nous adaptons notre matériel aux lieux de production (atelier, chai, exploitation) pour capter le geste et l'environnement de travail dans des conditions sonores et visuelles optimales.",
        },
      ],
    },
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

/**
 * Returns the unique editorial content for a (service × ville) couple,
 * or `undefined` when the combination has no dedicated content.
 */
export function getLocalPageContent(
  slug: LocalServiceSlug,
  villeSlug: string
): LocalPageContent | undefined {
  return LOCAL_PAGE_CONTENT[slug]?.[villeSlug as LocalVilleSlug];
}
