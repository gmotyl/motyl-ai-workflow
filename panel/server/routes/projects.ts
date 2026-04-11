import { Router } from "express";
import { discoverProjects } from "../lib/discovery.js";

const router = Router();

router.get("/", (_req, res) => {
  const projects = discoverProjects();
  res.json(projects);
});

export default router;
