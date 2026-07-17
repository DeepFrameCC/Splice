/**
 * Seed script for the Portail Local (annuaire / agenda / guides).
 * Bootstraps the geographic + taxonomy data only — NO fictional Place.
 *
 * Inserts:
 *   - Region "Centre-Val de Loire" (CVL)
 *   - City "Orléans" (45) + real districts
 *   - ~8 base commerce categories
 *
 * Usage: npx tsx prisma/seed-portail.ts
 * Idempotent: upsert by slug (composite unique for City/District), safe to re-run.
 */
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";
import ws from "ws";

// Load .env manually (same approach as seed.ts / seed-galerie.ts)
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
  console.error("Failed to load .env in seed-portail script", e);
}

const databaseUrl = process.env.DATABASE_URL!;
const cleanUrl = databaseUrl.split("?")[0];
Pool.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: cleanUrl });
const db = new PrismaClient({ adapter });

async function main() {
  // ── Region : Centre-Val de Loire ───────────────────────────────────
  const region = await db.region.upsert({
    where: { slug: "centre-val-de-loire" },
    update: { name: "Centre-Val de Loire", code: "CVL" },
    create: {
      name: "Centre-Val de Loire",
      slug: "centre-val-de-loire",
      code: "CVL",
    },
  });
  console.log("Region:", region.slug, `(${region.code})`);

  // ── City : Orléans (45) ────────────────────────────────────────────
  const city = await db.city.upsert({
    where: { regionId_slug: { regionId: region.id, slug: "orleans" } },
    update: {
      name: "Orléans",
      departmentCode: "45",
      lat: 47.9029,
      lng: 1.9093,
    },
    create: {
      name: "Orléans",
      slug: "orleans",
      departmentCode: "45",
      regionId: region.id,
      lat: 47.9029,
      lng: 1.9093,
    },
  });
  console.log("City:", city.slug, `(${city.departmentCode})`);

  // ── Districts (quartiers réels d'Orléans) ──────────────────────────
  const districts = [
    { slug: "centre-ville", name: "Centre-ville" },
    { slug: "carmes", name: "Carmes" },
    { slug: "bourgogne", name: "Bourgogne" },
    { slug: "saint-marceau", name: "Saint-Marceau" },
    { slug: "madeleine", name: "Madeleine" },
    { slug: "la-source", name: "La Source" },
  ];

  for (const d of districts) {
    await db.district.upsert({
      where: { cityId_slug: { cityId: city.id, slug: d.slug } },
      update: { name: d.name },
      create: { name: d.name, slug: d.slug, cityId: city.id },
    });
    console.log("District:", d.slug);
  }

  // ── Categories de base (indépendantes de la géo) ───────────────────
  const categories = [
    { slug: "restaurant", name: "Restaurant", icon: "utensils" },
    { slug: "coiffeur", name: "Coiffeur", icon: "scissors" },
    { slug: "fleuriste", name: "Fleuriste", icon: "flower" },
    { slug: "boulangerie", name: "Boulangerie", icon: "croissant" },
    { slug: "bar", name: "Bar", icon: "wine" },
    { slug: "boutique", name: "Boutique", icon: "shopping-bag" },
    { slug: "artisan", name: "Artisan", icon: "hammer" },
    { slug: "beaute", name: "Beauté", icon: "sparkles" },
  ];

  for (const c of categories) {
    await db.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, icon: c.icon },
      create: { name: c.name, slug: c.slug, icon: c.icon },
    });
    console.log("Category:", c.slug);
  }

  console.log("Seed portail termine.");
}

main()
  .catch((e) => {
    console.error("Seed portail failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
