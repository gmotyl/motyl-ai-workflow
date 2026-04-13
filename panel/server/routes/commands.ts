import { Router } from "express";
import { readdirSync, statSync, readFileSync } from "fs";
import { resolve, join } from "path";
import { getConfig } from "../config.js";

const router = Router();

router.get("/", (_req, res) => {
  const { projectsDir } = getConfig();
  const commandsDir = resolve(projectsDir, "../commands");

  try {
    const files = readdirSync(commandsDir)
      .filter((f) => f.endsWith(".md"))
      .sort()
      .map((name) => {
        const fullPath = join(commandsDir, name);
        const stat = statSync(fullPath);
        // Extract description from first non-empty, non-heading line
        let description = "";
        try {
          const content = readFileSync(fullPath, "utf-8");
          const lines = content.split("\n");
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("---")) continue;
            description = trimmed.slice(0, 120);
            break;
          }
        } catch {}
        return { name, description, modified: stat.mtimeMs };
      });
    res.json(files);
  } catch {
    res.json([]);
  }
});

export default router;
