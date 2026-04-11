import { loadConfig } from "../config.js";
import { registerAgent } from "../lib/agent-registry.js";

async function main() {
  await loadConfig();

  const args = process.argv.slice(2);
  const getArg = (name: string) => {
    const idx = args.indexOf(`--${name}`);
    return idx !== -1 ? args[idx + 1] : undefined;
  };

  const type = getArg("type") as "claude" | "opencode" | "qwen";
  const project = getArg("project") || "unknown";
  const cwd = getArg("cwd") || process.cwd();
  const pid = parseInt(getArg("pid") || "0");

  if (!pid) {
    console.error("--pid required");
    process.exit(1);
  }

  registerAgent({ pid, type, project, cwd, startedAt: new Date().toISOString() });
  console.log(`Registered ${type} agent (PID ${pid}) for project ${project}`);
}

main();
