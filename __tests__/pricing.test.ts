import { describe, it, expect } from "vitest";
import {
  computeQuote,
  validateQuote,
  PricingError,
  PACKS,
  ACOMPTE_RATE,
  PRIX_KM,
} from "@/lib/pricing";
import type { QuoteInput } from "@/lib/pricing";

const BASE_INPUT: QuoteInput = {
  pack: "BASIQUE",
  duree: "DEMI_JOURNEE",
  usage: "ORGANIQUE",
  delai: "STANDARD",
  villeDepart: "TOURS",
  distanceKm: 0,
  videosSupp: 0,
  videos3D: 0,
  motionDesign: false,
  montageExpress: false,
};

describe("computeQuote", () => {
  it("returns base pack price for minimal input", () => {
    const quote = computeQuote(BASE_INPUT);
    expect(quote.totalHT).toBe(PACKS.BASIQUE.price);
    expect(quote.lines.length).toBe(1);
    expect(quote.acompte).toBe(Math.round((140 * ACOMPTE_RATE) / 100));
    expect(quote.solde).toBe(quote.totalHT - quote.acompte);
  });

  it("adds durée supplement for JOURNEE", () => {
    const quote = computeQuote({ ...BASE_INPUT, duree: "JOURNEE" });
    expect(quote.totalHT).toBe(140 + 60);
  });

  it("adds durée supplement for DEUX_JOURNEES", () => {
    const quote = computeQuote({ ...BASE_INPUT, duree: "DEUX_JOURNEES" });
    expect(quote.totalHT).toBe(140 + 120);
  });

  it("calculates frais de déplacement correctly", () => {
    const quote = computeQuote({ ...BASE_INPUT, distanceKm: 100 });
    expect(quote.totalHT).toBe(140 + 100 * PRIX_KM);
    const kmLine = quote.lines.find((l) => l.label.includes("déplacement"));
    expect(kmLine).toBeDefined();
    expect(kmLine?.qty).toBe(100);
    expect(kmLine?.unit).toBe(PRIX_KM);
  });

  it("adds usage surcharge per video", () => {
    const quote = computeQuote({ ...BASE_INPUT, usage: "ADS_SOCIAL" });
    // BASIQUE has 1 video, ADS_SOCIAL is 60€/video
    expect(quote.totalHT).toBe(140 + 60);
  });

  it("includes supplementary videos in usage calculation", () => {
    const quote = computeQuote({ ...BASE_INPUT, usage: "ADS_GOOGLE", videosSupp: 2 });
    // 1 pack video + 2 supp = 3 videos, ADS_GOOGLE = 80€/video
    // Pack 140 + usage 240 + 2*90 supp = 140 + 240 + 180 = 560
    expect(quote.totalHT).toBe(140 + 80 * 3 + 90 * 2);
  });

  it("adds videos 3D with correct unit price", () => {
    const quote = computeQuote({ ...BASE_INPUT, videos3D: 2 });
    expect(quote.totalHT).toBe(140 + 110 * 2);
  });

  it("adds motion design option", () => {
    const quote = computeQuote({ ...BASE_INPUT, motionDesign: true });
    expect(quote.totalHT).toBe(140 + 40);
  });

  it("adds montage express option", () => {
    const quote = computeQuote({ ...BASE_INPUT, montageExpress: true });
    expect(quote.totalHT).toBe(140 + 55);
  });

  it("adds express delivery supplement", () => {
    const quote = computeQuote({ ...BASE_INPUT, delai: "EXPRESS_48H" });
    expect(quote.totalHT).toBe(140 + 50);
  });

  it("computes acompte at 30%", () => {
    const quote = computeQuote({ ...BASE_INPUT, pack: "PREMIUM" });
    expect(quote.acompte).toBe(Math.round((850 * 30) / 100));
    expect(quote.solde).toBe(850 - quote.acompte);
  });

  it("handles VISIBILITE pack with all options", () => {
    const quote = computeQuote({
      ...BASE_INPUT,
      pack: "VISIBILITE",
      duree: "JOURNEE",
      usage: "ADS_SOCIAL",
      delai: "EXPRESS_48H",
      distanceKm: 50,
      videosSupp: 1,
      motionDesign: true,
    });
    // Pack: 340, Durée: +60, Deplacement: 25, Usage: 60*(4+1)=300, VideoSupp: 90, Motion: 40, Express: 50
    const expected = 340 + 60 + 25 + 300 + 90 + 40 + 50;
    expect(quote.totalHT).toBe(expected);
  });

  it("returns SUR_MESURE at 0€ base", () => {
    const quote = computeQuote({ ...BASE_INPUT, pack: "SUR_MESURE" });
    expect(quote.totalHT).toBe(0);
  });
});

describe("validateQuote", () => {
  it("throws PricingError for montageExpress + PREMIUM", () => {
    expect(() =>
      validateQuote({ ...BASE_INPUT, pack: "PREMIUM", montageExpress: true })
    ).toThrow(PricingError);
  });

  it("throws PricingError for montageExpress + 3D videos", () => {
    expect(() =>
      validateQuote({ ...BASE_INPUT, montageExpress: true, videos3D: 1 })
    ).toThrow(PricingError);
  });

  it("throws PricingError for negative distance", () => {
    expect(() =>
      validateQuote({ ...BASE_INPUT, distanceKm: -10 })
    ).toThrow(PricingError);
  });

  it("throws PricingError for negative video counts", () => {
    expect(() =>
      validateQuote({ ...BASE_INPUT, videosSupp: -1 })
    ).toThrow(PricingError);
  });

  it("allows valid inputs without throwing", () => {
    expect(() => validateQuote(BASE_INPUT)).not.toThrow();
  });
});
