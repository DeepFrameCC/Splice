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
      // Disallow unavailable options for STANDARD
      if (s.mode === "ABONNEMENT" && s.planId === "STANDARD" && (key === "podcast" || key === "montageExpress")) {
        return {};
      }

      const current = s.options[key];
      if (current && current > 0) {
        const nextOptions = { ...s.options };
        delete nextOptions[key];

        // If disabling photoSupp, we must disable photoRetouche as well
        if (key === "photoSupp") {
          delete nextOptions.photoRetouche;
        }

        return { options: nextOptions };
      } else {
        // If enabling photoRetouche, auto-enable photoSupp at 1 if not already enabled
        if (s.mode === "ABONNEMENT" && key === "photoRetouche") {
          const nextOptions = { ...s.options };
          if (!nextOptions.photoSupp || nextOptions.photoSupp === 0) {
            nextOptions.photoSupp = 1;
          }
          nextOptions.photoRetouche = 1;
          return { options: nextOptions };
        }

        let defaultQty = 1;
        if (
          key !== "creationBanniere" &&
          key !== "videoSupp" &&
          key !== "photoSupp" &&
          key !== "podcast" &&
          key !== "photoRetouche" &&
          key !== "banniere"
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
          if (max === 0) return {};
          cappedQty = Math.min(Math.max(1, qty), max);
        } else if (key === "photoSupp") {
          const max = s.planId === "STANDARD" ? 1 : s.planId === "PRO" ? 3 : 99;
          const nextPhotoSupp = Math.min(Math.max(1, qty), max);
          const nextOptions = { ...s.options, photoSupp: nextPhotoSupp };
          if (nextOptions.photoRetouche) {
            nextOptions.photoRetouche = Math.min(nextOptions.photoRetouche, 5 * nextPhotoSupp);
          }
          return { options: nextOptions };
        } else if (key === "photoRetouche") {
          const planMax = s.planId === "STANDARD" ? 5 : s.planId === "PRO" ? 15 : 30;
          const jpgMax = 5 * (s.options.photoSupp ?? 0);
          const max = Math.min(planMax, jpgMax);
          if (max <= 0) return {};
          cappedQty = Math.min(Math.max(1, qty), max);
        } else if (key === "montageExpress") {
          const max = s.planId === "STANDARD" ? 0 : s.planId === "PRO" ? 2 : 5;
          if (max === 0) return {};
          cappedQty = Math.min(Math.max(1, qty), max);
        } else if (key === "banniere") {
          cappedQty = 1;
        } else if (key === "videoSupp") {
          cappedQty = Math.max(1, qty);
        } else if (
          key !== "creationBanniere"
        ) {
          const max = SUBSCRIPTION_PLANS[s.planId]?.videosPerMonth ?? 1;
          cappedQty = Math.min(Math.max(1, qty), max);
        } else {
          cappedQty = Math.max(1, qty);
        }
      } else {
        const maxVideos = s.nbVideos ?? 0;
        if (
          key !== "creationBanniere" &&
          key !== "videoSupp" &&
          key !== "photoSupp" &&
          key !== "podcast" &&
          key !== "photoRetouche" &&
          key !== "banniere"
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
