import { Router } from "express";
import { execSync } from "child_process";

const router = Router();

router.get("/qmd", (req, res) => {
  const query = req.query.q as string;
  const collection = req.query.collection as string | undefined;

  if (!query) return res.status(400).json({ error: "Missing q parameter" });

  let cmd = `qmd query "${query.replace(/"/g, '\\"')}"`;
  if (collection) cmd += ` --collection ${collection}`;

  try {
    const result = execSync(cmd, { encoding: "utf-8", timeout: 10_000 });
    res.json({ results: result });
  } catch (err: any) {
    res.status(500).json({ error: "qmd query failed", details: err.message });
  }
});

export default router;
