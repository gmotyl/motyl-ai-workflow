import { readFileSync, writeFileSync, existsSync } from "fs";
import { getConfig } from "../config.js";

export interface AgentEntry {
  pid: number;
  type: "claude" | "opencode" | "qwen";
  project: string;
  cwd: string;
  startedAt: string;
}

function registryPath(): string {
  return getConfig().agentRegistryPath;
}

export function readRegistry(): AgentEntry[] {
  const path = registryPath();
  if (!existsSync(path)) return [];
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return [];
  }
}

export function writeRegistry(entries: AgentEntry[]): void {
  writeFileSync(registryPath(), JSON.stringify(entries, null, 2));
}

export function registerAgent(entry: AgentEntry): void {
  const entries = readRegistry().filter((e) => e.pid !== entry.pid);
  entries.push(entry);
  writeRegistry(entries);
}

export function deregisterAgent(pid: number): void {
  const entries = readRegistry().filter((e) => e.pid !== pid);
  writeRegistry(entries);
}

export function pruneDeadAgents(): void {
  const entries = readRegistry();
  const alive = entries.filter((e) => {
    try {
      process.kill(e.pid, 0);
      return true;
    } catch {
      return false;
    }
  });
  if (alive.length !== entries.length) {
    writeRegistry(alive);
  }
}
