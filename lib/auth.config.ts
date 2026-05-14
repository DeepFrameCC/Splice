import type { NextAuthConfig } from "next-auth";

/**
 * Auth config shared between middleware (Edge Runtime) and full auth (Node.js).
 * Must NOT import Node.js-only modules (argon2, prisma, etc.).
 */
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.twoFactorEnabled = (user as any).twoFactorEnabled;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).twoFactorEnabled = token.twoFactorEnabled;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
