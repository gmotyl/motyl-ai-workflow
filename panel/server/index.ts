import express from "express";
import { createServer } from "http";
import { createServer as createViteServer } from "vite";
import { loadConfig, getConfig } from "./config.js";
import projectsRouter from "./routes/projects.js";
import { rebuildIndex } from "./lib/file-index.js";
import filesRouter from "./routes/files.js";
import gitRouter from "./routes/git.js";
import agentsRouter from "./routes/agents.js";
import searchRouter from "./routes/search.js";
import imagesRouter from "./routes/images.js";
import commandsRouter from "./routes/commands.js";
import agentSettingsRouter from "./routes/agent-settings.js";
import { setupWebSocket, setupFileWatcher } from "./watcher.js";
import { pruneDeadAgents } from "./lib/agent-registry.js";

async function start() {
  await loadConfig();
  rebuildIndex();
  const { port } = getConfig();

  const app = express();
  const server = createServer(app);

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });

  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/projects", projectsRouter);
  app.use("/api/files", filesRouter);
  app.use("/api/git", gitRouter);
  app.use("/api/agents", agentsRouter);
  app.use("/api/search", searchRouter);
  app.use("/api/images", imagesRouter);
  app.use("/api/commands", commandsRouter);
  app.use("/api/agent-settings", agentSettingsRouter);

  app.use(vite.middlewares);

  server.listen(port, () => {
    console.log(`Panel running at http://localhost:${port}`);
  });

  setupWebSocket(server);
  setupFileWatcher();

  setInterval(pruneDeadAgents, 30_000);
}

start();
