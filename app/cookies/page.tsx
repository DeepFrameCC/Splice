import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";
import { LEGAL_LAST_UPDATED } from "@/lib/legal-dates";

export const metadata: Metadata = {
  title: "Politique de cookies",
  description: "Politique de cookies du site DeepFrame — informations sur les cookies utilisés et comment les gérer.",
};

export default function Cookies() {
  return (
    <>
      <NavWrapper />
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <h1 className="font-display text-4xl font-bold text-df-blue">Politique de cookies</h1>
        <p className="mt-2 text-sm text-white/40">Dernière mise à jour : {LEGAL_LAST_UPDATED}</p>

        <section className="mt-10 space-y-8 text-sm leading-relaxed text-white/80">
          <div>
            <h2 className="text-lg font-bold text-white">1. Qu&apos;est-ce qu&apos;un cookie ?</h2>
            <p>
              Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone)
              lors de la visite d&apos;un site web. Il permet au site de mémoriser des informations sur votre
              visite (préférences, identifiants de session, etc.).
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">2. Cookies utilisés sur deepframe.cc</h2>

            <h3 className="mt-4 font-bold text-white">2.1. Cookies strictement nécessaires</h3>
            <p>Ces cookies sont indispensables au fonctionnement du site. Ils ne peuvent pas être désactivés.</p>
            <table className="mt-3 w-full text-left text-xs">
              <caption className="sr-only">Cookies strictement nécessaires</caption>
              <thead>
                <tr className="border-b border-df-ink/10">
                  <th scope="col" className="py-2 pr-4 font-bold">Nom</th>
                  <th scope="col" className="py-2 pr-4 font-bold">Finalité</th>
                  <th scope="col" className="py-2 font-bold">Durée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-df-ink/5">
                <tr>
                  <td className="py-2 pr-4 font-mono">authjs.session-token</td>
                  <td className="py-2 pr-4">Authentification utilisateur (NextAuth)</td>
                  <td className="py-2">Session / 7 jours</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono">authjs.csrf-token</td>
                  <td className="py-2 pr-4">Protection contre les attaques CSRF</td>
                  <td className="py-2">Session</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono">authjs.callback-url</td>
                  <td className="py-2 pr-4">Redirection après connexion</td>
                  <td className="py-2">Session</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-3 text-xs text-white/50">
              Note : le choix de consentement à la bannière cookies (clé{" "}
              <span className="font-mono">df_consent</span>) est stocké dans le{" "}
              <strong>localStorage</strong> de votre navigateur (pas un cookie HTTP) et n&apos;est
              jamais transmis aux serveurs DeepFrame. Vous pouvez le réinitialiser en vidant le
              stockage local du site.
            </p>

            <h3 className="mt-6 font-bold text-white">2.2. Cookies tiers — Paiement</h3>
            <p>
              Lors du paiement d&apos;un devis, Stripe peut déposer des cookies pour la sécurisation
              de la transaction et la prévention de la fraude.
            </p>
            <table className="mt-3 w-full text-left text-xs">
              <caption className="sr-only">Cookies tiers — paiement</caption>
              <thead>
                <tr className="border-b border-df-ink/10">
                  <th scope="col" className="py-2 pr-4 font-bold">Fournisseur</th>
                  <th scope="col" className="py-2 pr-4 font-bold">Finalité</th>
                  <th scope="col" className="py-2 font-bold">Plus d&apos;infos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-df-ink/5">
                <tr>
                  <td className="py-2 pr-4">Stripe</td>
                  <td className="py-2 pr-4">Sécurisation des paiements, détection de fraude</td>
                  <td className="py-2">
                    <a href="https://stripe.com/fr/privacy" target="_blank" rel="noopener noreferrer" className="text-df-blue underline hover:text-df-gold transition-colors">stripe.com/privacy</a>
                  </td>
                </tr>
              </tbody>
            </table>

            <h3 className="mt-6 font-bold text-white">2.3. Cookies analytiques</h3>
            <p>
              Actuellement, deepframe.cc n&apos;utilise aucun cookie analytique (Google Analytics, Matomo, etc.).
              Si un outil d&apos;analyse venait à être mis en place, cette page serait mise à jour et votre
              consentement serait recueilli préalablement.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">3. Gestion des cookies</h2>
            <p>
              Vous pouvez à tout moment gérer vos préférences en matière de cookies via les paramètres
              de votre navigateur :
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li><strong>Chrome :</strong> Paramètres &gt; Confidentialité et sécurité &gt; Cookies</li>
              <li><strong>Firefox :</strong> Paramètres &gt; Vie privée et sécurité &gt; Cookies</li>
              <li><strong>Safari :</strong> Préférences &gt; Confidentialité &gt; Cookies</li>
              <li><strong>Edge :</strong> Paramètres &gt; Cookies et autorisations de site</li>
            </ul>
            <p className="mt-3">
              La suppression des cookies essentiels peut empêcher le bon fonctionnement du site
              (connexion à votre compte, paiement en ligne).
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">4. Base légale</h2>
            <p>
              Conformément à l&apos;article 82 de la loi Informatique et Libertés et aux lignes directrices
              de la CNIL, les cookies strictement nécessaires au fonctionnement du site sont exemptés de
              consentement. Pour tout autre type de cookie, votre consentement sera recueilli avant leur dépôt.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">5. Contact</h2>
            <p>
              Pour toute question concernant notre utilisation des cookies, contactez-nous à{" "}
              <a href="mailto:contact@deepframe.cc" className="text-df-blue underline hover:text-df-gold transition-colors">contact@deepframe.cc</a>.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
