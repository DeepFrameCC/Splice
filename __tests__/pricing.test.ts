import { describe, it, expect } from "vitest";
import {
  computePackParticulierQuote,
  computeAbonnementQuote,
  computeFormuleBienvenueQuote,
  quoteToStripeLineItems,
  PricingError,
  SUBSCRIPTION_PLANS,
  ACOMPTE_RATE,
  PRIX_KM,
  resolvePackLabel,
} from "@/lib/pricing";
import type { PackParticulierInput, AbonnementInput } from "@/lib/pricing";

const BASE_PACK_INPUT: PackParticulierInput = {
  nbVideos: 1,
  nbPhotos: null,
  options: {},
  banniere: null,
  villeDepart: "TOURS",
  distanceKm: 0,
  delai: "STANDARD",
};

const BASE_ABO_INPUT: AbonnementInput = {
  planId: "STANDARD",
  billingCycle: "MENSUEL",
  useLaunchPrice: true,
  options: {},
};

describe("computePackParticulierQuote", () => {
  it("returns base video price for 1 video", () => {
    const quote = computePackParticulierQuote(BASE_PACK_INPUT);
    expect(quote.totalHT).toBe(29);
    expect(quote.lines.length).toBe(1);
    expect(quote.acompte).toBe(Math.round((29 * ACOMPTE_RATE) / 100));
    expect(quote.solde).toBe(quote.totalHT - quote.acompte);
  });

  it("returns pack price for 4 videos", () => {
    const quote = computePackParticulierQuote({ ...BASE_PACK_INPUT, nbVideos: 4 });
    expect(quote.totalHT).toBe(99);
  });

  it("adds photo pack price", () => {
    const quote = computePackParticulierQuote({ ...BASE_PACK_INPUT, nbVideos: 2, nbPhotos: 10 });
    // Pack Duo (2 vidéos = 55) + Pack Standard (10 photos = 90)
    expect(quote.totalHT).toBe(55 + 90);
  });

  it("calculates frais de déplacement correctly", () => {
    const quote = computePackParticulierQuote({ ...BASE_PACK_INPUT, distanceKm: 100 });
    expect(quote.totalHT).toBe(29 + 100 * PRIX_KM);
    const kmLine = quote.lines.find((l) => l.label.includes("déplacement"));
    expect(kmLine).toBeDefined();
    expect(kmLine?.qty).toBe(100);
    expect(kmLine?.unit).toBe(PRIX_KM);
  });

  it("adds express delivery supplement", () => {
    const quote = computePackParticulierQuote({ ...BASE_PACK_INPUT, delai: "EXPRESS_48H" });
    expect(quote.totalHT).toBe(29 + 50);
  });

  it("adds options per video", () => {
    const quote = computePackParticulierQuote({
      ...BASE_PACK_INPUT,
      nbVideos: 2,
      options: { voixOff: true, sousTitres: true },
    });
    // 2 videos pack (55) + voixOff 12*2 + sousTitres 12*2 = 55 + 24 + 24 = 103
    expect(quote.totalHT).toBe(55 + 12 * 2 + 12 * 2);
  });

  it("adds options with specific numeric quantities", () => {
    const quote = computePackParticulierQuote({
      ...BASE_PACK_INPUT,
      nbVideos: 4,
      options: { voixOff: 2, sousTitres: 1 },
    });
    // 4 videos pack (99) + voixOff 12*2 + sousTitres 12*1 = 99 + 24 + 12 = 135
    expect(quote.totalHT).toBe(99 + 12 * 2 + 12 * 1);
  });

  it("caps numeric options quantity to the selected video count", () => {
    const quote = computePackParticulierQuote({
      ...BASE_PACK_INPUT,
      nbVideos: 2,
      options: { voixOff: 5 }, // 5 is capped to videoCount 2
    });
    // 2 videos pack (55) + voixOff 12*2 = 55 + 24 = 79
    expect(quote.totalHT).toBe(55 + 12 * 2);
  });

  it("adds bannière price", () => {
    const quote = computePackParticulierQuote({ ...BASE_PACK_INPUT, banniere: "PETITE" });
    expect(quote.totalHT).toBe(29 + 15);
  });

  it("throws PricingError for negative distance", () => {
    expect(() =>
      computePackParticulierQuote({ ...BASE_PACK_INPUT, distanceKm: -10 })
    ).toThrow(PricingError);
  });

  it("returns empty quote when no videos or photos selected", () => {
    const quote = computePackParticulierQuote({ ...BASE_PACK_INPUT, nbVideos: null });
    expect(quote.totalHT).toBe(0);
    expect(quote.lines.length).toBe(0);
  });
});

