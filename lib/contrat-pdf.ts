import type { Contrat, Devis } from "@prisma/client";
import {
  createPdfContext,
  drawPageDecorations,
  drawParagraph,
  addPage,
  wrapText,
  pdfColor,
  safe,
  PDF_LAYOUT,
  PDF_COLORS,
} from "@/lib/pdf";
import { PRESTATAIRE_PDF, parseDevisLines } from "@/lib/pdf-documents";

/**
 * Contrat de prestation de services audiovisuels — généré à partir du devis
 * accepté. Le contrat prend effet au paiement (acompte ou activation de
 * l'abonnement) et court jusqu'à la fin du projet : livraison finale des
 * livrables et paiement intégral du prix.
 *
 * ⚠️ Texte rédigé pour l'activité Splice Studio (micro-entreprise, art. 293 B
 * CGI) ; toute évolution substantielle doit être relue par un professionnel
 * du droit.
 */

const { MARGIN_L, MARGIN_R } = PDF_LAYOUT;
const BODY_SIZE = 8;
const LINE_H = BODY_SIZE + 3;
const PAGE_BOTTOM = 780;
const PAGE_TOP_NEXT = 45;

export async function buildContratPdfBytes(contrat: Contrat, devis: Devis): Promise<Uint8Array> {
  const ctx = await createPdfContext();
  const { pdf, fonts } = ctx;
  let page = ctx.page;
  let y = 0;

  drawPageDecorations(page);

  /* ── Writer avec saut de page automatique ─────────────────────── */
  const ensure = (height: number) => {
    if (y + height > PAGE_BOTTOM) {
      page = addPage(pdf);
      drawPageDecorations(page);
      y = PAGE_TOP_NEXT;
    }
  };

  const para = (
    text: string,
    opts?: { size?: number; bold?: boolean; color?: keyof typeof PDF_COLORS; after?: number; x?: number },
  ) => {
    const size = opts?.size ?? BODY_SIZE;
    const font = opts?.bold ? fonts.bold : fonts.main;
    const x = opts?.x ?? MARGIN_L;
    const lines = wrapText(font, text, size, MARGIN_R - x);
    ensure(lines.length * (size + 3));
    y = drawParagraph(page, fonts, text, y, { size, bold: opts?.bold, color: opts?.color, x }) + (opts?.after ?? 4);
  };

  const article = (titre: string) => {
    ensure(40);
    y += 6;
    y = drawParagraph(page, fonts, titre, y, { size: 9.5, bold: true, color: "ink" }) + 4;
  };

  /* ── En-tête ──────────────────────────────────────────────────── */
  y = 30;
  y = drawParagraph(page, fonts, "SPLICE STUDIO", y, { size: 20, bold: true, color: "orange" }) + 2;
  y = drawParagraph(page, fonts, "CONTRAT DE PRESTATION DE SERVICES AUDIOVISUELS", y, {
    size: 13,
    bold: true,
    color: "ink",
  }) + 2;
  const dateContrat = (contrat.dateDebut ?? contrat.createdAt).toLocaleDateString("fr-FR");
  para(`Contrat n° ${safe(contrat.numero)} — établi le ${dateContrat} — se rapportant au devis n° ${safe(devis.numero)}.`, {
    color: "muted",
    after: 10,
  });

  /* ── Parties ──────────────────────────────────────────────────── */
  article("ENTRE LES SOUSSIGNÉS");
  para(
    `${PRESTATAIRE_PDF.entreprise}, entrepreneur individuel (micro-entreprise), exerçant sous le nom commercial « Splice Studio », immatriculée sous le SIRET ${PRESTATAIRE_PDF.siret}, dont le siège est situé ${PRESTATAIRE_PDF.adresse}, e-mail : ${PRESTATAIRE_PDF.email}, ci-après désignée « le Prestataire » ;`,
  );
  const clientId = [
    devis.nomEntreprise ? `${devis.nomEntreprise}, représentée par ${devis.nomContact}` : devis.nomContact,
    `e-mail : ${devis.emailContact}`,
    `téléphone : ${devis.telContact}`,
  ].join(", ");
  para(`Et ${clientId}, ci-après désigné(e) « le Client ».`, { after: 2 });
  para("Il a été convenu ce qui suit :", { after: 6 });

  const isAbo = devis.devisType === "ABONNEMENT";
  const cycleLabel = devis.billingCycle === "ANNUEL" ? "annuelle" : "mensuelle";

  /* ── Article 1 — Objet ────────────────────────────────────────── */
  article("Article 1 — Objet");
  para(
    `Le présent contrat a pour objet la réalisation par le Prestataire de prestations de production audiovisuelle (captation, montage, photographie, déclinaisons pour réseaux sociaux et prestations associées) telles que décrites dans le devis n° ${safe(devis.numero)} accepté par le Client. Le devis, ses lignes de prestation et ses mentions font partie intégrante du présent contrat.`,
  );
  const lines = parseDevisLines(devis.lines).filter((l) => l.total > 0 || !l.label.startsWith("Économie"));
  if (lines.length) {
    para("Prestations convenues :", { bold: true, after: 2 });
    for (const l of lines.slice(0, 12)) {
      para(`• ${l.label}${l.qty && l.qty > 1 ? ` (x${l.qty})` : ""} — ${l.total} €`, { x: MARGIN_L + 10, after: 1 });
    }
    y += 3;
  }
  if (devis.lieuTournage) {
    para(`Lieu d'exécution principal : ${devis.lieuTournage}.${devis.dateTournage ? ` Date de tournage prévue : ${devis.dateTournage.toLocaleDateString("fr-FR")}.` : ""}`);
  }

  /* ── Article 2 — Durée ────────────────────────────────────────── */
  article("Article 2 — Entrée en vigueur et durée");
  if (isAbo) {
    const engagementClause =
      devis.billingCycle === "MENSUEL"
        ? `L'abonnement est souscrit avec un engagement minimum de 3 mois ; le Client peut résilier à l'issue de cette période d'engagement, depuis son espace client. `
        : `Le Client peut résilier à tout moment depuis son espace client ; `;
    para(
      `Le contrat prend effet à la date d'activation de l'abonnement par le Client et est conclu pour une période ${cycleLabel}, renouvelée tacitement à chaque échéance. ${engagementClause}la résiliation prend effet au terme de la période en cours, déjà réglée, sans remboursement prorata. Le contrat demeure en vigueur jusqu'à la fin du dernier cycle souscrit et la livraison des contenus dus au titre de ce cycle (« fin du projet »).`,
    );
  } else {
    para(
      `Le contrat prend effet à la date de paiement de l'acompte par le Client et demeure en vigueur jusqu'à la complète exécution des obligations des deux parties, à savoir la livraison finale des livrables et le paiement intégral du prix (« fin du projet »). Les délais de production communiqués (7 à 14 jours ouvrés sauf mention contraire au devis) sont des délais indicatifs de bonne foi.`,
    );
  }

  /* ── Article 3 — Prix et paiement ─────────────────────────────── */
  article("Article 3 — Prix et modalités de paiement");
  if (isAbo) {
    para(
      `Le prix de l'abonnement s'élève à ${devis.totalHT} € par période ${cycleLabel}, TVA non applicable, art. 293 B du CGI. Le règlement s'effectue par prélèvement automatique récurrent via la plateforme sécurisée Stripe, à l'activation puis à chaque échéance. Une facture est émise et mise à disposition du Client à chaque prélèvement. Le tarif souscrit (y compris tarif de lancement) est maintenu tant que l'abonnement reste actif.`,
    );
  } else {
    para(
      `Le prix total de la prestation s'élève à ${devis.totalHT} €, TVA non applicable, art. 293 B du CGI. Un acompte de ${devis.acompteRate} % (soit ${devis.acompteAmount} €) est exigible à la validation du devis ; le solde (soit ${devis.totalHT - devis.acompteAmount} €) est exigible à la livraison. Les paiements s'effectuent en ligne via la plateforme sécurisée Stripe ou par virement bancaire.`,
    );
  }
  para(
    "Pour les Clients professionnels, tout retard de paiement entraîne de plein droit des pénalités égales à trois fois le taux d'intérêt légal ainsi qu'une indemnité forfaitaire de recouvrement de 40 € (articles L.441-10 et D.441-5 du Code de commerce). Aucun escompte n'est consenti pour paiement anticipé.",
  );

  /* ── Article 4 — Annulation et report ─────────────────────────── */
  article("Article 4 — Annulation, report");
  para(
    "En cas d'annulation par le Client après validation du devis, l'acompte versé reste acquis au Prestataire à titre d'indemnité forfaitaire, en compensation du travail préparatoire engagé et des dates réservées. Un report de la date de tournage est possible sans frais une (1) fois, sous réserve d'en informer le Prestataire au moins 7 jours calendaires avant la date prévue ; tout report ultérieur ou tardif pourra donner lieu à facturation des frais réellement engagés.",
  );
  para(
    "Lorsque les conditions (météo, sécurité, autorisation de lieu) rendent la captation impossible, les parties conviennent d'un report sans frais. En cas d'annulation du fait du Prestataire en dehors d'un cas de force majeure, les sommes versées par le Client lui sont intégralement restituées, à l'exclusion de toute autre indemnité.",
  );

  /* ── Article 5 — Obligations du Prestataire ───────────────────── */
  article("Article 5 — Obligations du Prestataire");
  para(
    "Le Prestataire s'engage à exécuter la prestation avec professionnalisme, au moyen d'un matériel adapté, dans le respect des règles de l'art (obligation de moyens). Il s'engage à tenir le Client informé de l'avancement, à respecter la confidentialité des informations communiquées par le Client et à conserver les fichiers sources pendant la durée du projet.",
  );

  /* ── Article 6 — Obligations du Client ────────────────────────── */
  article("Article 6 — Obligations du Client");
  para(
    "Le Client s'engage à : donner accès aux lieux de tournage et désigner un interlocuteur disponible ; obtenir les autorisations nécessaires relevant de son périmètre (occupation de lieux privés, participation de ses collaborateurs ou invités, éléments de marque, musiques ou contenus qu'il fournit) ; valider les étapes et livrables dans des délais raisonnables. Le Client garantit que les éléments qu'il fournit ne portent pas atteinte aux droits de tiers et garantit le Prestataire contre tout recours à ce titre.",
  );

  /* ── Article 7 — Livraison et révisions ───────────────────────── */
  article("Article 7 — Livraison, révisions et acceptation");
  para(
    "Le tarif inclut deux (2) allers-retours de modifications mineures sur le montage final. Toute modification supplémentaire ou demande sortant du périmètre du devis est facturée au tarif horaire de 50 € / heure, sur devis complémentaire accepté par le Client. Les fichiers finaux sont livrés par voie numérique après paiement intégral du solde. Le Client dispose de 14 jours à compter de la livraison pour émettre des réserves ; à défaut, les livrables sont réputés acceptés.",
  );

  /* ── Article 8 — Propriété intellectuelle ─────────────────────── */
  article("Article 8 — Propriété intellectuelle");
  para(
    "Les créations réalisées (vidéos, photographies, montages) sont des œuvres protégées au sens de l'article L.111-1 du Code de la propriété intellectuelle. Elles demeurent la propriété exclusive du Prestataire jusqu'au paiement intégral du prix. À compter du paiement intégral, le Prestataire cède au Client, conformément à l'article L.131-3 du même code, les droits de reproduction et de représentation des livrables pour les besoins de sa communication et de sa promotion, sur tous supports numériques et imprimés, pour le monde entier et pour toute la durée légale de protection des droits.",
  );
  para(
    "Les rushes et fichiers de travail non livrés restent la propriété du Prestataire. Sauf opposition écrite du Client, le Prestataire est autorisé à présenter les réalisations à titre de référence (portfolio, site, réseaux sociaux) avec mention du Client.",
  );

  /* ── Article 9 — Droit à l'image ──────────────────────────────── */
  article("Article 9 — Droit à l'image");
  para(
    "Chaque partie veille au respect du droit à l'image des personnes apparaissant dans les contenus. Le Client garantit avoir recueilli le consentement des personnes qu'il fait intervenir (équipes, clients, invités) ; le Prestataire recueille les autorisations des intervenants qu'il mobilise. Toute personne concernée peut exercer ses droits auprès des parties conformément à la réglementation.",
  );

  /* ── Article 10 — Rétractation ────────────────────────────────── */
  article("Article 10 — Droit de rétractation (clients consommateurs)");
  para(
    "Lorsque le Client est un consommateur et que le contrat est conclu à distance, il dispose d'un délai de rétractation de 14 jours à compter de l'acceptation du devis (article L.221-18 du Code de la consommation), sans avoir à motiver sa décision. Si le Client demande expressément que l'exécution de la prestation commence avant l'expiration de ce délai (notamment lorsque la date de tournage intervient dans les 14 jours), il reconnaît perdre son droit de rétractation une fois la prestation pleinement exécutée (article L.221-28 du Code de la consommation) ; en cas de rétractation avant complète exécution, il est redevable du prix correspondant au service déjà fourni.",
  );

  /* ── Article 11 — Responsabilité et force majeure ─────────────── */
  article("Article 11 — Responsabilité et force majeure");
  para(
    "La responsabilité du Prestataire est limitée aux dommages directs et prévisibles, et plafonnée au montant effectivement payé par le Client au titre du présent contrat. Le Prestataire ne saurait être tenu des dommages indirects (perte d'exploitation, perte de chance, atteinte à l'image) ni des conséquences d'une utilisation des livrables non conforme à leur destination. Aucune partie ne peut être tenue responsable d'un manquement causé par un cas de force majeure au sens de l'article 1218 du Code civil ; les obligations sont alors suspendues et, si l'empêchement excède 30 jours, le contrat peut être résolu sans indemnité, les sommes correspondant à des prestations non exécutées étant restituées.",
  );

  /* ── Article 12 — Données personnelles ────────────────────────── */
  article("Article 12 — Données personnelles");
  para(
    "Les données personnelles collectées dans le cadre du contrat sont traitées conformément au RGPD et à la politique de confidentialité accessible sur splicestudio.fr/confidentialite. Le Client dispose notamment de droits d'accès, de rectification et d'effacement, qu'il peut exercer à l'adresse e-mail du Prestataire.",
  );

  /* ── Article 13 — Médiation ───────────────────────────────────── */
  article("Article 13 — Médiation de la consommation");
  para(
    "Conformément aux articles L.612-1 et suivants du Code de la consommation, le Client consommateur peut, en cas de litige non résolu par une réclamation écrite préalable auprès du Prestataire, recourir gratuitement à un médiateur de la consommation. Les coordonnées du médiateur compétent sont disponibles dans les mentions légales du site splicestudio.fr ou sur demande.",
  );

  /* ── Article 14 — Droit applicable ────────────────────────────── */
  article("Article 14 — Droit applicable et juridiction compétente");
  para(
    "Le présent contrat est soumis au droit français. À défaut de résolution amiable, tout litige avec un Client professionnel relève des tribunaux compétents d'Orléans. Pour les Clients consommateurs, la juridiction compétente est déterminée conformément aux règles légales en vigueur.",
  );

  /* ── Signatures ───────────────────────────────────────────────── */
  ensure(120);
  y += 14;
  const C = pdfColor("border");
  const colW = (MARGIN_R - MARGIN_L - 20) / 2;
  page.drawLine({ start: { x: MARGIN_L, y: PDF_LAYOUT.PAGE_H - y }, end: { x: MARGIN_R, y: PDF_LAYOUT.PAGE_H - y }, color: C, thickness: 0.5 });
  y += 10;
  const sigTop = y;
  y = drawParagraph(page, fonts, "Pour le Prestataire", y, { size: 9, bold: true }) + 2;
  y = drawParagraph(page, fonts, `${PRESTATAIRE_PDF.entreprise} — Splice Studio`, y) + 2;
  y = drawParagraph(page, fonts, "Signature :", y, { color: "muted" }) + 40;
  let yClient = sigTop;
  yClient = drawParagraph(page, fonts, "Pour le Client", yClient, { size: 9, bold: true, x: MARGIN_L + colW + 20 }) + 2;
  yClient = drawParagraph(page, fonts, devis.nomEntreprise || devis.nomContact, yClient, { x: MARGIN_L + colW + 20 }) + 2;
  drawParagraph(page, fonts, "Signature, précédée de « Lu et approuvé » :", yClient, { color: "muted", x: MARGIN_L + colW + 20 });

  para("TVA non applicable, art. 293 B du CGI. Document généré électroniquement par Splice Studio ; l'acceptation du devis et le paiement valent acceptation des présentes conditions.", {
    size: 6.5,
    color: "light",
    after: 0,
  });

  return pdf.save();
}
