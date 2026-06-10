import { type DefaultSession } from "next-auth";
import { type Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role?: Role;
    twoFactorEnabled?: boolean;
    passwordChangedAt?: number | null;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      twoFactorEnabled: boolean;
      passwordChangedAt?: number | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    twoFactorEnabled?: boolean;
    passwordChangedAt?: number | null;
  }
}
