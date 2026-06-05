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

async function main() {
  const admin = await db.user.findUnique({
    where: { email: "admin@splice.cc" },
    include: { profile: true }
  });

  if (!admin) {
    console.error("ADMIN USER NOT FOUND IN DB!");
  } else {
    console.log("Admin user:", {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      pseudo: admin.pseudo,
      twoFactorEnabled: admin.twoFactorEnabled,
      hasProfile: !!admin.profile
    });
  }
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
