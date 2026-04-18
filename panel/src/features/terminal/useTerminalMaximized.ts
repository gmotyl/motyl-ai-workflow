import { useCallback, useState } from "react";

export function useTerminalMaximized(
  project: string,
): [boolean, () => void, (value: boolean) => void] {
  const storageKey = `panel-terminal-maximized-${project}`;

  const [value, setValueState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(storageKey) === "1";
    } catch (err) {
      console.warn(`[terminal] read ${storageKey}:`, err);
      return false;
    }
  });

  const setValue = useCallback(
    (next: boolean) => {
      setValueState(next);
      try {
        if (next) localStorage.setItem(storageKey, "1");
        else localStorage.removeItem(storageKey);
      } catch (err) {
        console.warn(`[terminal] write ${storageKey}:`, err);
      }
    },
    [storageKey],
  );

  const toggle = useCallback(() => setValue(!value), [value, setValue]);

  return [value, toggle, setValue];
}
