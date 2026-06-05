import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";
import { LEGAL_LAST_UPDATED } from "@/lib/legal-dates";

export const metadata: Metadata = {
  title: "Politique de cookies",
  description: "Politique de cookies du site Splice Studio — informations sur les cookies utilisés et comment les gérer.",
};

export default function Cookies() {
  return (
    <>
      <NavWrapper />
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <h1 className="font-display text-4xl font-bold text-white">Politique de cookies</h1>
        <p className="mt-2 text-sm text-white/60">Dernière mise à jour : {LEGAL_LAST_UPDATED}</p>

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
            <h2 className="text-lg font-bold text-white">2. Cookies utilisés sur splice.cc</h2>

            <h3 className="mt-4 font-bold text-white">2.1. Cookies strictement nécessaires</h3>
            <p>Ces cookies sont indispensables au fonctionnement du site. Ils ne peuvent pas être désactivés.</p>
            <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-xs">
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
            </div>
            <p className="mt-3 text-xs text-white/50">
              Note : le choix de consentement à la bannière cookies (clé{" "}
              <span className="font-mono">df_consent</span>) est stocké dans le{" "}
              <strong>localStorage</strong> de votre navigateur (pas un cookie HTTP) et n&apos;est
              jamais transmis aux serveurs Splice Studio. Vous pouvez le réinitialiser en vidant le
              stockage local du site.
            </p>

            <h3 className="mt-6 font-bold text-white">2.2. Cookies tiers — Paiement</h3>
            <p>
              Lors du paiement d&apos;un devis, Stripe peut déposer des cookies pour la sécurisation
              de la transaction et la prévention de la fraude.
            </p>
            <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-xs">
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
                    <a href="https://stripe.com/fr/privacy" target="_blank" rel="noopener noreferrer" className="text-df-gold underline hover:text-df-gold/80 transition-colors">stripe.com/privacy</a>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>

            <h3 className="mt-6 font-bold text-white">2.3. Cookies et traceurs analytiques</h3>
            <p>
              Avec votre consentement préalable, splice.cc utilise les technologies suivantes pour
              analyser la fréquentation du site et améliorer l&apos;expérience utilisateur. Ces traceurs
              ne sont activés qu&apos;après avoir cliqué sur « Tout accepter » ou activé les cookies d&apos;analyse
              dans le panneau de personnalisation.
            </p>
            <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-xs">
              <caption className="sr-only">Cookies et traceurs analytiques</caption>
              <thead>
                <tr className="border-b border-df-ink/10">
                  <th scope="col" className="py-2 pr-4 font-bold">Fournisseur</th>
                  <th scope="col" className="py-2 pr-4 font-bold">Finalité</th>
                  <th scope="col" className="py-2 font-bold">Plus d&apos;infos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-df-ink/5">
                <tr>
                  <td className="py-2 pr-4">Google Tag Manager</td>
                  <td className="py-2 pr-4">Gestionnaire de balises — charge conditionnellement les scripts d&apos;analyse</td>
                  <td className="py-2">
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-df-gold underline hover:text-df-gold/80 transition-colors">policies.google.com/privacy</a>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Plausible Analytics</td>
                  <td className="py-2 pr-4">Statistiques de fréquentation anonymes, sans cookies HTTP (conforme RGPD)</td>
                  <td className="py-2">
                    <a href="https://plausible.io/privacy" target="_blank" rel="noopener noreferrer" className="text-df-gold underline hover:text-df-gold/80 transition-colors">plausible.io/privacy</a>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
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
              <a href="mailto:contact.splicestudio@gmail.com" className="text-df-gold underline hover:text-df-gold/80 transition-colors">contact.splicestudio@gmail.com</a>.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
