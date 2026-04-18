import { describe, it, expect } from "vitest";
import { buildFileTree, countFiles } from "../file-tree";

describe("buildFileTree", () => {
  it("builds a tree from flat file list", () => {
    const files = [
      { status: "M", path: "src/app.ts" },
      { status: "A", path: "src/utils/helper.ts" },
      { status: "D", path: "README.md" },
    ];
    const root = buildFileTree(files);
    expect(root.children.length).toBe(2); // "src" dir and "README.md" file
    const readme = root.children.find((c) => c.name === "README.md");
    expect(readme?.file?.status).toBe("D");
  });

  it("collapses single-child directories", () => {
    const files = [{ status: "M", path: "a/b/c/file.ts" }];
    const root = buildFileTree(files);
    expect(root.children.length).toBe(1);
    expect(root.children[0].name).toBe("a/b/c");
    expect(root.children[0].children[0].file?.path).toBe("a/b/c/file.ts");
  });

  it("does not collapse directories with multiple children", () => {
    const files = [
      { status: "M", path: "src/a.ts" },
      { status: "M", path: "src/b.ts" },
    ];
    const root = buildFileTree(files);
    expect(root.children.length).toBe(1);
    expect(root.children[0].name).toBe("src");
    expect(root.children[0].children.length).toBe(2);
  });

  it("returns empty tree for empty input", () => {
    const root = buildFileTree([]);
    expect(root.children.length).toBe(0);
  });
});

describe("countFiles", () => {
  it("counts files in nested tree", () => {
    const files = [
      { status: "M", path: "a/b.ts" },
      { status: "M", path: "a/c.ts" },
      { status: "M", path: "d.ts" },
    ];
    const root = buildFileTree(files);
    expect(countFiles(root)).toBe(3);
  });

  it("returns 0 for empty tree", () => {
    const root = buildFileTree([]);
    expect(countFiles(root)).toBe(0);
  });
});
