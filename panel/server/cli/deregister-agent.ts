import { loadConfig } from "../config.js";
import { deregisterAgent } from "../lib/agent-registry.js";

async function main() {
  await loadConfig();

  const args = process.argv.slice(2);
  const getArg = (name: string) => {
    const idx = args.indexOf(`--${name}`);
    return idx !== -1 ? args[idx + 1] : undefined;
  };

  const pid = parseInt(getArg("pid") || "0");

  if (!pid) {
    console.error("--pid required");
    process.exit(1);
  }

  deregisterAgent(pid);
  console.log(`Deregistered agent (PID ${pid})`);
}

main();
