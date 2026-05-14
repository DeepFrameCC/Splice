"use server";

import { z } from "zod";
import { sendMail, MAIL_FOUNDERS, MAIL_CONTACT } from "@/lib/mailer";
import { contactLimiter, checkRateLimit } from "@/lib/rate-limit";

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

const contactSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caracteres"),
  email: z.string().email("Adresse email invalide"),
  type: z.string().min(1, "Le type de projet est requis"),
  budget: z.string().min(1, "Le budget envisage est requis"),
  brief: z.string().min(10, "Le brief doit contenir au moins 10 caracteres"),
});

export type ContactPayload = z.infer<typeof contactSchema>;

/* ------------------------------------------------------------------ */
/*  Action                                                             */
/* ------------------------------------------------------------------ */

export async function submitContact(
  payload: ContactPayload
): Promise<{ success: true } | { success: false; error: string }> {
  // --- Rate limit ---
  const rl = await checkRateLimit(contactLimiter);
  if (!rl.success) return { success: false, error: rl.error ?? "Trop de requêtes" };

  // --- Validation Zod ---
  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "Donnees invalides";
    return { success: false, error: firstError };
  }

  const { nom, email, type, budget, brief } = parsed.data;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://deepframe.cc";

  try {
    // --- Email fondateurs : notification interne ---
    await sendMail({
      to: MAIL_FOUNDERS.length ? MAIL_FOUNDERS : [MAIL_CONTACT],
      subject: `[Deepframe] Nouveau pre-devis — ${nom}`,
      replyTo: email,
      html: `
        <div style="font-family:system-ui;color:#0A0A23;max-width:600px">
          <h2 style="color:#1901AD;margin-bottom:24px">Nouvelle demande de pre-devis</h2>
          <table style="border-collapse:collapse;width:100%">
            <tr>
              <td style="padding:8px 12px;font-weight:bold;color:#1901AD;vertical-align:top">Nom</td>
              <td style="padding:8px 12px">${escapeHtml(nom)}</td>
            </tr>
            <tr style="background:#f8f8fc">
              <td style="padding:8px 12px;font-weight:bold;color:#1901AD;vertical-align:top">Email</td>
              <td style="padding:8px 12px"><a href="mailto:${escapeHtml(email)}" style="color:#1901AD">${escapeHtml(email)}</a></td>
            </tr>
            <tr>
              <td style="padding:8px 12px;font-weight:bold;color:#1901AD;vertical-align:top">Type de projet</td>
              <td style="padding:8px 12px">${escapeHtml(type)}</td>
            </tr>
            <tr style="background:#f8f8fc">
              <td style="padding:8px 12px;font-weight:bold;color:#1901AD;vertical-align:top">Budget</td>
              <td style="padding:8px 12px">${escapeHtml(budget)}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;font-weight:bold;color:#1901AD;vertical-align:top">Brief</td>
              <td style="padding:8px 12px;white-space:pre-line">${escapeHtml(brief)}</td>
            </tr>
          </table>
          <div style="margin-top:24px">
            <a href="${appUrl}/admin/devis"
               style="background:#FFBD59;color:#1901AD;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
              Ouvrir l'admin
            </a>
          </div>
        </div>`,
    });

    // --- Email client : confirmation ---
    await sendMail({
      to: email,
      subject: "Deepframe — Nous avons bien recu votre demande",
      html: `
        <div style="font-family:system-ui;color:#0A0A23;max-width:600px">
          <h2 style="color:#1901AD">Merci ${escapeHtml(nom)} !</h2>
          <p>Nous avons bien recu votre demande de pre-devis et nous reviendrons vers vous dans les plus brefs delais.</p>
          <p><strong>Recapitulatif :</strong></p>
          <ul style="line-height:1.8">
            <li><strong>Type de projet :</strong> ${escapeHtml(type)}</li>
            <li><strong>Budget envisage :</strong> ${escapeHtml(budget)}</li>
          </ul>
          <p style="color:#666;font-size:14px;margin-top:24px">
            En attendant, n'hesitez pas a consulter nos realisations sur
            <a href="${appUrl}" style="color:#1901AD">deepframe.cc</a>.
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
          <p style="color:#999;font-size:12px">
            Cet email a ete envoye automatiquement par Deepframe.
            Si vous n'etes pas a l'origine de cette demande, vous pouvez ignorer ce message.
          </p>
        </div>`,
    });

    return { success: true };
  } catch (err) {
    console.error("[contact] Erreur envoi email:", err);
    return {
      success: false,
      error: "Une erreur est survenue lors de l'envoi. Veuillez reessayer.",
    };
  }
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
