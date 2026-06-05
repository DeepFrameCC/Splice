// Load env
import fs from "fs";
import path from "path";

try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf-8");
    for (const rawLine of envConfig.split("\n")) {
      const line = rawLine.replace(/\r/g, "").trim();
      if (!line || line.startsWith("#")) continue;
      const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        process.env[key] = value.trim();
      }
    }
  }
} catch (e) {
  console.error("Failed to load .env", e);
}

import { register } from "tsconfig-paths";
register({
  baseUrl: "./",
  paths: {
    "@/*": ["*"]
  }
});

import { db } from "@/lib/db";

function formatEuros(euros: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(euros);
}

async function simulateRender(userId: string, email: string) {
  console.log(`Simulating render for user ${email}...`);
  try {
    const factures = await db.facture.findMany({
      where: { userId },
      include: { devis: true, abonnement: { include: { devis: true } } },
      orderBy: { createdAt: "desc" },
    });

    console.log(`Found ${factures.length} invoices.`);
    
    for (const f of factures) {
      console.log(`Processing Invoice n°${f.numero}`);
      const src = f.devis ?? f.abonnement?.devis ?? null;
      const isAbo = f.abonnementId != null;
      const montant = f.montant ?? src?.totalHT ?? 0;
      
      console.log(`- src: ${src ? 'Exists' : 'Null'}, isAbo: ${isAbo}, montant: ${montant}`);
      
      // Test formatEuros
      console.log(`- formatting amount...`);
      const formattedAmount = formatEuros(montant);
      console.log(`  formatted: ${formattedAmount}`);
      
      if (!isAbo && src) {
        console.log(`- formatting acompte...`);
        const formattedAcompte = formatEuros(src.acompteAmount);
        console.log(`  formatted acompte: ${formattedAcompte}`);
      }
      
      if (isAbo && f.periodeDebut && f.periodeFin) {
        console.log(`- formatting period dates...`);
        const pDebut = f.periodeDebut.toLocaleDateString("fr-FR");
        const pFin = f.periodeFin.toLocaleDateString("fr-FR");
        console.log(`  period: ${pDebut} - ${pFin}`);
      }
      
      console.log(`- formatting createdAt date...`);
      const createdDate = f.createdAt.toLocaleDateString("fr-FR");
      console.log(`  createdAt: ${createdDate}`);
    }
    console.log(`Simulation for ${email} succeeded without errors!\n`);
  } catch (err) {
    console.error(`Simulation for ${email} FAILED:`, err);
    console.log("\n");
  }
}

async function main() {
  const users = await db.user.findMany();
  for (const u of users) {
    await simulateRender(u.id, u.email);
  }
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
