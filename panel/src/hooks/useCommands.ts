import { useState, useEffect } from "react";

export interface CommandEntry {
  name: string;
  description: string;
  modified: number;
}

export function useCommands() {
  const [commands, setCommands] = useState<CommandEntry[]>([]);

  useEffect(() => {
    fetch("/api/commands")
      .then((res) => (res.ok ? res.json() : []))
      .then(setCommands)
      .catch(() => {});
  }, []);

  return commands;
}
