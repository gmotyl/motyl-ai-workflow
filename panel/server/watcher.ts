import chokidar from "chokidar";
import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { getConfig } from "./config.js";
import { rebuildIndex } from "./lib/file-index.js";

let wss: WebSocketServer;

export function setupWebSocket(server: Server): WebSocketServer {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    ws.send(JSON.stringify({ type: "connected" }));
  });

  return wss;
}

export function broadcast(data: Record<string, unknown>): void {
  if (!wss) return;
  const msg = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

export function setupFileWatcher(): void {
  const { projectsDir, watchDebounceMs, ignorePatterns, agentRegistryPath } = getConfig();

  const watcher = chokidar.watch(projectsDir, {
    ignored: ignorePatterns,
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: watchDebounceMs },
  });

  watcher.on("all", (event, path) => {
    rebuildIndex();
    broadcast({ type: "file-change", event, path });
  });

  console.log(`File watcher started on ${projectsDir}`);

  chokidar.watch(agentRegistryPath, { ignoreInitial: true }).on("all", () => {
    broadcast({ type: "agent-change" });
  });
}
