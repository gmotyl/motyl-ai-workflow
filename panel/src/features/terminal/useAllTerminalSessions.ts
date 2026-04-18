import { useEffect, useCallback, useState } from "react";
import type { SessionMeta } from "./useTerminalSessions";
import { useWebSocket } from "../realtime/useWebSocket";

export function useAllTerminalSessions(pollMs = 8000) {
  const [sessions, setSessions] = useState<SessionMeta[]>([]);
  const { lastMessage } = useWebSocket();

  const fetchAll = useCallback(async () => {
    try {
      const res = await fetch("/api/terminal/sessions");
      if (!res.ok) {
        console.warn(
          `[terminal] useAllTerminalSessions got ${res.status} from server`,
        );
        return;
      }
      const data: SessionMeta[] = await res.json();
      setSessions(data);
    } catch (err) {
      console.warn(`[terminal] useAllTerminalSessions fetch failed:`, err);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    const id = setInterval(fetchAll, pollMs);
    return () => clearInterval(id);
  }, [fetchAll, pollMs]);

  // Refresh on any WS message — cheap and covers create/delete made in other tabs.
  useEffect(() => {
    if (lastMessage) fetchAll();
  }, [lastMessage, fetchAll]);

  return { sessions, refresh: fetchAll };
}
