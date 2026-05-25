import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { verifyPassword } from "@/lib/crypto/password";
import { z } from "zod";
import { db } from "./db";
import { authConfig } from "./auth.config";
import { verifyTOTP } from "./totp";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  totpCode: z.string().optional(),
});

const { providers, ...restConfig } = authConfig;

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...restConfig,
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      credentials: { email: {}, password: {}, totpCode: {} },
      async authorize(creds) {
        const parsed = loginSchema.safeParse(creds);
        if (!parsed.success) return null;

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user) return null;

        const ok = await verifyPassword(parsed.data.password, user.passwordHash);
        if (!ok) return null;

        // Enforce 2FA when enabled
        if (user.twoFactorEnabled && user.twoFactorSecret) {
          const code = parsed.data.totpCode;
          if (!code) return null; // No TOTP code provided — reject
          const valid = verifyTOTP(code, user.twoFactorSecret);
          if (!valid) return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.pseudo,
          role: user.role,
          twoFactorEnabled: user.twoFactorEnabled,
        };
      },
    }),
  ],
});

export const isAdmin = (role?: string) => role === "ADMIN";
export const isTeam = (role?: string) => role === "TEAM" || role === "ADMIN";
