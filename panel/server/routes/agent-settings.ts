import { Router } from "express";
import { existsSync, readFileSync, statSync } from "fs";
import { homedir } from "os";
import { resolve } from "path";

const router = Router();

interface SettingsFile {
  name: string;
  path: string;
  exists: boolean;
  size?: number;
  modified?: number;
}

interface AgentConfig {
  agent: string;
  icon: string;
  files: SettingsFile[];
}

function probe(name: string, absPath: string): SettingsFile {
  const exists = existsSync(absPath);
  if (!exists) return { name, path: absPath, exists };
  const stat = statSync(absPath);
  return { name, path: absPath, exists, size: stat.size, modified: stat.mtimeMs };
}

const home = homedir();

function getAgentConfigs(): AgentConfig[] {
  return [
    {
      agent: "Claude Code",
      icon: "claude",
      files: [
        probe("settings.json", resolve(home, ".claude/settings.json")),
        probe("settings.local.json", resolve(home, ".claude/settings.local.json")),
        probe("hooks.json", resolve(home, ".claude/hooks.json")),
        probe("policy-limits.json", resolve(home, ".claude/policy-limits.json")),
      ].filter((f) => f.exists),
    },
    {
      agent: "OpenCode",
      icon: "opencode",
      files: [
        probe("ocx.jsonc", resolve(home, ".config/opencode/ocx.jsonc")),
        probe("opencode.json", resolve(home, ".config/opencode/opencode.json")),
      ].filter((f) => f.exists),
    },
    {
      agent: "Kilo Code",
      icon: "kilo",
      files: [
        probe("kilo.jsonc", resolve(home, ".config/kilo/kilo.jsonc")),
      ].filter((f) => f.exists),
    },
    {
      agent: "Qwen Code",
      icon: "qwen",
      files: [
        probe("settings.json", resolve(home, ".qwen/settings.json")),
      ].filter((f) => f.exists),
    },
    {
      agent: "Gemini CLI",
      icon: "gemini",
      files: [
        probe("settings.json", resolve(home, ".gemini/settings.json")),
        probe("projects.json", resolve(home, ".gemini/projects.json")),
        probe("trustedFolders.json", resolve(home, ".gemini/trustedFolders.json")),
      ].filter((f) => f.exists),
    },
  ].filter((a) => a.files.length > 0);
}

router.get("/", (_req, res) => {
  res.json(getAgentConfigs());
});

router.get("/read", (req, res) => {
  const filePath = req.query.path as string;
  if (!filePath) return res.status(400).json({ error: "Missing path parameter" });

  // Only allow reading known agent config paths under home directory
  const resolved = resolve(filePath);
  if (!resolved.startsWith(home)) {
    return res.status(403).json({ error: "Path outside home directory" });
  }
  if (!existsSync(resolved)) {
    return res.status(404).json({ error: "File not found" });
  }

  const content = readFileSync(resolved, "utf-8");
  res.json({ path: resolved, content });
});

export default router;
