import type { NextAuthConfig } from "next-auth";

/**
 * Auth config shared between middleware (Edge Runtime) and full auth (Node.js).
 * Must NOT import Node.js-only modules (argon2, prisma, etc.).
 */
export const authConfig = {
  pages: { signIn: "/login" },
  trustHost: true,
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60, updateAge: 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.twoFactorEnabled = user.twoFactorEnabled;
        token.passwordChangedAt = user.passwordChangedAt ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as import("@prisma/client").Role;
        session.user.twoFactorEnabled = token.twoFactorEnabled as boolean;
        session.user.passwordChangedAt = (token.passwordChangedAt as number | null) ?? null;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
