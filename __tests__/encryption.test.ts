import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { encrypt, decrypt } from "@/lib/encryption";

// Generate a test key: 32 bytes = 64 hex chars
const TEST_KEY = "a".repeat(64);

beforeAll(() => {
  vi.stubEnv("ENCRYPTION_KEY", TEST_KEY);
});

afterAll(() => {
  vi.unstubAllEnvs();
});

describe("encryption", () => {
  it("encrypts and decrypts a string correctly", () => {
    const plaintext = "Hello, DeepFrame!";
    const ciphertext = encrypt(plaintext);
    expect(ciphertext).not.toBe(plaintext);
    expect(decrypt(ciphertext)).toBe(plaintext);
  });

  it("produces different ciphertext for same plaintext (random IV)", () => {
    const plaintext = "Same input, different output";
    const c1 = encrypt(plaintext);
    const c2 = encrypt(plaintext);
    expect(c1).not.toBe(c2);
    // Both should decrypt to the same value
    expect(decrypt(c1)).toBe(plaintext);
    expect(decrypt(c2)).toBe(plaintext);
  });

  it("handles empty string", () => {
    const ciphertext = encrypt("");
    expect(decrypt(ciphertext)).toBe("");
  });

  it("handles unicode content", () => {
    const plaintext = "Données personnelles — RGPD 🔒";
    const ciphertext = encrypt(plaintext);
    expect(decrypt(ciphertext)).toBe(plaintext);
  });

  it("handles long strings", () => {
    const plaintext = "x".repeat(10_000);
    const ciphertext = encrypt(plaintext);
    expect(decrypt(ciphertext)).toBe(plaintext);
  });

  it("throws on tampered ciphertext", () => {
    const ciphertext = encrypt("test");
    const tampered = ciphertext.slice(0, -2) + "XX";
    expect(() => decrypt(tampered)).toThrow();
  });

  it("throws on too-short ciphertext", () => {
    expect(() => decrypt("dG9vc2hvcnQ=")).toThrow("too short");
  });
});
