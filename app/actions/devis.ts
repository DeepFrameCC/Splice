"use server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  computeAbonnementQuote,
  computePackParticulierQuote,
  ACOMPTE_RATE,
  SUBSCRIPTION_PLANS,
  resolvePackLabel,
  type PlanId,
  type Quote,
} from "@/lib/pricing";
import { nextNumero } from "@/lib/numbering";
import { notifyFoundersNewDevis, sendMail } from "@/lib/mailer";
import { Founder } from "@prisma/client";
import { redirect } from "next/navigation";
import { devisLimiter, checkRateLimit } from "@/lib/rate-limit";
import { audit } from "@/lib/audit";
import { notify } from "@/lib/notifications";

const founders: Founder[] = ["PAPI", "LOUISIA", "TY"];

async function pickChefDeProjet(): Promise<Founder> {
  const annee = new Date().getFullYear();
  const counts = await Promise.all(
    founders.map((f) =>
      db.devis.count({
        where: { annee, chefDeProjet: f, NOT: { status: "REFUSE" } },
      })
    )
  );
  let min = Infinity,
    idx = 0;
  counts.forEach((c, i) => {
    if (c < min) {
      min = c;
      idx = i;
    }
  });
  return founders[idx] ?? "PAPI";
}

// ─── Option keys ─────────────────────────────────────────────────

const optionKeysEnum = z.enum([
  "voixOff",
  "sousTitres",
  "retourSupp",
  "creationBanniere",
  "montageExpress",
  "musiqueSurMesure",
  "adsReseaux",
]);

const optionsSchema = z
  .record(optionKeysEnum, z.boolean().optional())
  .optional()
  .default({});

// ─── Shared contact fields ───────────────────────────────────────

const contactFields = {
  nomEntreprise: z.string().optional(),
  nomContact: z.string().min(2),
  emailContact: z.string().email(),
  telContact: z.string().min(6),
  lieuTournage: z.string().min(2),
  dateTournage: z.string().optional(),
  remarques: z.string().optional(),
};

// ─── Abonnement schema ──────────────────────────────────────────

const abonnementSchema = z.object({
  mode: z.literal("ABONNEMENT"),
  planId: z.enum(["STANDARD", "PRO", "PREMIUM_ABO"]),
  billingCycle: z.enum(["MENSUEL", "ANNUEL"]),
  useLaunchPrice: z.coerce.boolean(),
  options: optionsSchema,
  // Unused fields (from form state, safe to ignore)
  nbVideos: z.any().optional(),
  nbPhotos: z.any().optional(),
  banniere: z.any().optional(),
  villeDepart: z.any().optional(),
  distanceKm: z.any().optional(),
  delai: z.any().optional(),
  duree: z.any().optional(),
  ...contactFields,
});

// ─── Pack Particulier schema ─────────────────────────────────────

const packParticulierSchema = z.object({
  mode: z.literal("PACK_PARTICULIER"),
  nbVideos: z.coerce.number().int().min(0).nullable(),
  nbPhotos: z.coerce.number().int().min(0).nullable(),
  banniere: z.enum(["PETITE", "MOYENNE", "GRANDE"]).nullable(),
  villeDepart: z.enum(["TOURS", "ORLEANS"]),
  distanceKm: z.coerce.number().int().min(0),
  delai: z.enum(["STANDARD", "ETENDU", "EXPRESS_48H"]),
  duree: z.enum(["DEMI_JOURNEE", "JOURNEE", "DEUX_JOURNEES"]),
  options: optionsSchema,
  // Unused fields
  planId: z.any().optional(),
  billingCycle: z.any().optional(),
  useLaunchPrice: z.any().optional(),
  ...contactFields,
});

// ─── Discriminated union ─────────────────────────────────────────

const schema = z.discriminatedUnion("mode", [
  abonnementSchema,
  packParticulierSchema,
]);

