import { Resend } from "resend";
import * as fs from "fs";
import * as path from "path";

// Simple helper to load .env manually in case --env-file is not supported or used
function loadEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
      if (match) {
        let key = match[1].trim();
        let val = match[2].trim();
        // Remove surrounding quotes if any
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    }
  }
}

async function main() {
  loadEnv();

  const apiKey = process.env.RESEND_API_KEY;
  const mailFrom = process.env.MAIL_FROM ?? "Splice Studio <noreply@splicestudio.fr>";
  const mailFounders = process.env.MAIL_FOUNDERS ?? "";

  console.log("Configuration chargee :");
  console.log("- RESEND_API_KEY:", apiKey ? `${apiKey.substring(0, 7)}...` : "MANQUANTE");
  console.log("- MAIL_FROM:", mailFrom);
  console.log("- MAIL_FOUNDERS:", mailFounders);

  if (!apiKey) {
    console.error("Erreur : RESEND_API_KEY est manquante dans le fichier .env");
    return;
  }

  const resend = new Resend(apiKey);

  const testRecipients = mailFounders.split(",").map(s => s.trim()).filter(Boolean);
  if (testRecipients.length === 0) {
    testRecipients.push("tracydinga97@gmail.com"); // fallback
  }

  console.log("\nEnvoi d'un mail de test aux fondateurs:", testRecipients);

  try {
    const result = await resend.emails.send({
      from: mailFrom,
      to: testRecipients,
      subject: "[Test Splice Studio] Test d'envoi Resend",
      html: `<p>Ceci est un test de fonctionnement du service de messagerie Resend pour Splice Studio.</p>`
    });

    console.log("Resultat de l'envoi :");
    console.log(JSON.stringify(result, null, 2));

    if (result.error) {
      console.error("\n[ECHEC] L'API Resend a retourne une erreur.");
    } else {
      console.log("\n[SUCCES] L'API Resend a accepte le mail (ID: " + result.data?.id + ")");
    }
  } catch (error) {
    console.error("\n[ERREUR] Une exception a ete levee lors de l'envoi :", error);
  }
}

main();
