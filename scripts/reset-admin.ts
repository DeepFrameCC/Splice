import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/argon2";

const db = new PrismaClient();

async function main() {
  const newPassword = process.env.ADMIN_RESET_PASSWORD;
  if (!newPassword) {
    console.error("Usage: ADMIN_RESET_PASSWORD='...' npx tsx scripts/reset-admin.ts");
    console.error("Set ADMIN_RESET_PASSWORD env var with the new admin password.");
    process.exit(1);
  }

  if (newPassword.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const admin = await db.user.findUnique({ where: { email: "admin@deepframe.cc" } });

  if (!admin) {
    console.log("No admin account found in database.");
    return;
  }

  console.log("Admin found:", admin.email, "(role:", admin.role + ")");

  const newHash = await hash(newPassword);
  await db.user.update({
    where: { email: "admin@deepframe.cc" },
    data: { passwordHash: newHash },
  });
  console.log("Admin password reset successfully.");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
