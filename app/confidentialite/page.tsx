import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et protection des données personnelles — DeepFrame, conformément au RGPD.",
};

export default function Confidentialite() {
  return (
    <>
      <Nav />
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <h1 className="font-display text-4xl font-bold text-df-blue">Politique de confidentialité</h1>
        <p className="mt-2 text-sm text-df-ink/50">Dernière mise à jour : mai 2026</p>

        <section className="mt-10 space-y-8 text-sm leading-relaxed text-df-ink/80">
          <div>
            <h2 className="text-lg font-bold text-df-ink">1. Responsable du traitement</h2>
            <ul className="mt-3 space-y-1">
              <li><strong>Dénomination :</strong> DeepFrame (micro-entreprise)</li>
              <li><strong>Siège :</strong> Saint-Avertin (37550), Indre-et-Loire</li>
              <li><strong>Email :</strong> contact@deepframe.cc</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-df-ink">2. Données collectées</h2>
            <p>Dans le cadre de l&apos;utilisation du site deepframe.cc, nous collectons les données suivantes :</p>

            <h3 className="mt-4 font-bold text-df-ink">2.1. Création de compte</h3>
            <p>Nom, prénom, pseudo, adresse email, mot de passe (hashé), adresse postale, code postal, ville, téléphone, âge.</p>

            <h3 className="mt-4 font-bold text-df-ink">2.2. Demande de devis</h3>
            <p>Type de projet, description du besoin, lieu de tournage, dates souhaitées, budget envisagé. Ces données sont liées à votre compte utilisateur.</p>

            <h3 className="mt-4 font-bold text-df-ink">2.3. Paiement</h3>
            <p>Les informations de paiement (carte bancaire) sont collectées et traitées directement par notre prestataire de paiement Stripe. DeepFrame ne stocke jamais vos données bancaires.</p>

            <h3 className="mt-4 font-bold text-df-ink">2.4. Navigation</h3>
            <p>Données de connexion (adresse IP, type de navigateur, pages visitées, date et heure de connexion) via les cookies essentiels au fonctionnement du site.</p>

            <h3 className="mt-4 font-bold text-df-ink">2.5. Formulaire de contact</h3>
            <p>Nom, email, type de projet, budget, brief créatif.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-df-ink">3. Finalités et bases légales</h2>
            <table className="mt-3 w-full text-left text-xs">
              <thead>
                <tr className="border-b border-df-ink/10">
                  <th className="py-2 pr-4 font-bold">Finalité</th>
                  <th className="py-2 pr-4 font-bold">Base légale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-df-ink/5">
                <tr><td className="py-2 pr-4">Gestion de votre compte</td><td className="py-2">Exécution du contrat</td></tr>
                <tr><td className="py-2 pr-4">Traitement des demandes de devis</td><td className="py-2">Exécution du contrat</td></tr>
                <tr><td className="py-2 pr-4">Paiement et facturation</td><td className="py-2">Exécution du contrat / obligation légale</td></tr>
                <tr><td className="py-2 pr-4">Envoi d&apos;emails transactionnels</td><td className="py-2">Exécution du contrat</td></tr>
                <tr><td className="py-2 pr-4">Amélioration du site</td><td className="py-2">Intérêt légitime</td></tr>
                <tr><td className="py-2 pr-4">Réponse aux demandes de contact</td><td className="py-2">Consentement</td></tr>
              </tbody>
            </table>
          </div>

          <div>
            <h2 className="text-lg font-bold text-df-ink">4. Destinataires des données</h2>
            <p>Vos données personnelles peuvent être transmises aux sous-traitants suivants :</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li><strong>Vercel Inc.</strong> — hébergement du site (États-Unis, clauses contractuelles types)</li>
              <li><strong>Stripe Inc.</strong> — traitement des paiements (États-Unis, certifié conforme RGPD)</li>
              <li><strong>Resend Inc.</strong> — envoi d&apos;emails transactionnels (États-Unis, clauses contractuelles types)</li>
              <li><strong>Neon Inc.</strong> — hébergement de la base de données PostgreSQL</li>
            </ul>
            <p className="mt-2">Aucune donnée n&apos;est vendue ou cédée à des tiers à des fins commerciales.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-df-ink">5. Durée de conservation</h2>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li><strong>Données de compte :</strong> conservées pendant la durée de votre inscription, puis supprimées dans les 30 jours suivant la demande de suppression.</li>
              <li><strong>Données de devis et facturation :</strong> conservées 10 ans (obligation comptable et fiscale, article L.123-22 du Code de commerce).</li>
              <li><strong>Données de contact :</strong> conservées 3 ans à compter du dernier contact.</li>
              <li><strong>Données de navigation :</strong> 13 mois maximum (recommandation CNIL).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-df-ink">6. Vos droits</h2>
            <p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez des droits suivants :</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li><strong>Droit d&apos;accès :</strong> obtenir une copie de vos données personnelles.</li>
              <li><strong>Droit de rectification :</strong> corriger des données inexactes ou incomplètes.</li>
              <li><strong>Droit à l&apos;effacement :</strong> demander la suppression de vos données (sauf obligation légale de conservation).</li>
              <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré et lisible.</li>
              <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement de vos données pour des motifs légitimes.</li>
              <li><strong>Droit à la limitation :</strong> demander la suspension du traitement de vos données.</li>
              <li><strong>Droit de retirer votre consentement :</strong> à tout moment, sans affecter la licéité du traitement effectué avant le retrait.</li>
            </ul>
            <p className="mt-3">
              Pour exercer vos droits, envoyez un email à{" "}
              <a href="mailto:contact@deepframe.cc" className="text-df-blue underline hover:text-df-gold transition-colors">contact@deepframe.cc</a>{" "}
              en joignant une copie de votre pièce d&apos;identité. Nous répondons dans un délai maximum de 30 jours.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-df-ink">7. Sécurité</h2>
            <p>
              DeepFrame met en oeuvre des mesures techniques et organisationnelles appropriées pour protéger
              vos données : chiffrement des mots de passe (Argon2id), connexions HTTPS, accès restreint aux
              bases de données, authentification par token JWT.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-df-ink">8. Transferts hors UE</h2>
            <p>
              Certains de nos sous-traitants sont situés aux États-Unis (Vercel, Stripe, Resend, Neon).
              Ces transferts sont encadrés par des clauses contractuelles types approuvées par la Commission
              européenne, conformément à l&apos;article 46 du RGPD.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-df-ink">9. Réclamation</h2>
            <p>
              Si vous estimez que le traitement de vos données constitue une violation du RGPD, vous pouvez
              introduire une réclamation auprès de la CNIL :
            </p>
            <ul className="mt-3 space-y-1">
              <li><strong>CNIL</strong> — Commission Nationale de l&apos;Informatique et des Libertés</li>
              <li>3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07</li>
              <li>Site : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-df-blue underline hover:text-df-gold transition-colors">www.cnil.fr</a></li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-df-ink">10. Modifications</h2>
            <p>
              DeepFrame se réserve le droit de modifier la présente politique de confidentialité à tout moment.
              La date de dernière mise à jour est indiquée en haut de cette page. Nous vous invitons à la
              consulter régulièrement.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
