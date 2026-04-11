import { Router } from "express";
import multer from "multer";
import sharp from "sharp";
import { resolve, dirname, basename, extname } from "path";
import { existsSync, readdirSync } from "fs";
import { getConfig } from "../config.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

const TARGET_KB = 100;
const MAX_WIDTH = 1920;

router.post("/optimize", upload.single("image"), async (req, res) => {
  const file = req.file;
  const targetMarkdown = req.body.targetMarkdown; // relative path

  if (!file || !targetMarkdown) {
    return res.status(400).json({ error: "Missing image or targetMarkdown" });
  }

  const { projectsDir } = getConfig();
  const mdAbsolute = resolve(projectsDir, targetMarkdown);

  if (!mdAbsolute.startsWith(projectsDir)) {
    return res.status(403).json({ error: "Path traversal blocked" });
  }

  const dir = dirname(mdAbsolute);
  const mdName = basename(mdAbsolute, extname(mdAbsolute));

  // Find next available index
  const existing = existsSync(dir) ? readdirSync(dir) : [];
  const pattern = new RegExp(`^${mdName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}_.*-(\\d+)\\.webp$`);
  let maxN = 0;
  for (const f of existing) {
    const m = f.match(pattern);
    if (m) maxN = Math.max(maxN, parseInt(m[1]));
  }
  const n = maxN + 1;

  const slug = (file.originalname || "screenshot")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .slice(0, 30);

  const outputName = `${mdName}_${slug}-${n}.webp`;
  const outputPath = resolve(dir, outputName);

  // Sharp pipeline (same as motyl-dev image-optimize.ts): target ≤100KB, max 1920px, quality starts at 82
  let quality = 82;
  const meta = await sharp(file.buffer).metadata();
  let width = Math.min(meta.width ?? MAX_WIDTH, MAX_WIDTH);
  let buffer: Buffer;

  while (true) {
    buffer = await sharp(file.buffer)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();

    if (buffer.byteLength / 1024 <= TARGET_KB || quality <= 30) break;

    if (quality > 50) {
      quality -= 8;
    } else {
      quality -= 5;
      width = Math.round(width * 0.85);
    }
  }

  await sharp(buffer).toFile(outputPath);

  const markdownRef = `![${slug}](./${outputName})`;
  const sizeKB = Math.round(buffer.byteLength / 1024);

  res.json({ filename: outputName, markdownRef, sizeKB, quality, width });
});

export default router;
