import Link from "next/link";

interface Props {
  serviceName: string;
  slug: string;
}

export function ServiceBreadcrumb({ serviceName, slug }: Props) {
  return (
    <nav aria-label="Fil d'Ariane" className="mb-6">
      <ol
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        className="flex flex-wrap items-center gap-2 text-sm text-white/50"
      >
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <Link itemProp="item" href="/" className="transition hover:text-white">
            <span itemProp="name">Accueil</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>
        <li aria-hidden="true" className="text-white/30">/</li>
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <Link itemProp="item" href="/services" className="transition hover:text-white">
            <span itemProp="name">Services</span>
          </Link>
          <meta itemProp="position" content="2" />
        </li>
        <li aria-hidden="true" className="text-white/30">/</li>
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" aria-current="page">
          <span itemProp="name" className="font-medium text-white/70">{serviceName}</span>
          <meta itemProp="item" content={`https://deepframe.cc/services/${slug}`} />
          <meta itemProp="position" content="3" />
        </li>
      </ol>
    </nav>
  );
}
