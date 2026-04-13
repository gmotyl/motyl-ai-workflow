import { Router } from "express";
import { execFile } from "child_process";
import { homedir } from "os";
import { join } from "path";

const router = Router();

const home = homedir();
const PATH = [
  join(home, ".bun/bin"),
  join(home, ".nvm/versions/node/v24.7.0/bin"),
  "/usr/local/bin",
  "/usr/bin",
  "/bin",
].join(":");

router.get("/qmd", (req, res) => {
  const query = req.query.q as string;
  const collection = req.query.collection as string | undefined;

  if (!query) return res.status(400).json({ error: "Missing q parameter" });

  const args = ["query", query];
  if (collection) args.push("--collection", collection);

  execFile("qmd", args, { encoding: "utf-8", timeout: 15_000, env: { ...process.env, PATH } }, (err, stdout, _stderr) => {
    if (err && !stdout) {
      return res.status(500).json({ error: "qmd query failed", details: err.message });
    }
    // qmd may exit non-zero but still produce useful stdout — return it
    res.type("text/plain").send(stdout);
  });
});

export default router;
