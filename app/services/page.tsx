import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { getAllServices } from "@/lib/services/queries";

export const metadata: Metadata = {
  title: "Services audiovisuels Orléans Tours | DeepFrame",
  description:
    "Production vidéo, photographie professionnelle, motion design, pub réseaux sociaux à Orléans et Tours. DeepFrame couvre toute la chaîne de production audiovisuelle en Centre-Val de Loire.",
  alternates: { canonical: "https://deepframe.cc/services" },
  openGraph: {
    title: "Services audiovisuels Orléans Tours | DeepFrame",
    description: "Production vidéo, photographie, motion design à Orléans et Tours.",
    url: "https://deepframe.cc/services",
    siteName: "DeepFrame",
    locale: "fr_FR",
    type: "website",
  },
};

export const revalidate = 3600;

const CATEGORY_LABELS: Record<string, string> = {
  video: "Vidéo",
  photo: "Photo",
  motion: "Motion",
  audio: "Audio",
};

const CATEGORY_ORDER = ["video", "photo", "motion", "audio"];

export default async function ServicesHubPage() {
  const services = await getAllServices();
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  const grouped = CATEGORY_ORDER.reduce<Record<string, typeof services>>((acc, cat) => {
    const items = services.filter((s) => s.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://deepframe.cc" },
          { "@type": "ListItem", position: 2, name: "Services", item: "https://deepframe.cc/services" },
        ],
      },
      {
        "@type": "LocalBusiness",
        name: "DeepFrame",
        url: "https://deepframe.cc",
        image: "https://deepframe.cc/logo.svg",
        description: "Agence de production audiovisuelle à Orléans et Tours — vidéo corporate, photographie, motion design, pub réseaux sociaux.",
        email: "contact@deepframe.cc",
        address: [
          { "@type": "PostalAddress", addressLocality: "Orléans", postalCode: "45000", addressRegion: "Centre-Val de Loire", addressCountry: "FR" },
          { "@type": "PostalAddress", addressLocality: "Tours", postalCode: "37000", addressRegion: "Centre-Val de Loire", addressCountry: "FR" },
        ],
        areaServed: [
          { "@type": "City", name: "Orléans" },
          { "@type": "City", name: "Tours" },
          { "@type": "AdministrativeArea", name: "Centre-Val de Loire" },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services audiovisuels",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Montage vidéo professionnel", url: "https://deepframe.cc/services/montage-video" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Production corporate", url: "https://deepframe.cc/services/production-corporate" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Motion design", url: "https://deepframe.cc/services/motion-design" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Publicité réseaux sociaux", url: "https://deepframe.cc/services/pub-reseaux-sociaux" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Shooting automobile", url: "https://deepframe.cc/services/shooting-automobile" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Photographie professionnelle", url: "https://deepframe.cc/services/photographie-professionnelle" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Interview & témoignage", url: "https://deepframe.cc/services/interview-temoignage" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Voix-off & sound design", url: "https://deepframe.cc/services/voix-off-sound-design" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Film de présentation d'entreprise", url: "https://deepframe.cc/services/presentation-entreprise" } },
          ],
        },
      },
    ],
  };

  return (
    <>
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-20">
        <header className="mb-14">
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Nos services audiovisuels à Orléans et Tours
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/70">
            DeepFrame accompagne les entreprises d&apos;Orléans, Tours et de toute la région Centre-Val de Loire
            sur l&apos;ensemble de la chaîne de production audiovisuelle. Nous intervenons dans le Loiret (45),
            l&apos;Indre-et-Loire (37) et les départements voisins pour produire des contenus vidéo, photo, motion
            et audio à forte valeur perçue.
          </p>
        </header>

        {Object.entries(grouped).map(([cat, items]) => (
          <section key={cat} className="mb-16">
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-df-gold">
              {CATEGORY_LABELS[cat] ?? cat}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-df-surface shadow-sm transition hover:shadow-md hover:border-df-gold/25"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-df-surface">
                    <Image
                      src={s.coverImageUrl}
                      alt={s.coverImageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-white group-hover:text-df-gold transition">
                      {s.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/50 line-clamp-2">
                      {s.metaDescription}
                    </p>
                    <span className="mt-4 inline-block text-sm font-medium text-df-gold">
                      En savoir plus &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-16 rounded-2xl border border-white/[0.08] bg-df-surface p-8 md:p-10">
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">Zone d&apos;intervention</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-white/70">
            Notre équipe intervient principalement à Orléans, Tours, Blois, Chartres et Bourges, ainsi que dans
            l&apos;ensemble de la région Centre-Val de Loire. Des déplacements réguliers en Île-de-France sont
            également possibles pour les tournages corporate, shootings photo, publicités réseaux sociaux et projets
            sur mesure.
          </p>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">Comment ça marche</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {([
              { step: "01", title: "Devis", text: "Vous nous expliquez votre besoin, votre deadline et votre budget. Nous vous orientons vers le format le plus pertinent." },
              { step: "02", title: "Tournage / Production", text: "Nous préparons, tournons ou produisons votre contenu avec une direction artistique claire et un niveau d'exécution premium." },
              { step: "03", title: "Livraison", text: "Vous recevez vos livrables optimisés pour le web, les réseaux sociaux, l'interne ou vos supports commerciaux." },
            ] as const).map((item) => (
              <div key={item.step} className="rounded-2xl border border-white/[0.08] bg-df-surface p-6">
                <p className="text-sm font-semibold uppercase tracking-widest text-df-gold">{item.step}</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-white/[0.08] bg-df-surface p-8 text-center md:p-12">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">Parlons de votre projet</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/70">
            Répondez à quelques questions et recevez un devis personnalisé sous 24h ouvrées pour votre projet
            vidéo, photo ou motion design.
          </p>
          <div className="mt-6">
            <Link
              href="/devis"
              className="inline-flex items-center justify-center rounded-full bg-df-gold px-6 py-3 text-sm font-semibold text-black transition hover:bg-df-gold/90"
            >
              Demander un devis gratuit
            </Link>
          </div>
        </section>

        {services.length === 0 && (
          <p className="mt-12 text-center text-white/40">Aucun service disponible pour le moment.</p>
        )}
      </main>
    </>
  );
}
