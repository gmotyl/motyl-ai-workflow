import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface PanelConfig {
  /** Absolute path to the projects directory (contains project subfolders with PROJECT.md) */
  projectsDir: string;
  /** Port for the dev server */
  port: number;
  /** Path to agent registry file */
  agentRegistryPath: string;
  /** File watching debounce in ms */
  watchDebounceMs: number;
  /** Glob patterns to ignore in file tree */
  ignorePatterns: string[];
  /** Absolute path to TLS certificate (.pem) — enables HTTPS when set together with tlsKey */
  tlsCert?: string;
  /** Absolute path to TLS private key (.pem) — enables HTTPS when set together with tlsCert */
  tlsKey?: string;
}

const defaults: PanelConfig = {
  projectsDir: resolve(__dirname, "../projects"),
  port: 3010,
  agentRegistryPath: resolve(process.env.HOME || "~", ".agent-registry.json"),
  watchDebounceMs: 300,
  ignorePatterns: [
    "**/node_modules/**",
    "**/.DS_Store",
    "**/.git/**",
    "**/log/*.txt",
  ],
};

export default defaults;
