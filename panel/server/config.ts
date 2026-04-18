import defaults, { type PanelConfig } from "../panel.config.js";
import { existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const localPath = resolve(__dirname, "../panel.config.local.ts");

let config: PanelConfig = { ...defaults };

export async function loadConfig(): Promise<PanelConfig> {
  if (existsSync(localPath)) {
    try {
      const local = await import(localPath);
      config = { ...defaults, ...local.default };
    } catch (e) {
      console.warn("Failed to load panel.config.local.ts, using defaults:", e);
    }
  }
  // Env vars override config file for TLS paths
  if (process.env.PANEL_TLS_CERT) config.tlsCert = process.env.PANEL_TLS_CERT;
  if (process.env.PANEL_TLS_KEY) config.tlsKey = process.env.PANEL_TLS_KEY;
  return config;
}

export function getConfig(): PanelConfig {
  return config;
}
