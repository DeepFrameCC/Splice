import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";
import { LEGAL_LAST_UPDATED } from "@/lib/legal-dates";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Splice — production audiovisuelle à Orléans et Tours.",
};

export default function MentionsLegales() {
  return (
    <>
      <NavWrapper />
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <h1 className="font-display text-4xl font-bold text-white">Mentions légales</h1>
        <p className="mt-2 text-sm text-white/40">Dernière mise à jour : {LEGAL_LAST_UPDATED}</p>

        <section className="mt-10 space-y-8 text-sm leading-relaxed text-white/80">
          <div>
            <h2 className="text-lg font-bold text-white">1. Éditeur du site</h2>
            <ul className="mt-3 space-y-1">
              <li><strong>Dénomination :</strong> Splice</li>
              <li><strong>Statut juridique :</strong> Micro-entreprise (auto-entrepreneur)</li>
              <li>
                <strong>SIRET :</strong>{" "}
                {process.env.NEXT_PUBLIC_LEGAL_SIRET ? (
                  <span className="font-mono">{process.env.NEXT_PUBLIC_LEGAL_SIRET}</span>
                ) : (
                  <span className="text-white/50 italic">communiqué sur demande à contact@splice.cc</span>
                )}
              </li>
              <li><strong>Code APE :</strong> 5911A — Production de films et de programmes pour la télévision</li>
              <li><strong>TVA :</strong> TVA non applicable, art.&nbsp;293&nbsp;B du CGI (franchise en base)</li>
              <li><strong>Siège social :</strong> Saint-Avertin (37550), Indre-et-Loire — adresse complète communiquée sur demande</li>
              <li><strong>Email :</strong> contact@splice.cc</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">2. Directeur de la publication</h2>
            <p>Le directeur de la publication est le responsable de la micro-entreprise Splice.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">3. Hébergeur</h2>
            <ul className="mt-3 space-y-1">
              <li><strong>Nom :</strong> Vercel Inc.</li>
              <li><strong>Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</li>
              <li><strong>Site :</strong> vercel.com</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">4. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble du contenu du site splice.cc (textes, images, vidéos, logos, éléments graphiques,
              animations) est la propriété exclusive de Splice ou de ses partenaires. Toute reproduction,
              représentation, modification, publication ou adaptation de tout ou partie de ces éléments, quel
              que soit le moyen ou le procédé utilisé, est interdite sauf autorisation écrite préalable de Splice.
            </p>
            <p className="mt-2">
              Toute exploitation non autorisée du site ou de l&apos;un de ses éléments constitue une contrefaçon
              sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">5. Limitation de responsabilité</h2>
            <p>
              Splice s&apos;efforce de fournir sur le site des informations aussi précises que possible.
              Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes ou des carences
              dans la mise à jour, qu&apos;elles soient de son fait ou du fait des tiers partenaires qui lui
              fournissent ces informations.
            </p>
            <p className="mt-2">
              Le site peut contenir des liens hypertextes vers d&apos;autres sites. Splice ne dispose d&apos;aucun
              moyen de contrôle du contenu de ces sites tiers et décline toute responsabilité quant à leur contenu.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">6. Données personnelles</h2>
            <p>
              Pour toute information relative à la collecte et au traitement de vos données personnelles,
              veuillez consulter notre{" "}
              <a href="/confidentialite" className="text-df-gold underline hover:text-df-gold/80 transition-colors">
                politique de confidentialité
              </a>.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">7. Cookies</h2>
            <p>
              Pour en savoir plus sur l&apos;utilisation des cookies sur ce site, consultez notre{" "}
              <a href="/cookies" className="text-df-gold underline hover:text-df-gold/80 transition-colors">
                politique de cookies
              </a>.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">8. Droit applicable</h2>
            <p>
              Les présentes mentions légales sont régies par le droit français. En cas de litige,
              les tribunaux d&apos;Orléans seront seuls compétents.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
