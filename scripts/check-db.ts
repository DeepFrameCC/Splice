// Load .env variables
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

async function main() {
  console.log("Checking all devis details...");
  const devis = await db.devis.findMany();
  for (const d of devis) {
    console.log(`Devis ID: ${d.id}, Numero: ${d.numero}`);
    console.log(`- totalHT: ${d.totalHT} (${typeof d.totalHT})`);
    console.log(`- acompteRate: ${d.acompteRate} (${typeof d.acompteRate})`);
    console.log(`- acompteAmount: ${d.acompteAmount} (${typeof d.acompteAmount})`);
    console.log(`- nomEntreprise: ${d.nomEntreprise}`);
    console.log(`- nomContact: ${d.nomContact}`);
    console.log("------------------------");
  }
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
