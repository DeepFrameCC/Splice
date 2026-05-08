"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, User } from "lucide-react";

const links = [
  { href: "/",        label: "Accueil" },
  { href: "/galerie", label: "Galerie" },
  { href: "/equipe",  label: "Équipe" },
  { href: "/avis",    label: "Avis" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-df-blue/20 bg-white/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <ul className="flex items-center gap-6">
          {links.map((l) => {
            const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <li key={l.href}>
                <Link href={l.href} className={`nav-link relative ${active ? "nav-link-active" : ""}`}>
                  {l.label}
                  <span className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-df-gold transition-transform duration-300 origin-left ${active ? "scale-x-100" : "scale-x-0"}`} />
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-3">
          <Link href="/devis" aria-label="Demander un devis"
            className="grid h-10 w-10 place-items-center rounded-full bg-df-cream transition hover:scale-110 hover:bg-df-gold">
            <Calculator className="h-5 w-5 text-df-blue" />
          </Link>
          <Link href="/profil" aria-label="Mon profil"
            className="grid h-10 w-10 place-items-center rounded-full border-2 border-df-blue text-df-blue transition hover:bg-df-blue hover:text-white">
            <User className="h-5 w-5" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
