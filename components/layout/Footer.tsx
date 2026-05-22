import Link from "next/link";
import { Instagram, Facebook, Mail } from "lucide-react";

const founders = [
  { handle: "@papiforcex", insta: "https://instagram.com/papiforcex" },
  { handle: "@by.louisia", insta: "https://instagram.com/by.louisia" },
  { handle: "@t.y97one",  insta: "https://instagram.com/t.y97one" },
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-[var(--bg-deep)] border-t border-white/[.08] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl uppercase tracking-tight">Deepframe</h3>
          <p className="mt-3 text-sm opacity-80">
            Boîte de production audiovisuelle.
            On capte le meilleur de votre entreprise.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <a href="https://www.instagram.com/deepframe.cc/" target="_blank" rel="noopener noreferrer" aria-label="Instagram DeepFrame">
              <Instagram className="h-5 w-5 opacity-80 hover:opacity-100 transition-opacity" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61589292522120" target="_blank" rel="noopener noreferrer" aria-label="Facebook DeepFrame">
              <Facebook className="h-5 w-5 opacity-80 hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-bold text-df-gold">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/galerie">Galerie</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/equipe">Équipe</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/devis">Demander un devis</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-bold text-df-gold">L&apos;équipe</h3>
          <ul className="space-y-2 text-sm">
            {founders.map((f) => (
              <li key={f.handle} className="flex items-center gap-2">
                <Instagram className="h-4 w-4" /> <a href={f.insta} target="_blank" rel="noopener noreferrer">{f.handle}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-bold text-df-gold">Contact</h3>
          <a href="mailto:contact@deepframe.cc" className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4" /> contact@deepframe.cc
          </a>
          <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs opacity-60">
            <Link href="/mentions-legales">Mentions légales</Link>
            <span>·</span>
            <Link href="/confidentialite">Confidentialité</Link>
            <span>·</span>
            <Link href="/cookies">Cookies</Link>
          </div>
          <p className="mt-2 text-xs opacity-60">© {new Date().getFullYear()} Deepframe. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
