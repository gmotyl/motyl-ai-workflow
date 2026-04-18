import { useState, useCallback } from "react";

/**
 * Persisted wide/compact mode per view key.
 * Key examples: "viewer", "repos", "notes"
 */
export function useWideMode(key: string) {
  const storageKey = `panel-wide-${key}`;

  const [wide, setWide] = useState(() => {
    try { return localStorage.getItem(storageKey) === "true"; } catch { return false; }
  });

  const toggle = useCallback(() => {
    setWide((prev) => {
      const next = !prev;
      try { localStorage.setItem(storageKey, String(next)); } catch {}
      return next;
    });
  }, [storageKey]);

  return [wide, toggle] as const;
}
