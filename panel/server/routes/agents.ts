import { Router } from "express";
import { execSync } from "child_process";
import { readRegistry, pruneDeadAgents } from "../lib/agent-registry.js";

const router = Router();

router.get("/", (_req, res) => {
  pruneDeadAgents();
  res.json(readRegistry());
});

router.post("/focus", (req, res) => {
  const { cwd } = req.body;
  if (!cwd) return res.status(400).json({ error: "cwd required" });

  try {
    // AppleScript to focus iTerm2 session by working directory
    const script = `
      tell application "iTerm2"
        activate
        set found to false
        repeat with w in windows
          repeat with t in tabs of w
            repeat with s in sessions of t
              try
                set sessionPath to variable named "session.path" of s
                if sessionPath contains "${cwd.replace(/"/g, '\\"')}" then
                  select t
                  set found to true
                  exit repeat
                end if
              end try
            end repeat
            if found then exit repeat
          end repeat
          if found then exit repeat
        end repeat
      end tell
    `;
    execSync(`osascript -e '${script}'`, { timeout: 5000 });
    res.json({ ok: true });
  } catch {
    // Fallback: just activate iTerm2
    try {
      execSync("open -a iTerm");
      res.json({ ok: true, fallback: true });
    } catch {
      res.status(500).json({ error: "Failed to focus terminal" });
    }
  }
});

export default router;