describe("computeAbonnementQuote", () => {
  it("returns launch monthly price for Standard", () => {
    const quote = computeAbonnementQuote(BASE_ABO_INPUT);
    expect(quote.totalHT).toBe(49);
  });

  it("returns launch annual total for Standard annual", () => {
    const quote = computeAbonnementQuote({ ...BASE_ABO_INPUT, billingCycle: "ANNUEL" });
    expect(quote.totalHT).toBe(540);
  });

  it("returns standard monthly price when not launch", () => {
    const quote = computeAbonnementQuote({ ...BASE_ABO_INPUT, useLaunchPrice: false });
    expect(quote.totalHT).toBe(79);
  });

  it("adds 20 € supplement for sans engagement (launch)", () => {
    const quote = computeAbonnementQuote({ ...BASE_ABO_INPUT, billingCycle: "SANS_ENGAGEMENT" });
    // STANDARD launch monthly 49 + 20 = 69
    expect(quote.totalHT).toBe(49 + 20);
    expect(quote.lines[0]?.label).toContain("Sans engagement");
  });

  it("adds 20 € supplement for sans engagement (standard price)", () => {
    const quote = computeAbonnementQuote({
      ...BASE_ABO_INPUT,
      billingCycle: "SANS_ENGAGEMENT",
      useLaunchPrice: false,
    });
    // STANDARD std monthly 79 + 20 = 99
    expect(quote.totalHT).toBe(79 + 20);
  });

  it("labels the monthly base line as engagement 3 mois", () => {
    const quote = computeAbonnementQuote(BASE_ABO_INPUT);
    expect(quote.lines[0]?.label).toContain("Engagement 3 mois");
  });

  it("bills sans engagement monthly via Stripe (interval month)", () => {
    const quote = computeAbonnementQuote({ ...BASE_ABO_INPUT, billingCycle: "SANS_ENGAGEMENT" });
    const items = quoteToStripeLineItems(quote, "SANS_ENGAGEMENT");
    expect(items[0]?.price_data.unit_amount).toBe(6900);
    expect(items[0]?.price_data.recurring.interval).toBe("month");
  });

  it("adds options per video count", () => {
    const quote = computeAbonnementQuote({
      ...BASE_ABO_INPUT,
      planId: "PRO",
      options: { voixOff: true },
    });
    // PRO launch monthly 99 + voixOff 12 * 5 videos = 99 + 60 = 159
    expect(quote.totalHT).toBe(99 + 12 * 5);
  });

  it("computes PRO annual with savings line", () => {
    const quote = computeAbonnementQuote({
      planId: "PRO",
      billingCycle: "ANNUEL",
      useLaunchPrice: true,
      options: {},
    });
    expect(quote.totalHT).toBe(1068);
    expect(quote.lines.some((l) => l.label.includes("Économie"))).toBe(true);
  });

  it("enforces STANDARD subscription plan limits", () => {
    // podcast not allowed
    expect(() =>
      computeAbonnementQuote({ ...BASE_ABO_INPUT, planId: "STANDARD", options: { podcast: 1 } })
    ).toThrow(PricingError);

    // photoSupp capped at 1 pack max
    expect(() =>
      computeAbonnementQuote({ ...BASE_ABO_INPUT, planId: "STANDARD", options: { photoSupp: 2 } })
    ).toThrow(PricingError);

    // 1 pack of photos is allowed (49 + 15 = 64)
    const quote = computeAbonnementQuote({ ...BASE_ABO_INPUT, planId: "STANDARD", options: { photoSupp: 1 } });
    expect(quote.totalHT).toBe(49 + 15);
  });

  it("enforces PRO subscription plan limits", () => {
    // podcast capped at 2
    expect(() =>
      computeAbonnementQuote({ ...BASE_ABO_INPUT, planId: "PRO", options: { podcast: 3 } })
    ).toThrow(PricingError);

    // photoSupp capped at 3 packs max
    expect(() =>
      computeAbonnementQuote({ ...BASE_ABO_INPUT, planId: "PRO", options: { photoSupp: 4 } })
    ).toThrow(PricingError);

    // 2 podcasts + 3 photo packs are allowed
    const quote = computeAbonnementQuote({
      ...BASE_ABO_INPUT,
      planId: "PRO",
      options: { podcast: 2, photoSupp: 3 },
    });
    // PRO launch: 99 + 2 * 29 + 3 * 15 = 99 + 58 + 45 = 202
    expect(quote.totalHT).toBe(202);
  });
});

