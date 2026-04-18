import { useState, useCallback } from "react";

export type GitViewMode = "flat" | "tree";

const STORAGE_KEY = "panel-git-view-mode";

export function useGitViewMode(): [GitViewMode, (mode: GitViewMode) => void] {
  const [mode, setModeState] = useState<GitViewMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === "tree" ? "tree" : "flat";
    } catch {
      return "flat";
    }
  });

  const setMode = useCallback((newMode: GitViewMode) => {
    setModeState(newMode);
    try { localStorage.setItem(STORAGE_KEY, newMode); } catch {}
  }, []);

  return [mode, setMode];
}
