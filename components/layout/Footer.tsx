import Link from "next/link";
import { Instagram, Mail } from "lucide-react";

const founders = [
  { handle: "@papiforcex", insta: "https://instagram.com/papiforcex", tiktok: "https://tiktok.com/@papiforcex" },
  { handle: "@by.louisia", insta: "https://instagram.com/by.louisia", tiktok: "https://tiktok.com/@by.louisia" },
  { handle: "@t.y97one",  insta: "https://instagram.com/t.y97one",  tiktok: "https://tiktok.com/@t.y97one" }
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-df-blue text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl italic">Deepframe</h3>
          <p className="mt-3 text-sm opacity-80">
            Boîte de production audiovisuelle.
            On capte le meilleur de votre entreprise.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-bold text-df-gold">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/photos">Photos</Link></li>
            <li><Link href="/videos">Vidéos</Link></li>
            <li><Link href="/avis">Avis</Link></li>
            <li><Link href="/devis">Demander un devis</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-bold text-df-gold">L&apos;équipe</h4>
          <ul className="space-y-2 text-sm">
            {founders.map((f) => (
              <li key={f.handle} className="flex items-center gap-2">
                <Instagram className="h-4 w-4" /> <a href={f.insta} target="_blank" rel="noopener noreferrer">{f.handle}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-bold text-df-gold">Contact</h4>
          <a href="mailto:contact@deepframe.cc" className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4" /> contact@deepframe.cc
          </a>
          <p className="mt-3 text-xs opacity-60">© {new Date().getFullYear()} Deepframe. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
