import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const adminEmail = "admin@deepframe.cc";
  const adminPassword = "DeepFrame2026!";

  const exists = await db.user.findUnique({ where: { email: adminEmail } });
  if (exists) {
    console.log("Admin existe déjà:", exists.email);
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await db.user.create({
    data: {
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
      pseudo: "admin",
      prenom: "Admin",
      nom: "DeepFrame",
      adresse: "12 quai du Châtelet, Orléans",
      codePostal: "45000",
      ville: "Orléans",
      tel: "+33238000000",
      age: 25,
    },
  });

  console.log("Compte admin créé:", admin.email, "/ mot de passe:", adminPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