export async function submitDevis(payload: z.infer<typeof schema>) {
  const rl = await checkRateLimit(devisLimiter);
  if (!rl.success)
    return {
      ok: false as const,
      error: rl.error ?? "Trop de requêtes. Veuillez réessayer.",
    };

  const session = await auth();
  const userId = session?.user?.id;

  const data = schema.parse(payload);
  const chefDeProjet = await pickChefDeProjet();

  // Compute quote based on mode
  let quote: Quote;
  let packLabel: string;
  let devisType: "ABONNEMENT" | "PACK_PARTICULIER";
  let planAbonnement: string | null = null;
  let billingCycle: string | null = null;

  if (data.mode === "ABONNEMENT") {
    devisType = "ABONNEMENT";
    planAbonnement = data.planId;
    billingCycle = data.billingCycle;
    packLabel = `Abonnement ${SUBSCRIPTION_PLANS[data.planId as PlanId].label}`;
    quote = computeAbonnementQuote({
      planId: data.planId as PlanId,
      billingCycle: data.billingCycle,
      useLaunchPrice: data.useLaunchPrice,
      options: data.options ?? {},
    });
  } else {
    devisType = "PACK_PARTICULIER";
    packLabel = "Pack Particulier";
    quote = computePackParticulierQuote({
      nbVideos: data.nbVideos,
      nbPhotos: data.nbPhotos,
      options: data.options ?? {},
      banniere: data.banniere,
      villeDepart: data.villeDepart,
      distanceKm: data.distanceKm,
      delai: data.delai,
    });
  }

  const devis = await db.$transaction(async (tx) => {
    const { numero, annee, sequence } = await nextNumero("DEVIS", tx);
    return tx.devis.create({
      data: {
        numero,
        annee,
        sequence,
        userId: userId ?? null,
        chefDeProjet,
        devisType,
        pack: packLabel,
        planAbonnement,
        billingCycle,
        duree: data.mode === "PACK_PARTICULIER" ? data.duree : "DEMI_JOURNEE",
        usage: "ORGANIQUE",
        delai: data.mode === "PACK_PARTICULIER" ? data.delai : "STANDARD",
        villeDepart:
          data.mode === "PACK_PARTICULIER" ? data.villeDepart : "TOURS",
        distanceKm:
          data.mode === "PACK_PARTICULIER" ? data.distanceKm : 0,
        nomEntreprise: data.nomEntreprise ?? "",
        nomContact: data.nomContact,
        emailContact: data.emailContact,
        telContact: data.telContact,
        lieuTournage: data.lieuTournage,
        dateTournage: data.dateTournage ? new Date(data.dateTournage) : null,
        remarques: data.remarques ?? null,
        lines: quote.lines,
        totalHT: quote.totalHT,
        acompteRate: ACOMPTE_RATE,
        acompteAmount: quote.acompte,
      },
    });
  });

  // Emails dispatched in parallel, never block user flow
  const founderMail = notifyFoundersNewDevis(devis.numero, {
    client: data.nomEntreprise || data.nomContact,
    total: devis.totalHT,
    lieu: data.lieuTournage,
    pack: packLabel,
  });

  const clientMail = sendMail({
    to: data.emailContact,
    subject: `Deepframe — Demande de devis ${devis.numero} bien reçue`,
    html: `
      <div style="font-family:system-ui;color:#0E0E22;max-width:600px">
        <h2 style="color:#F36B1F">Merci pour votre demande</h2>
        <p>Bonjour ${data.nomContact},</p>
        <p>Nous avons bien reçu votre demande de devis <strong>n°${devis.numero}</strong> pour un total estimatif de <strong>${devis.totalHT} €</strong>.</p>
        <p>Notre équipe revient vers vous sous 48h après validation interne. Vous pourrez ensuite régler l'acompte de ${devis.acompteAmount} € pour confirmer.</p>
        ${
          userId
            ? `<p style="margin-top:20px"><a href="${process.env.NEXT_PUBLIC_APP_URL}/profil/devis/${devis.id}" style="background:#F36B1F;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Voir mon devis</a></p>`
            : `<p style="margin-top:20px;color:#555">Créez un compte sur <a href="${process.env.NEXT_PUBLIC_APP_URL}/register" style="color:#F36B1F;font-weight:bold">deepframe.cc</a> pour suivre votre devis en ligne.</p>`
        }
        <p style="font-size:12px;color:#777;margin-top:30px">Deepframe · contact@deepframe.cc</p>
      </div>`,
  });

  const results = await Promise.allSettled([founderMail, clientMail]);
  for (const [i, r] of results.entries()) {
    if (r.status === "rejected") {
      console.error(
        `[submitDevis] mail #${i} failed for devis ${devis.numero}:`,
        r.reason
      );
    }
  }

  await audit({
    action: "DEVIS_CREATED",
    userId,
    target: devis.id,
    metadata: { numero: devis.numero, pack: packLabel, devisType },
  });

  if (userId) {
    await notify({
      userId,
      type: "DEVIS_STATUS",
      title: `Devis n°${devis.numero} envoyé`,
      message: `Votre demande de devis (${devis.totalHT} € HT) a bien été enregistrée. Nous la traitons rapidement.`,
      href: `/profil/devis/${devis.id}`,
    });
    redirect(`/profil/devis/${devis.id}?nouveau=1`);
  } else {
    redirect(`/devis/confirmation?numero=${devis.numero}&total=${devis.totalHT}`);
  }
}
