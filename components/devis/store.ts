"use client";
import { create } from "zustand";
import {
  SUBSCRIPTION_PLANS,
  type PlanId,
  type BillingCycle,
  type DevisMode,
  type OptionKey,
  type BanniereSize,
} from "@/lib/pricing";
import type { DureeTournage, DelaiLivraison, VilleDepart } from "@prisma/client";

export interface DevisFormState {
  step: 1 | 2 | 3;
  mode: DevisMode;

  // Abonnement fields
  planId: PlanId;
  billingCycle: BillingCycle;
  useLaunchPrice: boolean;

  // Pack Particulier fields
  nbVideos: number | null;
  nbPhotos: number | null;
  banniere: BanniereSize | null;
  villeDepart: VilleDepart;
  distanceKm: number;
  delai: DelaiLivraison;
  duree: DureeTournage;

  // Shared options
  options: Partial<Record<OptionKey, number>>;

  // Auth / eligibility (set from server props)
  isAuthenticated: boolean;
  canUseFormuleBienvenue: boolean;
  isAdmin: boolean;

  // Coordonnées (Step 3)
  nomEntreprise: string;
  nomContact: string;
  emailContact: string;
  telContact: string;
  lieuTournage: string;
  dateTournage: string;
  remarques: string;

  // Actions
  next: () => void;
  prev: () => void;
  set: <K extends keyof DevisFormState>(k: K, v: DevisFormState[K]) => void;
  toggleOption: (key: OptionKey) => void;
  setOptionQty: (key: OptionKey, qty: number) => void;
  reset: () => void;
}

const initial = {
  step: 1 as const,
  mode: "ABONNEMENT" as DevisMode,

  planId: "PRO" as PlanId,
  billingCycle: "MENSUEL" as BillingCycle,
  useLaunchPrice: true,

  nbVideos: null as number | null,
  nbPhotos: null as number | null,
  banniere: null as BanniereSize | null,
  villeDepart: "TOURS" as VilleDepart,
  distanceKm: 0,
  delai: "STANDARD" as DelaiLivraison,
  duree: "DEMI_JOURNEE" as DureeTournage,

  options: {} as Partial<Record<OptionKey, number>>,

  isAuthenticated: false,
  canUseFormuleBienvenue: false,
  isAdmin: false,

  nomEntreprise: "",
  nomContact: "",
  emailContact: "",
  telContact: "",
  lieuTournage: "",
  dateTournage: "",
  remarques: "",
};

export const useDevisForm = create<DevisFormState>((set) => ({
  ...initial,
  next: () =>
    set((s) => ({ step: Math.min(3, s.step + 1) as 1 | 2 | 3 })),
  prev: () =>
    set((s) => ({ step: Math.max(1, s.step - 1) as 1 | 2 | 3 })),
  set: (k, v) => set({ [k]: v } as Partial<DevisFormState>),
  toggleOption: (key) =>
    set((s) => {
      const current = s.options[key];
      if (current && current > 0) {
        const nextOptions = { ...s.options };
        delete nextOptions[key];
        return { options: nextOptions };
      } else {
        let defaultQty = 1;
        if (
          key !== "creationBanniere" &&
          key !== "videoSupp" &&
          key !== "photoSupp" &&
          key !== "podcast"
        ) {
          if (s.mode === "ABONNEMENT") {
            defaultQty = SUBSCRIPTION_PLANS[s.planId]?.videosPerMonth ?? 1;
          } else {
            defaultQty = s.nbVideos ?? 1;
          }
        }
        return {
          options: { ...s.options, [key]: defaultQty },
        };
      }
    }),
  setOptionQty: (key, qty) =>
    set((s) => {
      let cappedQty = qty;
      if (s.mode === "ABONNEMENT") {
        if (key === "podcast") {
          const max = s.planId === "STANDARD" ? 0 : s.planId === "PRO" ? 2 : 4;
          cappedQty = Math.min(Math.max(1, qty), max);
        } else if (key === "photoSupp") {
          const max = s.planId === "STANDARD" ? 1 : s.planId === "PRO" ? 3 : 99;
          cappedQty = Math.min(Math.max(1, qty), max);
        } else if (key === "videoSupp") {
          cappedQty = Math.max(1, qty);
        } else if (key !== "creationBanniere") {
          const max = SUBSCRIPTION_PLANS[s.planId]?.videosPerMonth ?? 1;
          cappedQty = Math.min(Math.max(1, qty), max);
        }
      } else {
        const maxVideos = s.nbVideos ?? 0;
        if (
          key !== "creationBanniere" &&
          key !== "videoSupp" &&
          key !== "photoSupp" &&
          key !== "podcast"
        ) {
          cappedQty = Math.min(Math.max(1, qty), maxVideos);
        } else {
          cappedQty = Math.max(1, qty);
        }
      }
      return {
        options: { ...s.options, [key]: cappedQty },
      };
    }),
  reset: () => set(initial),
}));
