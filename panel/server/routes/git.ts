import { Router } from "express";
import { execSync } from "child_process";
import { resolve } from "path";
import { getConfig } from "../config.js";

const router = Router();

function getRepoRoot(customRepo?: string): string {
  if (customRepo) {
    // Resolve ~ to home dir
    const resolved = customRepo.startsWith("~/")
      ? resolve(process.env.HOME || "", customRepo.slice(2))
      : resolve(customRepo);
    return resolved;
  }
  const { projectsDir } = getConfig();
  return resolve(projectsDir, "..");
}

function git(cmd: string, repoPath?: string): string {
  return execSync(`git ${cmd}`, { cwd: getRepoRoot(repoPath), encoding: "utf-8" });
}

// Git status
router.get("/status", (req, res) => {
  try {
    const repo = req.query.repo as string | undefined;
    const status = git("status --porcelain", repo);
    const files = status
      .split("\n")
      .filter(Boolean)
      .map((line) => ({
        status: line.slice(0, 2).trim(),
        path: line.slice(3),
      }));
    res.json(files);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Diff for a specific file
router.get("/diff", (req, res) => {
  try {
    const file = req.query.file as string;
    const repo = req.query.repo as string | undefined;
    if (!file) return res.status(400).json({ error: "file parameter required" });
    const diff = git(`diff -- "${file}"`, repo);
    res.json({ diff });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Stage files
router.post("/stage", (req, res) => {
  try {
    const { files, repo } = req.body;
    if (!Array.isArray(files)) return res.status(400).json({ error: "files array required" });
    for (const f of files) {
      git(`add "${f}"`, repo);
    }
    res.json({ ok: true, staged: files.length });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Commit
router.post("/commit", (req, res) => {
  try {
    const { message, repo } = req.body;
    if (!message) return res.status(400).json({ error: "message required" });
    const safe = message.replace(/"/g, '\\"');
    git(`commit -m "${safe}"`, repo);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Push
router.post("/push", (req, res) => {
  try {
    const { repo } = req.body || {};
    git("push", repo);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Branch info
router.get("/branch", (req, res) => {
  try {
    const repo = req.query.repo as string | undefined;
    const branch = git("rev-parse --abbrev-ref HEAD", repo).trim();
    res.json({ branch });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Suggest commit message based on changed files
router.get("/suggest-message", (req, res) => {
  try {
    const repo = req.query.repo as string | undefined;
    const status = git("status --porcelain", repo);
    const files = status.split("\n").filter(Boolean).map((l) => l.slice(3));

    // Detect projects from file paths (files are like "projects/metro/notes/...")
    const projects = [...new Set(
      files
        .filter((f) => f.startsWith("projects/"))
        .map((f) => f.split("/")[1])
        .filter(Boolean)
    )];

    // Detect types
    const types = [...new Set(
      files.map((f) => {
        if (f.includes("/notes/")) return "note";
        if (f.includes("/progress/")) return "progress";
        if (f.includes("/plans/")) return "plan";
        if (f.includes("/memo/")) return "memo";
        return "update";
      })
    )];

    const type = types.length === 1 ? types[0] : "update";
    const project = projects.length === 1 ? projects[0] : projects.length > 0 ? projects.join("+") : "workspace";

    res.json({ suggestion: `${type}(${project}): ` });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
