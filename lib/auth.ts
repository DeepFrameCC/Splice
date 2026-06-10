import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { verifyPassword, hashPassword, needsRehash } from "@/lib/crypto/password";
import { z } from "zod";
import { getDb } from "./db";
import { authConfig } from "./auth.config";
import { verifyTOTP } from "./totp";
import { authLimiter, checkRateLimit, getClientIP } from "./rate-limit";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  totpCode: z.string().optional(),
});

const { providers, ...restConfig } = authConfig;

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...restConfig,
  adapter: PrismaAdapter(getDb()),
  providers: [
    Credentials({
      credentials: { email: {}, password: {}, totpCode: {} },
      async authorize(creds) {
        // Rate limit au niveau du provider : protège aussi les POST directs sur
        // /api/auth/callback/credentials qui contournent la Server Action loginAction.
        // Bucket distinct (`authorize:{ip}`) pour ne pas doubler la consommation
        // du bucket IP déjà utilisé par loginAction.
        const ip = await getClientIP();
        const rl = await checkRateLimit(authLimiter, `authorize:${ip}`);
        if (!rl.success) return null;

        const parsed = loginSchema.safeParse(creds);
        if (!parsed.success) return null;

        const prisma = getDb();
        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        // Toujours exécuter une vérification PBKDF2, même quand l'utilisateur
        // n'existe pas, pour neutraliser l'oracle de timing (énumération de
        // comptes). Le dummy hash a le même coût que les vrais hashes courants.
        const DUMMY_HASH =
          "pbkdf2$600000$00000000000000000000000000000000$0000000000000000000000000000000000000000000000000000000000000000";
        const ok = await verifyPassword(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);
        if (!user || !ok) return null;

        // Enforce 2FA when enabled
        if (user.twoFactorEnabled && user.twoFactorSecret) {
          const code = parsed.data.totpCode;
          if (!code) return null; // No TOTP code provided — reject
          const valid = verifyTOTP(code, user.twoFactorSecret);
          if (!valid) return null;
        }

        // Re-hash transparent vers le coût courant si le hash stocké est obsolète
        // (migration progressive du parc 100k → 600k itérations). Best-effort.
        if (needsRehash(user.passwordHash)) {
          try {
            const upgraded = await hashPassword(parsed.data.password);
            await prisma.user.update({ where: { id: user.id }, data: { passwordHash: upgraded } });
          } catch {
            /* non bloquant : l'utilisateur sera ré-upgradé au prochain login */
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.pseudo,
          role: user.role,
          twoFactorEnabled: user.twoFactorEnabled,
          passwordChangedAt: user.passwordChangedAt ? user.passwordChangedAt.getTime() : null,
        };
      },
    }),
  ],
});

export const isAdmin = (role?: string) => role === "ADMIN";
export const isTeam = (role?: string) => role === "TEAM" || role === "ADMIN";
