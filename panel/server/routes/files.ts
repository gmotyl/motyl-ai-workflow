import { Router } from "express";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { getConfig } from "../config.js";
import { getFileIndex } from "../lib/file-index.js";

const router = Router();

// File path index for Cmd+P finder
router.get("/index", (_req, res) => {
  res.json(
    getFileIndex().map(({ relativePath, project, modified }) => ({
      relativePath,
      project,
      modified,
    }))
  );
});

// Read a file's raw content — Express v5 / path-to-regexp v8: *name wildcard
router.get("/read/*path", (req, res) => {
  const parts = req.params.path;
  const relativePath = Array.isArray(parts) ? parts.join("/") : parts;
  const { projectsDir } = getConfig();

  // Support _commands/ prefix for files in the commands directory
  let absolutePath: string;
  if (relativePath.startsWith("_commands/")) {
    const commandFile = relativePath.slice("_commands/".length);
    absolutePath = resolve(projectsDir, "../commands", commandFile);
    const commandsDir = resolve(projectsDir, "../commands");
    if (!absolutePath.startsWith(commandsDir)) {
      return res.status(403).json({ error: "Path traversal blocked" });
    }
  } else if (relativePath.startsWith("_help/")) {
    const helpFile = relativePath.slice("_help/".length);
    absolutePath = resolve(projectsDir, "../panel/help", helpFile);
    const helpDir = resolve(projectsDir, "../panel/help");
    if (!absolutePath.startsWith(helpDir)) {
      return res.status(403).json({ error: "Path traversal blocked" });
    }
  } else {
    absolutePath = resolve(projectsDir, relativePath);
    if (!absolutePath.startsWith(projectsDir)) {
      return res.status(403).json({ error: "Path traversal blocked" });
    }
  }

  if (!existsSync(absolutePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  const content = readFileSync(absolutePath, "utf-8");
  res.json({ path: relativePath, absolutePath, content });
});

// File tree for a specific project
router.get("/tree/:project", (req, res) => {
  const entries = getFileIndex().filter((e) => e.project === req.params.project);
  res.json(
    entries.map(({ relativePath, project, modified }) => ({
      relativePath,
      project,
      modified,
    }))
  );
});

export default router;
