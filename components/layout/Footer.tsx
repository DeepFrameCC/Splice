import Link from "next/link";
import { Instagram, Facebook, Linkedin, Mail } from "lucide-react";
import CookieSettingsButton from "./CookieSettingsButton";

const founders = [
  { handle: "@by.louisia", insta: "https://instagram.com/by.louisia" },
  { handle: "@t.y97one",  insta: "https://instagram.com/t.y97one" },
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-[var(--bg-deep)] border-t border-white/[.08] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl uppercase tracking-tight">Splice Studio</h3>
          <p className="mt-3 text-sm opacity-80">
            Boîte de production audiovisuelle.
            On capte le meilleur de votre entreprise.
          </p>
          <div className="df-footer-socials">
            <a href="https://www.facebook.com/Splicecc/" target="_blank" rel="noopener noreferrer" className="df-social-btn" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="https://www.instagram.com/splice.studio.cc/" target="_blank" rel="noopener noreferrer" className="df-social-btn" aria-label="Instagram">
              <Instagram size={18} />
            </a>
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-bold text-df-gold">Navigation</h3>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <li><Link href="/services" className="hover:text-df-gold transition-colors">Services</Link></li>
            <li><Link href="/agence-communication-orleans" className="hover:text-df-gold transition-colors">Agence communication</Link></li>
            <li><Link href="/photographe-evenementiel" className="hover:text-df-gold transition-colors">Photo événementiel</Link></li>
            <li><Link href="/tarifs" className="hover:text-df-gold transition-colors">Tarifs</Link></li>
            <li><Link href="/galerie" className="hover:text-df-gold transition-colors">Galerie</Link></li>
            <li><Link href="/blog" className="hover:text-df-gold transition-colors">Blog</Link></li>
            <li><Link href="/equipe" className="hover:text-df-gold transition-colors">Équipe</Link></li>
            <li><Link href="/partenaires" className="hover:text-df-gold transition-colors">Partenaires</Link></li>
            <li><Link href="/faq" className="hover:text-df-gold transition-colors">FAQ</Link></li>
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
          <a href="mailto:contact.splicestudio@gmail.com" className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4" /> contact.splicestudio@gmail.com
          </a>
          <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs opacity-60">
            <Link href="/mentions-legales">Mentions légales</Link>
            <span>·</span>
            <Link href="/confidentialite">Confidentialité</Link>
            <span>·</span>
            <Link href="/cookies">Cookies</Link>
            <span>·</span>
            <CookieSettingsButton />
          </div>
          <p className="mt-2 text-xs opacity-60">© {new Date().getFullYear()} Splice Studio. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
