import { describe, it, expect } from "vitest";
import { buildTree, parseViewPath } from "../FileTree";

describe("buildTree", () => {
  it("groups files by project", () => {
    const files = [
      { relativePath: "metro/notes/daily.md", project: "metro", modified: 1 },
      { relativePath: "metro/PROJECT.md", project: "metro", modified: 2 },
      { relativePath: "alokai/notes/sync.md", project: "alokai", modified: 3 },
    ];
    const tree = buildTree(files);
    expect(Object.keys(tree)).toEqual(["metro", "alokai"]);
    expect(tree.metro.root).toHaveLength(1);
    expect(tree.metro.subfolders.notes).toHaveLength(1);
    expect(tree.alokai.subfolders.notes).toHaveLength(1);
  });

  it("puts top-level project files in root", () => {
    const files = [
      { relativePath: "ch/PROJECT.md", project: "ch", modified: 1 },
    ];
    const tree = buildTree(files);
    expect(tree.ch.root).toHaveLength(1);
    expect(tree.ch.root[0].relativePath).toBe("ch/PROJECT.md");
  });

  it("handles deeply nested files as subfolder entries", () => {
    const files = [
      { relativePath: "metro/notes/log/transcript.txt", project: "metro", modified: 1 },
    ];
    const tree = buildTree(files);
    expect(tree.metro.subfolders.notes).toHaveLength(1);
  });

  it("returns empty object for empty input", () => {
    expect(buildTree([])).toEqual({});
  });
});

describe("parseViewPath", () => {
  it("parses /view/project/subfolder", () => {
    expect(parseViewPath("/view/metro/notes")).toEqual({ project: "metro", subfolder: "notes" });
  });

  it("parses /view/project only", () => {
    expect(parseViewPath("/view/metro")).toEqual({ project: "metro", subfolder: "" });
  });

  it("returns null for non-view paths", () => {
    expect(parseViewPath("/dashboard")).toBeNull();
    expect(parseViewPath("/")).toBeNull();
  });
});