describe("computeAbonnementQuote — annualisation des options", () => {
  it("annualise les options (× 12) sur un abonnement annuel", () => {
    const quote = computeAbonnementQuote({
      planId: "PRO",
      billingCycle: "ANNUEL",
      useLaunchPrice: true,
      options: { voixOff: true },
    });
    // Base annuelle PRO lancement 1068 + voixOff (12 € × 12 mois × 5 vidéos = 720)
    expect(quote.totalHT).toBe(1068 + 12 * 12 * 5);
    const voixOff = quote.lines.find((l) => l.label === "Voix off");
    expect(voixOff?.unit).toBe(12 * 12);
    expect(voixOff?.total).toBe(12 * 12 * 5);
  });

  it("ne modifie pas les options en mensuel (facteur 1)", () => {
    const quote = computeAbonnementQuote({
      planId: "PRO",
      billingCycle: "MENSUEL",
      useLaunchPrice: true,
      options: { voixOff: true },
    });
    expect(quote.totalHT).toBe(99 + 12 * 5);
  });
});

describe("quoteToStripeLineItems", () => {
  it("mappe un abonnement mensuel en line_items récurrents (centimes, interval month)", () => {
    const quote = computeAbonnementQuote(BASE_ABO_INPUT); // STANDARD mensuel = 49
    const items = quoteToStripeLineItems(quote, "MENSUEL");
    expect(items).toHaveLength(1);
    expect(items[0]?.price_data.unit_amount).toBe(4900);
    expect(items[0]?.price_data.recurring.interval).toBe("month");
    expect(items[0]?.price_data.currency).toBe("eur");
    expect(items[0]?.quantity).toBe(1);
  });

  it("utilise l'interval year en annuel et filtre les lignes à 0 €", () => {
    const quote = computeAbonnementQuote({
      planId: "PRO",
      billingCycle: "ANNUEL",
      useLaunchPrice: true,
      options: {},
    });
    // 2 lignes (base 1068 + « Économie » à 0) → la ligne à 0 € est filtrée
    const items = quoteToStripeLineItems(quote, "ANNUEL");
    expect(items).toHaveLength(1);
    expect(items[0]?.price_data.unit_amount).toBe(106800);
    expect(items[0]?.price_data.recurring.interval).toBe("year");
  });

  it("ne produit aucune ligne pour une formule gratuite", () => {
    const quote = computeFormuleBienvenueQuote();
    expect(quoteToStripeLineItems(quote, "MENSUEL")).toHaveLength(0);
  });
});

describe("resolvePackLabel", () => {
  it("resolves legacy pack names", () => {
    expect(resolvePackLabel("BASIQUE")).toBe("Pack Basique");
    expect(resolvePackLabel("VISIBILITE")).toBe("Pack Visibilité");
    expect(resolvePackLabel("PREMIUM")).toBe("Pack Premium");
  });

  it("returns new pack labels as-is", () => {
    expect(resolvePackLabel("Abonnement Pro")).toBe("Abonnement Pro");
    expect(resolvePackLabel("Pack Particulier")).toBe("Pack Particulier");
  });
});
