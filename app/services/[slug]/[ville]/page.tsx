import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const VILLES = {
  orleans: {
    nom: "Orléans",
    departement: "Loiret (45)",
    region: "Centre-Val de Loire",
    description: "Capitale du Loiret et de la région Centre-Val de Loire, Orléans est à 1h de Paris.",
    slug: "orleans",
  },
  tours: {
    nom: "Tours",
    departement: "Indre-et-Loire (37)",
    region: "Centre-Val de Loire",
    description: "Capitale de l'Indre-et-Loire, Tours est le cœur économique de la Touraine.",
    slug: "tours",
  },
  "centre-val-de-loire": {
    nom: "Centre-Val de Loire",
    departement: "Loiret, Indre-et-Loire, Loir-et-Cher, Cher, Eure-et-Loir, Indre",
    region: "Centre-Val de Loire",
    description: "Nous couvrons l'ensemble de la région Centre-Val de Loire.",
    slug: "centre-val-de-loire",
  },
  loiret: {
    nom: "Loiret",
    departement: "Loiret (45)",
    region: "Centre-Val de Loire",
    description: "Département du Loiret avec Orléans, Montargis, Pithiviers.",
    slug: "loiret",
  },
} as const;

const SERVICES_LOCAL = {
  "pub-reseaux-sociaux": {
    name: "Publicité réseaux sociaux",
    shortName: "Pubs réseaux sociaux",
    metaDescriptionTemplate: (ville: string) =>
      `Publicité vidéo réseaux sociaux à ${ville} — Instagram Reels, TikTok, Facebook Ads. DeepFrame crée des pubs vidéo qui convertissent pour les entreprises de ${ville}.`,
    h1Template: (ville: string) => `Publicité vidéo réseaux sociaux à ${ville}`,
    intro: (ville: string, dep: string) =>
      `Vous cherchez une agence de publicité vidéo à ${ville} ? DeepFrame conçoit des contenus publicitaires natifs pour TikTok, Instagram Reels et Facebook Ads, adaptés aux entreprises du ${dep} et de la région Centre-Val de Loire.`,
    points: [
      "Vidéos verticales 9:16 natives pour TikTok et Reels",
      "Hooks visuels testés pour stopper le scroll",
      "Sous-titres dynamiques synchronisés",
      "Livraison multi-plateformes en 5 à 7 jours",
      "Options express 48h disponibles",
    ],
    priceFrom: "400 € HT",
    deliveryTime: "5 à 7 jours ouvrés",
  },
  "photographie-professionnelle": {
    name: "Photographie professionnelle",
    shortName: "Photographie pro",
    metaDescriptionTemplate: (ville: string) =>
      `Photographe professionnel à ${ville} — portraits corporate, événementiel, packshots produits. DeepFrame, photographe entreprise en Centre-Val de Loire.`,
    h1Template: (ville: string) => `Photographe professionnel à ${ville}`,
    intro: (ville: string, dep: string) =>
      `Vous cherchez un photographe professionnel à ${ville} ? DeepFrame réalise des portraits corporate, des reportages événementiels et des packshots produits pour les entreprises du ${dep}. Intervention rapide, retouche complète, livraison sous 5 à 7 jours.`,
    points: [
      "Portraits corporate et photos d'équipe",
      "Reportage événementiel (séminaires, inaugurations)",
      "Packshots produits pour e-commerce",
      "Photos immobilières et architecture",
      "Livraison galerie en ligne sécurisée",
    ],
    priceFrom: "250 € HT",
    deliveryTime: "5 à 7 jours ouvrés",
  },
  "shooting-automobile": {
    name: "Shooting automobile",
    shortName: "Shooting auto",
    metaDescriptionTemplate: (ville: string) =>
      `Shooting photo vidéo automobile à ${ville} — rolling shots, studio, événementiel auto. DeepFrame, spécialiste du shooting automobile en Centre-Val de Loire.`,
    h1Template: (ville: string) => `Shooting automobile à ${ville}`,
    intro: (ville: string, dep: string) =>
      `Vous êtes concession, préparateur ou collectionneur à ${ville} ? DeepFrame réalise des shootings automobiles professionnels dans le ${dep} — rolling shots dynamiques, shooting studio, couverture d'événements auto.`,
    points: [
      "Rolling shots depuis véhicule suiveur équipé",
      "Shooting studio avec éclairage créatif",
      "Couverture événements automobiles",
      "Retouche avancée (nettoyage reflets, correction colorimétrique)",
      "Livraison sous 5 à 7 jours ouvrés",
    ],
    priceFrom: "350 € HT",
    deliveryTime: "5 à 7 jours ouvrés",
  },
  "production-corporate": {
    name: "Production corporate",
    shortName: "Production corporate",
    metaDescriptionTemplate: (ville: string) =>
      `Production corporate à ${ville} — films d'entreprise, brand content, interviews. DeepFrame accompagne les entreprises de ${ville} et Centre-Val de Loire.`,
    h1Template: (ville: string) => `Production corporate à ${ville}`,
    intro: (ville: string, dep: string) =>
      `Vous cherchez une agence de production vidéo corporate à ${ville} ? DeepFrame accompagne les entreprises du ${dep} dans la création de films d'entreprise, de brand content et de contenus vidéo à forte valeur ajoutée.`,
    points: [
      "Film de présentation d'entreprise (1 à 5 min)",
      "Interviews dirigeants et témoignages clients",
      "Brand content réseaux sociaux",
      "Direction artistique et script inclus",
      "Tournage caméra cinéma Sony FX / Blackmagic",
    ],
    priceFrom: "1 500 € HT",
    deliveryTime: "3 à 6 semaines",
  },
  "motion-design": {
    name: "Motion design",
    shortName: "Motion design",
    metaDescriptionTemplate: (ville: string) =>
      `Motion design à ${ville} — animations graphiques, infographies vidéo, habillage sur mesure. Studio DeepFrame à Orléans et Tours.`,
    h1Template: (ville: string) => `Motion design à ${ville}`,
    intro: (ville: string, dep: string) =>
      `Vous avez besoin d'animations graphiques pour votre marque à ${ville} ? DeepFrame conçoit des animations motion design sur mesure pour les entreprises du ${dep} : intros animées, infographies vidéo, habillage graphique.`,
    points: [
      "Animations After Effects / Cinema 4D",
      "Infographies animées et data visualization",
      "Habillage graphique complet (lower thirds, transitions)",
      "Animations 2D et 3D",
      "Livraison en 2 à 4 semaines",
    ],
    priceFrom: "800 € HT",
    deliveryTime: "2 à 4 semaines",
  },
  "presentation-entreprise": {
    name: "Film de présentation d'entreprise",
    shortName: "Film d'entreprise",
    metaDescriptionTemplate: (ville: string) =>
      `Film de présentation d'entreprise à ${ville} — film vitrine, visite virtuelle, savoir-faire. DeepFrame, production audiovisuelle en Centre-Val de Loire.`,
    h1Template: (ville: string) => `Film de présentation d'entreprise à ${ville}`,
    intro: (ville: string, dep: string) =>
      `Vous souhaitez réaliser un film de présentation pour votre entreprise à ${ville} ? DeepFrame accompagne les sociétés du ${dep} dans la création de films d'entreprise percutants — film vitrine, visite virtuelle, présentation d'activité.`,
    points: [
      "Film de 2 à 5 minutes avec narration complète",
      "Script, storyboard, repérage inclus",
      "Déclinaisons réseaux sociaux (30s à 90s)",
      "Motion design intégré",
      "Livraison en 4 à 8 semaines",
    ],
    priceFrom: "2 000 € HT",
    deliveryTime: "4 à 8 semaines",
  },
} as const;

