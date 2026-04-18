import { useState, useCallback } from "react";

type SidebarKey = "leftSidebar" | "rightSidebar";

function readStorage(key: SidebarKey): boolean {
  try {
    const val = localStorage.getItem(`panel:${key}`);
    return val === null ? true : val === "true";
  } catch {
    return true;
  }
}

function writeStorage(key: SidebarKey, value: boolean) {
  try {
    localStorage.setItem(`panel:${key}`, String(value));
  } catch {
    // ignore
  }
}

export function useSidebarState(key: SidebarKey) {
  const [expanded, setExpandedState] = useState(() => readStorage(key));

  const toggle = useCallback(() => {
    setExpandedState((prev) => {
      const next = !prev;
      writeStorage(key, next);
      return next;
    });
  }, [key]);

  const setExpanded = useCallback(
    (value: boolean) => {
      setExpandedState((prev) => {
        if (prev === value) return prev;
        writeStorage(key, value);
        return value;
      });
    },
    [key],
  );

  return { expanded, toggle, setExpanded };
}
