#!/usr/bin/env node
/*
 * node-pty's pnpm-installed prebuilds lose the +x bit on spawn-helper, causing
 * `posix_spawnp failed` at runtime. Reapply executable permission after install.
 */
const { chmodSync, existsSync, readdirSync } = require("fs");
const { resolve, join } = require("path");

function findNodePtyDirs(root) {
  const results = [];
  const direct = resolve(root, "node_modules", "node-pty");
  if (existsSync(direct)) results.push(direct);
  const pnpmRoot = resolve(root, "node_modules", ".pnpm");
  if (existsSync(pnpmRoot)) {
    for (const entry of readdirSync(pnpmRoot)) {
      if (!entry.startsWith("node-pty@")) continue;
      const candidate = join(pnpmRoot, entry, "node_modules", "node-pty");
      if (existsSync(candidate)) results.push(candidate);
    }
  }
  return results;
}

const dirs = findNodePtyDirs(resolve(__dirname, ".."));
for (const dir of dirs) {
  const prebuilds = join(dir, "prebuilds");
  if (!existsSync(prebuilds)) continue;
  for (const platform of readdirSync(prebuilds)) {
    const helper = join(prebuilds, platform, "spawn-helper");
    if (existsSync(helper)) {
      try {
        chmodSync(helper, 0o755);
      } catch (err) {
        console.warn(`Could not chmod ${helper}: ${err.message}`);
      }
    }
  }
}
