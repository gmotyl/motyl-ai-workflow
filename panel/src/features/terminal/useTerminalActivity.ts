import { useEffect, useState } from "react";
import {
  subscribeActivity,
  type TerminalActivity,
} from "./terminalInstances";

export function useTerminalActivity(sessionId: string): TerminalActivity {
  const [state, setState] = useState<TerminalActivity>("idle");
  useEffect(() => {
    return subscribeActivity(sessionId, setState);
  }, [sessionId]);
  return state;
}
