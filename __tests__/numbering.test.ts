import { describe, it, expect } from "vitest";
import { formatNumero } from "@/lib/numbering";

describe("formatNumero", () => {
  it("formats year and sequence with 3-digit padding", () => {
    expect(formatNumero(2025, 1)).toBe("2025_001");
    expect(formatNumero(2025, 42)).toBe("2025_042");
    expect(formatNumero(2025, 100)).toBe("2025_100");
    expect(formatNumero(2025, 999)).toBe("2025_999");
  });

  it("handles sequences above 999 without padding", () => {
    expect(formatNumero(2025, 1000)).toBe("2025_1000");
    expect(formatNumero(2025, 12345)).toBe("2025_12345");
  });

  it("works with different years", () => {
    expect(formatNumero(2024, 7)).toBe("2024_007");
    expect(formatNumero(2026, 15)).toBe("2026_015");
  });
});