type VilleSlug = keyof typeof VILLES;
type ServiceSlug = keyof typeof SERVICES_LOCAL;

interface PageProps {
  params: Promise<{ slug: string; ville: string }>;
}

export const revalidate = 3600;
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = Object.keys(SERVICES_LOCAL) as ServiceSlug[];
  const villes = Object.keys(VILLES) as VilleSlug[];
  return slugs.flatMap((slug) => villes.map((ville) => ({ slug, ville })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, ville } = await params;
  const serviceData = SERVICES_LOCAL[slug as ServiceSlug];
  const villeData = VILLES[ville as VilleSlug];
  if (!serviceData || !villeData) return {};
  const url = `https://deepframe.cc/services/${slug}/${ville}`;
  const title = `${serviceData.h1Template(villeData.nom)} | DeepFrame`;
  const description = serviceData.metaDescriptionTemplate(villeData.nom);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "DeepFrame", locale: "fr_FR", type: "website" },
  };
}

export default async function ServiceVillePage({ params }: PageProps) {
  const { slug, ville } = await params;
  const serviceData = SERVICES_LOCAL[slug as ServiceSlug];
  const villeData = VILLES[ville as VilleSlug];
  if (!serviceData || !villeData) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://deepframe.cc" },
          { "@type": "ListItem", position: 2, name: "Services", item: "https://deepframe.cc/services" },
          { "@type": "ListItem", position: 3, name: serviceData.shortName, item: `https://deepframe.cc/services/${slug}` },
          { "@type": "ListItem", position: 4, name: villeData.nom, item: `https://deepframe.cc/services/${slug}/${ville}` },
        ],
      },
      {
        "@type": "Service",
        name: `${serviceData.name} à ${villeData.nom}`,
        description: serviceData.metaDescriptionTemplate(villeData.nom),
        url: `https://deepframe.cc/services/${slug}/${ville}`,
        provider: {
          "@type": "LocalBusiness",
          name: "DeepFrame",
          url: "https://deepframe.cc",
          address: [
            { "@type": "PostalAddress", addressLocality: "Orléans", postalCode: "45000", addressRegion: "Centre-Val de Loire", addressCountry: "FR" },
            { "@type": "PostalAddress", addressLocality: "Tours", postalCode: "37000", addressRegion: "Centre-Val de Loire", addressCountry: "FR" },
          ],
        },
        areaServed: { "@type": "City", name: villeData.nom },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <nav className="mb-6 text-sm text-white/40">
          <Link href="/" className="hover:text-white">Accueil</Link>
          {" › "}
          <Link href="/services" className="hover:text-white">Services</Link>
          {" › "}
          <Link href={`/services/${slug}`} className="hover:text-white">{serviceData.shortName}</Link>
          {" › "}
          <span className="text-white/70">{villeData.nom}</span>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
          {serviceData.h1Template(villeData.nom)}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/70">
          {serviceData.intro(villeData.nom, villeData.departement)}
        </p>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-white">Ce que comprend la prestation</h2>
          <ul className="mt-6 space-y-3">
            {serviceData.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-white/70">
                <span className="mt-1 text-df-gold">✓</span>
                {point}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.08] bg-df-surface p-6">
            <p className="text-sm font-medium text-white/50 uppercase tracking-wider">Délai standard</p>
            <p className="mt-2 text-2xl font-semibold text-white">{serviceData.deliveryTime}</p>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-df-surface p-6">
            <p className="text-sm font-medium text-white/50 uppercase tracking-wider">À partir de</p>
            <p className="mt-2 text-2xl font-semibold text-df-gold">{serviceData.priceFrom}</p>
          </div>
        </section>

        <section className="mt-12 rounded-xl border border-df-gold/20 bg-df-surface p-6">
          <h2 className="text-xl font-semibold text-white">Intervention à {villeData.nom} et alentours</h2>
          <p className="mt-3 text-white/70">
            {villeData.description} Notre équipe se déplace sur {villeData.nom} et dans l&apos;ensemble
            du {villeData.departement}. Des déplacements en Île-de-France et dans le reste de la France
            sont possibles sur devis.
          </p>
        </section>

        <section className="mt-12 rounded-2xl bg-df-surface border border-white/[0.08] p-8 md:p-12 text-center">
          <h2 className="text-2xl font-semibold text-white">Votre projet à {villeData.nom}</h2>
          <p className="mt-3 text-white/70 max-w-xl mx-auto">
            Répondez à quelques questions sur votre besoin et recevez un devis personnalisé sous 24h. Sans engagement.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/devis" className="rounded-full bg-df-gold px-8 py-3 font-semibold text-black hover:bg-df-gold/90 transition">
              Demander un devis gratuit
            </Link>
            <Link href={`/services/${slug}`} className="rounded-full border border-white/20 px-8 py-3 font-semibold text-white hover:border-white/40 transition">
              Voir le détail du service
            </Link>
          </div>
          <p className="mt-4 text-sm text-white/40">Réponse garantie sous 24h ouvrées · Devis sans engagement</p>
        </section>

        <p className="mt-8 text-center text-sm text-white/40">
          Voir la page complète :{" "}
          <Link href={`/services/${slug}`} className="text-df-gold hover:underline">
            {serviceData.name} — tous les détails, équipements, FAQ
          </Link>
        </p>
      </main>
    </>
  );
}
