import { describe, it, expect } from "vitest";
import { statusLabel, statusColor } from "../GitChanges";

describe("statusLabel", () => {
  it("maps ?? to U (untracked)", () => expect(statusLabel("??")).toBe("U"));
  it("maps M to M", () => expect(statusLabel("M")).toBe("M"));
  it("maps D to D", () => expect(statusLabel("D")).toBe("D"));
  it("maps A to A", () => expect(statusLabel("A")).toBe("A"));
  it("passes through unknown status", () => expect(statusLabel("R")).toBe("R"));
});

describe("statusColor", () => {
  it("returns green for untracked", () => expect(statusColor("??")).toBe("var(--green)"));
  it("returns yellow for modified", () => expect(statusColor("M")).toBe("var(--yellow)"));
  it("returns red for deleted", () => expect(statusColor("D")).toBe("var(--red)"));
  it("returns tertiary for unknown", () => expect(statusColor("X")).toBe("var(--text-tertiary)"));
});
