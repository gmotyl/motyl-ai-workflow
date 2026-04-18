import { describe, it, expect } from "vitest";
import { detectLang, escapeHtml, injectHighlight } from "../DiffView";

describe("detectLang", () => {
  it("returns typescript for .ts files", () => {
    expect(detectLang("src/app.ts")).toBe("typescript");
  });

  it("returns typescript for .tsx files", () => {
    expect(detectLang("components/Button.tsx")).toBe("typescript");
  });

  it("returns dockerfile for Dockerfile", () => {
    expect(detectLang("Dockerfile")).toBe("dockerfile");
  });

  it("returns undefined for unknown extensions", () => {
    expect(detectLang("file.xyz")).toBeUndefined();
  });

  it("returns undefined when no filename given", () => {
    expect(detectLang()).toBeUndefined();
    expect(detectLang(undefined)).toBeUndefined();
  });

  it("handles nested paths", () => {
    expect(detectLang("a/b/c/styles.css")).toBe("css");
  });

  it("is case-insensitive for filenames", () => {
    expect(detectLang("path/DOCKERFILE")).toBe("dockerfile");
  });
});

describe("escapeHtml", () => {
  it("escapes ampersand, less-than, greater-than", () => {
    expect(escapeHtml("a < b > c & d")).toBe("a &lt; b &gt; c &amp; d");
  });

  it("returns empty string for empty input", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("leaves safe text unchanged", () => {
    expect(escapeHtml("hello world")).toBe("hello world");
  });
});

describe("injectHighlight", () => {
  it("returns html unchanged when term is empty", () => {
    const html = '<span class="kw">const</span>';
    expect(injectHighlight(html, "")).toBe(html);
  });

  it("wraps matching text in mark tags", () => {
    const result = injectHighlight("hello world", "world");
    expect(result).toContain("<mark");
    expect(result).toContain("world</mark>");
  });

  it("does not highlight inside HTML tags", () => {
    const html = '<span class="world">world</span>';
    const result = injectHighlight(html, "world");
    // The "world" in class attribute should be untouched
    expect(result).toContain('class="world"');
  });

  it("is case-insensitive", () => {
    const result = injectHighlight("Hello HELLO hello", "hello");
    const marks = result.match(/<mark/g);
    expect(marks?.length).toBe(3);
  });

  it("escapes regex special characters in term", () => {
    const result = injectHighlight("price is $100 (total)", "$100");
    expect(result).toContain("<mark");
  });
});
