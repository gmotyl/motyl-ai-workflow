import { useState, useEffect } from "react";
import { useWebSocket } from "./useWebSocket";

export interface AgentEntry {
  pid: number;
  type: "claude" | "opencode" | "qwen";
  project: string;
  cwd: string;
  startedAt: string;
}

export function useAgents() {
  const [agents, setAgents] = useState<AgentEntry[]>([]);
  const { lastMessage } = useWebSocket();

  const fetchAgents = async () => {
    const res = await fetch("/api/agents");
    if (res.ok) setAgents(await res.json());
  };

  useEffect(() => { fetchAgents(); }, []);

  // Refetch on agent-change OR file-change (agent might have written progress)
  useEffect(() => {
    if (lastMessage?.type === "agent-change" || lastMessage?.type === "file-change") {
      fetchAgents();
    }
  }, [lastMessage]);

  return agents;
}
