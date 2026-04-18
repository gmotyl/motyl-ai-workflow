import { describe, it, expect } from "vitest";
import { fixAmbiguousLabels } from "../MermaidDiagram";

describe("fixAmbiguousLabels", () => {
  it("quotes labels starting with /", () => {
    expect(fixAmbiguousLabels("A[/api/users]")).toBe('A["/api/users"]');
  });

  it("quotes labels starting with \\", () => {
    expect(fixAmbiguousLabels("A[\\path\\to]")).toBe('A["\\path\\to"]');
  });

  it("leaves normal labels untouched", () => {
    expect(fixAmbiguousLabels("A[normal label]")).toBe("A[normal label]");
  });

  it("handles multiple labels in one string", () => {
    const input = "A[/first] --> B[/second]";
    const result = fixAmbiguousLabels(input);
    expect(result).toContain('A["/first"]');
    expect(result).toContain('B["/second"]');
  });

  it("handles string with no labels", () => {
    expect(fixAmbiguousLabels("A --> B")).toBe("A --> B");
  });
});
