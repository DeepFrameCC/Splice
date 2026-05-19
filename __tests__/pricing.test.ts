import { describe, it, expect } from "vitest";
import {
  computePackParticulierQuote,
  computeAbonnementQuote,
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
    expect(quote.totalHT).toBe(55 + 28);
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
