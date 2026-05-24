import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/crypto/password";

describe("lib/crypto/password", () => {
  it("hashPassword produces an Argon2id encoded hash", async () => {
    const hash = await hashPassword("testPassword123!");
    expect(hash).toMatch(/^\$argon2id\$/);
  });

  it("verifyPassword returns true for matching password", async () => {
    const password = "securePass!2024";
    const hash = await hashPassword(password);
    const valid = await verifyPassword(password, hash);
    expect(valid).toBe(true);
  });

  it("verifyPassword returns false for wrong password", async () => {
    const hash = await hashPassword("correctPassword");
    const valid = await verifyPassword("wrongPassword", hash);
    expect(valid).toBe(false);
  });
});
