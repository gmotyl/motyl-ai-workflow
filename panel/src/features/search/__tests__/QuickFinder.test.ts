import { describe, it, expect } from "vitest";
import { formatDate } from "../QuickFinder";

describe("formatDate", () => {
  it("formats timestamp to readable date", () => {
    const ts = new Date("2026-01-15T12:00:00Z").getTime();
    const result = formatDate(ts);
    expect(result).toContain("Jan");
    expect(result).toContain("15");
    expect(result).toContain("2026");
  });

  it("formats zero timestamp", () => {
    const result = formatDate(0);
    expect(result).toContain("1970");
  });
});
