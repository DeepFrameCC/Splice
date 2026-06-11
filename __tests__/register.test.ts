import { describe, it, expect } from "vitest";
import { formatPseudo, pseudoRegex } from "@/lib/auth-utils";
import { hashToken } from "@/lib/crypto/token";
import { needsRehash } from "@/lib/crypto/password";

// ── formatPseudo ──────────────────────────────────────────────

describe("formatPseudo", () => {
  it("lowercases input", () => {
    expect(formatPseudo("Alice")).toBe("alice");
    expect(formatPseudo("SPLICE")).toBe("splice");
  });

  it("replaces accented characters", () => {
    expect(formatPseudo("élodie")).toBe("elodie");
    expect(formatPseudo("François")).toBe("francois");
    expect(formatPseudo("José")).toBe("jose");
  });

  it("replaces forbidden chars with dots", () => {
    expect(formatPseudo("alice dupont")).toBe("alice.dupont");
    expect(formatPseudo("alice@dupont")).toBe("alice.dupont");
    expect(formatPseudo("alice-dupont")).toBe("alice.dupont");
  });

  it("collapses consecutive replacement dots", () => {
    // spaces and dashes are not allowed → replaced with "." then collapsed
    expect(formatPseudo("alice  dupont")).toBe("alice.dupont");
    expect(formatPseudo("a  b")).toBe("a.b");
    expect(formatPseudo("a--b")).toBe("a.b");
  });

  it("strips leading and trailing replacement dots", () => {
    expect(formatPseudo("-alice-")).toBe("alice");
    expect(formatPseudo("--hello--")).toBe("hello");
    expect(formatPseudo("@alice@")).toBe("alice");
  });

  it("preserves allowed chars (lowercase, digits, dot, underscore)", () => {
    // _ is explicitly in [a-z0-9._] so it is kept as-is
    expect(formatPseudo("alice.dupont")).toBe("alice.dupont");
    expect(formatPseudo("alice_dupont")).toBe("alice_dupont");
    expect(formatPseudo("user42")).toBe("user42");
    expect(formatPseudo("a1.b2.c3")).toBe("a1.b2.c3");
  });

  // Key regression: formatPseudo can shrink a raw value that passed Zod min(3)
  // when forbidden chars (dashes, spaces, @…) collapse into dots then get stripped.
  it("can produce a result shorter than 3 chars", () => {
    expect(formatPseudo("a--")).toBe("a");   // "a.." → "a." → "a"
    expect(formatPseudo("ab-")).toBe("ab");  // "ab." → "ab"
    expect(formatPseudo("--a")).toBe("a");   // ".a" → "a"
  });

  it("returns empty string for all-forbidden input", () => {
    expect(formatPseudo("---")).toBe("");
    expect(formatPseudo("@@@")).toBe("");
  });
});

// ── pseudoRegex ───────────────────────────────────────────────

describe("pseudoRegex", () => {
  it("accepts valid pseudos", () => {
    expect(pseudoRegex.test("alice")).toBe(true);
    expect(pseudoRegex.test("alice.dupont")).toBe(true);
    expect(pseudoRegex.test("user42")).toBe(true);
    expect(pseudoRegex.test("a1.b2.c3")).toBe(true);
  });

  it("rejects uppercase letters", () => {
    expect(pseudoRegex.test("Alice")).toBe(false);
  });

  it("rejects spaces and special characters", () => {
    expect(pseudoRegex.test("alice dupont")).toBe(false);
    expect(pseudoRegex.test("alice@dupont")).toBe(false);
    expect(pseudoRegex.test("alice-dupont")).toBe(false);
    expect(pseudoRegex.test("alice!")).toBe(false);
  });

  it("rejects accented characters", () => {
    expect(pseudoRegex.test("élodie")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(pseudoRegex.test("")).toBe(false);
  });
});

// ── Registration pseudo validation (mirrors auth.ts guard) ────

describe("pseudo validation after formatPseudo (registration guard)", () => {
  function validatePseudo(raw: string): { ok: boolean; error?: string } {
    const pseudo = formatPseudo(raw);
    if (pseudo.length < 3 || !pseudoRegex.test(pseudo)) {
      return { ok: false, error: "Pseudo : min 3 caractères, minuscules, chiffres, points uniquement" };
    }
    return { ok: true };
  }

  it("accepts a valid pseudo", () => {
    expect(validatePseudo("alice.dupont")).toEqual({ ok: true });
    expect(validatePseudo("user42")).toEqual({ ok: true });
  });

  it("rejects a pseudo that shortens below 3 chars after formatting", () => {
    // dashes/spaces are replaced by dots then stripped
    expect(validatePseudo("a--").ok).toBe(false);  // → "a"
    expect(validatePseudo("ab-").ok).toBe(false);  // → "ab"
    expect(validatePseudo("--a").ok).toBe(false);  // → "a"
  });

  it("accepts a pseudo that stays ≥ 3 chars after formatting", () => {
    expect(validatePseudo("a-b-c").ok).toBe(true); // → "a.b.c" (5 chars)
    expect(validatePseudo("Élodie").ok).toBe(true); // → "elodie"
    expect(validatePseudo("alice_dupont").ok).toBe(true); // underscore kept as-is
  });

  it("rejects an empty result after formatting", () => {
    expect(validatePseudo("@@@").ok).toBe(false);
    expect(validatePseudo("---").ok).toBe(false);
  });
});

// ── hashToken ─────────────────────────────────────────────────

describe("hashToken", () => {
  it("returns a 64-char hex string (SHA-256)", async () => {
    const digest = await hashToken("some-random-token");
    expect(digest).toHaveLength(64);
    expect(digest).toMatch(/^[0-9a-f]+$/);
  });

  it("is deterministic: same input → same digest", async () => {
    const token = "abc123def456";
    const a = await hashToken(token);
    const b = await hashToken(token);
    expect(a).toBe(b);
  });

  it("different inputs → different digests", async () => {
    const a = await hashToken("token-one");
    const b = await hashToken("token-two");
    expect(a).not.toBe(b);
  });

  it("handles an empty string without throwing", async () => {
    const digest = await hashToken("");
    expect(digest).toHaveLength(64);
  });
});

// ── needsRehash ───────────────────────────────────────────────

describe("needsRehash", () => {
  it("returns true for non-pbkdf2 formats", () => {
    expect(needsRehash("bcrypt$...")).toBe(true);
    expect(needsRehash("plaintext")).toBe(true);
    expect(needsRehash("")).toBe(true);
  });

  it("returns true for a lower iteration count", () => {
    expect(needsRehash("pbkdf2$100000$salt$hash")).toBe(true);
    expect(needsRehash("pbkdf2$310000$salt$hash")).toBe(true);
  });

  it("returns false for the current target (600 000 iterations)", () => {
    expect(needsRehash("pbkdf2$600000$salt$hash")).toBe(false);
  });

  it("returns false for a higher iteration count", () => {
    expect(needsRehash("pbkdf2$700000$salt$hash")).toBe(false);
  });

  it("returns true when iteration count is 0 or missing", () => {
    expect(needsRehash("pbkdf2$0$salt$hash")).toBe(true);
    expect(needsRehash("pbkdf2$$salt$hash")).toBe(true);
  });
});
