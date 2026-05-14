"use server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { computeQuote, validateQuote, ACOMPTE_RATE } from "@/lib/pricing";
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
    founders.map((f) => db.devis.count({ where: { annee, chefDeProjet: f, NOT: { status: "REFUSE" } } }))
  );
  let min = Infinity, idx = 0;
  counts.forEach((c, i) => { if (c < min) { min = c; idx = i; } });
  return founders[idx] ?? "PAPI";
}

const schema = z.object({
  pack: z.enum(["BASIQUE", "VISIBILITE", "VISIBILITE_MIX", "PREMIUM", "INTRO_ANIMEE", "SUR_MESURE"]),
  duree: z.enum(["DEMI_JOURNEE", "JOURNEE", "DEUX_JOURNEES"]),
  usage: z.enum(["ORGANIQUE", "ADS_SOCIAL", "ADS_GOOGLE"]),
  delai: z.enum(["STANDARD", "ETENDU", "EXPRESS_48H"]),
  villeDepart: z.enum(["TOURS", "ORLEANS"]),
  distanceKm: z.coerce.number().int().min(0),
  videosSupp: z.coerce.number().int().min(0),
  videos3D: z.coerce.number().int().min(0),
  motionDesign: z.coerce.boolean(),
  montageExpress: z.coerce.boolean(),
  introAnimeeSec: z.coerce.number().int().min(5).max(20).nullable().optional(),
  nbFormat916: z.coerce.number().int().min(0),
  nbFormat169: z.coerce.number().int().min(0),
  nomEntreprise: z.string().optional(),
  nomContact: z.string().min(2),
  emailContact: z.string().email(),
  telContact: z.string().min(6),
  lieuTournage: z.string().min(2),
  dateTournage: z.string().optional(),
  remarques: z.string().optional()
});

export async function submitDevis(payload: z.infer<typeof schema>) {
  const rl = await checkRateLimit(devisLimiter);
  if (!rl.success) throw new Error(rl.error);

  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;

  const data = schema.parse(payload);
  validateQuote(data as any);
  const quote = computeQuote(data as any);
  const chefDeProjet = await pickChefDeProjet();

  const devis = await db.$transaction(async (tx) => {
    const { numero, annee, sequence } = await nextNumero("DEVIS", tx);
    return tx.devis.create({
      data: {
        numero, annee, sequence, userId: userId ?? null, chefDeProjet,
        pack: data.pack, duree: data.duree, usage: data.usage, delai: data.delai,
        villeDepart: data.villeDepart, distanceKm: data.distanceKm,
        videosSupp: data.videosSupp, videos3D: data.videos3D,
        motionDesign: data.motionDesign, montageExpress: data.montageExpress,
        introAnimeeSec: data.introAnimeeSec ?? null,
        nbFormat916: data.nbFormat916, nbFormat169: data.nbFormat169,
        nomEntreprise: data.nomEntreprise ?? "",
        nomContact: data.nomContact, emailContact: data.emailContact, telContact: data.telContact,
        lieuTournage: data.lieuTournage,
        dateTournage: data.dateTournage ? new Date(data.dateTournage) : null,
        remarques: data.remarques ?? null,
        lines: quote.lines, totalHT: quote.totalHT,
        acompteRate: ACOMPTE_RATE, acompteAmount: quote.acompte
      }
    });
  });

  // Emails are dispatched in parallel and never block the user flow. Resend latency
  // can exceed Server Action timeouts and the devis is already persisted in DB,
  // so a transient mail failure must not surface to the user. Errors are logged.
  const founderMail = notifyFoundersNewDevis(devis.numero, {
    client: data.nomEntreprise || data.nomContact,
    total: devis.totalHT * 100,
    lieu: data.lieuTournage,
    pack: data.pack
  });

  const clientMail = sendMail({
    to: data.emailContact,
    subject: `Deepframe — Demande de devis ${devis.numero} bien reçue`,
    html: `
      <div style="font-family:system-ui;color:#0A0A23;max-width:600px">
        <h2 style="color:#1901AD">Merci pour votre demande</h2>
        <p>Bonjour ${data.nomContact},</p>
        <p>Nous avons bien reçu votre demande de devis <strong>n°${devis.numero}</strong> pour un total estimatif de <strong>${devis.totalHT} €</strong>.</p>
        <p>Notre équipe revient vers vous sous 48h après validation interne. Vous pourrez ensuite régler l'acompte de ${devis.acompteAmount} € pour confirmer.</p>
        ${userId
          ? `<p style="margin-top:20px"><a href="${process.env.NEXT_PUBLIC_APP_URL}/profil/devis/${devis.id}" style="background:#FFBD59;color:#1901AD;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Voir mon devis</a></p>`
          : `<p style="margin-top:20px;color:#555">Créez un compte sur <a href="${process.env.NEXT_PUBLIC_APP_URL}/register" style="color:#1901AD;font-weight:bold">deepframe.cc</a> pour suivre votre devis en ligne.</p>`
        }
        <p style="font-size:12px;color:#777;margin-top:30px">Deepframe · contact@deepframe.cc</p>
      </div>`
  });

  const results = await Promise.allSettled([founderMail, clientMail]);
  for (const [i, r] of results.entries()) {
    if (r.status === "rejected") {
      console.error(`[submitDevis] mail #${i} failed for devis ${devis.numero}:`, r.reason);
    }
  }

  await audit({ action: "DEVIS_CREATED", userId, target: devis.id, metadata: { numero: devis.numero, pack: data.pack } });

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
